var http = require('http');
var url = require('url');
var router = require('routes')();
var qString = require('querystring');
var view = require('swig');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    database: 'node',
    user: 'root',
    password: '',
});

router.addRoute('/', function (req, res) {
    connection.query('SELECT * FROM MAHASISWA', function (err, rows, field) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(JSON.stringify(rows));
    });
});

router.addRoute('/insert', function (req, res) {
    connection.query('INSERT INTO MAHASISWA SET ?', {
        nim: '145150207111064',
        nama: 'Randa Alferdian',
    }, function (err, field) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(field.affectedRows + 'Affected Rows');
    });
});

router.addRoute('/update', function (req, res) {
    connection.query('UPDATE MAHASISWA SET ? WHERE ?', [{
        nama: 'Randa'
    }, {
        nim: '145150207111065',
    }], function (err, field) {
        if (err) throw err;
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(field.changedRows + ' Changed');
    });
});

router.addRoute('/delete', function (req, res) {
    connection.query('DELETE FROM MAHASISWA WHERE ?', {
        nim: '145150207111064'
    }, function (err, field) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(field.affectedRows + 'AffectedRows');
    });
});

router.addRoute('/home', function (req, res) {
    connection.query('SELECT * FROM MAHASISWA', function (err, rows, field) {
        if (err) throw err;
        var html = view.compileFile('./view/home.html')({
            title: 'Home Page',
            people: rows,
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    });
});

router.addRoute('/register', function (req, res) {
    if (req.method.toUpperCase() == 'POST') {
        var data_post = '';
        req.on('data', function (chuncks) {
            data_post += chuncks;
        });
        req.on('end', function () {
            data_post = qString.parse(data_post);
            connection.query('INSERT INTO MAHASISWA SET ?', {
                nim: data_post.nim,
                nama: data_post.nama,
            }, function (err, field) {
                if (err) throw err;
                res.writeHead(302, { 'Location': '/home' });
                res.end();
            });
        });
    } else {
        var html = view.compileFile('./view/register.html')({
            title: 'Register',
        });
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
});

router.addRoute('/edit/:id?', function (req, res) {
    connection.query('SELECT * FROM MAHASISWA WHERE ? ', {
        id: this.params.id,
    }, function (err, rows, field) {
        if (err) throw err;
        if (rows.length) {
            var data = rows[0];
            if (req.method.toUpperCase() == 'POST') {
                var data_post = '';
                req.on('data', function (chuncks) {
                    data_post += chuncks;
                });
                req.on('end', function () {
                    data_post = qString.parse(data_post);
                    res.end();
                    connection.query('UPDATE MAHASISWA SET ? WHERE ?', [{
                            nama: data_post.nama,
                        }, {
                            id: data_post.id,
                        }], function (err, field) {
                        if (err) throw err;
                        res.writeHead(302, { 'Location': '/home' });
                        res.end();
                    });
                });

            } else {
                var html = view.compileFile('./view/edit.html')({
                    person: data,
                });
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
        } else {
            var html = view.compileFile('./view/404.html');
            res.writeHead(404, { 'Content-type': 'text/html' });
            res.end(html);
        }
    });

});

http.createServer(function (req, res) {
    var path = url.parse(req.url).pathname;
    var match = router.match(path);
    if (match) {
        match.fn(req, res);
    } else {
        var html = view.compileFile('./view/404.html')();
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(html);
    }
}).listen(8888);

console.log('Server is starting...')