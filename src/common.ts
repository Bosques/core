
export function starts(target:string, prefix:any){
    if (target === undefined || target === null || prefix === undefined){
        return false;
    }
    if (!(prefix instanceof Array)){
        prefix = [prefix];
    }
    let rlt = false;
    all(prefix, (item:any, i:any)=>{
        if (target.indexOf(item) == 0){
            rlt = true;
            return true;
        }
    }); 
    return  rlt;
}

export function between(target:string, start:string, end:string){
    return target && target.indexOf(start) == 0 && target.lastIndexOf(end) == target.length-end.length;
}

export function inbetween(target:string, start?:string, end?:string){
    let sl = start?start.length:1;
    let el = end?end.length:1;
    if (target){
        return target.substr(sl, target.length - sl - el);
    }
    return target;
}

export function extend(s:any, d:any, ig?:any){
    if (d){
        for(var i in d){
            if (!ig || !ig[i]){
                s[i] = d[i];
            }
        }
    }
}

export function find(target:any[], field:string, val:any){
    if (!target || !field){
        return;
    }
    return all(target, function(item:any, i:number){
        if (item[field] == val){
            return true;
        }
    });
}

export function all(target:any, callback:Function, prepare?:Function, last?:boolean){
    let rlt:any = null;
    if (callback){
        if (target === undefined || target === null){
            if (prepare){
                prepare();
            }
            return rlt;
        }
        if (target instanceof Array || target.length !== undefined){
            if (prepare){
                prepare(true);
            }
            for(let i=0;i<target.length;i++){
                if (callback(target[i], i, target)){
                    rlt = target[i];
                    break;
                }
            }
            if (!rlt && last){
                rlt = target[target.length - 1];
            }
        }else{
            if (prepare){
                prepare(false);
            }
            for(let i in target){
                if (callback(target[i], i,target)){
                    rlt = target[i];
                    break;
                }else if (last){
                    rlt = target[i];
                }
            }
        }
    }
    return rlt;
}

export function uid(prefix?:string):string{
    if (!prefix){
        prefix = '$u$';
    }
    let d = new Date();
    let s = `${prefix}-${d.getHours()}${d.getMinutes()}${d.getSeconds()}${d.getMilliseconds()}${Math.floor(Math.random() * 100)}-${d.getFullYear()}${d.getMonth()}${d.getDate()}`;
    return s;
}

export function clone(target:any, id?:string){
    let KEY = "$cloneid$";
    id = id || uid('$cl$');
    if (target === undefined || target === null || typeof(target) != 'object'){
        return target;
    }
    let rlt:any = target;
    if (target[KEY] && target[KEY] == id){
        return target;
    }
    all(target, function(item:any, i:any){
        rlt[i] = clone(item, id);
    }, function(array:boolean){
        if (array){
            rlt = [];
        }else{
            rlt = {};
        }
        target[KEY] = id;
    });
    return rlt;
}

export function join(target:any, field?:string){
    let rlt = '';
    all(target, function(item:any, i:any){
        rlt += field? item[field]:item;
    });
    return rlt;
}

export function clear(target:{pop:Function, length:number}){
    if (target){
        while(target.length > 0){
            target.pop();
        }
    }
    return target;
}

export function unique(target:any, item:any, comp?:Function){
    if (!comp){
        comp = (a:any, b:any)=>{
            return a == b;
        };
    }
    let rlt = true;
    all(target, (it:any, i:any)=>{
        if (comp(it, item)){
            rlt = false;
            return true;
        }
    });
    return rlt;
}
export function add(target:any, item:any, isunique?:any):any{
    if (!isunique){
        isunique = (a:any, b:any)=>{
            return true;
        }
    }else if (isunique === true){
        isunique = unique;
    }
    if (!target){
        return [item];
    }
    if (target.length === undefined && isunique(target, item)){
        return [target, item];
    }
    if (isunique(target, item)){
        target[target.length] = item;
    }
    return target;
}

export function addrange(target:any[], items:any[]){
    for(let i=0; i<items.length; i++){
        let item = items[i];
        add(target, item);
    }
}

export function diff(a:Date, b:Date, mode?:number){
    let modes = [1, 1000, 60, 60, 24]; // ms, second, minute, hour, day
    if (!mode){
        mode = 0;
    }
    let d:any = (<any>a) - (<any>b);
    let m = 1;
    for(let i=0; i<mode;i++){
        m*=modes[i];
    }
    return Math.floor(d/m);
}
export function is(target:any, type:any){
    return target instanceof type;
}
export function trigger(target:any, name:string, args?:any[]){
    let scope = target.on;
    if (!scope){
        scope = {};
    }
    let evthandler:Function = target[`on${name}`];
    let scopehandler:Function = scope[name];
    let rlt:any = null;
    if (evthandler){
        rlt = evthandler.apply(target, args)
    }
    if (scopehandler){
        add(args, rlt);
        rlt = scopehandler.apply(target, args);
    }
    return rlt;
}
export function create(constructor:any, argArray:any[], nocreate?:boolean) {
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return nocreate ? factoryFunction : new factoryFunction();
}

export class Factory<T>{
    protected list:T[] = [];
    regist(item:T){
        add(this.list, item);
    }
    registAll(items:T[]){
        all(items, (it:T, i:number)=>{
            add(this.list, it);
        });
    }
}
export class NamedFactory<T extends NamedObject>{
    protected cache:any = {};
    constructor(protected caseSensitive?:boolean){

    }
    regist(item:T){
        let name = item.name;
        if (!this.caseSensitive){
            name = name.toLowerCase();
        }
        this.cache[name] = item;
    }
    registAll(items:T[]){
        all(items, (it:T, i:string)=>{
            let n = i;
            if (!this.caseSensitive){
                n = n.toLowerCase();
            }
            this.cache[n] = it;
        });
    }
    get(name:string){
        let n = (!this.caseSensitive)?name.toLowerCase():name;
        return this.cache[n];
    }
}
export class NamedCreator<T extends NamedObject>{
    protected cache:any = {};
    constructor(protected caseSensitive?:boolean){
    }
    regist(item:T, factoryName?:string){
        let c = (<any>item).constructor;
        let name = factoryName || item.name
        if (!this.caseSensitive){
            name = name.toLowerCase();
        }
        this.cache[name] = c;
    }
    create(name:string, args?:any[]){
        let n = (!this.caseSensitive)?name.toLowerCase():name;
        let c = this.cache[n];
        if (c){
            return create(c, args);
        }
        return null;
    }
    get(name:string){
        let n = (!this.caseSensitive)?name.toLowerCase():name;
        return this.cache[n];
    }
}

export interface NamedObject{
    name:string;
}