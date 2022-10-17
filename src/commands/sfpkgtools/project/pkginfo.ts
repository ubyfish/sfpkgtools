/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { getPackageInfo, getAllInstalledPackages, Package2Info } from "../../../helpers/package";
import { prepareTable } from "../../../renderer/table";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'projectpkginfo');

export default class PkgInfo extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {

  };

  protected static requiresDevhubUsername = true;
  protected static requiresUsername = true;

  protected static requiresProject = true;

  public async run(): Promise<Package2Info[]> {
    //conts isJsonFormat = this.flags.isJsonFormat
    const projectJson = await this.project.retrieveSfProjectJson();
    const packages = await projectJson.getPackageDirectories();
    let pkgNames = [];
    packages.forEach((record) => {
        if(record.package){
            this.ux.log('in scope ' + record.package);
            pkgNames.push(record.package);
            
        }
    });
    let fitleredList = [];
    let installedPkgs = await getAllInstalledPackages(this.org.getConnection());
    installedPkgs.forEach((pkg) => {
        let chk:string = pkg.Name;
        if(pkgNames.includes(chk)){
            this.ux.log('adding ' + chk);
            fitleredList.push(pkg);
        }
    }); 
    
    if (!fitleredList || fitleredList.length <= 0) {
        throw new SfError(messages.getMessage('errorNoOrgResults', [this.org.getUsername()]));
    }
    let resultList = [];
    for(const pkg of fitleredList){
        let result = await getPackageInfo(this.hubOrg.getConnection(),null,null,pkg.SubscriberPackageVersionId,false);
        if (!result || result.length > 1) {
            throw new SfError(messages.getMessage('errorManyOrgResults', [this.org.getUsername()]));
        }
        
        
        this.ux.log('found package : ' + result[0].Name + ', Tag : ' + result[0].Tag + ', SubscriberPackageVersionId ' +result[0].SubscriberPackageVersionId);
        resultList.push(result[0]);
    }
        
            let columns = ["Name","NameSpace","SubscriberPackageVersionId","PackageVersionNumber","isSecurityReviewed","Tag"];
            let op = prepareTable(resultList,columns);
            this.ux.log(op);
    
    return resultList;
  }


}
