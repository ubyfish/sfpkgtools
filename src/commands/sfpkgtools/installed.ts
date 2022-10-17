/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { getInstalledPackages, Package2Info } from "../../helpers/package";
import { prepareTable } from "../../renderer/table";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'installed');

export default class Installed extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: messages.getMessage('nameFlagDescription'),required: false
    }),
    exactmatch: flags.boolean({
      char: 'e',
      description: messages.getMessage('nameFlagDescription'),required: false,
      dependsOn: ['name'],
    })    
  };

  protected static requiresUsername = true;
  protected static requiresProject = false;

  public async run(): Promise<Package2Info[]> {
    this.ux.log(`querying installed packages for ${this.org.getUsername()}`);
    const packageName = this.flags.name;
    
    const exact = this.flags.exactmatch;
    if(packageName){
        if(exact){
          this.ux.log(`will filter exactly for ${packageName}`);  
        }else{
          this.ux.log(`will filter for like ${packageName}`);
        }
        
    }
    this.ux.startSpinner('processing....');
    


    let result = await getInstalledPackages(this.org.getConnection(),packageName,exact);
    //console.log(result);
    if (!result || result.length <= 0) {
      throw new SfError(messages.getMessage('errorNoOrgResults', [this.org.getUsername()]));
    }
    

    
    this.ux.stopSpinner();
    
      let columns = ["Name","NameSpace","SubscriberPackageVersionId","PackageVersionNumber","isSecurityReviewed"];
      
      let op = prepareTable(result,columns);
      this.ux.log(op);

    


    
    return result;
  }

}
