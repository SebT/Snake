(function() {
  var Uju, scope, _ref;

  scope = typeof window !== "undefined" && window !== null ? window : this;

  /*
  # UbiJsUtils holds convenient javascript functions used @ Ubidreams
  */


  scope.Uju = (_ref = scope.Uju) != null ? _ref : {};

  Uju = scope.Uju;

  /*
  # From enyojs / enyo / kernel / lang.js
  # Ensure the execution context of a method (fix the this element to a specified object inside the function)
  # @param context object to bind as context
  # @param method method to bind the context to
  # @return function wrapping a call to method which ensure context is the this element inside
  */


  Uju.bind = function(context, method) {
    var args;
    if (!(method != null)) {
      method = context;
      context = null;
    }
    context = context != null ? context : scope;
    if (Uju.isString(method)) {
      if (context[method] != null) {
        method = context[method];
      } else {
        throw '[UbiUtils.bind]: context[' + method + "] is null (context=" + context + ")";
      }
    }
    if (Uju.isFunction(method)) {
      args = Uju.cloneArray(arguments, 2);
      if (method.bind != null) {
        return method.bind.apply(method, [context].concat(args));
      } else {
        return function() {
          var nargs;
          nargs = Uju.cloneArray(arguments);
          return method.apply(context, args.concat(nargs));
        };
      }
    } else {
      throw '[UbiUtils.bind]: context[' + method + "] is not a function (context=" + context + ")";
    }
  };

  /*
  # Build an url from a provided url and additional param to send as a query string. Use objectToQuery to encode inParams in the url
  #
  # @param url base url to add params to
  # @param inParams object containing additional params to encode to the url as query
  #
  */


  Uju.buildUrl = function(url, inParams) {
    var args, bodyArgs, parts, uri;
    if (!(inParams != null)) {
      return url;
    }
    parts = url.split("?");
    uri = parts.shift() || "";
    args = parts.join("?").split("&");
    if (args.length === 1 && args[0] === "") {
      args = [];
    }
    bodyArgs = Uju.objectToQuery(inParams);
    args.push(bodyArgs);
    if (inParams.cacheBust != null) {
      args.push(Math.random());
    }
    return [uri, args.join("&")].join("?");
  };

  /*
  # From H-Ubu
  # Clone an object (deep copy).
  # @param obj {Object} the object to clone
  # @param excludes {Array} the property to exclude.
  # @return the cloned object, or the object itself if it's not an object.
  */


  Uju.clone = function(obj, excludes) {
    var flags, key, newInstance;
    if (!(obj != null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    excludes = excludes != null ? excludes : [];
    for (key in obj) {
      if (Uju.indexOf(excludes, key) === -1) {
        newInstance[key] = Uju.clone(obj[key], excludes);
      }
    }
    return newInstance;
  };

  /*
  # From enyojs / enyo / kernel / lang.js
  # Clone an array. Elements inside the array are not cloned (not a deep clone of the array).
  #
  # @param inArray The array to duplicate
  # @param inOffset Copy starting index (default 0)
  # @param inStartWith Array to insert in the return before pushing inArray elements (default [])
  # @return A copy of the array from inOffset to the end, starting with inStartingWith elements.
  */


  Uju.cloneArray = function(inArray, inOffset, inStartWith) {
    var arr, element, i, _i, _len, _ref1;
    if (inOffset == null) {
      inOffset = 0;
    }
    if (inStartWith == null) {
      inStartWith = [];
    }
    arr = inStartWith;
    for (i = _i = 0, _len = inArray.length; _i < _len; i = ++_i) {
      element = inArray[i];
      if ((_ref1 = i >= inOffset) != null ? _ref1 : 0) {
        arr.push(element);
      }
    }
    return arr;
  };

  /*
  # From http://stackoverflow.com/a/873856
  # http://www.ietf.org/rfc/rfc4122.txt
  */


  Uju.createUUID = function() {
    var hexDigits, i, s, uuid, _i;
    s = [];
    hexDigits = "0123456789abcdef";
    for (i = _i = 0; _i <= 35; i = ++_i) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    return uuid = s.join("");
  };

  Uju.createUniqueName = function(nbChar) {
    var i, letters, name, s, _i;
    if (nbChar == null) {
      nbChar = 20;
    }
    s = [];
    letters = "abcdefghijklmnopqrstuvwxyz";
    for (i = _i = 0; 0 <= nbChar ? _i <= nbChar : _i >= nbChar; i = 0 <= nbChar ? ++_i : --_i) {
      s[i] = letters.substr(Math.floor(Math.random() * 26), 1);
    }
    return name = s.join("");
  };

  /*
  # from H-ubu
  # indexOf function.
  # This method delegates on `Array.indexOf` if it exists. If not (IE), it just implements its own indexOf with simple
  # lookup
  # @param {Object} array the array
  # @param {Object} obj the object
  # @return the index of the object 'obj' in the array or -1 if not found.
  */


  Uju.indexOf = function(array, obj) {
    var i, v, _i, _len;
    if ((Array.prototype.indexOf != null)) {
      return array.indexOf(obj);
    } else {
      for (i = _i = 0, _len = array.length; _i < _len; i = ++_i) {
        v = array[i];
        if (v === obj) {
          return i;
        }
      }
      return -1;
    }
  };

  /* typeOf Wrappers
  */


  Uju.isArray = function(obj) {
    return Uju.typeOf(obj) === "array";
  };

  Uju.isBoolean = function(obj) {
    return Uju.typeOf(obj) === "boolean";
  };

  Uju.isDate = function(obj) {
    return Uju.typeOf(obj) === "date";
  };

  Uju.isFunction = function(obj) {
    return Uju.typeOf(obj) === "function";
  };

  Uju.isNumber = function(obj) {
    return Uju.typeOf(obj) === "number";
  };

  Uju.isObject = function(obj) {
    return Uju.typeOf(obj) === "object";
  };

  Uju.isRegExp = function(obj) {
    return Uju.typeOf(obj) === "regexp";
  };

  Uju.isString = function(obj) {
    return Uju.typeOf(obj) === "string";
  };

  Uju.isUndefined = function(obj) {
    return Uju.typeOf(obj) === "undefined";
  };

  /*
  # Convert an object to an URL query string. object's fields are converted using encodeURIComponent (using string is advised)
  #
  # @param map object to convert to a URL query string
  #
  */


  Uju.objectToQuery = function(map) {
    var assign, backstop, item, name, pairs, value, _i, _len;
    pairs = [];
    backstop = {};
    for (name in map) {
      value = map[name];
      if (value !== backstop[name]) {
        assign = encodeURIComponent(name) + "=";
        if (Uju.isArray(value)) {
          for (_i = 0, _len = value.length; _i < _len; _i++) {
            item = value[_i];
            pairs.push(assign + encodeURIComponent(item));
          }
        } else {
          pairs.push(assign + encodeURIComponent(value));
        }
      }
    }
    return pairs.join("&");
  };

  /*
  # return number of properties of this object
  #
  # @param obj object toCount properties from
  #
  */


  Uju.propertiesCount = function(obj) {
    var cpt, prop;
    cpt = 0;
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        cpt++;
      }
    }
    return cpt;
  };

  /*
  # Return the type of obj as a lower case string : boolean, number, string, function, array, date, regexp, object, undefined
  */


  Uju.typeOf = function(obj) {
    var myClass, name, _i, _len, _ref1;
    if (!(obj != null)) {
      return "undefined";
    }
    if (!(Uju.__classToType != null)) {
      Uju.__classToType = new Object;
      _ref1 = "Boolean Number String Function Array Date RegExp".split(" ");
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        name = _ref1[_i];
        Uju.__classToType["[object " + name + "]"] = name.toLowerCase();
      }
    }
    myClass = Object.prototype.toString.call(obj);
    if (myClass in Uju.__classToType) {
      return Uju.__classToType[myClass];
    }
    return "object";
  };

}).call(this);
;
