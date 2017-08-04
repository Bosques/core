export default function debug(callback:Function, level?:number){
    if (callback){
        if ((<any>document.body).debugging || document.body.getAttribute('debugging') == 'true'){
            let lvl = new Number(document.body.getAttribute('dlevel'));
            if (level >= lvl){
                if (lvl > 0){
                    debugger;
                }
                callback();
            }
        }
    }
}

function getLogBox(){
    var box = (<any>document.body).$lbox$;
    if (!box){
        box = document.createElement('div');
        box.className = 'logbox';
        (<any>document.body).$lbox$ = box;
        document.body.appendChild(box);
    }
    return box;
}
let logger:any = {};
export function log(text:string, target?:any){
    let box = target || getLogBox();
    if (target){
        if (typeof(target) == 'string' && logger[target]){
            box = logger[target];
        }else if (text){
            logger[text] = target;
            box = target;
            text = `Box ${text} activated`;
        }
    }
    box.innerHTML = text + "<br />" + box.innerHTML;
    console.log(text);
}