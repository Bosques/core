import { Module, ModuleScope } from "./modulefactory";
import {Cursor} from "../../cursor";

export abstract class OperationNode extends Element{

    static check(node:OperationNode, parent?:OperationNode){
        if (node.nodeName.indexOf('#') < 0){
            Cursor.check<OperationNode>(node);
            node.setalias = function(alias:string){
                let u = <any>this.cs().unit;
                u[`$${alias}`] = this;
            };
            node.cs = function(){
               return this.cs;
            };
            node.scope=function(){
                return this.md.scope;
            };
            return true;
        }
        return false;
    }

    md:Module;

    abstract cs():Cursor<OperationNode>;

    abstract scope():ModuleScope;

    abstract setalias(alias:string):void;
}