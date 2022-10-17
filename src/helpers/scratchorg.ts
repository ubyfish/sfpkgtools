/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * ------------------------------------------------------------------------------------------------------------
 * model interface and helper methods for packaging
 */

import { AuthInfo, Org } from '@salesforce/core';
//import { getUserInfo } from "./user";
const child_process = require('child_process');

export default class ScratchOrgUtils {
    private static async getScratchOrgLoginURL(hubOrg: Org, username: string): Promise<any> {
        let conn = hubOrg.getConnection();

        let query = `SELECT Id, SignupUsername, LoginUrl FROM ScratchOrgInfo WHERE SignupUsername = '${username}'`;
        console.log('QUERY:' + query);
        const results = (await conn.query(query)) as any;
        console.log(`Login URL Fetched: ${JSON.stringify(results)}`);

        return results.records[0].LoginUrl;
    }    

    public static async createScratchOrg(adminEmail: string, config_file_path: string, durationDays: number,hubOrg: Org, issueEmail: boolean,orgAlias?:string): Promise<ScratchOrg> {
        console.log('Parameters: ' + adminEmail + ' ' + config_file_path + ' ' + durationDays);
        
        let getSFDXCommand = `sfdx force:org:create -f ${config_file_path} -d ${durationDays} -w 10 -v ${hubOrg.getUsername()}`;
        let orgName;
        if(orgAlias){
            orgName = orgAlias;
        }else{
            orgName = 'SO1';
        }
        getSFDXCommand += ` --setalias=${orgName}`;
        if (adminEmail) {
            getSFDXCommand += ` adminEmail=${adminEmail}`;
        }        
        getSFDXCommand+=' --json';
        console.log('created command : ' + getSFDXCommand);

        //let result = child_process.execSync(getSFDXCommand, { stdio: 'pipe' });
        let result = child_process.execSync(getSFDXCommand,{
            encoding: 'utf8',
        });
        const resultObject = JSON.parse(result);
    
        console.log('scratchOrg response => ' +JSON.stringify(resultObject));
        //{"status":0,"result":{"orgId":"00D0C00000012BQUAY","username":"test-riroudcml6vt@example.com"}}
        let scratchOrg: ScratchOrg = {
            alias: orgName,
            orgId: resultObject.result.orgId,
            username: resultObject.result.username,
            signupEmail: adminEmail ? adminEmail : '',
        };
    
        //Get FrontDoor URL
        scratchOrg.loginURL = await this.getScratchOrgLoginURL(hubOrg, scratchOrg.username);
    
        //Generate Password
        let passwordCmd = `sfdx force:user:password:generate --targetusername ${scratchOrg.username} -v ${hubOrg.getUsername()} --json`;
        let passresult = child_process.execSync(passwordCmd, {
            encoding: 'utf8',
        });
        const passObject = JSON.parse(passresult);
        //console.log(JSON.stringify(passObject))
        scratchOrg.password = passObject.result.password;
    
        //Get Sfdx Auth URL
        try {
            const authInfo = await AuthInfo.create({ username: scratchOrg.username });
            scratchOrg.sfdxAuthUrl = authInfo.getSfdxAuthUrl();
        } catch (error) {
            console.log( `Unable to fetch authURL for ${scratchOrg.username}. Only Scratch Orgs created from DevHub using authenticated using auth:sfdxurl or auth:web will have access token and enabled for autoLogin`);
        }
    
        if (!passObject.result.password) {
            throw new Error('Unable to setup password to scratch org');
        } else {
            console.log( `Password successfully set for ${scratchOrg.username}`);
        }
    
        return scratchOrg;
    }
    
    public static async shareScratchOrgThroughEmail(emailId: string, scratchOrg: ScratchOrg, hubOrg: Org, projectName:string) {
        let hubOrgUserName = hubOrg.getUsername();
        
        let body = `${hubOrgUserName} Requested a scratch org for project ${projectName}. Below is the info to login\n
The Login url for this org is : ${scratchOrg.loginURL}\n
Username: ${scratchOrg.username}\n
Password: ${scratchOrg.password}\n
Please use sfdx force:auth:web:login -r ${scratchOrg.loginURL} -a <alias>  command to authenticate against this Scratch org\n
Thanks!`;
    
        console.log('/services/data/v50.0/actions/standard/emailSimple');
        //const emailResult = await hubOrg.getConnection().request({
        await hubOrg.getConnection().request({
            method: 'POST',
            url: '/services/data/v50.0/actions/standard/emailSimple',
            body: JSON.stringify({
                inputs: [
                    {
                        emailBody: body,
                        emailAddresses: emailId,
                        emailSubject: `${hubOrgUserName} created you a new Scratch Org`,
                        //senderType: 'CurrentUser',
                        senderAddress: `${hubOrgUserName}`
                    },
                ],
            }),
        });
        
        
        //console.log(JSON.stringify(emailResult));
        
        console.log(`Succesfully send email to ${emailId} for ${scratchOrg.username}`);
    }    

}



export interface ScratchOrg {
    recordId?: string;
    orgId?: string;
    loginURL?: string;
    signupEmail?: string;
    username?: string;
    alias?: string;
    password?: string;
    isScriptExecuted?: boolean;
    expiryDate?: string;
    accessToken?: string;
    instanceURL?: string;
    status?: string;
    sfdxAuthUrl?: string;
}

