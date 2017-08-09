import * as core from '../../common';
import {ModuleFactory} from './modulefactory';
import {OperationNode} from './operationode';
import { Cursor } from "../../cursor";
import {Module, NodeModule} from './module';

export class VNodeFactory implements core.NamedObject{
    constructor(public readonly name:string){
    }
    static instance:core.NamedFactory<VNodeFactory> = new core.NamedFactory<VNodeFactory>();
}

export function parseElement(node:CoreNode, parent?:CoreNode, scope?:any){
    let md:Module = undefined;
    if (core.is(node, Element)){
        let el = <Element><any>node;
        let tag = el.tagName.toLowerCase();
        md = VNodeFactory.instance.get(tag);
    }
    let vn = new vnode(node, scope || (parent?parent.vn.scope():undefined), md?md.create():undefined);
    node.vn = vn;

    let attrs = node.attributes;
    core.all(attrs, (at:CoreNode, i:number)=>{
        let aname = at.nodeName.toLowerCase();
        if (aname == 'alias' || aname == 'group'){
            vn.setalias(aname, aname == 'group');
        }else{
            vn.addprop(at.nodeName, at.nodeValue);
        }
    });
    if (parent){
        vn.setparent(parent.vn);
    }
    core.trigger(vn, 'created', [parent.vn], vn.scope());
    let children = node.childNodes;
    core.all(children, (ch:OperationNode, i:number)=>{
        parseElement(ch, node);
    });
    core.trigger(vn, 'ready', [parent.vn], vn.scope());
}

export class vnode {
    readonly cs:Cursor<vnode>;
    alias:string;

    ref:any;
    obj:any;

    readonly children:vnode[] = [];
    protected _props:any = {};
    constructor(el?:Node, protected _scope?:any, public readonly md?:Module){
        this.ref = el;
        if (!this._scope){
            this._scope = {};
        }
        this.cs = new Cursor<vnode>();
    }
    prop(name:string){
        return this._props[name];
    }
    scope(){
        return this._scope;
    }
    addprop(name:string, val:any){
        let self = this;
        this._props[name] = val;
    }
    setparent(parent:vnode){
        this.cs.setparent(parent.cs);
        parent.addchild(this);
    }
    addchild(child:vnode){
        core.add(this.children, child);
    }
    setalias(alias:string, group:boolean){
        this.alias = alias;
        let u = <any>this.cs.unit;
        if (u){
            u[`$${alias}`] = this;
            if (group){
                this._scope = this._scope[`$${alias}`] || {};
                this._scope.$parent = u.scope();
            }
        }
    }
    dispose(){
        this._props = null;
        this.ref = null;
        this.cs.dispose();

    }
}

export class CoreNode extends Node{
    vn:vnode;
}