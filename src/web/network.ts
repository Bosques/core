import {all} from '../common';

interface ActiveXObject {
    new (s: string): any;
}
declare var ActiveXObject: ActiveXObject;

var XMLHttpFactories = [
    function () {return new XMLHttpRequest()},
    function () {return new ActiveXObject("Msxml2.XMLHTTP")},
    function () {return new ActiveXObject("Msxml3.XMLHTTP")},
    function () {return new ActiveXObject("Microsoft.XMLHTTP")}
];

function createXMLHTTPObject() {
    let xmlhttp:any = null;
    for (var i=0;i<XMLHttpFactories.length;i++) {
        try {
            xmlhttp = XMLHttpFactories[i]();
        }
        catch (e) {
            continue;
        }
        break;
    }
    return xmlhttp;
}

function toformdata(o:any){
    let s = '';
    all(o, function(item:any, i:string){
        let si:string = item as string;
        if (typeof(item) == 'object'){
            si = JSON.stringify(item);
        }
        si = encodeURIComponent(si);
        s += `${i}=${si}`;
    });
    return s;
}

function sendRequest(settings:any){
    let url = settings.url;
    let shandler = settings.success;
    let ehandler = settings.error;
    let req = createXMLHTTPObject() as XMLHttpRequest;
    if (!req){return;}
    let method:string = settings.method || 'get';
    method = method.trim().toLowerCase();
    let ispost = method == 'post';
    req.open(method, url, true, settings.user, settings.pwd);
    if (!settings.header){
        settings.header = {};
    }
    if (ispost && !settings.upload && !settings.header['content-type']){
        settings.header['content-type'] = 'application/x-www-form-urlencoded';
    }
    all(settings.header, function(item:any, i:string){
        req.setRequestHeader(i, item);
    });
    if (settings.progress){
        if (req.upload){
            req.upload.onprogress = settings.progress;
        }else{
            req.onprogress = settings.progress;
        }
    }
    req.onreadystatechange = function(){
        if (req.readyState == 4){
            if (req.status>=200 && req.status <= 304){
                shandler(req.responseText);
            }else{
                ehandler(req.responseText);
            }
        }
    }
    let fd:any = null;
    if (ispost){
        if (settings.upload){
            fd = settings.form;
            if (fd.tagName){
                fd = new FormData(fd);
            }
        }else if (settings.raw){
            fd = settings.raw;
        }else{
            fd = toformdata(settings.form);
        }
    }
    req.send(fd);
}

function handleResponse(text:string, settings:any, shandler:Function, ehandler:Function){
    let a:any = text;
    if (settings.json){
        try{
            if (text){
                a = { success:true, result:JSON.parse(text) };
            }else{
                a = {success:false, result:'Empty server response'};
            }
        }catch(e){
            ehandler({
                success:false
                , error: e
                , raw: text
            })
        }
    }
    shandler(a);
}
export function send(url:string, settings?:any):Promise<any>{
    if (!settings){
        settings = {};
    }
    if (!settings.method){
        settings.method = 'get';
    }
    settings.json = true;
    settings.url = url;
    let p = new Promise((r, j)=>{
        settings.success = function(text:string){
            handleResponse(text, settings, r, j);
        };
        settings.error = function(text:string){
            handleResponse(text, settings, j, j);
        }
        sendRequest(settings);
    });
    return p;
}

export function upload(url:string, file:File, options?:any):Promise<any>{
    if (!options){
        options = {};
    }

    let settings = {
        method:'post'
        ,header:{
            'content-type':file.type
            , 'content-disposition':`attachment; filename=${file.type}`
        }
        ,json:false
        ,success:options.success
        ,progress:options.progress
        ,error:options.error
    }
    
    let p = send(url, settings);
    return p;
}
