export class Cursor<T extends {cs:any}>{
    root:T;
    get childunit():T{
        let t = <any>this.target;
        let at = t['alias'] || t.getAttribute('alias');
        if (at){
            return this.target;
        }
        return this.unit || this.target;
    }
    unit:T;
    parent:T;
    target:T;
    constructor(){
    }
    
    static check<T extends {cs:any}>(target:T){
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
            this.unit = pcs.childunit;
        }
    }

    dispose(){
        this.root = null;
        this.unit = null;
        this.parent = null;
        this.target = null;
    }
}