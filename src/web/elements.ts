import {starts, all, add} from "../common";

export function addcss(target:any, name:string){
    let classes = target.className.trim();
    if (classes.indexOf(name) != 0 && classes.indexOf(' ' + name)<0){
        let s = `${classes} ${name}`;
        target.className = s;
    }
}
export function delcss(target:any, name:string){
    let classes = target.className.trim();
    if (classes.indexOf(name) == 0 || classes.indexOf(' ' + name)>=0){
        let s = classes.replace(name, '');
        target.className = s;
    }
}
export function destroy(target:Node){
    let b = <any>document.body;
    if (!b.$destroyer$){
        b.$destroyer$ = document.createElement('div');
    }
    if (!target){
        return;
    }
    all(target, function(item:any, i:string){
        if (starts(i, ['$', '_'])){
            item[i] = null;
        }
    })
    let d = <Element> b.$destroyer$;
    d.appendChild(target);
    d.innerHTML = '';
}
export function evtarget(event:Event, callback?:Function){
    let el = event.target || event.srcElement;
    if (callback){
        return callback(el);
    }
    return el;
}
export function create(html:string, multiple?:boolean):Node{
    let b = <any>document.body;
    if (!b.$creator$){
        b.$creator$ = document.createElement('div');
    }
    let div = b.$creator$;
    div.innerHTML = html;
    let rlt:any[] = [];
    all(div.childNodes, (n:Node, i:number)=>{
        add(rlt, n);
    });
    div.innerHTML = '';

    return multiple?rlt:rlt[0];
}
export function astyle(styles:any, val?:any) {
    let style:any = null;
    let props = (styles instanceof Array)?styles:[styles];
    let el:Element = this;
    let compStyle:CSSStyleDeclaration = window.getComputedStyle(el, null);
    for (let i:number = 0; i < props.length; i++) {
        style = compStyle.getPropertyValue(props[i]);
        if (style != null) {
            break;
        }
    }
    if (val !== undefined){
        return style == val;
    }
    return style;
};

