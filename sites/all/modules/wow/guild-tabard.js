
var Core = {

	/**
	 * Base context URL for the project.
	 */
	baseUrl: '/',

	/**
	 * Battle.net support site URL.
	 */
	supportUrl: '/support/',

	/**
	 * The cached string for the browser.
	 */
	browser: null,

	/**
	 * Dynamic load queue.
	 */
	deferredLoadQueue: [],

	/**
	 * Current locale and region.
	 */
	locale: 'en-us',
	region: 'us',

	/**
	 * Short date format
	 */
	shortDateFormat: 'MM/dd/Y',

	/**
	 * Date/time format
	 */
	dateTimeFormat: 'dd/MM/yyyy HH:mm',

	/**
	 * The current project.
	 */
	project: '',

	/**
	 * Path to static content.
	 */
	staticUrl: '/',
	sharedStaticUrl: '/local-common/',

	/**
	 * The current host and protocol.
	 */
	host: '',

	/**
	 * User agent specification
	 */
	userAgent: 'web',

	/**
	 * Initialize the script.
	 *
	 * @constructor
	 */
	initialize: function() {
		
	},

	/**
	 * Return letter (alphabet) values only within a string.
	 *
	 * @param string
	 * @return string
	 */
	alpha: function(string) {
		return string.replace(/[^a-zA-Z]/gi, '');
	},

	/**
	 * Create a frame (for IE and app) or object (sane browsers) within the document.
	 *
	 * @param url
	 * @param width
	 * @param height
	 * @param parent
	 * @param id
	 * @param cssClass Any css classes. Primarily to allow for analytics pixels to be rendered hidden or off-screen.
	 */
	appendFrame: function(url, width, height, parent, id, cssClass) {
		if (typeof url === 'undefined')
			return;

		if (typeof width === 'undefined')
			width = 1;

		if (typeof height === 'undefined')
			height = 1;

		if (typeof parent === 'undefined')
			parent = jQuery('body');

		var idVar = ((typeof id !== 'undefined') ? ' id="' + id + '"' : '');
		if (Core.isIE() || Core.isApp()) {
			parent.append('<iframe src="' + url + '" width="' + width + '" height="' + height + '" scrolling="no" frameborder="0" allowTransparency="true"' + idVar + '></iframe>');
		} else {
			var cssVar = cssClass ? ' class="' + cssClass + '"' : '';
			parent.append('<object type="text/html" data="' + url + '" width="' + width + '" height="' + height + '"' + idVar + cssVar + '></object>');
		}
	},

	/**
	 * Create a frame (for IE and app) or object (sane browsers) within the document.
	 *
	 * @param url
	 * @param cssClass Any css classes. Primarily to allow for analytics pixels to be rendered hidden or off-screen.
	 */
	appendFrameWithClass: function(url, cssClass) {
		this.appendFrame(url, undefined, undefined, undefined, undefined, cssClass);
	},

	/**
	 * Escape a string for DOM searching
	 *
	 * @param str
	 * @return string
	 */
	escapeSelector: function(str) {
		return typeof str === "string" ? str.replace(/[^-\w]/g, "\\$&") : str
	},

	/**
	 * Fix column headers if multiple lines.
	 *
	 * @param query
	 * @param baseHeight
	 */
	fixTableHeaders: function(query, baseHeight) {
		jQuery(query).each(function() {
			baseHeight = baseHeight || 18;

			var table = jQuery(this);
			var height = baseHeight;

			table.find('.sort-link').each(function() {
				var linkHeight = jQuery(this).height();

				if (linkHeight > height) {
					height = linkHeight;
				}
			});

			if (height > baseHeight) {
				table.find('.sort-link, .sort-tab').css('height', height);
			}
		});
	},

	/**
	 * Format a locale to a specific structure.
	 *
	 * @param format
	 * @param divider
	 * @return string
	 */
	formatLocale: function(format, divider) {
		divider = divider || '-';
		format = format || 1;

		switch (format) {
			case 1:
			default:
				return Core.locale.replace('-', divider);
			break;
			case 2:
				var parts = Core.locale.split('-');
				return parts[0] + divider + parts[1].toUpperCase();
			break;
			case 3:
				return Core.locale.toUpperCase().replace('-', divider);
			break;
		}
	},

	/**
	 * Convert a datetime string to a users local time zone and return as a string using the specified format.
	 *
	 * http://www.w3.org/TR/html5/common-microsyntaxes.html#valid-global-date-and-time-string
	 *
	 * @param format
	 * @param datetime (2010-07-22T07:41-07:00)
	 * @return string
	 */
	formatDatetime: function(format, datetime) {
		var localDate;

		if (!datetime) {
			localDate = new Date();
		} else {
			// gecko
			localDate = new Date(datetime);

			// webkit
			if (isNaN(localDate.getTime())) { // 2010-07-22 07:41 GMT-0700
				datetime = datetime.substring(0,10) + ' ' + datetime.substring(11,16) + ':00 GMT' + datetime.substring(16,19) + datetime.substring(20,22);
				localDate = new Date(datetime);
			}

			// safari still thinking different
			if (isNaN(localDate.getTime())) { // 2010/07/22 07:41 GMT-0700
				datetime = datetime.substring(0,4) + '/' + datetime.substring(5,7) + '/' + datetime.substring(8,29);
				localDate = new Date(datetime);
			}

			// trident
			if (isNaN(localDate.getTime())) { // 07-22 07:41 GMT-0700 2010
				datetime = datetime.substring(5,10) + ' ' + datetime.substring(11,16) + ' GMT' + datetime.substring(23,28) + ' ' + datetime.substring(0,4);
				localDate = new Date(datetime);
			}

			if (isNaN(localDate.getTime())) {
				return false;
			}
		}

		if (!format) {
			format = 'yyyy-MM-ddThh:mmZ';
		}

		var hr = localDate.getHours(),
			meridiem = 'AM';

		if (hr > 12) {
			hr -= 12;
			meridiem = 'PM'

		} else if (hr === 12) {
			meridiem = 'PM'

		} else if (hr === 0) {
			hr = 12;
		}

		var tz = parseInt(localDate.getTimezoneOffset() / 60 * -1, 10);

		if (tz < 0) {
			tz = '-' + Core.zeroFill(Math.abs(tz), 2) + ':00';
		} else {
			tz = ' + ' + Core.zeroFill(Math.abs(tz), 2) + ':00';
		}

		format = format.replace('yyyy', localDate.getFullYear());
		format = format.replace('MM', Core.zeroFill(localDate.getMonth() + 1,2));
		format = format.replace('dd', Core.zeroFill(localDate.getDate(),2));
		format = format.replace('HH', Core.zeroFill(localDate.getHours(),2));
		format = format.replace('hh', Core.zeroFill(hr,2));
		format = format.replace('mm', Core.zeroFill(localDate.getMinutes(),2));
		format = format.replace('a', meridiem);
		format = format.replace('Z', tz);

		return format;
	},

	/**
	 * Detect the browser type, based on feature detection and not user agent.
	 *
	 * @return object
	 */
	

	/**
	 * Get the hash from the URL.
	 *
	 * @return string
	 */
	getHash: function() {
		var hash = location.hash || "";

		return hash.substr(1, hash.length);
	},

	/**
	 * Return the language based off locale.
	 *
	 * @return string
	 */
	getLanguage: function() {
		return Core.locale.split('-')[0];
	},

	/**
	 * Return the region based off locale.
	 *
	 * @return string
	 */
	getRegion: function() {
		return Core.locale.split('-')[1];
	},

	/**
	 * Conveniently jump to a page.
	 *
	 * @param url
	 * @param base
	 */
	goTo: function(url, base) {
		window.location.href = (base ? Core.baseUrl : '') + url;

		if (window.event)
			window.event.returnValue = false;
	},

	/**
	 * Include a JavaScript file via XHR.
	 *
	 * @param url
	 * @param success
	 * @param cache - defaults to true
	 */
	include: function(url, success, cache) {
		jQuery.ajax({
			url: url,
			dataType: 'script',
			success: success,
			cache: cache !== false
		});
	},

	/**
	 * Checks to see if the argument is a function/callback.
	 *
	 * @param callback
	 * @return boolean
	 */
	isCallback: function(callback) {
		return (callback && typeof callback === 'function');
	},

	/**
	 * Is the browser using IE?
	 *
	 * @param version
	 * @return boolean
	 */
	isIE: function(version) {

	},

	/**
	 * Are we in the Battle.net App?
	 *
	 * @return boolean
	 */
	isApp: function () {
		return typeof window.phoenix === "object";
	},

	/**
	 * Loads either a JavaScript or CSS file, by default deferring the load until after other
	 * content has loaded. The file type is determined by using the file extension.
	 *
	 * @param path
	 * @param deferred - true by default
	 * @param callback
	 */
	load: function(path, deferred, callback) {
		deferred = deferred !== false;

		if (Page.loaded || !deferred) {
			Core.loadDeferred(path, callback);
		} else {
			Core.deferredLoadQueue.push(path);
		}
	},

	/**
	 * Determine which type to load.
	 *
	 * @param path
	 * @param callback
	 */
	loadDeferred: function(path, callback) {
		var queryIndex = path.indexOf("?");
		var extIndex = path.lastIndexOf(".") + 1;
		var ext = path.substring(extIndex, queryIndex === -1 ? path.length : queryIndex);

		switch (ext) {
			case 'js':
				Core.loadDeferredScript(path, callback);
			break;
			case 'css':
				Core.loadDeferredStyle(path);
			break;
		}
	},

	/**
	 * Include JS file.
	 *
	 * @param path
	 * @param callback
	 */
	loadDeferredScript: function(path, callback) {
		jQuery.ajax({
			url: path,
			cache: true,
			global: false,
			dataType: 'script',
			success: callback
		});
	},

	/**
	 * Include CSS file; must be done this way because of IE (of course).
	 *
	 * @param path
	 * @param media
	 */
	loadDeferredStyle: function(path, media) {
		jQuery('head').append('<link rel="stylesheet" href="' + path + '" type="text/css" media="' + (media || "all") + '" />');
	},

	/**
	 * Replace {0}, {1}, etc. with the passed arguments.
	 *
	 * @param str
	 * @return string
	 */
	msg: function(str) {
		for (var i = 1, len = arguments.length; i < len; ++i) {
			str = str.replace("{" + (i - 1) + "}", arguments[i]);
		}

		return str;
	},

	/**
	 * This version can handle multiple occurences of the same token, but is slower due to the use of a RegExp. Only use if needed.
	 *
	 * @param str
	 * @return string
	 */
	msgAll: function(str) {
		for (var i = 1, len = arguments.length; i < len; ++i) {
			str = str.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), arguments[i]);
		}

		return str;
	},

	/**
	 * Return numeric values only within a string.
	 *
	 * @param string
	 * @return int
	 */
	numeric: function(string) {
		string = string.replace(/[^0-9]/gi, '');

		if (!string || isNaN(string)) {
			string = 0;
		}

		return string;
	},

	/**
	 * Open the link in a new window.
	 *
	 * @param node
	 * @return false
	 */
	open: function(node) {
		if (node.href)
			window.open(node.href);

		return false;
	},

	/**
	 * Helper function for event preventDefault.
	 *
	 * @param e
	 */
	preventDefault: function(e) {
		e.preventDefault();
	},

	/**
	 * Run on page load!
	 */
	processLoadQueue: function() {
		if (Core.deferredLoadQueue.length > 0) {
			for (var i = 0, path; path = Core.deferredLoadQueue[i]; i++) {
				Core.load(path);
			}
		}
	},

	/**
	 * Generate a random number between 0 and up to the argument.
	 *
	 * @param no
	 * @return int
	 */
	randomNumber: function(no) {
		return Math.floor(Math.random() * no);
	},

	/**
	 * Scroll to a specific part of the page.
	 *
	 * @param target
	 * @param duration
	 * @param callback
	 */
	scrollTo: function(target, duration, callback) {
		target = jQuery(target);

		if (target.length !== 1) {
			return;
		}

		var win = jQuery(window),
			winTop = win.scrollTop(),
			winBottom = winTop + win.height(),
			top = target.offset().top;

		top -= 15;

		if (top >= winTop && top <= winBottom) {
			return;
		}

		// jQuery.browser was removed from jQuery in version 1.9
		if (typeof jQuery.browser !== 'undefined') {
			jQuery(jQuery.browser.webkit ? 'body' : 'html').animate({
				scrollTop: top
			},
			duration || 350,
			callback || null);
		}
	},

	/**
	 * Scroll to a specific part of the page (enough to make sure it's fully visible).
	 *
	 * @param target
	 * @param duration
	 * @param callback
	 */
	scrollToVisible: function(target, duration, callback) {
		target = jQuery(target);

		if (target.length !== 1) {
			return;
		}

		var win = jQuery(window),
			winTop = win.scrollTop(),
			winBottom = winTop + win.height(),
			top = target.offset().top,
			bottom = top + target.height();

		top -= 15;
		bottom += 15;

		if (top >= winTop && bottom <= winBottom) {
			return;
		}

		// jQuery.browser was removed from jQuery in version 1.9
		if (typeof jQuery.browser !== 'undefined') {
			jQuery(jQuery.browser.webkit ? 'body' : 'html').animate({
				scrollTop: (top < winTop ? top : bottom - win.height())
			},
			duration || 350,
			callback || null);
		}
	},

	/**
	 * Helper function for event stopPropagation and preventDefault.
	 *
	 * @param e
	 */
	stopEvent: function(e) {
		e.stop();
	},

	/**
	 * Helper function for event stopPropagation.
	 *
	 * @param e
	 */
	stopPropagation: function(e) {
		e.stopPropagation();
	},

	/**
	 * Trims specific characters off the end of a string.
	 *
	 * @param string
	 * @param c
	 * @return string
	 */
	trimChar: function(string, c) {
		if (string.substr(0, 1) === c)
			string = string.substr(1, (string.length - 1));

		if (string.substr((string.length - 1), string.length) === c)
			string = string.substr(0, (string.length - 1));

		return string;
	},

	/**
	 * Trims specific characters off the right end of a string.
	 *
	 * @param string
	 * @param charlist
	 * @return string
	 */
	trimRight: function(string, charlist) {
		charlist = !charlist ? ' \\s\u00A0' : (charlist + '').replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '\\$1');

		return (string + '').replace( new RegExp('[' + charlist + ']+$', 'g') , '');
	},

	/**
	 * Apply global functionality to certain UI elements.
	 *
	 * @param context
	 */
	ui: function(context) {
		context = context || document;

		if (Core.isIE(6)) {
			jQuery(context).find('button.ui-button').hover(
				function() {
					if (!this.disabled || this.className.indexOf('disabled') == -1) {
						jQuery(this).addClass('hover');
					}
				},
				function() {
					jQuery(this).removeClass('hover');
				}
			);
		}

		if (Core.project !== 'bam') {
			jQuery(context).find('button.ui-button').click(function(e) {
				var self = jQuery(this);
				var alt = self.attr('data-text');

				if (typeof alt === 'undefined') {
					alt = "";
				}

				if (this.tagName.toLowerCase() === 'button' && alt !== "") {
					if (self.attr('type') === 'submit') {
						e.preventDefault();
						e.stopPropagation();

						self.find('span span').html(alt);
						self.removeClass('hover')
							.addClass('processing')
							.attr('disabled', 'disabled');

						// Manually submit
						self.parents('form').submit();
					}
				}

				return true;
			});
		}
	},

	/**
	 * Zero-fills a number to the specified length (works on floats and negatives, too).
	 *
	 * @param number
	 * @param width
	 * @param includeDecimal
	 * @return string
	 */
	zeroFill: function(number, width, includeDecimal) {
		if (typeof includeDecimal === 'undefined') {
			includeDecimal = false;
		}

		var result = parseFloat(number),
			negative = false,
			length = width - result.toString().length,
			i = length - 1;

		if (result < 0) {
			result = Math.abs(result);
			negative = true;
			length++;
			i = length - 1;
		}

		if (width > 0) {
			if (result.toString().indexOf('.') > 0) {
				if (!includeDecimal) {
					length += result.toString().split('.')[1].length;
				}

				length++;
				i = length - 1;
			}

			if (i >= 0) {
				do {
					result = '0' + result;
				} while (i--);
			}
		}

		if (negative) {
			return '-' + result;
		}

		return result;
	},

	/**
	 * Fire a Google Analytics event asynchronously.
	 */
	trackEvent: function(eventCategory, eventAction, eventLabel) {
		window._gaq = _gaq || [];
		_gaq.push(['_trackEvent', eventCategory, eventAction, eventLabel]);
	},

	/**
	 * Fire a GA event on click
	 * @param selector jquery element selector
	 * @param eventCategory GA category if data-category not specified, Core.project if neither specified
	 * @param eventAction GA action if data-action not specified, "Click" if neither specified
	 * @param eventLabel GA label if data-label not specified, Core.locale if neither specified
	 */
	bindTrackEvent: function(selector, eventCategory, eventAction, eventLabel) {
		jQuery(selector).on('click.analytics', function() {
			var self = jQuery(this);

			var submitCategory, submitAction, submitLabel;
			// Allow eventCategory to be a callback function evaluated on click
			if (typeof eventCategory == "function") {
				submitCategory = eventCategory.call(this);
			} else {
				submitCategory = eventCategory;
			}

			// Allow eventLabel to be a callback function evaluated on click
			if (typeof eventLabel == "function") {
				submitLabel = eventLabel.call(this);
			} else {
				submitLabel = eventLabel;
			}

			// Allow eventAction to be a callback function evaluated on click
			if (typeof eventAction == "function") {
				var eventActionToken = self.data('action-attachment') || "Unknown Action";
				submitAction = eventAction.call(this, eventActionToken);
			} else {
				submitAction = eventAction;
			}

			submitCategory = self.data('category') || submitCategory || Core.project;
			submitAction = self.data('action') || submitAction || "Click";
			submitLabel = self.data('label') || submitLabel || Core.locale;
			Core.trackEvent( submitCategory, submitAction, submitLabel );
		});
	},


	/**
	 * Utility for boxes that can be closed permanently.
	 * e.g: New Feature Box, BlizzCon Bar
	 *
	 * @param nodeQuery
	 * @param cookieId
	 * @param options - startDate, endDate, cookieParams, fadeIn, trackingCategory, trackingAction, onShow, onHide
	 */
	showUntilClosed: function(nodeQuery, cookieId, options) {
		options = options || {};

		var node = jQuery(nodeQuery),
			COOKIE_NAME = 'bnet.closed.' + cookieId;

		if (!node.length || !Cookie.isSupported() || Cookie.read(COOKIE_NAME)) {
			return false;
		}

		// Date validation
		var now = new Date();

		if (options.startDate) {
			var startDate = new Date(options.startDate);

			if ((startDate - now) > 0) {
				return false;
			}
		}

		if (options.endDate) {
			var endDate = new Date(options.endDate);

			if ((endDate - now) < 0) {
				return false;
			}
		}

		// Show the node
		if (options.fadeIn) {
			node.fadeIn(options.fadeIn, options.onShow);
		} else {
			node.show();

			if (options.onShow) {
				options.onShow();
			}
		}

		// Click events
		var cookieParams = jQuery.extend({
			path: Core.baseUrl,
			expires: 8760
		}, options.cookieParams || {});

		node.delegate('a', 'click', function() {
			var self = jQuery(this),
				trackingLabel = self.data('label'),
				closeButton = (this.rel === 'close');

			if (closeButton) {
				node.hide();

				if (options.onHide) {
					options.onHide();
				}
			}

			if (closeButton || !options.closeButtonOnly) {
				Cookie.create(COOKIE_NAME, 1, cookieParams);
			}

			if (trackingLabel) {
				Marketing.trackImpression(options.trackingCategory || 'Tracking', options.trackingAction || 'Click', trackingLabel);
			}
		});

		return true;
	}

};

jQuery(function() {
	Core.initialize();
});


Core.staticUrl = '/static/wow/static';
Core.sharedStaticUrl = '/static/wow/static/local-common';
Core.baseUrl = '/static/wow/ru';
Core.projectUrl = '/static/wow';
Core.cdnUrl = 'http://media.blizzard.com';
Core.supportUrl = '/static/support/';
Core.secureSupportUrl = 'https://eu.battle.net/support/';
Core.project = 'wow';
Core.locale = 'ru-ru';
Core.language = 'ru';
Core.region = 'eu';
Core.shortDateFormat = 'dd/MM/yyyy';
Core.dateTimeFormat = 'dd/MM/yyyy HH:mm';
Core.loggedIn = true;
Core.userAgent = 'web';
//]]>


/**
 * Renders a customized guild tabard using the HTML5 <canvas> element.
 *
 * @copyright   2010, Blizzard Entertainment, Inc
 * @class       GuildTabard
 * @example
 *
 *      var tabard = new GuildTabard('canvas-element', {
 *	 		'ring': 'alliance',
 *			'bg': [ 0, 2 ],
 *			'border': [ 0, 5 ],
 *			'emblem': [ 65, 12 ]
 *		});
 *
 */

function GuildTabard(id, tabard) {
	var self = this,
		canvas = document.getElementById(id),
		context = null,
		_path = Core.staticUrl + '/images/guild/tabards/',
		_width = canvas.width,
		_height = canvas.height,
		_src = [],
		_img = [],
		_colorMap = [],
		_color = [],
		_position = [];

	self.initialize = function() {
		if (canvas === null || !document.createElement('canvas').getContext || !_isInteger(tabard.bg[0]) || !_isInteger(tabard.border[0]) || !_isInteger(tabard.emblem[0]))
			return false;

		_colorMap = [
			null,
			null,
			[[215,32,112],[171,0,76],[87,0,0],[225,105,26],[180,56,0],[133,11,0],[237,151,22],[205,110,0],[155,61,0],[239,207,20],[207,162,0],[158,113,0],[226,216,20],[183,177,0],[133,128,0],[206,209,24],[159,161,3],[112,115,0],[153,206,27],[108,154,3],[65,108,0],[30,210,96],[4,157,63],[0,110,11],[29,206,169],[4,152,122],[0,107,74],[33,177,214],[3,109,139],[0,81,111],[72,125,193],[38,85,145],[0,39,98],[188,75,195],[145,42,155],[108,8,128],[202,17,191],[173,0,162],[124,0,116],[219,30,160],[149,0,97],[121,0,68],[160,108,44],[108,66,15],[53,16,0],[15,26,31],[117,124,120],[136,145,139],[156,166,159],[211,211,198],[229,107,140]],
			null,
			[[97,42,44],[109,69,46],[119,101,36],[118,114,36],[108,118,36],[85,108,48],[76,109,48],[48,108,66],[48,105,107],[48,80,108],[55,60,100],[87,54,100],[100,55,76],[103,51,53],[153,159,149],[38,46,38],[155,94,28]],
			[[102,0,32],[103,35,0],[103,69,0],[103,86,0],[98,102,0],[80,102,0],[54,102,0],[0,102,30],[0,102,86],[0,72,102],[9,42,94],[86,9,94],[93,10,79],[84,54,10],[177,183,176],[16,20,22],[221,163,90]]
		];

		_position = [
			[ 0, 0, (_width*216/240), (_width*216/240) ],
			[ (_width*18/240), (_width*27/240), (_width*179/240), (_width*216/240) ],
			[ (_width*18/240), (_width*27/240), (_width*179/240), (_width*210/240) ],
			[ (_width*18/240), (_width*27/240), (_width*179/240), (_width*210/240) ],
			[ (_width*31/240), (_width*40/240), (_width*147/240), (_width*159/240) ],
			[ (_width*33/240), (_width*57/240), (_width*125/240), (_width*125/240) ],
			[ (_width*18/240), (_width*27/240), (_width*179/240), (_width*32/240) ]
		];

		// If the tabard values exist
		if (_colorMap[2][tabard.bg[1]] && _colorMap[4][tabard.border[1]] && _colorMap[5][tabard.emblem[1]]) {
			_src = [
				_path + 'ring-' + tabard.ring + '.png',
				_path + 'shadow_' + Core.zeroFill(tabard.bg[0], 2) + '.png',
				_path + 'bg_' + Core.zeroFill(tabard.bg[0], 2) + '.png',
				_path + 'overlay_' + Core.zeroFill(tabard.bg[0], 2) + '.png',
				_path + 'border_' + Core.zeroFill(tabard.border[0], 2) + '.png',
				_path + 'emblem_' + Core.zeroFill(tabard.emblem[0], 2) + '.png',
				_path + 'hooks.png'
			];

			_color = [
				null,
				null,
				[ _colorMap[2][tabard.bg[1]][0], _colorMap[2][tabard.bg[1]][1], _colorMap[2][tabard.bg[1]][2] ],
				null,
				[ _colorMap[4][tabard.border[1]][0], _colorMap[4][tabard.border[1]][1], _colorMap[4][tabard.border[1]][2] ],
				[ _colorMap[5][tabard.emblem[1]][0], _colorMap[5][tabard.emblem[1]][1], _colorMap[5][tabard.emblem[1]][2] ],
				null
			];

			_img = [ new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image() ];

		// Else fallback to default tabard
		} else {
			_src = [
				_path + 'ring-' + tabard.ring + '.png',
				_path + 'shadow_00.png',
				_path + 'bg_00.png',
				_path + 'overlay_00.png',
				_path + 'hooks.png'
			];

			_img = [ new Image(), new Image(), new Image(), new Image(), new Image() ];
		}

		jQuery(canvas).css('opacity', 0);
		context = canvas.getContext('2d');

		_loadImage(0);

		return true;
	};

	function _loadImage(count) {
		if (count >= _src.length) {
			_render(0);
			return;
		}
		jQuery.ajax({
			'url': _src[count],
			'beforeSend': function() {
				_loadImage(count + 1);
			}
		});
	}

	function _render(index) {
		var _oldCanvas = new Image(),
			_newCanvas = new Image();

		_img[index].src = _src[index];

		_img[index].onload = function() {
			_oldCanvas.src = canvas.toDataURL('image/png');
		};

		_oldCanvas.onload = function() {
			canvas.width = 1;
			canvas.width = _width;
			context.drawImage(_img[index], _position[index][0], _position[index][1], _position[index][2], _position[index][3]);

			if (typeof _color[index] !== 'undefined' && _color[index] !== null) {
				_colorize(_color[index][0], _color[index][1], _color[index][2]);
			}

			_newCanvas.src = canvas.toDataURL('image/png');
			context.drawImage(_oldCanvas, 0, 0, _width, _height);
		};

		_newCanvas.onload = function() {
			context.drawImage(_newCanvas, 0, 0, _width, _height);
			index++;

			if (index < _src.length) {
				_render(index);
			} else {
				jQuery(canvas).animate({opacity: 1}, 400);
			}
		};
	}

	function _colorize(r, g, b) {
		var imageData = context.getImageData(0, 0, _width, _height),
			pixelData = imageData.data,
			i = pixelData.length,
			intensityScale = 19,
			blend = 1 / 3,
			added_r = r / intensityScale + r * blend,
			added_g = g / intensityScale + g * blend,
			added_b = b / intensityScale + b * blend,
			scale_r = r / 255 + blend,
			scale_g = g / 255 + blend,
			scale_b = b / 255 + blend;

		do {
			if (pixelData[i + 3] !== 0) {
				pixelData[i] = pixelData[i] * scale_r + added_r;
				pixelData[i + 1] = pixelData[i + 1] * scale_g + added_g;
				pixelData[i + 2] = pixelData[i + 2] * scale_b + added_b;
			}
		} while (i -= 4);
		context.putImageData(imageData, 0, 0);
	}

	function _isInteger(n) {
		if (!isNaN(parseFloat(n)) && isFinite(n)) {
			return n % 1 === 0;
		} else {
			return false;
		}
	}

	this.initialize();
}
