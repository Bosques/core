export class Cursor<T extends {cs:any}>{
    root:T;
    get childunit():T{
        let t = <any>this.target;
        let at = t.getAttribute('alias');
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
}