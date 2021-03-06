/*!
 * StringBuilder.utils.args
 * Copyright(c) 2013 Delmo Carrozzo <dcardev@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var XRegExp = require('xregexp').XRegExp
  , formatter = require('./formatter');

/**
 * XRegExp for formats
 * 
 */
var regexLib = {
	format: '{(?<arg>\\d+)(:(?<format>[^{}]+))?}'
};

/**
 * Expose functionality
 */
exports.replace = replace;
exports.hasArgs = hasArgs;


/**
 * Define if the `str` contains formats
 * 
 * @param  {String}  srt 
 * @return {Boolean}     
 */
function hasArgs(srt) {
	var r = new XRegExp(regexLib.format, 'g');

	return r.test( srt );
}

/**
 * Replace `args` into `str`
 * 
 * @param {String} str
 * @param {Array} args
 */
function replace(str, args) {
	//return str;

	var tokens = getTokens(str, args)
		result = []
		index = 0;

	// asume that tokens is sortered by index
	tokens.forEach(function(item){
		result.push(str.substring(index, item.index));

		if (item.format !== undefined) {
			result.push(formatter.format(item.format, item.value));
		} else {
			result.push(item.value.toString());
		}
		
		index = item.index+item.arg.length;
	});

	if (index < str.length) {
		result.push(str.substring(index));	
	}
	
	return result
			.join('')
			.replace(/{{/g, '{')  // clean {{
			.replace(/}}/g, '}'); // clean }}
}

/**
 * Extract the arguments from the `srt` 
 * 
 * @param  {String} str  
 * @param  {Array} args 
 * @return {Array}      
 */
function getTokens(str, args) {
	var res = []
	  , r = new XRegExp(regexLib.format, 'g');

	XRegExp.forEach(str, r, function(match){
		if (true === isReallyAnArg(str, match)) {
			res.push({
				  index: match.index
				, arg: match[0]
				, format: match.format
				, value: args[match.arg]
			});
		}
	});

	return res;
}

/**
 * Define if the `match` is really and argument from `str`
 * 
 * NOTE: This functions can be replaced for an regex lookbeighn implementarion
 * 
 * @param  {String}  str   
 * @param  {Object}  match 
 * @return {Boolean}       
 */
function isReallyAnArg(str, match) {
	var im = true
	  , value = match[0];

	if (match.index > 0) {
		im = str[match.index-1] !== '{';
	}
	
	if (!im) {
		return false;
	}

	if ( (match.index+value.length) < str.length ) {
		im = str[match.index+value.length+1] !== '}';	
	}

	return im;
}