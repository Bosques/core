import * as core from '../../common';
import { Cursor } from "../../cursor";
import * as nodes from '../elements';
import {Scope} from './scope';

export class NodeFactory implements core.NamedObject{
    constructor(public readonly name:string){
    }
    static instance:core.NamedCreator<vnode> = new core.NamedCreator<vnode>();
    static parse(entry:any, scope?:Scope){
        let rlt = parseElement(entry, scope);
        return rlt;
    }
}

export function parseElement(node:CoreNode, scope?:Scope, parent?:CoreNode){
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
    if (parent){
        vn.setparent(parent.vn);
    }
    let attrs = node.attributes;
    core.all(attrs, (at:CoreNode, i:number)=>{
        let aname = at.nodeName.toLowerCase();
        let aval = at.nodeValue;
        if (aname == 'alias'){
            vn.setalias(aval);
        }else if(aname == 'group'){
            if (!vn.alias && aval && aval.length > 0){
                vn.setalias(aval);                
            }
            scope = vn.setgroup();
        }else if (core.starts(aname, 'if')){
            let f = vn.scope().bag[aval];
            if (f){
                let n = aname.substr(2, aname.length - 2);
                vn.on[n] = f;
            }
        }else{
            vn.addprop(at.nodeName, at.nodeValue);
        }
    });
    let html = core.trigger(vn, 'render', [parent?parent.vn:null]);
    if (html){
        let n = nodes.create(html);
        parent.appendChild(n);
        core.trigger(vn, 'rendered', [n]);
    }
    core.trigger(vn, 'created', [parent?parent.vn:null]);
    core.trigger(vn, 'place', [parent?parent.vn:null]);
    let children = node.childNodes;
    core.all(children, (ch:CoreNode, i:number)=>{
        parseElement(ch, scope, node);
    });
    core.trigger(vn, 'setup', [parent?parent.vn:null]);
    core.all(children, (ch:CoreNode, i:number)=>{
        let v = ch.vn;
        if (v){
            core.trigger(v, 'ready', [node.vn]);
        }
    });
}

export class vnode {
    readonly name:string;
    readonly cs:Cursor<vnode>;
    alias:string;

    ref:any;

    on:any;

    has(name:string){
        return this.name == name || this.alias == name;
    }

    readonly children:vnode[] = [];
    protected _props:any = {};
    protected _scope:Scope;
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
        this._scope = scope || new Scope();
    }
    setparent(parent:vnode){
        this.cs.setparent(parent.cs);
        parent.addchild(this);
    }
    addchild(child:vnode){
        core.add(this.children, child);
    }
    setgroup(){
        let u = <any>this.cs.unit();
        if (this.alias){
            let preset = this._scope.children[`${this.alias}`];
            if (preset){
                this._scope = preset;
            }else{
                this._scope = this._scope.child(this.alias);
            }
        }else{
            this._scope = this._scope.child();
        }
        return this._scope;
    }
    setalias(alias:string){
        this.alias = alias;
        let u = <any>this.cs.unit();
        if (u){
            u[`$${alias}`] = this;
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