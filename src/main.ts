import {log} from './info';
//import * as common from './common';
import {add} from './common';

export function init(){
    log("Main module loaded");
}

let w = <any>window;
w.test = [];
add(w.test, 'success');