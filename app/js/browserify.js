(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var deps = {};

deps.virginity = require('virginity');

window.browserify = deps;

},{"virginity":4}],2:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],4:[function(require,module,exports){
/*jslint node: true */
'use strict';

var fmt = require('./lib/formatters.js');

var has = function(data, key){
  return data.hasOwnProperty(key);
};

var fold = function(data){
  var parts = data.match(/[\s\S]{1,75}/g) || [];
  return parts.join('\r\n ');
};


function compile(data){
  var elements = [];
  var head = 'BEGIN:VCARD\r\nVERSION:3.0';
  elements.push(head);

  if (has(data, 'name')){
    elements.push(fmt.name(data.name));
    elements.push(fmt.formattedName(data.name));
  }
  if (has(data, 'adr')){
    var address = data.adr.map(function(d){
      return fmt.adr(d);
    });
    elements = elements.concat(address);
  }
  if (has(data, 'bday')){
    elements.push(fmt.bday(data.bday));
  }
  if (has(data, 'categories')){
    elements.push(fmt.categories(data.categories));
  }
  if (has(data, 'email')){
    var email = data.email.map(function(d){
      return fmt.email(d);
    });
    elements = elements.concat(email);
  }
  if (has(data, 'nickname')){
    elements.push(fmt.nickname(data.nickname));
  }
  if (has(data, 'note')){
    elements.push(fmt.note(data.note));
  }
  if (has(data, 'org')){
    elements.push(fmt.org(data.org));
  }
  if (has(data, 'title')){
    elements.push(fmt.title(data.title));
  }
  if (has(data, 'photo')){
    elements.push(fmt.photo(data.photo));
  }
  if (has(data, 'tel')){
    var tel = data.tel.map(function(d){
      return fmt.tel(d);
    });
    elements = elements.concat(tel);
  }
  if (has(data, 'url')){
    var url = data.url.map(function(d, i){
      return fmt.url(d, i + 1);
    });
    elements = elements.concat(url);
  }
  if (has(data, 'im')){
    var im = data.im.map(function(d){
      return fmt.im(d);
    });
    elements = elements.concat(im);
  }

  elements.push('END:VCARD');

  var newLine = '\r\n';
  var folded = elements.map(fold);
  var joined = folded.join(newLine);

  return joined;
}

module.exports = compile;

},{"./lib/formatters.js":5}],5:[function(require,module,exports){
/*jslint node: true */
'use strict';

var path = require('path');

var esc = function(s){
  if (typeof s !== 'string'){
    return '';
  }
  return s.replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
};

var escJoin = function(a, char){
  a.map(function(d){ return esc(d); });
  return a.join(char);
};

var imLookup = {
	yahoo: 'X-YAHOO:',
	google: 'X-GTALK:',
	aim: 'X-AIM:',
	skype: 'X-SKYPE:',
	qq: 'X-QQ:',
	msn: 'X-MSN:',
	icq: 'X-ICQ:',
	jabber: 'X-JABBER:'
};

// TODO: function to turn an array of vcard lines into a string

var formatters = {
  name: function(data){
    var base = 'N:';
    var last = (data.last) ? esc(data.last) : '';
    var first = (data.first) ? esc(data.first) : '';
    var additional = (data.additional) ? escJoin(data.additional, ' ') : '';
    var prefix = (data.prefix) ? esc(data.prefix) : '';
    var suffix = (data.suffix) ? escJoin(data.suffix, ',') : '';
    var n = [last, first, additional, prefix, suffix].join(';');
    return base + n;
  },
  formattedName: function(data){
    var base = 'FN:';
    var prefix = (data.prefix) ? esc(data.prefix) : '';
    var first = (data.first) ? esc(data.first) : '';
    var additional = (data.additional) ? escJoin(data.additional, ' ') : '';
    var last = (data.last) ? esc(data.last) : '';
    var suffix = (data.suffix) ? '\\, ' + escJoin(data.suffix, '\\, ') : '';
    var items = [prefix, first, additional, last].filter(function(d){ return d !== ''; });
    var n = base + items.join(' ') + suffix;
    return n;
  },
  adr: function(data){
    var base = 'ADR';
    var type = (data.type) ? data.type : '';
    type = 'TYPE=' + type + ':';
    var country = (data.country) ? data.country : '';
    var address = [base, type, '', esc(data.street), esc(data.city), esc(data.state), esc(data.zip), esc(country)].join(';');
    return address;
  },
  bday: function(data){
    // for now, assume that date is coming in formatted yyyy-mm-dd
    var base = 'BDAY:';
    return base + data;
  },
  categories: function(data){
    var base = 'CATEGORIES:';
    var categories = escJoin(data, ',');
    return base + categories;
  },
  email: function(data){
    var base = 'EMAIL;';
    var type = (data.type) ? 'TYPE=' + esc(data.type) : 'TYPE=';
    if (data.preferred){
      type += ',pref';
    }
    type += ':';
    var address = esc(data.address);
    return base + type + address;
  },
  nickname: function(data){
    var base = 'NICKNAME:';
    var names = escJoin(data, ',');
    return base + names;
  },
  note: function(data){
    var base = 'NOTE:';
    var note = esc(data);
    return base + note;
  },
  org: function(data){
    var base = 'ORG:';
    var company = (data.company) ? esc(data.company) : '';
    var suborg1 = (data.suborg1) ? esc(data.suborg1) : '';
    var suborg2 = (data.suborg2) ? esc(data.suborg2) : '';
    return base + [company, suborg1, suborg2].join(';');
  },
  title: function(data){
    var base = 'TITLE:';
    var out = base + esc(data);
    return out;
  },
  photo: function(data){
    var base = 'PHOTO;';
    var meta;
    if (data.type === 'uri'){
      meta = 'VALUE=uri:';
    } else{
      meta = 'ENCODING=b;TYPE=' + data.ext + ':';
    }
    return base + meta + data.photo;
  },
  tel: function(data){
    var base = 'TEL;';
    var type = (data.type) ? esc(data.type) : '';
    type = 'TYPE=' + type;
    if (data.pref){
      type += ',pref:';
    } else{
      type += ':';
    }
    return base + type + esc(data.number);
  },
  url: function(data, i){
    var item = 'item' + i;
    var url = item + '.URL:' + data.url;
    var label = item + '.X-ABLabel:';
    if (data.type === 'homepage'){
      label += '_$!<HomePage>!$_';
    } else{
      label += esc(data.type);
    }
    return url + '\r\n' + label;
  },
  im: function(data){
    if (imLookup.hasOwnProperty(data.type)){
      return imLookup[data.type] + esc(data.name);
    } else{
      return false;
    }
  }
};

module.exports = formatters;

},{"path":2}]},{},[1]);
