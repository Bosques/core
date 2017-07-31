///<reference path="../dist/bundle.d.ts" />
import {add} from "common";
export function log(msg:string){
    let list:any[] = [];
    add(list, "testDeclaration");
    console.log(`[${list.length}]${msg}`);
}

