#!/usr/bin/env node
var express = require('express');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var swig = require('swig');

var term = require('./lib/headless-term.js');

var _ = require('underscore');


var shellcasts = {};
var stats = {
	_viewers: 0,
	_broadcasts: 0,
	publicBroadcasts: {},
	socket: (function() {
		var socket = io.of('/stats');

		socket.on('connection', function(socket) {
			stats.update();
		});

		return socket;
	})(),

	update: _.debounce(function() {
		this.socket.emit('stats', {
			viewers: this._viewers,
			broadcasts: this._broadcasts,
			publicBroadcasts: this.publicBroadcasts,
		});
	}),
};

Object.defineProperties(stats, {
	viewers: {
		get: function() { return stats._viewers; },

		set: function(val) {
			stats._viewers = val;
			stats.update();
		},
	},

	broadcasts: {
		get: function() { return stats._broadcasts; },

		set: function(val) {
			stats._broadcasts = val;
			stats.update();
		},
	},
});


app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.set('view cache', false);

swig.setDefaults({ cache: false });

if (process.env.NODE_ENV == 'production') {
	io.enable('browser client etag');
	app.set('view cache', true);
}


app.use(function(req, res, next) {
	console.log('%s %s', req.method, req.path);
	next();
});

app.use('/t', term.middleware());
app.use(express.static(__dirname + '/public'));


app.get('/', function(req, res) {
	res.render('home');
});

app.get('/t/:term', function(req, res) {
	if (shellcasts[req.params.term]) {
		res.render('shell');
	} else {
		res.status(404).send('No shell broadcasting at this location.');
	}
});

app.get('/t/:term/c', function(req, res) {
	if (!shellcasts[req.params.term]) {
		var token = Math.random();
		var sc = shellcasts[req.params.term] = {
			term: term(),
			viewers: 0,
			socket: io.of('/t/' + req.params.term),
			control: io.of('/t/' + req.params.term + '/' + token),
			options: {
				public: false,
				title: req.params.term,
			},
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

			socket.on('options', function(options) {
				var del = !sc.options.public && options.public;

				sc.options = options;

				if (options.public) {
					stats.publicBroadcasts[req.params.term] = _.pick(sc, 'viewers', 'options');
				} else if (del) {
					delete stats.publicBroadcasts[req.params.term];
				}

				stats.update();
			});

			stats.broadcasts++;

			socket.on('disconnect', function() {
				stats.broadcasts--;

				sc.term.reset();
				delete shellcasts[req.params.term];
				delete stats.publicBroadcasts[req.params.term];
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

			sc.socket.emit('viewers', ++sc.viewers);
			socket.on('disconnect', function() {
				stats.viewers--;

				sc.viewers--;
				sc.socket.emit('viewers', sc.viewers);
			});
		});

		res.json({ token: token });
	}
});


server.listen(process.env.PORT || 5000);
