var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;
var extension = '.logz';

var exports = module.exports = function(opts){
	function createPath(path) {
		function puts(error, stdout, stderr) { 
			sys.puts(stdout);
		}

		if (!fs.existsSync(path)) {
			exec("mkdir -p " + path, puts);
		}
	}

	function getUserHome() {
	  return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
	}

	function setupConfig() {
    	var key;

    	exports.config = {
	    	dir: getUserHome() + '/logz/',
	    	persist: false,
	    	stack: false,
	    	defaultLog: 'default',
	    	messageDelimiter: '::::',
	    	messageEnd: '####',
	    };

	    if (opts != null) {
	    	for (key in opts) {
	    		exports.config[key] = opts[key];
	    	}
	    }

	    exports.config.defaultLog += '.logz';
    }

    function getDateString(dateObj, delimiter) {
		if (dateObj == null) return '';
		if (!(dateObj instanceof Date)) throw 'dateObj not a date';

		return [
			dateObj.getFullYear()
			, padDateTimePart(dateObj.getMonth() + 1)
			, padDateTimePart(dateObj.getDate())
		].join(delimiter || '-');
	}

	function getTimeString(dateObj, delimiter) {
		if (dateObj == null) return '';
		if (!(dateObj instanceof Date)) throw 'dateObj not a date';

		return [
			padDateTimePart(dateObj.getHours())
			, padDateTimePart(dateObj.getMinutes())
			, padDateTimePart(dateObj.getSeconds())
		].join(delimiter || ':');
	}

	function padDateTimePart(part) {
		part = part.toString();
		if (part.length < 2) return '0' + part;
		return part;
	}

	function getDateTimeString(dateObj, dateDelimiter, timeDelimiter) {
		if (dateObj == null) return '';
		if (!(dateObj instanceof Date)) throw 'dateObj not a date';

		return getDateString(dateObj, dateDelimiter) + 'T' + getTimeString(dateObj, timeDelimiter);
	}

	function getDateTimeStamp() {
		return getDateTimeString(new Date());
	}

	function prepareMessage(msg, end, stacktrace) {
		var txt;

    	if (end === true) {
    		if (stacktrace === false) {
    			txt = uuid() + exports.config.messageDelimiter + getDateTimeStamp() + exports.config.messageDelimiter;
    		}
    		else {
    			txt = '';
    		}
    		txt += msg + exports.config.messageEnd;
    	}
    	else {
    		txt = uuid() + exports.config.messageDelimiter + getDateTimeStamp() + exports.config.messageDelimiter + msg;
    	}
    	txt += '\n';

    	return txt;
	}

	function randomInt (low, high) {
	    return Math.floor(Math.random() * (high - low) + low);
	}

	function randomHex (low, high) {
		var result;
		if (low == null) low = 0;
		if (high == null) high = 16;

	    result = randomInt(low, high);

	    if (result > 9) {
	    	result = String.fromCharCode(87 + result);
	    }

	    return result;
	}

	function repeat(fn, times) {
		var result = '';
		for (var i = 0; i < times; i++) {
			result += fn();
		}

		return result;
	}

	function uuid() {
		return [
			repeat(randomHex, 8)
			, repeat(randomHex, 4)
			, repeat(randomHex, 4)
			, repeat(randomHex, 4)
			, repeat(randomHex, 12)
		].join('-');
	}

	function getLogName(topic) {
    	if (topic == null) return exports.config.defaultLog;
    	else return topic + extension;
    }

    function createTodaysLog(logName) {
		var fd, now, path;

		if (logName == null) throw 'logName required';

		now = new Date();
		path = getDateString(now, '/');
		exports.config.fullPath = exports.config.dir + path + '/';
		exports.config.todaysLog = exports.config.fullPath + logName;

		try {
			createPath(exports.config.fullPath);

			if (!fs.existsSync(exports.config.todaysLog)) {
				fd = fs.openSync(exports.config.todaysLog, 'w');
				fs.closeSync(fd);
			}
		}
		catch (e) {
			console.log(e);
		}
	}

	function persist(msg, logName) {
		fs.appendFile(exports.config.fullPath + logName || exports.config.todaysLog, msg, function (err) {
		  if (err) throw err;
		});
	}

	exports.log = function(msg, persistFlag, stackFlag, topic) {
		var err, txt, end, logName;

		logName = getLogName(topic);
		createTodaysLog(logName);

		if (persistFlag !== true && persistFlag !== false) {
			persistFlag = exports.config.persist;
		}

		if (stackFlag !== true && stackFlag !== false) {
			stackFlag = exports.config.stack;
		}

		end = !stackFlag;
		txt = prepareMessage(msg, end, false);

		if (stackFlag === true) {
			err = new Error();
			end = true;
			txt += prepareMessage(err.stack, end, true);
			console.log(txt);
			if (persistFlag === true) {
				persist(txt, logName);
			}
		}
		else {
			console.log(txt);
			if (persistFlag === true) {
				persist(txt, logName);
			}
		}
	};

	setupConfig();
	createTodaysLog(getLogName(null));

	return exports;
};


