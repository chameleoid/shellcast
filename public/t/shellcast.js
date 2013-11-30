Terminal.bindMouse =
Terminal.bindKeys =
Terminal.fixIpad = function() {};

var term = new Terminal({
	cols: 80,
	rows: 24,
	useStyle: true,
	scrollback: 0,
	cursorBlink: false,
	colors: Terminal.tangoColors,
});

term.scaleMode = 'zoom';

term.open(document.body);

var socket = io.connect(location.pathname);

socket.on('connect', term.reset.bind(term));
socket.on('data', term.write.bind(term));
socket.on('viewers', function(viewers) {
	document.getElementById('viewers').innerHTML = viewers;
});

socket.on('resize', function(data) {
	term.options.cols = data.cols;
	term.options.rows = data.rows;
	term.resize(data.cols, data.rows)
	setTimeout(window.onresize, 0);
});

socket.on('sync', function(data) {
	term.options.cols = data.cols;
	term.options.rows = data.rows;
	term.resize(data.cols, data.rows);
	setTimeout(function() {
		term.lines = data.lines;
		term.x = data.x;
		term.y = data.y;
		term.refresh(0, term.rows - 1);
		window.onresize();
	}, 0);
});

// TODO: display a notification
socket.on('disconnect', function() {
	term.reset();
	term.write('Disconnected.');
});

(onresize = function() {
	var transform;
	var scaleX = window.innerWidth / term.element.clientWidth;
	var scaleY = window.innerHeight / term.element.clientHeight;

	switch (term.scaleMode) {
		case 'stretch':
			transform = 'scaleX(' + scaleX + ') scaleY(' + scaleY + ')';
			break;

		case 'zoom':
		default:
			transform = 'scale(' + Math.min(scaleX, scaleY) + ')';
			break;
	}

	term.element.style.marginTop = -(term.element.clientHeight / 2) + 'px';
	term.element.style.marginLeft = -(term.element.clientWidth / 2) + 'px';

	term.element.style.transform =
	term.element.style.webkitTransform = transform;
})();
