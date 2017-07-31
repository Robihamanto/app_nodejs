var http = require('http');
var fs = require('fs');
var url = require('url');
var qString = require('querystring');

http.createServer(function (req, res) {
    if (req.url != '/favico.ico') {
        var access = url.parse(req.url);
        if (access.pathname == '/') {
            data = qString.parse(access.query);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Index');
            res.end();
        } else if (access.pathname == '/register') {
            if (req.method.toUpperCase() == "POST") {
                var data_post = '';
                req.on('data', function (chunck) {
                    data_post += chunck;
                })

                req.on('end', function(){
                    data_post = qString.parse(data_post);
                    res.writeHead(200, {'Content-Type': 'text/plain'})
                    res.end(JSON.stringify(data_post));
                })

            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' })
                fs.createReadStream('./view/register.html').pipe(res);
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'plain/html' })
            res.end();
        }
    }
}).listen(8888);

console.log('Server is starting...');
