import * as core from "../../common";
import { OperationNode } from "./operationode";
import { Cursor } from "../../cursor";
import * as nodes from "../elements";
import { ModuleScope } from "./modulescope";


export abstract class Module{
    cs:Cursor<Module>;
    scope:any;
    $ref:any;
    $obj:any;
    alias:string;
    readonly $props:any = {};
    constructor(public readonly name:string){
        name = name.toLowerCase();
        //this.cs = new Cursor<Module>();
        Cursor.check<Module>(this);
        this.scope = new ModuleScope();

    }
    setparent(parent:Module){
        let cs = this.cs;
        if (parent){
            let pcs = parent.cs;
            cs.setparent(pcs);
            this.scope = parent.scope;
            //parent.setchild(this);
            core.trigger(parent, 'child', [this]);
        }
    }
    setalias(alias:string, group?:boolean){
        this.alias = alias;
        let u = <any>this.cs.unit;
        if (u){
            u[`$${alias}`] = this;
        }
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