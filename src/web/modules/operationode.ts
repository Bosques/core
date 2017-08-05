import {Module} from "./modulefactory";
export class OperationNode extends Node{

    static check(node:OperationNode, parent?:OperationNode){
        if (node.nodeName.indexOf('#') < 0){
            Cursor.check(node);

            return true;
        }
        return false;
    }

    md:Module;

    cs:Cursor;

    scope:OperationScope;

    setalias(alias:string, group?:boolean){
        let u = <any>this.cs.unit;
        u[`$${alias}`] = this;
        if (group){
            this.scope = new OperationScope(this.scope);
        }
    }
    setchild(node:OperationNode){
        node.cs.parent = this;
        node.cs.root = this.cs.root;
        node.cs.unit = this.cs.childunit;
        this.md.setchild(node.md);
    }
}

export class OperationScope{
    static check(target:OperationNode, parent?:OperationNode){
        if (target){
            if (!target.scope && parent.scope){
                target.scope = parent.scope;
            }else if (!target.scope && parent && !parent.scope){
                // Parent should always have a scope.
                debugger;
            }else{
                target.scope = new OperationScope();
            }
        }
    }
    constructor(protected readonly $parent?:OperationScope){

    }
}

export class Cursor{
    root:OperationNode;
    get childunit():OperationNode{
        let t = <any>this.target;
        let at = t.getAttribute('alias');
        if (at){
            return this.target;
        }
        return this.unit || this.target;
    }
    unit:OperationNode;
    parent:OperationNode;
    target:OperationNode;
    constructor(){

    }
    static check(target:OperationNode){
        if (!target.cs){
            let cs = new Cursor();
            cs.target = target;
            target.cs = cs;
        }
    }
}