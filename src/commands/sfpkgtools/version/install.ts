/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * --------
 * 1 - get the latest
 * 2 - get diff and filter only rectypes and picklists
 * 3 - check for unmanagedPackage etc
 * 4 - install to give env
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { Package2Info } from "../../../helpers/package";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'latest');

export default class Install extends SfdxCommand {
  
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
    })
  };

  protected static requiresDevhubUsername = true;
  protected static requiresUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<Package2Info> {
    //const name = (this.flags.name || 'world') as string;

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.hubOrg.getConnection();
    const pkgname = this.flags.name;
    console.log(`${pkgname}, ${conn.getUsername}`);
    return null;
  }

}
