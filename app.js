var http = require('http');
var url = require('url');
var router = require('routes')();
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
    var html = view.compileFile('./view/register.html')({
        title: 'Register',
    });
    if (req.method.toUpperCase() == 'POST') {

    } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
    }
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