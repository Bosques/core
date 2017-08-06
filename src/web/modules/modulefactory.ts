////<amd-module name="ModuleFactories"/>

import * as core from "../../common";
import { OperationNode } from "./operationode";
import { Cursor } from "../../cursor";
import * as nodes from "../elements";


export abstract class ModuleFactory extends core.NamedFactory<Module> implements core.NamedObject{
    constructor(public readonly name:string){
        super();
        name = name.toLowerCase();
    }
    abstract create(target:ModuleTemplate):Module;
    abstract process(target:ModuleTemplate):void;
}

export interface ModuleTemplate{
    readonly tag:string;
}

export class ModuleScope{
    static check(target:Module, parent?:Module){
        if (target){
            if (!target.scope && parent.scope){
                target.scope = parent.scope;
            }else if (!target.scope && parent && !parent.scope){
                // Parent should always have a scope.
                debugger;
            }else{
                target.scope = new ModuleScope(target.scope);
            }
        }
    }
    constructor(protected readonly $parent?:ModuleScope){

    }
}
export abstract class Module{
    cs:Cursor<Module>;
    scope:ModuleScope;
    $ref:any;
    protected parent:Module;
    constructor(public readonly name:string){
        name = name.toLowerCase();
        this.cs = new Cursor<Module>();
        this.scope = new ModuleScope();
    }
    setparent(parent:Module){
        this.parent = parent;
        this.scope = parent.scope;
        //parent.setchild(this);
        core.trigger(parent, 'child', [this]);
    }
    setalias(alias:string, group?:boolean){
        let u = <any>this.cs.unit;
        u[`$${alias}`] = this;
        if (group){
            this.scope = new ModuleScope(this.scope);
        }
    }
    abstract create():Module;
}

export abstract class NodeModule extends Module{
    constructor(name:string){
        super(name);
    }
    render(parentEl:OperationNode){
        let html = this.dorender();
        let node = nodes.make(html);
        parentEl.appendChild(node);
        return node;
    }
    abstract dorender():string;
}