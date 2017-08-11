import * as core from '../../common';
import {ModuleFactory} from './modulefactory';
import {OperationNode} from './operationode';
import { Cursor } from "../../cursor";
import {Module, NodeModule} from './module';
import * as nodes from '../elements';

export class NodeFactory implements core.NamedObject{
    constructor(public readonly name:string){
    }
    static instance:core.NamedCreator<vnode> = new core.NamedCreator<vnode>();
    static parse(entry:any, scope?:any){
        let rlt = parseElement(entry, scope);
        return rlt;
    }
}

export function parseElement(node:CoreNode, scope?:any, parent?:CoreNode){
    let tag:string = null;
    if (core.is(node, Element)){
        let el = <Element><any>node;
        tag = el.tagName.toLowerCase();
    }else{
        tag = node.nodeName.toLowerCase();
    }
    //let vn = new vnode(node, scope || (parent?parent.vn.scope():undefined), md?md.create():undefined);
    let vn = <vnode>NodeFactory.instance.create(tag, [node]);
    if (!vn){
        vn = new vnode(node, 'vnode');
    }
    vn.setscope(scope || (parent?parent.vn.scope():undefined));
    node.vn = vn;

    let attrs = node.attributes;
    core.all(attrs, (at:CoreNode, i:number)=>{
        let aname = at.nodeName.toLowerCase();
        let aval = at.nodeValue;
        if (aname == 'alias' || aname == 'group'){
            scope = vn.setalias(aname, aname == 'group');
        }else if (core.starts(aname, 'if')){
            let f = vn.scope()[aval];
            if (f){
                let n = aname.substr(2, aname.length - 2);
                vn.on[n] = f;
            }
        }else{
            vn.addprop(at.nodeName, at.nodeValue);
        }
    });
    if (parent){
        vn.setparent(parent.vn);
    }
    let html = core.trigger(vn, 'render', [parent?parent.vn:null]);
    if (html){
        let n = nodes.create(html);
        parent.appendChild(n);
        core.trigger(vn, 'rendered', [n]);
    }
    core.trigger(vn, 'created', [parent?parent.vn:null]);
    let children = node.childNodes;
    core.all(children, (ch:OperationNode, i:number)=>{
        parseElement(ch, scope, node);
    });
    core.trigger(vn, 'ready', [parent?parent.vn:null]);
}

export class vnode {
    readonly name:string;
    readonly cs:Cursor<vnode>;
    alias:string;

    ref:any;
    obj:any;

    on:any;

    readonly children:vnode[] = [];
    protected _props:any = {};
    protected _scope:any;
    constructor(el:CoreNode, name?:string){
        this.ref = el;
        Cursor.check<vnode>(this);
        this.name = name;
        this.on = {};
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
    setscope(scope?:any){
        this._scope = scope || {};
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
        return this._scope;
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