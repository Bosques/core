import * as core from '../../common';
import {ModuleFactory, Module, NodeModule} from './modulefactory';
import {OperationNode} from './operationode';


export class Noder extends core.NamedFactory<ModuleFactory>{
    static readonly instance:Noder = new Noder();
    constructor(){
        super();
    }
    parse(entry:any){
        let entries = this.getentries(entry);
        let self = this;
        core.all(entries, (it:OperationNode, i:number)=>{
            self.parseNode(it);
        });
    }
    private getfactoryname(nodename:string){
        if (nodename && nodename.indexOf('.')>0){
            let list = nodename.split('.');
            return {f:list[0], m:list.length > 1?list[1]:''};
        }
        return {f:nodename, m:nodename};
    }
    parseNode(target:OperationNode, parent?:Module){
        OperationNode.check(target);
        let self = this;
        let r = self.getfactoryname(target.nodeName);
        let factory = <ModuleFactory>self.get(r.f);
        if (factory){
            let template:any = {tag:r.m};
            let alias:any = undefined;
            let group = false;
            core.all(target.attributes, (attr:Node, i:number)=>{
                if (attr.nodeName == 'alias'){
                    alias = attr.nodeValue;
                }else if (attr.nodeName == 'group'){
                    alias = attr.nodeValue;
                    group = true;
                }else{
                    template[attr.nodeName] = attr.nodeValue;
                }
            });
            let md = factory.create(template);
            if (md){
                target.md = md;
                md.$ref = target;
                if (parent){
                    //parentNode.setchild(target);
                    //parentNode.md.setchild(md);
                    md.setparent(parent);
                }
                if (alias){
                    md.setalias(alias, group);
                    target.setalias(alias);
                }        
                core.trigger(md, 'created');
                if (core.is(md, NodeModule)){
                    let ndmodule = <NodeModule>md;
                    let node = ndmodule.render(target);
                    core.trigger(md, 'rendered', [node]);
                }
                core.all(target.childNodes, function(item:any, i:number){
                    self.parseNode(item, md);
                    let el = <OperationNode>item;
                    let alias = el.getAttribute('alias');
                    if (alias){
                        el.setalias(alias);
                    }
                });
                core.trigger(md, 'ready');
            }
        }else{
            core.all(target.childNodes, function(item:Node, i:number){
                if (item.nodeName.indexOf('#')<0){
                    self.parseNode(<any>item);
                    let el = <OperationNode>item;
                    let alias = el.getAttribute('alias');
                    if (alias){
                        el.setalias(alias);
                    }
                }
            });
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

