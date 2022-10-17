/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * ------------------------------------------------------------------------------------------------------------
 * model interface and helper methods for packaging
 */

import { Connection, Org } from '@salesforce/core';
import fs = require('fs-extra');
import { getPackageInfo, getInstalledPackages, Package2Info } from "./package";

export async function readRelaseJSON(devHubCon:Connection,planFile:string,targetOrg:Org):Promise<ReleasePlan> {
    let releasePlanJSON:ReleasePlan;
    try{
        releasePlanJSON = JSON.parse(await fs.readFileSync(planFile, 'utf-8'));
    }catch(e){
        throw new Error(`Cannot read releasePlan : ${planFile}`);
    }
    

    console.log(releasePlanJSON.releaseName);
    await hydrate(devHubCon,releasePlanJSON.packages);
    if(targetOrg){
        await checkOrg(targetOrg,releasePlanJSON.packages);
    }
    
    return releasePlanJSON;
}

async function hydrate(conn:Connection,entries:ReleasePlanEntry[]){
    for (const pkg of entries) {
        let result = await getPackageInfo(conn,pkg.name,pkg.version,null,false);
        if (!result || result.length <= 0) {
            throw new Error(`no pacakge found for ${pkg.name} and version ${pkg.version}`);
        }
        pkg.detail = result[0];
    }
}

async function checkOrg(targetOrg:Org,entries:ReleasePlanEntry[]){
    for (const pkg of entries) {
        let result = await getInstalledPackages(targetOrg.getConnection(),pkg.name);
        if (!result || result.length <= 0) {
            throw new Error(`no pacakge found for ${pkg.name} and version ${pkg.version}`);
        }
        const orgEntry = {} as OrgEntry;
        orgEntry.orgName = targetOrg.getUsername();
        orgEntry.installedVersion = result[0].PackageVersionNumber;
        if(pkg.detail.SubscriberPackageVersionId == result[0].SubscriberPackageVersionId){
            orgEntry.installed = true;
        }else{
            orgEntry.installed = false;
        }
        pkg.installedInfo = orgEntry;
    }

    
}

// The type we are querying for
export interface ReleasePlan {
    releaseName: string;
    plannedReleaseDate:string;
    releasePackage:boolean;
    preReleaseRunBook:string;
    postReleaseRunBook:string;
    packages: ReleasePlanEntry[];
}

export interface ReleasePlanEntry {
    name: string;
    version:string;
    squence:number;
    detail:Package2Info;
    installedInfo:OrgEntry;
}

export interface OrgEntry{
    orgName:string;
    installed:boolean;
    installedVersion:string;
}

