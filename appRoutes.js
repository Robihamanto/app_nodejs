var http = require('http');
var url = require('url');
var routes = require('routes');
routes = routes();

routes.addRoute('/', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('index');
});
routes.addRoute('/login', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Login Page');
});
routes.addRoute('/profile/:name?/:email?', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('profile => ' + this.params.name + ' email : ' + this.params.email);
});

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var match = routes.match(path);
    if(match){
        match.fn(req, res);
    }else{
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end('404');
    }

}).listen(8888);

console.log('Server Is Starting...');