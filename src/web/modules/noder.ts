import * as core from '../../common';
import {ModuleFactory} from './modulefactory';
import {OperationNode} from './operationode';
import {Module, NodeModule} from './module';


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
    createmplate(target:OperationNode, name:string){
        let template:any = {tag:name};
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
        return {template:template, alias:alias, group:group};
    }
    parseNode(target:OperationNode, parentNode?:OperationNode){
        OperationNode.check(target, parentNode);

        let self = this;
        let r = self.getfactoryname(target.nodeName);
        let temp = this.createmplate(target, r.m);
        if (temp.alias && parentNode){
            target.setalias(temp.alias, temp.group);
        }
        let factory = <ModuleFactory>self.get(r.f);
        if (factory){
            let md = factory.create(temp.template);
            if (md){
                target.md = md;
                md.$ref = target;
                if (parent){
                    md.setparent(parentNode.md);
                }
                if (temp.alias){
                    md.setalias(temp.alias, temp.group);
                }        
                core.trigger(md, 'created');
                if (core.is(md, NodeModule)){
                    let ndmodule = <NodeModule>md;
                    let node = ndmodule.render(target);
                    core.trigger(md, 'rendered', [node]);
                }
                core.all(target.childNodes, function(item:any, i:number){
                    self.parseNode(item, target);
                });
                core.trigger(md, 'ready');
            }
        }else{
            core.all(target.childNodes, function(item:Node, i:number){
                if (item.nodeName.indexOf('#')<0){
                    self.parseNode(<any>item, target);
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

