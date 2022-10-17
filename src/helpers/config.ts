/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * ------------------------------------------------------------------------------------------------------------
 * model interface and helper methods for packaging
 */

import fs = require('fs-extra');

/**
 * 
 * @param connection - sfdx connection
 * @param pkgname - e.g. salesforce-global-core
 * @param version - the symantic version e.g. 1.1.0.1
 * @param pkgId - if provided it will just fetch info for the package
 * @param allBetas - if supplied then it will show the list of packages in that group - e.g. 1.1.0.1, 1.1.0.2,1.1.0.3 - otherwise just the specific version
 * @returns 
 */
export async function readConfig():Promise<ConfigOverrides> {
    let overrides: ConfigOverrides = JSON.parse(await fs.readFileSync('config.json', 'utf-8'));
    console.log(overrides.releaseTransition);
    console.log(overrides.runTestOnValidate);
    return overrides;
}

// The type we are querying for
export interface ConfigOverrides {
    runTestOnValidate: boolean;
    releaseTransition:boolean;
}

