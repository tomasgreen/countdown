(function () {
	'use strict';
	
	function _launchFullScreen(element) {
		if(element.requestFullscreen) element.requestFullscreen();
		else if(element.mozRequestFullScreen) element.mozRequestFullScreen();
		else if(element.webkitRequestFullscreen) element.webkitRequestFullscreen();
		else if(element.msRequestFullscreen) element.msRequestFullscreen();
	}
				
	function _queryStringToObject(str) {
		if (!str) return;
		var objURL = {};
		str.replace(new RegExp('([^?=&]+)(=([^&]*))?', 'g'), function ($0, $1, $2, $3) {
			objURL[$1] = decodeURIComponent($3);
		});
		return objURL;
	}
	function _serialize(obj) {
		var str = [];
		for (var p in obj)
			if (obj.hasOwnProperty(p)) {
				str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
			}
		return str.join("&");
	}
	function _each(o, func) {
		if (!o || (o.length === 0 && o != window)) return;
		if (!o.length) func(o);
		else Array.prototype.forEach.call(o, function (el, i) {
			func(el);
		});
	}

	function _on(els, events, func, useCapture) {
		_each(els, function (el) {
			var ev = events.split(' ');
			for (var e in ev) el.addEventListener(ev[e], func, useCapture);
		});
	}

	function _off(els, events, func, useCapture) {
		_each(els, function (el) {
			var ev = events.split(' ');
			for (var e in ev) el.removeEventListener(ev[e], func, useCapture);
		});
	}
	function _stopEventPropagation(e) {
		if (typeof e.stopPropagation === 'function') {
			e.stopPropagation();
			e.preventDefault();
		} else if (window.event && window.event.hasOwnProperty('cancelBubble')) {
			window.event.cancelBubble = true;
		}
	}
	function _tapOn(el, func) {
		if (el.ontouchstart === undefined) {
			_on(el, 'click', func);
			return;
		}
		var t = false;
		_on(el, 'touchstart', function (ev) {
			t = true;
		});
		_on(el, 'touchend', function (ev) {
			if (t) {
				func(ev);
				_stopEventPropagation(ev);
			}
		});
		_on(el, 'touchcancel touchleave touchmove', function (ev) {
			t = false;
		});
	}
	document.addEventListener('DOMContentLoaded', function () {
		_on(document.documentElement,'keydown', function(ev){
			if(ev.keyCode == 70 && ev.srcElement == document.body) _launchFullScreen(document.documentElement);
		});
		var el = document.getElementById('countdown');
		var formEl = document.getElementById('form');
		var params = _queryStringToObject(window.location.search);
		if (!params || !(params.datetime || params.minutes)) {
			el.style.display = 'none';
			_tapOn(document.getElementById('formButton'), function () {
				var obj = {};
				_each(formEl.querySelectorAll('input'), function (el) {
					if (el.value) obj[el.name] = el.value;
				});
				window.location.href = '?' + _serialize(obj);
			});
			return;
		} else {
			formEl.style.display = 'none';
		}
		Countdown(el, params);
	});
}).call(this);

/*
http://bitewallpapers.com/nature/summer/part%202/summer%20grass%20with%20a%20touch%20of%20rain%20desktop%20wallpaper%20hd.jpg
http://static.giantbomb.com/uploads/original/14/148096/2384107-wallpaper_668504.jpg
*/
