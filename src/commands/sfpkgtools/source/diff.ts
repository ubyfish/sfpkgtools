/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
//import { ReleasePlan, readRelaseJSON } from "../../../helpers/release";
//import { logTable } from "../../../renderer/table";
//var colors = require('@colors/colors');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'sourcediff');

export default class SourceDiff extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    fromcommit: flags.string({
      char: 'f',
      description: messages.getMessage('fromCommitFlagDescription')
    }),
    tocommit: flags.string({
        char: 't',
        description: messages.getMessage('toCommitFlagDescription')
    }),
    filters: flags.string({
        char: 'z',
        description: messages.getMessage('metaFiltersFlagDescription')
    })
  };

  //protected static supportsDevhubUsername = true;
  protected static requiresDevhubUsername = false;
  protected static supportsUsername = true;
  protected static requiresProject = true;

  public async run(): Promise<Object> {
    //let conn = this.hubOrg.getConnection();
    


    return null;
  }
    

}

