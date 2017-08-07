import { ModuleScope } from "./modulescope";
import { Module, NodeModule } from "./module";
import { Cursor } from "../../cursor";

export abstract class OperationNode extends Element{

    static check(node:OperationNode, parent?:OperationNode){
        if (node.nodeName.indexOf('#') < 0){
            Cursor.check<OperationNode>(node);
            node.setalias = function(alias:string, group?:boolean){
                let cs = <any>this.cs;
                let u = cs.unit;
                u[`$${alias}`] = this;
                if (group){
                    let self = <OperationNode>this;
                    self._scope = new OperationScope(self._scope);
                }
            };
            node.setparent = function(parent:OperationNode){
                let self = <OperationNode>this;
                let cs = self.cs;
                if (parent){
                    let pcs = parent.cs;
                    cs.setparent(pcs);
                    self._scope = parent.scope;
                }
            };
            node.scope = function(scope?:OperationScope){
                let self = <OperationNode>this;
                if (scope){
                    self._scope = scope;
                }
                return self._scope;
            };
            if (parent){
                node.setparent(parent);
            }
            return true;
        }
        return false;
    }

    //protected _scope:OperationScope;
    md:Module;
    protected _scope:OperationScope;
    cs:Cursor<OperationNode>;

    abstract scope(scope?:OperationScope):OperationScope;

    abstract setalias(alias:string, group?:boolean):void;

    abstract setparent(parent:OperationNode):void;
}
export class OperationScope{
    static check(target:OperationNode, parent?:OperationNode){
        if (target){
            if (!target.scope()){
                if (!parent){
                    target.scope(new OperationScope());
                }else if (parent.scope()){
                    target.scope(parent.scope());
                }else{
                    console.log('Parent should always has scope');
                    debugger;
                }
            }
        }
    }
    constructor(protected readonly $parent?:OperationScope){

    }
}