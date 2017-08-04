export class MobileDevice{
	static get Android ():boolean {
		var r = navigator.userAgent.match(/Android/i);
		if (r) {
			console.log('match Android');
		}
		return r!= null && r.length>0;
	}
	static get BlackBerry():boolean {
		var r = navigator.userAgent.match(/BlackBerry/i);
		if (r) {
			console.log('match Android');
		}
		return r!=null && r.length > 0;
	}
	static get iOS():boolean {
		var r = navigator.userAgent.match(/iPhone|iPad|iPod/i);
		if (r) {
			console.log('match Android');
		}
		return r != null && r.length > 0;
	}
	static get Opera():boolean {
		var r = navigator.userAgent.match(/Opera Mini/i);
		if (r) {
			console.log('match Android');
		}
		return r != null && r.length > 0;
	}
	static get Windows():boolean {
		var r = navigator.userAgent.match(/IEMobile/i);
		if (r) {
			console.log('match Android');
		}
		return r!= null && r.length >0;
	}
	static get any():boolean {
		return (MobileDevice.Android || MobileDevice.BlackBerry || MobileDevice.iOS || MobileDevice.Opera || MobileDevice.Windows);
	}
}

let w:any = window;
let d:any = document;
export class Browser{
	// Opera 8.0+
	static get isOpera():boolean{
		return (!!w.opr && !!w.opr.addons) || !!w.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
	}
	
	// Firefox 1.0+
	static get isFirefox():boolean{
		return typeof w.InstallTrigger !== 'undefined';
	}
	// At least Safari 3+: "[object HTMLElementConstructor]"
	static get isSafari():boolean{
		return Object.prototype.toString.call(HTMLElement).indexOf('Constructor') > 0;
	} 
	// Internet Explorer 6-11
	static get isIE():boolean{
		return /*@cc_on!@*/false || !!d.documentMode;
	}
	// Edge 20+
	static get isEdge():boolean{
		return !Browser.isIE && !!w.StyleMedia;
	}
	// Chrome 1+
	static get isChrome():boolean{
		return !!w.chrome && !!w.chrome.webstore;
	}
	// Blink engine detection
	static get isBlink():boolean{
		return (Browser.isChrome || Browser.isOpera) && !!w.CSS;
	}
}

export function fire(element:any, eventName:string, opts:any) {
	function extend(destination:any, source:any) {
		for (var property in source)
			destination[property] = source[property];
		return destination;
	}

	let eventMatchers:any = {
		'HTMLEvents': /^(?:load|unload|abort|error|select|change|submit|reset|focus|blur|resize|scroll)$/,
		'MouseEvents': /^(?:click|dblclick|mouse(?:down|up|over|move|out))$/
	}

	let defaultOptions = {
		pointerX: 100,
		pointerY: 100,
		button: 0,
		ctrlKey: false,
		altKey: false,
		shiftKey: false,
		metaKey: false,
		bubbles: true,
		cancelable: true
	}
	if (opts && opts.pos) {
		defaultOptions.pointerX = opts.pos[0];
		defaultOptions.pointerY = opts.pos[1];
	}
	let options = extend(defaultOptions, arguments[3] || {});
	let oEvent:any, eventType:any = null;

	for (let name in eventMatchers) {
		if (eventMatchers[name].test(eventName)) { eventType = name; break; }
	}

	if (!eventType)
		throw new SyntaxError('Only HTMLEvents and MouseEvents interfaces are supported');

	if (document.createEvent) {
		oEvent = document.createEvent(eventType);
		if (eventType == 'HTMLEvents') {
			oEvent.initEvent(eventName, options.bubbles, options.cancelable);
		}
		else {
			oEvent.initMouseEvent(eventName, options.bubbles, options.cancelable, document.defaultView,
			options.button, options.pointerX, options.pointerY, options.pointerX, options.pointerY,
			options.ctrlKey, options.altKey, options.shiftKey, options.metaKey, options.button, element);
		}
		element.dispatchEvent(oEvent);
	}
	else {
		options.clientX = options.pointerX;
		options.clientY = options.pointerY;
		var evt = (document as any).createEventObject();
		oEvent = extend(evt, options);
		element.fireEvent('on' + eventName, oEvent);
	}
	return element;
}
