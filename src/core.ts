import {log} from './info';
import {add} from './common';
import * as nodes from './web/modules/vnode';

export function init(callback?:Function){
    if (callback){
        callback(nodes.NodeFactory.instance);
    }
    log("Core module loaded");
}

let w = <any>window;
w.test = [];
add(w.test, 'success');