import * as core from '../../common';
export class Scope{
    static readonly instance:any = new Scope();
    protected parent:Scope
    readonly bag:any = {};
    readonly children:any = {};
    get(name:string){
        let p = <any>this;
        while(p){
            if (p.bag[name]){
                return p.bag[name];
            }
            p = p.parent;
        }
        return null;
    }
    set(name:string, val:any){
        this.bag[name] = val;
    }
    child(name?:string){
        let n = name || core.uid('scope');
        let c = new Scope();
        this.children[n] = c;
        c.parent = this;
        return c;
    }
}