export class Cursor<T extends {cs:any, name:string, has?:Function}>{
    root:T;
    get childunit():T{
        let t = <any>this.target;
        let at = t['alias'] || t['group'] || (t.getAttribute && (t.getAttribute('alias') || t.getAttribute('group')));
        if (at){
            return this.target;
        }
        return this._unit || this.target;
    }
    unit(name?:string):T{
        let u = this._unit;
        let has = u.has || function(name:string){
            return this.name == name;
        }
        if (name){
            while (true){
                if (!u || has.apply(u, name)){
                    break;
                }
                u = u.cs._unit;
            }
            return (u && has.apply(u, name))?u:undefined;
        }else{
            return u;
        }
    }
    protected _unit:T;
    parent:T;
    target:T;
    constructor(){
    }
    
    static check<T extends {cs:any, name:string}>(target:T){
        if (!target.cs){
            let cs = new Cursor<T>();
            cs.target = target;
            target.cs = cs;
        }
    }

    setparent(pcs?:Cursor<T>){
        if (pcs){
            this.parent = pcs.target;
            this.root = pcs.root || pcs.target;
            this._unit = pcs.childunit;
        }
    }

    dispose(){
        this.root = null;
        this._unit = null;
        this.parent = null;
        this.target = null;
    }
}