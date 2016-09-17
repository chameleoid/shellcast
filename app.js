#!/usr/bin/env node
'use strict';

const uuid = require('node-uuid');
const document = require('./lib/dummy-dom');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const swig = require('swig');
const term = require('./lib/headless-term');
const _ = require('underscore');

var shellcasts = {};
var stats = {
  _viewers: 0,
  _broadcasts: 0,
  publicBroadcasts: {},
  socket: io.of('/stats').on('connection', () => stats.update()),

  update: _.debounce(() => {
    stats.socket.emit('stats', {
      viewers: stats._viewers,
      broadcasts: stats._broadcasts,
      publicBroadcasts: stats.publicBroadcasts,
    });
  }),
};

Object.defineProperties(stats, {
  viewers: {
    get: () => stats._viewers,

    set: val => {
      stats._viewers = val;
      stats.update();
    },
  },

  broadcasts: {
    get: () => stats._broadcasts,

    set: val => {
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
  app.set('view cache', true);
}

app.use((req, res, next) => {
  console.log('%s %s', req.method, req.path);
  next();
});

app.use('/t', term.middleware());
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => res.render('home'));

app.get('/t/:term', (req, res) => {
  if (shellcasts[req.params.term]) {
    res.render('shell');
  } else {
    res.status(404).send('No shell broadcasting at this location.');
  }
});

app.get('/t/:term/c', (req, res) => {
  if (!shellcasts[req.params.term]) {
    let token = uuid.v4();
    let sc = shellcasts[req.params.term] = {
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

    sc.control.on('connection', socket => {
      socket.on('data', data => {
        sc.term.write(data);
        sc.socket.emit('data', data);
      });

      socket.on('resize', data => {
        sc.term.options.cols = data.cols;
        sc.term.options.rows = data.rows;
        sc.term.resize(data.cols, data.rows);
        sc.socket.emit('resize', data);
      });

      socket.on('options', options => {
        let del = !sc.options.public && options.public;

        sc.options = options;

        if (options.public) {
          stats.publicBroadcasts[req.params.term] = _.pick(sc, 'viewers', 'options');
        } else if (del) {
          delete stats.publicBroadcasts[req.params.term];
        }

        stats.update();
      });

      stats.broadcasts++;

      socket.on('disconnect', () => {
        stats.broadcasts--;

        sc.term.reset();
        delete shellcasts[req.params.term];
        delete stats.publicBroadcasts[req.params.term];
      });
    });

    sc.socket.on('connection', socket => {
      socket.emit('sync', {
        lines: sc.term.lines,
        x: sc.term.x,
        y: sc.term.y,
        rows: sc.term.rows,
        cols: sc.term.cols,
      });

      stats.viewers++;

      sc.socket.emit('viewers', ++sc.viewers);

      socket.on('disconnect', () => {
        stats.viewers--;
        sc.viewers--;
        sc.socket.emit('viewers', sc.viewers);
      });
    });

    res.json({ token: token });
  }
});


server.listen(process.env.PORT || 5000);
