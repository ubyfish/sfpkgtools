/*
 * Copyright (c) 2022, ubyfish
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */

var Table = require('cli-table3');

export function prepareTable(data:Object[],fields:string[]):string {
    var table = new Table({ head: fields, wordWrap: true });
    data.forEach(row => {
        let rowData = [];
        for (const field of fields) {
            rowData.push(row[field]);
        }
        table.push(
            rowData 
        )        
    });
    
    return table.toString();
}



export async function logTable(data:Object[],fields:string[]) {
    var table = new Table({ head: fields, wordWrap: true });
    data.forEach(row => {
        let rowData = [];
        for (const field of fields) {
            rowData.push(row[field]);
        }
        table.push(
            rowData 
        )        
    });
    console.log(table.toString());
}


