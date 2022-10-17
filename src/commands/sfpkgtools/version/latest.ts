/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { getLatestPackageVersion, Package2Info } from "../../../helpers/package";
import { logTable } from "../../../renderer/table";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'latest');

export default class Latest extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: messages.getMessage('nameFlagDescription'),required: true
    }),
    released: flags.boolean({
      char: 'r',
      description: messages.getMessage('releasedFlagDescription'),required: false
    }),
    showversions: flags.boolean({
      char: 's',
      description: messages.getMessage('showVersionsFlagDescription'),required: false
    })    
    // orderby: flags.string({
    //   char: 'o', 
    //   description: messages.getMessage('orderByFlagDescription'), 
    //   options: ['Version','CreatedDate'], default: 'CreatedDate', required: false})
  };

  protected static requiresDevhubUsername = true;

  protected static requiresProject = false;

  public async run(): Promise<Package2Info> {
    //const name = (this.flags.name || 'world') as string;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.hubOrg.getConnection();
    const pkgname = this.flags.name;
    const shoversions = this.flags.showversions;
    this.ux.log('Fetching Latest package version for : ' + pkgname);
    
    let result = await getLatestPackageVersion(conn,pkgname,this.flags.released);
    //console.log(result);
    if (!result || result.length <= 0) {
      throw new SfError(messages.getMessage('errorNoOrgResults', [pkgname]));
    }
    let latestPackage = result[0];
    let fields = ['PackageVersionNumber', 'CreatedDate','LastModifiedDate','SubscriberPackageVersionId','CodeCoverage','Tag','IsReleased'];
    if(shoversions){
      logTable(result,fields);
      this.ux.log('--------------------------------------------------');
    }
    
    this.ux.log('Latest version : ' + latestPackage.PackageVersionNumber + ', Id = ' + latestPackage.SubscriberPackageVersionId);
    
    
    return latestPackage;
  }

}
