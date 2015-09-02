function Router(){}

Router.table = {};
Router.current = null;

Router.hasRoute = function(route){
	if(!route) return false;
	return route in Router.table;
}

Router.go = function(route){
	if(Router.hasRoute(Router.current) && 'exit' in Router.table[Router.current]) Router.table[Router.current].exit();
	
    var options = Router.table[route];
    if(options){
		if('clear' in options)
            for(var k in options.clear) $('.'+options.clear[k]).html('');
        if('hide' in options)
            for(var k in options.hide) $('.'+options.hide[k]).hide();		
        if('show' in options)
            for(var k in options.show) $('.'+options.show[k]).show();		
        if('init' in options) options.init();		
    }

    var _this;
    $('[route]').each(function(){
        _this = $(this);
        if(_this.is('[route='+route+']')) _this.show();
        else _this.hide();
    });

    Router.current = route;
};

Router.set = function(route,options){
    if(!options) options = {};
    Router.table[route] = options;
    if('default' in options && options.default === true) Router.go(route);
    return Router;
};

Router.empty = function(){
    for(var k in Router.table) return false;
    return true;
};

$(function(){
    var _this, route;
    $('[route]').each(function(){
        _this = $(this);
        route = _this.attr('route');
        Router.set(route);
        if(!Router.current) Router.go(route);
    });

    $('[to-route]').each(function(){
        _this = $(this);
        _this.click(function(){
            route = $(this).attr('to-route');
            Router.go(route);
        });
    });
});