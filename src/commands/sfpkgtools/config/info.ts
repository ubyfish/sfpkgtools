/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { readConfig, ConfigOverrides } from "../../../helpers/config";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'info');

export default class Info extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    name: flags.string({
      char: 'n',
      description: messages.getMessage('nameFlagDescription'),required: false
    }),
    versionnumber: flags.string({
      char: 'm',
      description: messages.getMessage('versionNumberFlagDescription')
    }),
    allbetas: flags.boolean({
      char: 'b',
      description: messages.getMessage('allBetasFlagDescription')
    }),    
    versionid: flags.string({
      char: 'i', 
      description: messages.getMessage('versionIdByFlagDescription')})
  };

  //protected static supportsDevhubUsername = true;
  protected static requiresDevhubUsername = false;

  protected static requiresProject = false;

  public async run(): Promise<ConfigOverrides> {
    let result = await readConfig();
    if(result == null){
      throw new SfError('No config.json found');
    }
    return result;
  }
    

    





}
