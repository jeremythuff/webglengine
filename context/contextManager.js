var Context = function() {
    this.includedScripts = [];
    this.singletons = {};

    return this;    
}

Context.prototype = {
    makeSingleton: function(name, object) {
        if(!this.singletons[name]) {}
        this.singletons[name] = object;
    },
    getSingleton: function(name) {
        return this.singletons[name];
    }
}

appContext = new Context();

var include = function (url, objectName, parentscope)
{

    var ajax = new XMLHttpRequest();
    ajax.open( 'GET', url, false ); // <-- the 'false' makes it synchronous
    ajax.onreadystatechange = function () {
        var script = ajax.response || ajax.responseText;
        if (ajax.readyState === 4) {
            switch( ajax.status) {
                case 200:
                    
                    if(appContext.includedScripts.indexOf(script) != -1) break;
                    
                    appContext.includedScripts.push(script);
                    eval.apply( parentscope, [script] );

                    parentscope[objectName] = parentscope[objectName+"Scope"]();

                    console.log("script loaded: ", url);
                    
                    break;
                default:
                    console.log("ERROR: script not loaded: ", url);
            }
        }
    };
    
    ajax.send(null);

}


