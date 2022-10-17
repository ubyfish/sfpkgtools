/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * ------------------------------------------------------------------------------------------------------------
 * model interface and helper methods for packaging
 */

import { AuthInfo } from '@salesforce/core'

/**
 * inspects your local Org authorisations and retunds info about them.
 * TODO : how to return a connection...
 * @param targetAlias 
 * @returns 
 */
export async function localOrgAuthInfo(targetAlias:string):Promise<OrgInfo[]> {
  let orAuths = await AuthInfo.listAllAuthorizations();
  let orgList = [];
  
  orAuths.forEach((auth) => {
    const orgInfo = {} as OrgInfo;
    orgInfo.orgAlias = auth.aliases[0];
    orgInfo.targetUername = auth.username;
    orgInfo.orgId = auth.orgId;
    orgList.push(orgInfo);
  });
  
  return orgList;

}

export interface OrgInfo{
  orgAlias:string;
  orgId:string;
  targetUername:string;
}