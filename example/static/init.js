(function() {
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		var el = document.getElementById('countdown');
		var options = {
			title: "Semester om...",
			datetime: "2015-07-03 16:00:00",
			done: "Nu jävlar är det semester",
			lang: "sv",
			theme: "dark",
			unittype: ""
		};
		new Countdown(el, options);
	});
	console.log(new Date);
}).call(this); /* not added */

/*
bg: "http://bitewallpapers.com/nature/summer/part%202/summer%20grass%20with%20a%20touch%20of%20rain%20desktop%20wallpaper%20hd.jpg",*/
