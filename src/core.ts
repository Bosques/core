import {log} from './info';
import {add} from './common';
import {Noder} from './web/modules/noder';

export function init(callback?:Function){
    if (callback){
        callback(Noder.instance);
    }
    log("Core module loaded");
}

let w = <any>window;
w.test = [];
add(w.test, 'success');