import * as core from '../../common';


export class Noder extends core.NamedFactory<ModuleFactory>{
    static readonly instance:Noder = new Noder();
    constructor(){
        super(true);
    }
    parse(entry:any){
        let entries = this.getentries(entry);
        let self = this;
        core.all(entries, (it:OperationNode, i:number)=>{
            self.parseNode(it);
        });
    }
    parseNode(target:OperationNode){
        let self = this;
        let factory = self.get(target.nodeName);
        if (factory){
            let mi = new ModuleItem(factory, target);
            mi.prepare();
            core.all(target.childNodes, function(item:any, i:number){
                self.parseNode(item);
            });
            mi.prepare();
        }
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

export abstract class ModuleFactory extends core.NamedObject{
    constructor(name:string){
        super(name);
    }
    abstract prepare(target:OperationNode):void;
    abstract process(target:OperationNode):void;
}

export class ModuleItem{
    constructor(
        public factory:ModuleFactory
        ,public target:OperationNode
    ){}
    prepare(){
        this.factory.prepare(this.target);
    }
    process(){
        this.factory.process(this.target);
    }
}

export interface OperationNode extends Node{

}