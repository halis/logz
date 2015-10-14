# logz
A simple persistent logger for node.js

You can use this library to log to the console, log to a file or both. There is an option to log with a stacktrace if needed.

The simplest usage is:
```javascript
	var logz = require('./logz.js')({});
	logz.log('Hello');
	// ea2d28ab-d065-135d-6b86-ef24a4c556fc::::2015-10-14T13:29:44::::Hello####
	// It will log this to the console only by default
	// uuid::::datetimestamp::::message####
```
In this case when you call require it will create a directory structure and default logging file.
```
	/Users/your-username/logz/2015/10/14/default.logz
```
Every time you call require it will look at the current year, month and date and create the file and directory structure if it doesn't already exist.

By default:
```
	logz.log('Hello');
```
This will not log a stack trace or persist. But you can control that behavior globally or per logging statement.
See below.

```javascript
	// These are the default global options, if they are suitable then pass in {} to the require as above
	var opts = {
		dir: '/Users/your-username/logz',
		persist: false,
		stack: false,
		defaultLog: 'default',
		messageDelimiter: '::::',
		messageEnd: '####',
	};
	var logz = require('./logz.js')(opts);

	/* 
	The global options are as follows:
	     dir - The directory where your logs are stored, by default it is under the user's home directory, but if you change this, make sure you create the directory and have the appropriate permissions
	     
	     persist - Whether to persist a logging statement by default
	     
	     stack - Whether to log a stack trace by default
	     
	     defaultLog - The name of the log file if no topic is used - default.logz

	     messageDelimiter - A logging message by default is uuid::::datetimestamp::::message#### this lets you control the :::: delimiter

	     messageEnd - A logging message by default is uuid::::datetimestamp::::message#### this lets you control the #### delimiter
	 */

	/* There is only one function exported which is:
		function log(msg, persistFlag, stackFlag, topic)
		Parameters:
		msg - The message to be logged
		persistFlag - overrides the global persist flag (whether it saves to disk or not)
		stackFlag - overrides the global stack flag (whether to include a stacktrace in the msg)
		topic - By default your logz are stored in default.logz if you change this to say 'hello' then they are stored in hello.logz
	*/

	logz.log('Hello', true, true);
	
	/*  The following will be stored in default.logz and logged in the console:
	72f33a9c-d438-c0bc-cc58-5fb15f36eb9a::::2015-10-14T13:33:11::::Hello
	Error
	    at Function.exports.log (/Users/your-username/someproject/logz.js:188:10)
	    at Object.<anonymous> (/Users/your-username/someproject/test.js:4:6)
	    at Module._compile (module.js:460:26)
	    at Object.Module._extensions..js (module.js:478:10)
	    at Module.load (module.js:355:32)
	    at Function.Module._load (module.js:310:12)
	    at Function.Module.runMain (module.js:501:10)
	    at startup (node.js:129:16)
	    at node.js:814:3####
    */

	logz.log('World', true, true, 'hot');

	/* The following will be stored in hot.logz and logged in the console:
	784a1b2d-ce9e-c3e0-c6fe-d6945ec78a57::::2015-10-14T13:35:45::::World
	Error
	    at Function.exports.log (/Users/cjgrim/dx/aar/logz.js:188:10)
	    at Object.<anonymous> (/Users/cjgrim/dx/aar/test2.js:4:6)
	    at Module._compile (module.js:460:26)
	    at Object.Module._extensions..js (module.js:478:10)
	    at Module.load (module.js:355:32)
	    at Function.Module._load (module.js:310:12)
	    at Function.Module.runMain (module.js:501:10)
	    at startup (node.js:129:16)
	    at node.js:814:3####
	*/
```