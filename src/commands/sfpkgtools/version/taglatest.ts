
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import {  getLatestPackageVersion } from "../../../helpers/package";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'taglatest');

export default class TagLatest extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    commithash: flags.string({
      char: 'c',
      description: messages.getMessage('commitHash'),required: true
    })
  };

  protected static requiresDevhubUsername = true;
  protected static requiresUsername = false;
  protected static requiresProject = true;

  public async run() {
    const commitHash = this.flags.commithash;
    console.log(commitHash);
    const projectJson = await this.project.retrieveSfProjectJson();
    const packages = await projectJson.getPackageDirectories();
    let pkgNames = [];
    packages.forEach((record) => {
        if(record.package){
            this.ux.log('in scope ' + record.package);
            pkgNames.push(record.package);
            
        }
    });

    for(const pkg of pkgNames){
        console.log('getting latest for ' + pkg);
        let latestPackage = await getLatestPackageVersion(this.hubOrg.getConnection(),pkg,false);
        console.log(latestPackage);
        // if (!latestPackage || latestPackage.length > 1) {
        //     throw new SfError(messages.getMessage('errorManyResults', [pkg]));
        // }
        let packageToUpdate = latestPackage[0];
        console.log('for update' + JSON.stringify(packageToUpdate));
        //await updatePackage(packageToUpdate.SubscriberPackageVersionId,commitHash,this.hubOrg.getConnection());
    }
    
    
  }


}
