/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 * ------------------------------------------------------------------------------------------------------------
 * model interface and helper methods for packaging
 */

import { Connection } from '@salesforce/core';


export async function getUserInfo(connection:Connection,userName:string):Promise<UserInfo> {
    let query = `SELECT Id, Username, LastName, FirstName, Name, Email FROM User where Username = '${userName}'`;
    let response = await connection.query(query);
    const userInfo = {} as UserInfo;
    console.log(JSON.stringify(response));
    //map to the interface
    if (response.records && response.records.length > 0) {
        let record = response.records[0];
        userInfo.Name = record.Name;
        userInfo.emailAddress = record.Email;
        userInfo.firstName = record.FirstName;
        userInfo.lastName = record.LastName;
        userInfo.id = record.Id;
        userInfo.userName = record.Username;
    }
    
    return userInfo;    
}

// The type we are querying for
export interface UserInfo {
    userName: string;
    emailAddress:string;
    id:string;
    firstName:string,
    lastName:string,
    Name:string
}

