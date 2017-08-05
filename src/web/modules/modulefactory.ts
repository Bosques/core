///<amd-module name="ModuleFactories"/>

import * as core from "../../common";
import {OperationNode} from "./operationode";
import * as nodes from "../elements";


export abstract class ModuleFactory extends core.NamedObject{
    constructor(name:string){
        super(name);
    }
    abstract create(target:ModuleTemplate):Module;
    abstract process(target:ModuleTemplate):void;
}

export interface ModuleTemplate{
    readonly tag:string;
}

export abstract class Module{
    protected parent:Module;
    constructor(){

    }
    abstract setup():void;
    setparent(parent:Module){
        this.parent = parent;
        parent.setchild(this);
    }
    abstract setchild(child:Module):void;
}

export abstract class NodeModule extends Module{
    constructor(){
        super();
    }
    render(parentEl:OperationNode){
        let html = this.dorender();
        let node = nodes.make(html);
        parentEl.appendChild(node);
    }
    abstract dorender():string;
}