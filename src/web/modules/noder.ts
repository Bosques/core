import * as core from '../../common';


export class Noder extends core.NamedFactory<ModuleFactory>{
    constructor(){
        super();
    }
    parse(entry:any){
        let entries = this.getentries(entry);
        let self = this;
        let items:ModuleItem[] = [];
        core.all(entries, (it:Element, i:number)=>{
            let factory = self.get(it.tagName);
            if (factory){
                core.add(items, new ModuleItem(factory, it));
            }
        });
    }
    protected getentries(entry:any){
        let entryEls = entry;
        if (typeof(entry) == 'string'){
            entryEls = [];
            let list = document.querySelectorAll(entry);
            core.all(list, function(it:any, i:number){
                core.add(entryEls, it);
            })
        }else if (entry instanceof Array){
            entryEls = [];
            core.all(entry, function(it:any, i:number){
                if (typeof(it) == 'string'){
                    let list = document.querySelectorAll(it);
                    core.all(list, function(item:any, idx:number){
                        core.add(entryEls, item);
                    });
                }else if (it instanceof Array){
                    core.all(it, function(item:any, idx:number){
                        core.add(entryEls, item);
                    });
                }else{
                    core.add(entryEls, it);
                }
            });
        }else{
            entryEls = [entry];
        }
        return entryEls;
    }
}

export class ModuleFactory extends core.NamedObject{
    constructor(name:string){
        super(name, true);
    }
}

export class ModuleItem{
    constructor(
    public factory:ModuleFactory
    ,public target:Element
    ){}
}