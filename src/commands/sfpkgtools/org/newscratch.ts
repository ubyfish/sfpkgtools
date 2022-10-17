/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import ScratchOrgUtils, { ScratchOrg } from "../../../helpers/scratchorg";
import { getUserInfo } from "../../../helpers/user";

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'newscratch');

export default class NewScratch extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    email: flags.boolean({
      char: 'e',
      description: messages.getMessage('emailFlagDescription')
    }),
    adminemail: flags.string({
      char: 'x',
      description: messages.getMessage('adminEmailFlagDescription')
    }),    
    numberofdays: flags.number({
      char: 'd',
      description: messages.getMessage('numberOfDaysFlagDescription')
    }),
    orgalias: flags.string({
      char: 'a',
      description: messages.getMessage('orgAliasFlagDescription')
    }),
    configpath: flags.string({
        char: 'c',
        description: messages.getMessage('configFlagDescription')
      })    
  };

  //protected static supportsDevhubUsername = true;
  protected static requiresDevhubUsername = true;
  protected static requiresProject = true;
  protected static supportsUsername = true;
  //protected static requiresUsername = true;
  
  public async run(): Promise<ScratchOrg> {
    const sendEmail:boolean = this.flags.email;
    let adminEmail:string = this.flags.adminemail;
    let durationDays:number = this.flags.numberofdays;
    const orgAlias = this.flags.orgalias;
    let configPath = this.flags.configpath;
    const devhubUserName = this.hubOrg.getUsername();
    
    if(adminEmail == null){
      let userInfo = await getUserInfo(this.hubOrg.getConnection(),devhubUserName);
      adminEmail = userInfo.emailAddress;
    }
    console.log('devHubUser : ' + devhubUserName + ', userInfo -> ' + adminEmail);
    const defaultPkg = await this.project.getDefaultPackage();
    console.log('defaultPkg => ' + defaultPkg.package);
    if(durationDays == null){
        durationDays = 5;
    }
    if(configPath == null){
        configPath = './config/scratch-org-config/project-scratch-def.json';
    }
    let scratchOrg: ScratchOrg = await ScratchOrgUtils.createScratchOrg(adminEmail, configPath, durationDays, this.hubOrg, sendEmail ,orgAlias);

    if(sendEmail){
        ScratchOrgUtils.shareScratchOrgThroughEmail(adminEmail,scratchOrg,this.hubOrg,defaultPkg.name);
    }
    
    return scratchOrg;
  }
    

    





}
