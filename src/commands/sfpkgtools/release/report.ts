/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfError } from '@salesforce/core';
import { ReleasePlan, readRelaseJSON } from "../../../helpers/release";
import { logTable } from "../../../renderer/table";
//var colors = require('@colors/colors');

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfpkgtools', 'releasereport');

export default class ReleaseReport extends SfdxCommand {
  
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-n, --name=VALUE)
    releaseplan: flags.string({
      char: 'r',
      description: messages.getMessage('releaseplanFlagDescription')
    })  
    

  };

  //protected static supportsDevhubUsername = true;
  protected static requiresDevhubUsername = true;
  protected static supportsUsername = true
  protected static requiresProject = false;

  public async run(): Promise<ReleasePlan> {
    let conn = this.hubOrg.getConnection();
    
    let planFile = this.flags.releaseplan != null ? this.flags.releaseplan : 'releasePlan.json';
    let releasePlan = await readRelaseJSON(conn,planFile,this.org);
    if(releasePlan == null){
        throw new SfError(messages.getMessage('errorNoOrgResults', [planFile]));
    }
    const summaryReport = {} as ReleasePlanSummaryReport;
    summaryReport.releaseName = releasePlan.releaseName;
    summaryReport.postReleaseRunBook = releasePlan.postReleaseRunBook;
    summaryReport.preReleaseRunBook = releasePlan.preReleaseRunBook;
    summaryReport.plannedReleaseDate = releasePlan.plannedReleaseDate;
    let reportPkgs = [];
    releasePlan.packages.forEach(pkg => {
        const releaseItem = {} as ReleaseItem;
        releaseItem.codeCoverage = pkg.detail.CodeCoverage;
        releaseItem.packageId = pkg.detail.SubscriberPackageVersionId;
        releaseItem.packageName = pkg.name;
        releaseItem.packageVersion = pkg.detail.PackageVersionNumber;
        releaseItem.skippedValidation = pkg.detail.ValidationSkipped;
        releaseItem.installedInTarget = pkg.installedInfo.installed;
        releaseItem.installedVersion = pkg.installedInfo.installedVersion;
        reportPkgs.push(releaseItem);
    });
    let plans = [];
    plans.push(summaryReport);
    let topFields = ['releaseName','plannedReleaseDate','preReleaseRunBook'];
    logTable(plans,topFields);
    let packageFields;
    if(this.org){
        packageFields = ['packageName','packageVersion','codeCoverage','skippedValidation','installedInTarget','packageId'];
    }else{
        packageFields = ['packageName','packageVersion','codeCoverage','skippedValidation','packageId'];
    }
    
    logTable(reportPkgs,packageFields);

    return releasePlan;
  }
    

}


interface ReleasePlanSummaryReport{
    releaseName:string;
    preReleaseRunBook:string;
    postReleaseRunBook:string;
    plannedReleaseDate:string;
    packages:ReleaseItem[];
}

interface ReleaseItem{
    packageName:string;
    packageVersion:string;
    packageId:string;
    sequence:number;
    codeCoverage:number;
    isReleased:boolean;
    skippedValidation:boolean;
    installedInTarget:boolean;
    installedVersion:string;
}