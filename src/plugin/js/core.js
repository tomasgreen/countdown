(function() {
	'use strict';
	var langs = {
		sv: {
			day: 'dag',
			dayFull: 'dag',
			dayFullPlu: 'dagar',
			year: 'år',
			yearFull: 'år',
			yearFullPlu: 'år',
			month: 'mån',
			monthFull: 'månad',
			monthFullPlu: 'månader',
			hour: 'tim',
			hourFull: 'timme',
			hourFullPlu: 'timmar',
			minute: 'min',
			minuteFull: 'minut',
			minuteFullPlu: 'minuter',
			second: 'sek',
			secondFull: 'sekund',
			secondFullPlu: 'sekunder'
		},
		en: {
			day: 'day',
			dayFull: 'day',
			dayFullPlu: 'day',
			year: 'year',
			yearFull: 'year',
			yearFullPlu: 'year',
			month: 'mon',
			monthFull: 'month',
			monthFullPlu: 'month',
			hour: 'hour',
			hourFull: 'hour',
			hourFullPlu: 'hour',
			minute: 'min',
			minuteFull: 'minute',
			minuteFullPlu: 'minute',
			second: 'sec',
			secondFull: 'second',
			secondFullPlu: 'second'
		}
	};
	var ms = {};
	ms.second = 1000;
	ms.minute = ms.second * 60;
	ms.hour = ms.minute * 60;
	ms.day = ms.hour * 24;
	ms.month = ms.day * 30;
	ms.year = ms.day * 365;

	function _createElement(name, attr, parent, html) {
		var el, arr;
		if (!attr) attr = {};
		if (name.indexOf('.') !== -1) {
			arr = name.split('.');
			name = arr[0];
			arr.shift();
			attr.class = arr.join(' ');
		}
		if (name.indexOf('#') !== -1) {
			arr = name.split('#');
			name = arr[0];
			attr.id = arr[1];
		}
		el = document.createElement(name);
		for (var i in attr) el.setAttribute(i, attr[i]);
		if (parent) parent.appendChild(el);
		if (html) el.innerHTML = html;
		return el;
	}

	function _attr(els, attrib, value) {
		if (value === undefined && els && els.getAttribute !== undefined) return els.getAttribute(attrib);
		_each(els, function (el) {
			el.setAttribute(attrib, value);
		});
	}

	function _setOptions(opt) {
		if (opt === undefined) opt = {};
		var o = {};
		for (var i in defaults) o[i] = (opt[i] !== undefined) ? opt[i] : defaults[i];
		return o;
	}

	function _each(o, func) {
		if (!o || (o.length === 0 && o != window)) return;
		if (!o.length) func(o);
		else Array.prototype.forEach.call(o, function(el, i) {
			func(el);
		});
	}

	function _addClass(els, cls) {
		_each(els, function(el) {
			if (el.classList) {
				var arr = cls.split(' ');
				for (var i in arr) el.classList.add(arr[i]);
			} else el.className += ' ' + cls;
		});
	}

	/* ************************************
	############## MY PLUGIN ##############
	************************************ */

	var defaults = {
		title: null,
		el: null,
		datetime: null,
		lang: 'sv',
		done: null,
		bg: null,
		bgPosition: 'center',
		theme: 'light',
		unittype: ''
	};

	var Base = function(el, options) {
		this.opt = _setOptions(options);
		if (!el) return;
		this.container = el;
		if(this.opt.bg) this.container.style.backgroundImage = 'url(' + this.opt.bg + ')';
		if(this.opt.bg && this.opt.bgPosition) this.container.style.backgroundPosition = this.opt.bgPosition; 
		this.contentEl = _createElement('div.content', null, this.container);
		this.textEl = _createElement('div.text', null, this.contentEl);
		this.tickerEl = _createElement('div.ticker', null, this.contentEl);
		this.time = new Date();
		this.countDownInitiated = false;
		this.countDownFinished = false;
		if (this.opt.datetime) {
			var a = this.opt.datetime.split(' ');
			this.time = new Date(a[0]);
			var tmp = a[1].split(':');
			if (tmp.length > 0) this.time.setHours(parseInt(tmp[0]));
			if (tmp.length > 1) this.time.setMinutes(parseInt(tmp[1]));
			if (tmp.length > 2) this.time.setSeconds(parseInt(tmp[2]));
		}
		if (this.opt.done) {
			this.utterance = new SpeechSynthesisUtterance(this.opt.done);
			this.utterance.lang = (this.opt.lang == 'sv') ? 'sv-SE' : 'en-US';
		}
		_addClass(this.contentEl, this.opt.theme);
		this.textEl.innerHTML = this.opt.title;
		this.units = ['year','month','day','hour','minute','second'];
		for(var u in this.units) {
			var unit = this.units[u];
			_createElement('span.time', {
				'data-unit': unit 
			},this.tickerEl);
		}
		this.ticker();
		this.interval = setInterval(this.ticker.bind(this), 100);
	};
	Base.prototype.getUnitText = function(value, unit, type) {
		if (type == 'full') {
			if (value != 1) return langs[this.opt.lang][unit + 'FullPlu'];
			return langs[this.opt.lang][unit + 'Full'];
		}
		return langs[this.opt.lang][unit];
	};
	Base.prototype.showUnit = function(computed,unit){
		var el = this.tickerEl.querySelector('[data-unit="'+ unit +'"]');
		if (this.show || computed[unit] > 0 ) {
			if(el.textContent !== computed[unit].toString()) {
				el.textContent = computed[unit];
				this.show = true;
				_attr(el, 'data-unit-text', this.getUnitText(computed[unit], unit, this.opt.unittype));
			}
		} else {
			el.textContent = '';
			_attr(el, 'data-unit-text', '');
		}
	};
	Base.prototype.ticker = function() {
		var now = new Date();
		var diff = this.time - now.getTime();
		var diff2 = diff;
		var computed = {};
		computed.year = Math.floor(diff2 / ms.year);
		diff2 -= computed.year * ms.year;
		computed.month = Math.floor(diff2 / ms.month);
		diff2 -= computed.month * ms.month;
		computed.day = Math.floor(diff2 / ms.day);
		diff2 -= computed.day * ms.day;
		computed.hour = Math.floor(diff2 / ms.hour);
		diff2 -= computed.hour * ms.hour;
		computed.minute = Math.floor(diff2 / ms.minute);
		diff2 -= computed.minute * ms.minute;
		computed.second = Math.floor(diff2 / ms.second);

		if (diff < 0) {
			if (this.interval) clearInterval(this.interval);
			if (this.opt.done) this.textEl.innerHTML = this.opt.done;
			if (!this.countDownFinished && this.utterance) {
				this.countDownFinished = true;
				window.speechSynthesis.speak(this.utterance);
			}
			return;
		}
		this.show = false;
		for(var u in this.units) {
			this.showUnit(computed,this.units[u]);
		}

		if (diff / 1000 < 11 && !this.countDownInitiated) {
			this.countDownInitiated = true;
			var countDownText = '';
			for (var i = computed.second; i > 0; i--) {
				countDownText += i + '. ';
			}
			var countDownUtterance = new SpeechSynthesisUtterance(countDownText);
			countDownUtterance.lang = (this.opt.lang == 'sv') ? 'sv-SE' : 'en-US';
			countDownUtterance.rate = 0.7;
			window.speechSynthesis.speak(countDownUtterance);
		} else if (computed.second > 10) {
			this.countDownInitiated = false;
		}
	};

	this.Countdown = function(el, options) {
		var instance = new Base(el, options);
		return instance;
	};

	this.Countdown.globals = defaults;

}).call(this);
