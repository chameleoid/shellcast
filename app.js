#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var swig = require('swig');
var io = require('socket.io').listen(server);
var term = require('./lib/headless-term.js');
var _ = require('underscore');

app.use('/t', term.middleware());

app.use(express.static(__dirname + '/public'));

var shellcasts = {};
var stats = {
	viewers: 0,
	broadcasts: 0,
	socket: io.of('/stats'),
	update: _.debounce(function() {
		this.socket.emit('stats', _.omit(this, 'socket', 'update'));
	}),
};

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);
swig.setDefaults({ cache: false });

io.configure('production', function() {
	io.enable('browser client etag');
	io.set('log level', 1);
	app.set('view cache', true);
});

stats.socket.on('connection', function(socket) {
	socket.emit('stats', _.omit(stats, 'socket', 'update'));
});

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/t/:term', function(req, res) {
	if (shellcasts[req.params.term])
		res.render('shell');
	else
		res.send(404, 'No shell broadcasting at this location.');
});

app.get('/t/:term/c', function(req, res) {
	if (!shellcasts[req.params.term]) {
		var token = Math.random();
		var sc = shellcasts[req.params.term] = {
			term: term(),
			viewers: 0,
			socket: io.of('/t/' + req.params.term),
			control: io.of('/t/' + req.params.term + '/' + token),
		};

		sc.term.open(document.body);

		sc.control.on('connection', function(socket) {
			socket.on('data', function(data) {
				sc.term.write(data);
				sc.socket.emit('data', data);
			});

			socket.on('resize', function(data) {
				sc.term.options.cols = data.cols;
				sc.term.options.rows = data.rows;
				sc.term.resize(data.cols, data.rows);
				sc.socket.emit('resize', data);
			});

			stats.broadcasts++;
			stats.update();

			socket.on('disconnect', function() {
				stats.broadcasts--;
				stats.update();

				sc.term.reset();
				delete shellcasts[req.params.term];
			});
		});

		sc.socket.on('connection', function(socket) {
			socket.emit('sync', {
				lines: sc.term.lines,
				x: sc.term.x,
				y: sc.term.y,
				rows: sc.term.rows,
				cols: sc.term.cols,
			});

			stats.viewers++;
			stats.update();

			sc.socket.emit('viewers', ++sc.viewers);
			socket.on('disconnect', function() {
				stats.viewers--;
				stats.update();

				sc.viewers--;
				sc.socket.emit('viewers', sc.viewers);
			});
		});

		res.json({ token: token });
	}
});

server.listen(process.env.PORT || 5000);
