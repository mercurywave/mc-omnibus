var RT = new ORuntime();

function mkObj(inner) {return new OObj(RT, inner);}
function gtInner(obj) {return (obj instanceof OObj) ? obj.inner : obj; }


/////// DOM ///////
RT.setStaticGlo("Dom.Body", document.body);
RT.setStaticGlo("Dom.Document", document);

RT.AddExternalFunction("Dom.CreateElement", function(tag) {
	return document.createElement(tag);
});
RT.AddExternalFunction("Dom.GetElement", function(id) {
	return document.getElementById(id);
});
RT.AddExternalMethod("Dom.HookEvent", function(evName, lamb) {
	gtInner(this).addEventListener(evName, (ev) => {
		OObj.RunLambda(lamb, {'$event': ev });
	});
});

RT.AddExternalMethod("Dom.SetAttribute", function(key, value) {
	gtInner(this)[key] = value;
});
RT.AddExternalMethod("Dom.GetAttribute", function(key) {
	return gtInner(this)[key];
});

RT.AddExternalMethod("Dom.SetId", function(id) {
	gtInner(this).id = id;
});
RT.AddExternalMethod("Dom.GetId", function() {
	return gtInner(this).id;
});


RT.AddExternalMethod("Dom.AppendChild", function(child){
	gtInner(this).appendChild(child);
	return child;
});
RT.AddExternalMethod("Dom.ClearChildren", function(id) {
	gtInner(this).replaceChildren();
});
RT.AddExternalMethod("Dom.RemoveChild", function(child){
	gtInner(this).removeChild(child);
});


RT.AddExternalMethod("Dom.SetText", function(text) {
	gtInner(this).textContent = text;
});
RT.AddExternalMethod("Dom.SetHtml", function(html) {
	gtInner(this).innerHTML = html;
});



RT.AddExternalMethod("Dom.Input.SetType", function(type) {
	gtInner(this).type = type;
});
RT.AddExternalMethod("Dom.Input.SetValue", function(type) {
	gtInner(this).value = type;
});

RT.AddExternalMethod("Dom.TextEntry.SelectAll", function(type) {
	gtInner(this).select();
});


RT.AddExternalMethod("Dom.Style.AddClasses", function(...styles) {
	gtInner(this).classList.add(...styles);
});
RT.AddExternalMethod("Dom.Style.RemoveClasses", function(...styles) {
	gtInner(this).classList.remove(...styles);
});
RT.AddExternalMethod("Dom.Style.SetAttribute", function(key, value) {
	gtInner(this).style[key] = value;
});


///////////////////////////////////////////
RT.AddExternalFunction("Dom.MarkdownToHtml", function(text) {
	return md.html(text);
});

//////////////// STORAGE //////////////////
var _dummyStore = {};
RT.AddExternalFunction("Storage.Load", function(key, def) {
	if (typeof(Storage) !== "undefined") {
		var out = unpackVar(localStorage.getItem(key));
		if(out == null) return def;
		return out;
	}
	return unpackVar(_dummyStore[key]) || def;
});
RT.AddExternalFunction("Storage.Save", function(key, val) {
	val = packVar(val);
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(key, val);
	}
	else _dummyStore[key] = val;
});
RT.AddExternalFunction("Storage.Remove", function(key) {
	if (typeof(Storage) !== "undefined") {
		localStorage.removeItem(key);
	}
	else _dummyStore[key] = null;
});
RT.AddExternalFunction("Storage.Clear", function(key) {
	if (typeof(Storage) !== "undefined") {
		localStorage.clear();
	}
	else _dummyStore = {};
});

RT.AddExternalFunction("Storage.AllKeys", function() {
	if (typeof(Storage) !== "undefined") {
		return new OObj(null, Object.keys(localStorage));
	}
	else return Object.keys(_dummyStore);
});
function packVar(val){
	return JSON.stringify(wingraToJsObject(val));
}
function wingraToJsObject(val){
	if (typeof val === 'number') return val;
	if (typeof val === 'boolean') return val;
	if (typeof val === 'string') return val;
	if (val == null) return null;
	if (val instanceof OObj) {
		var obj = {};
		for(var key in val.inner) {
			const sub = val.inner[key];
			obj[wingraToJsObject(key)] = wingraToJsObject(sub);
		}
		return obj;
	}
	throw "storage type not implemented";
}
function unpackVar(val){
	return jsObjectToWingra(JSON.parse(val) , null);
}
function jsObjectToWingra(val, parent){
	if (typeof val === 'number') return val;
	if (typeof val === 'boolean') return val;
	if (typeof val === 'string') return val;
	if (val == null) return null;
	if (val instanceof Object) {
		var obj = new OObj(parent);
		for(var key in val) {
			const sub = val[key];
			obj.inner[jsObjectToWingra(key)] = jsObjectToWingra(sub, obj);
		}
		return obj;
	}
	throw "storage type not implemented";
}

///////////////////////////////////////////
RT.AddExternalFunction("Time.Now", function() {
	return (new Date()).getTime();
});
RT.AddExternalFunction("Time.NowUtc", function() {
	const d = new Date();
	return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(),
		d.getUTCHours(), d.getUTCMinutes(), d.getUTCSeconds());
});


///////////////////////////////////////////
function LaunchSequenceStart()
{
	RT.InitByteCode(MCTRACK);
}
window.onload = function()
{
	LaunchSequenceStart();
}