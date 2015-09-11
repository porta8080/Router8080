function Router8080(){}

Router8080.table = {};
Router8080.current = null;

Router8080.hasRoute = function(route){
	if(!route) return false;
	return route in Router8080.table;
};

Router8080.go = function(route,keep_url){
        if(!route) return false;
	if(route == Router8080.current) return false;
	if(Router8080.hasRoute(Router8080.current) && 'exit' in Router8080.table[Router8080.current]) Router8080.table[Router8080.current].exit();
	
    var options = Router8080.table[route];
    if(options){
		var c;
		if('clear' in options)
            for(var k in options.clear) $(options.clear[k]).html('');
        if('hide' in options)
            for(var k in options.hide) $(options.hide[k]).attr('route-hide',route).hide();
        if('show' in options)
            for(var k in options.show) $(options.show[k]).attr('route-show',route).show();
        if('init' in options) options.init();
    }

    var _this;
    $('[route]').each(function(){
        _this = $(this);
        if(_this.is('[route='+route+']')) _this.show();
        else _this.hide();
    });
	
    	Router8080.current = route;
	if(!keep_url){
		try{
		    history.pushState({route: route}, '#'+route, '#'+route);
		}catch(e){
		    console.log('Error: '+e);
		}
	}	
};

Router8080.set = function(route,options){
    if(!options) options = {};
    Router8080.table[route] = options;
    if('default' in options && options.default === true && !Route8080.landing_route) Router8080.go(route);
    return Router8080;
};

Router8080.empty = function(){
    for(var k in Router8080.table) return false;
    return true;
};

Router8080.resolveLandingRoute = function(){
    var landing_route = location.hash.replace('#','');
    if(!landing_route || landing_route == '') Router8080.landing_route = false;
    else Router8080.landing_route = landing_route;
    return Router8080.landing_route;
}

$(function(){
    var _this, route, first_route;
    Router8080.resolveLandingRoute();
    
    //check whether we landed in a route
    //make sure default overwrites this and the landed overwrites default
    $('[route]').each(function(i){
        _this = $(this);
        route = _this.attr('route');
        Router8080.set(route);
        if(i===0) first_route = route;
        //if(!Router8080.current) Router8080.go(route);
    });

    $('[to-route]').each(function(){
        _this = $(this);
        _this.click(function(){
            route = $(this).attr('to-route');
            Router8080.go(route);
        });
    });
    
    if(Router8080.landing_route) Router8080.go(Router8080.landing_route,true);
    else if(!Router8080.current) Router8080.go(first_route);
});
