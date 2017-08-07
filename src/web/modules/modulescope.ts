import {Module} from "./module";

export class ModuleScope{
    static check(target:Module, parent?:Module){
        if (target){
            if (!target.scope && parent.scope){
                target.scope = parent.scope;
            }else if (!target.scope && parent && !parent.scope){
                // Parent should always have a scope.
                debugger;
            }else{
                target.scope = new ModuleScope(target.scope);
            }
        }
    }
    constructor(protected readonly $parent?:ModuleScope){

    }
}
