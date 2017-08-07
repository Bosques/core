////<amd-module name="ModuleFactories"/>

import * as core from "../../common";
import { OperationNode } from "./operationode";
import { Cursor } from "../../cursor";
import * as nodes from "../elements";
import {Module, NodeModule} from "./module";


export abstract class ModuleFactory extends core.NamedFactory<Module> implements core.NamedObject{
    constructor(public readonly name:string){
        super();
        name = name.toLowerCase();
    }
    abstract create(target:ModuleTemplate):Module;
    abstract process(target:ModuleTemplate):void;
}

export interface ModuleTemplate{
    readonly tag:string;
}

