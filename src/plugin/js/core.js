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
			dayFullPlu: 'days',
			year: 'year',
			yearFull: 'year',
			yearFullPlu: 'years',
			month: 'mon',
			monthFull: 'month',
			monthFullPlu: 'months',
			hour: 'hour',
			hourFull: 'hour',
			hourFullPlu: 'hours',
			minute: 'min',
			minuteFull: 'minute',
			minuteFullPlu: 'minutes',
			second: 'sec',
			secondFull: 'second',
			secondFullPlu: 'seconds'
		}
	};
	var ms = {};
	ms.second = 1000;
	ms.minute = ms.second * 60;
	ms.hour = ms.minute * 60;
	ms.day = ms.hour * 24;
	ms.month = ms.day * 30;
	ms.year = ms.day * 365;

	function _createElement(type, attr, parent, html) {
		var el, cls, id, arr;
		if (!attr) attr = {};
		if (type.indexOf('.') !== -1) {
			arr = type.split('.');
			type = arr[0];
			arr.shift();
			attr.class = arr.join(' ');
		}
		if (type.indexOf('#') !== -1) {
			arr = type.split('#');
			type = arr[0];
			attr.id = arr[1];
		}
		el = document.createElement(type);
		for (var i in attr) el.setAttribute(i, attr[i]);
		if (parent) parent.appendChild(el);
		if (html) el.innerHTML = html;
		return el;
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
		bg: '',
		theme: 'light',
		unittype: ''
	};

	var Base = function(el, options) {
		this.opt = _setOptions(options);
		if (!el) return;
		this.container = el;
		this.container.style.backgroundImage = 'url(' + this.opt.bg + ')';
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
		this.ticker();
		this.interval = setInterval(this.ticker.bind(this), 1000);
	};
	Base.prototype.getUnitText = function(value, unit, type) {
		if (type == 'full') {
			if (value != 1) return langs[this.opt.lang][unit + 'FullPlu'];
			return langs[this.opt.lang][unit + 'Full'];
		}
		return langs[this.opt.lang][unit];
	};
	Base.prototype.ticker = function() {
		var now = new Date();
		var diff = this.time - now.getTime();
		var diff2 = diff;
		var computed = {};
		computed.years = Math.floor(diff2 / ms.year);
		diff2 -= computed.years * ms.year;
		computed.months = Math.floor(diff2 / ms.month);
		diff2 -= computed.months * ms.month;
		computed.days = Math.floor(diff2 / ms.day);
		diff2 -= computed.days * ms.day;
		computed.hours = Math.floor(diff2 / ms.hour);
		diff2 -= computed.hours * ms.hour;
		computed.minutes = Math.floor(diff2 / ms.minute);
		diff2 -= computed.minutes * ms.minute;
		computed.seconds = Math.floor(diff2 / ms.second);

		if (diff < 0) {
			if (this.interval) clearInterval(this.interval);
			this.tickerEl.innerHTML = this.opt.done ? '' : 'NU!!!';
			if (this.opt.done) this.textEl.innerHTML = this.opt.done;
			if (!this.countDownFinished && this.utterance) {
				this.countDownFinished = true;
				window.speechSynthesis.speak(this.utterance);
			}
			return;
		}
		var html = '';
		var c = false;
		if (computed.years) {
			html += '<span class="time">' + computed.years + '</span>';
			html += '<span class="unit">' + this.getUnitText(computed.years, 'year', this.opt.unittype) + '</span> ';
			c = true;
		}
		if (c || computed.months) {
			html += '<span class="time">' + computed.months + '</span>';
			html += '<span class="unit">' + this.getUnitText(computed.months, 'month', this.opt.unittype) + '</span> ';
			c = true;
		}
		if (c || computed.days) {
			html += '<span class="time">' + computed.days + '</span>';
			html += '<span class="unit">' + this.getUnitText(computed.days, 'day', this.opt.unittype) + '</span> ';
			c = true;
		}
		if (c || computed.hours) {
			html += '<span class="time">' + computed.hours + '</span>';
			html += '<span class="unit">' + this.getUnitText(computed.hours, 'hour', this.opt.unittype) + '</span> ';
			c = true;
		}
		if (c || computed.minutes) {
			html += '<span class="time">' + computed.minutes + '</span>';
			html += '<span class="unit">' + this.getUnitText(computed.minutes, 'minute', this.opt.unittype) + '</span> ';
			c = true;
		}
		if (c || computed.seconds) {
			html += '<span class="time">' + computed.seconds + '</span>';
			html += '<span class="unit">' + this.getUnitText(computed.seconds, 'second', this.opt.unittype) + '</span> ';
		}
		this.tickerEl.innerHTML = html;
		if (diff / 1000 < 11 && !this.countDownInitiated) {
			this.countDownInitiated = true;
			var countDownText = '';
			for (var i = computed.seconds; i > 0; i--) {
				countDownText += i + '. ';
			}
			var countDownUtterance = new SpeechSynthesisUtterance(countDownText);
			countDownUtterance.lang = (this.opt.lang == 'sv') ? 'sv-SE' : 'en-US';
			countDownUtterance.rate = 0.6;
			window.speechSynthesis.speak(countDownUtterance);
		} else if (computed.seconds > 10) {
			this.countDownInitiated = false;
		}
	};

	this.Countdown = function(el, options) {
		var instance = new Base(el, options);
		return instance;
	};

	this.Countdown.globals = defaults;

}).call(this);
