import * as core from '../../common';
import { ModuleFactory, ModuleTemplate } from './modulefactory';
import {OperationNode} from './operationode';
import {Module, NodeModule} from './module';


export class Jsoner extends core.NamedFactory<ModuleFactory>{
    static readonly instance:Jsoner = new Jsoner();
    constructor(){
        super();
    }
    parse(jsons:any){
        let self = this;
        let json = JSON.parse(jsons);
        if (json instanceof Array){
            core.all(json, (it:any, i:number)=>{
                self.parseNode(it);
            });
        } else {
            self.parseNode(json);
        }
    }
    private getfactoryname(nodename:string){
        if (nodename && nodename.indexOf('.')>0){
            let list = nodename.split('.');
            return {f:list[0], m:list.length > 1?list[1]:''};
        }
        return {f:nodename, m:nodename};
    }
    parseNode(target:any, parent?:any){
        let self = this;
        let r = self.getfactoryname(target.tag);
        let temp = target;
        if (temp.alias && parent){
            target.setalias(temp.alias, temp.group);
        }
        let factory = <ModuleFactory>self.get(r.f);
        if (factory){
            let md = factory.create(temp.template);
            if (md){
                target.md = md;
                md.$ref = target;
                if (parent){
                    md.setparent(parent);
                }
                if (temp.alias){
                    md.setalias(temp.alias, temp.group);
                }        
                core.trigger(md, 'created', [parent]);
                core.all(target.$, function(item:any, i:number){
                    self.parseNode(item, md);
                });
                core.trigger(md, 'ready', [parent]);
            }
        }
    }
}

