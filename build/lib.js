'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./date-time'),
    convertStringToTimestamp = _require.convertStringToTimestamp,
    isValidDate = _require.isValidDate,
    printDate = _require.printDate,
    dateDelta = _require.dateDelta;

var _require2 = require('./basic'),
    isPrimitiveNumber = _require2.isPrimitiveNumber,
    precisionRound = _require2.precisionRound,
    isObjectLiteral = _require2.isObjectLiteral;

// @@@@@@@@@@@@@@@ TYPES @@@@@@@@@@@@@@@@

var correctInputType = function correctInputType(value, key) {
  // IMPROVE THIS SO SIGNATURES ARE NOT HARD-CODED !!!!
  // input, particularly from selectors, may be a string, when it should be an integer
  // input may come in as a string, even from a "number" input
  var numberKeysSignatures = ['number', 'Lbs', 'nessIn', 'Sf', 'Cf', 'idSlope'];
  var integerKeysSignatures = ['integer', 'idComponent', 'idProfile', 'idCassette', 'idStorm', 'idTest', 'initialPlantHealth'];
  var isNumber = false;
  var isInteger = false;
  numberKeysSignatures.forEach(function (sig) {
    if (key.includes(sig)) isNumber = true;
  });
  integerKeysSignatures.forEach(function (sig) {
    if (key.includes(sig)) isInteger = true;
  });
  var theValue = isNumber ? parseFloat(value) : isInteger ? parseInt(value, 10) : value;
  return theValue;
};

// @@@@@@@@@@@@@@@ NUMBERS @@@@@@@@@@@@@@@@


// @@@@@@@@@@@@@@@ MIXED TYPES @@@@@@@@@@@@@@@@

var print = function print(data, options) {
  var defaultOptions = {
    round: 4,
    arrays: true,
    stringLength: 250,
    object: ':('
  };
  var o = isObjectLiteral(options) ? options : defaultOptions;
  var trueValue = typeof o.trueValue === 'string' ? o.trueValue : 'true';
  var falseValue = typeof o.falseValue === 'string' ? o.falseValue : 'false';
  var undefinedValue = typeof o.undefinedValue === 'string' ? o.undefinedValue : 'undefined';
  var nullValue = typeof o.nullValue === 'string' ? o.nullValue : 'null';
  if (typeof data === 'string') {
    var timestamp = convertStringToTimestamp(data);
    if (isValidDate(timestamp)) {
      var dateOptions = isObjectLiteral(o.dateOptions) ? o.dateOptions : null;
      return printDate(timestamp, dateOptions);
    } else if (typeof o.stringLength === 'number') {
      return data.slice(0, o.stringLength);
    }
    return data;
  }
  if (typeof data === 'number') {
    if (typeof o.round === 'number') {
      return precisionRound(data, o.round);
    }
    return data;
  }
  if (isValidDate(data)) {
    return printDate(data);
  }
  if (Array.isArray(data)) {
    if (o.arrays) {
      var arrayToString = data.join(', ');
      if (typeof o.stringLength === 'number') {
        return arrayToString.slice(0, o.stringLength);
      }
      return arrayToString;
    }
  }
  if (isObjectLiteral(data)) {
    return o.object;
  }
  if (typeof data === 'boolean') {
    if (data) return trueValue;
    return falseValue;
  }
  if (data === undefined) {
    return undefinedValue;
  }
  if (data === null) {
    return nullValue;
  }
  return ':(';
};

var numberToLetter = function numberToLetter(num, option) {
  // 1-indexed, not 0-indexed, so subtract 1
  // move to conjunction-junction
  // make A if neg, Z if over
  // round number
  // exercise option for caps or lowercase
  var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var rawLetter = letters[num - 1];
  return rawLetter;
};

// @@@@@@@@@@@@@@@ STRINGS @@@@@@@@@@@@@@@@

var titleCaseWord = function titleCaseWord(word, option) {
  // input: string
  // option: 'cC' if the string is snake_case and you want camelCase (returned as SnakeCase or CamelCase)
  // output: capitalized string
  if (typeof word !== 'string') return;
  var end = word.slice(1, word.length);
  var endCase = option === 'cC' ? convertScToCc(end) : end;
  var front = word.slice(0, 1);
  return '' + front.toUpperCase() + endCase;
};

var lowerCaseWord = function lowerCaseWord(word) {
  if (typeof word !== 'string') return;
  var end = word.slice(1, word.length);
  var front = word.slice(0, 1);
  return '' + front.toLowerCase() + end;
};

var convertScToCc = function convertScToCc(word) {
  // input: string in snake_case
  // disregards any other type of formatting, such as spaces and hyphens
  if (isPrimitiveNumber(word)) return '' + word;
  if (typeof word !== 'string') return '';
  var array = word.split('_');
  var first = array[0];
  var others = array.slice(1, array.length);
  var othersCamel = others.map(function (word) {
    return titleCaseWord(word);
  });
  return '' + first + othersCamel.join('');
};

var convertCcToSc = function convertCcToSc(word) {
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if (isPrimitiveNumber(word)) return '' + word;
  if (typeof word !== 'string') return '';
  // const theWord = 'theWord';
  var newWord = '';
  var caps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var lower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  var _loop = function _loop(i) {
    var char = caps.includes(word.charAt(i)) ? '_' + lower[caps.findIndex(function (letter) {
      return letter === word.charAt(i);
    })] : word.charAt(i);
    newWord += char;
  };

  for (var i = 0; i <= word.length; i++) {
    _loop(i);
  }
  return newWord;
};

var convertCcToSpace = function convertCcToSpace(word) {
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if (isPrimitiveNumber(word)) return '' + word;
  if (typeof word !== 'string') return '';
  // const theWord = 'theWord';
  var newWord = '';
  var caps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
  var lower = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

  var _loop2 = function _loop2(i) {
    var char = caps.includes(word.charAt(i)) ? ' ' + lower[caps.findIndex(function (letter) {
      return letter === word.charAt(i);
    })] : word.charAt(i);
    newWord += char;
  };

  for (var i = 0; i <= word.length; i++) {
    _loop2(i);
  }
  return newWord;
};

var convertScToSpace = function convertScToSpace(word) {
  if (typeof word !== 'string') return;
  var split = word.split('_');
  return split.join(' ');
};

// @@@@@@@@@@@@@@@ OBJECT KEYS @@@@@@@@@@@@@@@@

var convertObjectKeyCase = function convertObjectKeyCase(object) {
  var caseOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'cC';

  if (!isObjectLiteral(object)) return {};
  var c = caseOption === 'cC' ? 'cC' : 'Sc';
  var newObject = {};
  for (var key in object) {
    if (c === 'cC') {
      var newKey = key.includes('_') ? convertScToCc(key) : key;
      newObject[newKey] = object[key];
    } else {
      var _newKey = convertCcToSc(key);
      newObject[_newKey] = object[key];
    }
  }
  return newObject;
};

var shiftObjectKeysColumn = function shiftObjectKeysColumn(object, keys, key, position1, position2) {
  // object: object with keys, 
  // keys: all keys
  // key: to look up in keys, 
  // position1 is from in array, position2 is to in array
  // output: object with keys shifted from position1 to position2, limited to position2 present
  // validate
  if (!isObjectLiteral(keys)) {
    console.error('shiftObjectKeysColumn FAILED: keys is not instanceof Object');
    return {};
  }
  if (!Array.isArray(keys[key])) {
    console.error('shiftObjectKeysColumn FAILED: keys[' + key + '] is not an array');
    return {};
  }
  if (!Array.isArray(keys[key][0])) {
    // position 1 must be a number, and must be valid index
    console.error('shiftObjectKeysColumn FAILED: keys[' + key + '][0] is an array');
    return {};
  }
  if (isNaN(position1) || isNaN(position2)) {
    console.error('shiftObjectKeysColumn FAILED: ' + position1 + ' or ' + position2 + ' is NaN');
    return {};
  }
  if (typeof keys[key][0][position1] !== 'string') {
    console.error('shiftObjectKeysColumn FAILED: keys[' + key + '][0][' + position1 + '] is a not string (' + keys[key][0][position1] + ')');
    return {};
  }
  if (typeof keys[key][0][position2] !== 'string') {
    console.error('shiftObjectKeysColumn FAILED: keys[' + key + '][0][' + position2 + '] is a not string (' + keys[key][0][position2] + ')');
    return {};
  }
  if (object instanceof Object) {
    var newObject = {};

    keys[key].forEach(function (rowOfKeys) {
      if (object[rowOfKeys[position1]] !== undefined) {
        newObject[rowOfKeys[position2]] = object[rowOfKeys[position1]];
      }
    });
    return newObject;
  } else {
    return {};
  }
};

var shiftArrayKeysColumn = function shiftArrayKeysColumn(array, keys, key, position1, position2) {
  if (!Array.isArray(array)) return [];
  if (!isObjectLiteral(keys)) return [];
  if (typeof key !== 'string') return array;
  if (!isPrimitiveNumber(position1)) return array;
  if (!isPrimitiveNumber(position2)) return array;
  if (!Array.isArray(keys[key])) return array;
  var keyMap = {};
  keys[key].forEach(function (row) {
    keyMap[row[position1]] = row[position2];
  });
  var newArray = array.map(function (string) {
    return keyMap[string];
  });
  return newArray;
};

var getKeyArray = function getKeyArray(input) {
  // input: key to look up in keys, 1 or 2 positions in the array of keys
  // output: array of keys  
  if (!isObjectLiteral(input)) return [];
  var keys = input.keys,
      key = input.key,
      action = input.action,
      position1 = input.position1,
      position2 = input.position2,
      match = input.match;
  // keys must be an object

  if (!isObjectLiteral(keys)) return [];
  // key within keys must be array of arrays
  if (!Array.isArray(keys[key])) return [];
  if (!Array.isArray(keys[key][0])) return [];
  // position 1 must be a number, and must be valid index
  if (!isPrimitiveNumber(position1)) return [];
  if (!keys[key][0][position1]) return [];
  // position 2 can be undefined, but if defined, must be a number and must exist
  if (position2 !== undefined) {
    if (!isPrimitiveNumber(position2)) return [];
    if (keys[key][0][position2] === undefined) return [];
  }
  // decipher action
  var column1 = // column 1 must be a field; check first line only
  typeof keys[key][0][position1] === 'string' ? 'field' : null;
  var column2 = !action ? 'list' : action === 'list' ? 'list' : position2 === undefined ? 'list' : action;

  if (column1 !== 'field') return [];
  // six possible actions
  if (column2 === 'list') {
    // returns a list of keys in this column
    return keys[key].map(function (array) {
      return array[position1];
    });
  }
  if (column2 === 'match') {
    // returns a filtered list of keys (use position 1 if position 2 is an exact match to match)
    var newArray = [];
    keys[key].forEach(function (array) {
      if (array[position2] === match) newArray.push(array[position1]);
    });
    return newArray;
  }
  if (column2 === 'filter') {
    // returns a filtered list of keys (use position 1 if position 2 is truthy)
    var _newArray = [];
    keys[key].forEach(function (array) {
      if (array[position2]) _newArray.push(array[position1]);
    });
    return _newArray;
  }
  if (column2 === 'reverse filter') {
    // returns a filtered list of keys (use position 1 if position 2 is falsey)
    var _newArray2 = [];
    keys[key].forEach(function (array) {
      if (!array[position2]) _newArray2.push(array[position1]);
    });
    return _newArray2;
  }
  if (column2 === 'field') {
    // returns a list of keys AS other keys
    return keys[key].map(function (array) {
      if (array[position1] === array[position2]) return array[position1];
      return array[position1] + ' as ' + array[position2];
    });
  }
  if (column2 === 'object list') {
    // similar to above, but returns an object with the key as position 1, and value as the value of position 2 
    var newObject = {};
    keys[key].forEach(function (array) {
      if (array[position2] instanceof Object) newObject[array[position1]] = array[position2];
    });
    return newObject;
  }
  return [];
};

var validateObjectKeysPresent = function validateObjectKeysPresent(object, arrayOfKeys) {
  if (!Array.isArray(arrayOfKeys)) return {
    message: 'Missing array of keys'
  };
  if (!isObjectLiteral(object)) return {
    message: 'Invalid input'
  };
  var missingField = arrayOfKeys.find(function (key) {
    return !(key in object);
  });
  if (missingField) {
    var response = {
      message: 'Missing field',
      location: missingField
    };
    return response;
  }
  return 'ok';
};

var validateObjectKeys = function validateObjectKeys(object, type, rowOfKeys) {
  // type = new or existing
  if (!isObjectLiteral(object)) return {
    message: 'Invalid input'
  };
  // input: object to validate
  // input: type: new or not
  // input: rowOfKeys: array of keys to check against.
  // checks object to ensure all keys are present.
  // output: ok if validated, else response object identifying missing keys
  if (!Array.isArray(rowOfKeys)) return 'ok';
  if (rowOfKeys.length <= 0) return 'ok';
  var isPresent = type === 'new' ? validateObjectKeysPresent(object, rowOfKeys) : 'ok';
  if (isPresent !== 'ok' && type === 'new') {
    return isPresent;
  } else {
    return 'ok';
  }
};

var limitObjectKeys = function limitObjectKeys(object, limitingKeys) {
  if (!isObjectLiteral(object)) return {};
  if (!Array.isArray(limitingKeys)) return object;
  var limitedObject = {};
  for (var key in object) {
    if (limitingKeys.includes(key)) {
      limitedObject[key] = object[key];
    }
  }
  return limitedObject;
};

var parseValuesObj2Levels = function parseValuesObj2Levels(query, object, searchInKey, returnKey) {
  /* input:
   *   object: {
   *     key1: {
   *       searchHere: 'value1',
   *       returnThis: 'Hey!',
   *     },
   *     key2: {
   *       searchHere: 'value2',
   *       returnThis: 'Wassup!?',
   *     }
   *   },
   *   query: 'value2',
   *   searchInKey: 'searchHere',
   *   returnKey:  'returnThis',
   * output: 'Wassup!?'
   */

  var focusId = 0; // so we default to something vs undefined
  for (var key in object) {
    if (object[key][searchInKey] === query) {
      focusId = object[key][returnKey];
    }
  }
  return focusId;
};

// @@@@@@@@@@@@@@@ OBJECTS & ARRAYS @@@@@@@@@@@@@@@@

var roundAllValues = function roundAllValues(value, roundingKey, key) {
  if (isPrimitiveNumber(value)) {
    if (isPrimitiveNumber(roundingKey[key])) {
      return precisionRound(value, roundingKey[key]);
    } else {
      return value;
    }
  } else if (typeof value === 'string') {
    return value;
  } else if (Array.isArray(value)) {
    return value.map(function (v) {
      return roundAllValues(v, roundingKey, key);
    });
  } else if (isObjectLiteral(value)) {
    var returnObject = {};
    for (var k in value) {
      returnObject[k] = roundAllValues(value[k], roundingKey, k);
    }
    return returnObject;
  }
  return value;
};

var parseValuesFromArrayOfObj1Level = function parseValuesFromArrayOfObj1Level(array, key) {
  // input: [ {key: 1, random: 6}, {key: 2, other: 5} ], 'key'  
  // output [1,2]
  if (Array.isArray(array)) {
    return array.map(function (item) {
      return item[key];
    });
  }
  return [];
};

var convertArrayToObject = function convertArrayToObject(array) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'id';

  // input: [ {id:0}, {id:1} ]      output {0:{},1:{}}
  var newObject = {};
  if (Array.isArray(array)) {
    array.forEach(function (obj) {
      if (isObjectLiteral(obj)) {
        newObject[obj[key]] = obj;
      }
    });
    return newObject;
  }
  return {};
};

var convertObjectToArray = function convertObjectToArray(object) {
  // input {0:{},1:{}}         output: [ {}, {} ]      
  var newArray = [];
  if ((typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && !Array.isArray(object)) {
    for (var prop in object) {
      newArray.push(object[prop]);
    }
    return newArray;
  }
  return [];
};

var subArrayByKey = function subArrayByKey(array, groupBy) {
  if (!Array.isArray(array) || typeof groupBy !== 'string') {
    return {
      groupBy: groupBy,
      arraysOfDataObjects: [{}],
      arrayOfDataGroups: [],
      arrayOfKeys: []
    };
  }
  var dGs = [];
  var dOs = [];
  var kO = {};
  array.forEach(function (item) {
    var index = dGs.findIndex(function (v) {
      return v === item[groupBy];
    });
    if (index >= 0) {
      dOs[index].push(item);
    } else {
      dOs.push([]);
      dOs[dOs.length - 1].push(item);
      dGs.push(item[groupBy]);
    }
    for (var k in item) {
      if (!kO[k]) kO[k] = true;
    }
  });
  var keys = [];
  for (var k in kO) {
    keys.push(k);
  }
  keys.sort();
  return {
    groupBy: groupBy,
    arraysOfDataObjects: dOs,
    arrayOfDataGroups: dGs,
    arrayOfKeys: keys
  };
};

var totalValuesByKey = function totalValuesByKey(arrayOfObjects, key) {
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: sum of all values of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'key must be a string' };
  var value = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'index ' + i + ': key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        value += o[key];
        return 'index ' + i + ': key ' + key + ': ' + o[key] + ' added; new cum. value: ' + value;
      }
    }
  });
  return {
    value: value,
    messages: messages
  };
};

var averageValuesByKey = function averageValuesByKey(arrayOfObjects, key) {
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: sum of all values of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'key must be a string' };
  var value = 0;
  var counter = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'index ' + i + ': key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        counter++;
        value += o[key];
        return 'index ' + i + ': key ' + key + ': ' + o[key] + ' added; new cum. value: ' + value + ', counter: ' + counter;
      }
    }
  });
  var average = precisionRound(value / counter, 4);
  return {
    value: average,
    messages: messages
  };
};

var mergeArraysOfObjectsByKey = function mergeArraysOfObjectsByKey(arr1, arr2, options) {
  if (!Array.isArray(arr1)) return [];
  if (!Array.isArray(arr2)) return arr1;
  if (!isObjectLiteral(options)) return [];
  var key1 = options.key1,
      key2 = options.key2,
      prefix = options.prefix;

  if (key1 === undefined || key2 === undefined || prefix === undefined) {
    return [];
  }
  var combo = arr1.map(function (obj1, i) {
    // follow primary list of objects
    var merged = Object.assign({}, obj1);
    // this handles arrays of unmatched length.
    // if arr1 is longer than arr2, returns this PORTION of arr1 (returns entire array a few lines up)
    if (!isObjectLiteral(arr2[i])) {
      return obj1;
    }
    var theMatch = {};
    // improve this by looking for other ways to match
    var delta = dateDelta(obj1[key1], arr2[i][key2]);
    if (delta <= 2) {
      theMatch = arr2[i];
    } else {
      theMatch = arr2.find(function (c) {
        var delta = dateDelta(obj1[key1], arr2[i][key2]);
        if (delta <= 2) {
          return c;
        }
      });
    }
    for (var key in theMatch) {
      if (merged.hasOwnProperty(key)) {
        merged['' + prefix + key] = theMatch[key];
      } else {
        merged[key] = theMatch[key];
      }
    }
    return merged;
  });
  return combo;
};

var filterSequentialItems = function filterSequentialItems(arr, options) {
  // input: sorted array, options (see below for options)
  // output: array containing ONLY sequential items, starting with index 0
  // does not sort, does not skip. Checks each item you sent in as supposed to be sequential, and ensures it is actually sequential
  var returnOnError = { array: [], index: 0, stop: 0 };
  if (!Array.isArray(arr)) return Object.assign({}, returnOnError, { message: 'array to check for sequentiality is not an array' });
  if (!isObjectLiteral(options)) return Object.assign({}, returnOnError, { message: 'options for array sequentiality is not an object' });
  var key = options.key,
      increment = options.increment,
      tolerance = options.tolerance,
      timestampUnits = options.timestampUnits,
      extraLoggingKey = options.extraLoggingKey;

  if (typeof key !== 'string') return Object.assign({}, returnOnError, { message: 'key to check for sequentiality is not a string' });
  if (!isPrimitiveNumber(increment)) return Object.assign({}, returnOnError, { message: 'increment to check for sequentiality is not a number' });
  if (!isPrimitiveNumber(tolerance)) return Object.assign({}, returnOnError, { message: 'tolerance to check for sequentiality is not a number' });
  // validated
  var id = typeof extraLoggingKey === 'string' ? extraLoggingKey : 'id';
  var index = void 0,
      stop = void 0,
      message = void 0;
  var range = increment + tolerance;
  var tsUnits = key.includes('imestamp') && typeof timestampUnits === 'string' ? timestampUnits : key.includes('imestamp') ? 'minutes' : null;
  arr.forEach(function (o, i) {
    if (i === 0) {
      index = 0;
    } else {
      if (!stop) {
        if (isObjectLiteral(o)) {
          if (o.hasOwnProperty(key)) {
            var delta = key.includes('imestamp') ? dateDelta(o[key], arr[index][key], tsUnits) : o[key] - arr[index][key];
            var absDelta = Math.abs(delta);
            if (absDelta > range) {
              stop = i;
              message = 'at record ' + i + ' exceeded range of ' + range + ' (' + id + ': ' + o[id] + ', delta: ' + delta + ', absolute: ' + absDelta + ', key: ' + key + ', value at ' + i + ': ' + o[key] + ', value at last sequential index #' + index + '/' + id + ': ' + arr[index][id] + ': ' + arr[index][key] + ')';
            } else if (absDelta === 0) {
              stop = i;
              message = 'at record ' + i + ' no sequentiality detected (' + id + ': ' + o[id] + ', delta: ' + delta + ', absolute: ' + absDelta + '), key: ' + key + ', value at ' + i + ': ' + o[key] + ', value at last sequential index #' + index + '/' + id + ': ' + arr[index][id] + ': ' + arr[index][key];
            } else {
              message = 'ok';
              index = i; // success!
            }
          } else {
            stop = i;
            message = 'at record ' + i + '/' + id + ': ' + o[id] + ' key of ' + key + ' not found.';
          }
        } else {
          stop = i;
          message = 'at record ' + i + '/' + id + ': ' + o[id] + ' no sequentiality object found.';
        }
      }
    }
  });
  return {
    array: arr.slice(0, index + 1),
    index: index,
    stop: stop,
    message: message
  };
};

// @@@@@@@@@@@@@@@ ARRAYS @@@@@@@@@@@@@@@@

var totalAndAverageArrays = function totalAndAverageArrays(compoundArray) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: array of arrays of numbers
  // output: { totaled: single array of numbers (sum), averaged: single array of numbers (average)
  // no reinforcement of array length
  var validated = true;
  var errors = [];
  if (!Array.isArray(compoundArray)) {
    validated = false;
    errors.push('input is not an array');
  }
  if (validated) {
    compoundArray.forEach(function (subArray) {
      if (!Array.isArray(subArray)) {
        validated = false;
        errors.push('input is not a compound array');
        return { totaled: [], averaged: [], errors: errors };
      }
    });
  }
  if (!validated) return { totaled: [], averaged: [], errors: errors };

  var totalsArray = [];
  compoundArray.forEach(function (subArray, j) {
    subArray.forEach(function (num, i) {
      // if not a primitive number, ignore it, but log the error
      if (!isPrimitiveNumber(num)) {
        errors.push('error at array ' + j + ':' + i);
      } else if (totalsArray[i]) {
        totalsArray[i] += num;
      } else {
        totalsArray[i] = num;
      }
    });
  });
  var averagesArray = totalsArray.map(function (num) {
    return precisionRound(num / compoundArray.length, precision);
  });
  return {
    totaled: totalsArray,
    averaged: averagesArray,
    errors: errors
  };
};

var deltaArray = function deltaArray(array1, array2) {
  // input: two arrays of numbers
  // output: new array containing the difference between the two numbers
  // array length is reinforced
  var validated = true;
  if (!Array.isArray(array1)) validated = false;
  if (!Array.isArray(array2)) validated = false;
  if (validated === true) {
    if (array1.length !== array2.length) validated = false;
  }
  if (!validated) return [];

  var arrayOfDeltas = array1.map(function (num, i) {
    var delta = isNaN(num - array2[i]) ? null : precisionRound(num - array2[i], 4);
    return delta;
  });

  return arrayOfDeltas;
};

var immutableArrayInsert = function immutableArrayInsert(index, array, itemToUpdate) {
  // input: index: integer to replace in array.
  // input: array: existing array to edit
  // input: itemToUpdate: what to put into the array: can be any data type
  // output: new array with item added (prepended, appended, replaced, based on index)
  // invalid index defaults to prepend
  if (!Array.isArray(array)) return [];
  if (itemToUpdate === undefined) return array;
  if (index === null || index === undefined || isNaN(index)) {
    return [itemToUpdate].concat(_toConsumableArray(array));
  }
  if (index <= 0) {
    var remainder = array.slice(1, array.length);
    var _newArray3 = [itemToUpdate].concat(_toConsumableArray(remainder));
    return _newArray3;
  }
  if (index >= array.length - 1) {
    var _remainder = array.slice(0, array.length - 1);
    var _newArray4 = [].concat(_toConsumableArray(_remainder), [itemToUpdate]);
    return _newArray4;
  }
  var remainderFront = array.slice(0, index);
  var remainderBack = array.slice(index + 1, array.length);
  var newArray = [].concat(_toConsumableArray(remainderFront), [itemToUpdate], _toConsumableArray(remainderBack));
  return newArray;
};

var immutableArraySplice = function immutableArraySplice(index, array) {
  // input: index: integer to delete from array.
  // input: array: existing array to edit
  // output: new array with item removed
  // invalid index does nothing
  if (!Array.isArray(array)) return [];
  if (isNaN(index) || index < 0) return array;
  if (index > array.length - 1) return array;
  if (index === 0) {
    return array.slice(1, array.length);
  }
  if (index === array.length - 1) {
    return array.slice(0, array.length - 1);
  }
  var remainderFront = array.slice(0, index);
  var remainderBack = array.slice(index + 1, array.length);
  var newArray = [].concat(_toConsumableArray(remainderFront), _toConsumableArray(remainderBack));

  return newArray;
};

var removeAllItemsFromArray = function removeAllItemsFromArray(array, items) {
  // input: array of values (currently only accepting primitives)
  // items: items to remove from the array
  // if items ARE on the array, they are removed
  // if items are NOT on the array, they are ignored
  if (!Array.isArray(items)) return array;
  if (!Array.isArray(array)) return;

  var newArray = [].concat(_toConsumableArray(array));

  items.forEach(function (itemToRemove) {
    var index = newArray.findIndex(function (exItem) {
      return exItem === itemToRemove;
    });
    newArray = index >= 0 ? immutableArraySplice(index, newArray) : newArray;
  });

  return newArray;
};

var addAllItemsToArray = function addAllItemsToArray(array, items) {
  // input: array, only accepting primitives now
  // input: items to add to array (only primitives now)
  // first remove all items from array to avoid duplicates
  // then add all items to end of array
  if (!Array.isArray(items)) return array;
  if (!Array.isArray(array)) return;

  var removedArray = removeAllItemsFromArray(array, items);
  return [].concat(_toConsumableArray(removedArray), _toConsumableArray(items));
};

var getPositionToInterpolate = function getPositionToInterpolate(value, increment) {
  // input: numeric value and numeric value of 1 increment
  var position = precisionRound(value / increment, 4); // intentionally rounded to 4, not 8
  var lo = Math.floor(position);
  var hi = Math.ceil(position);
  var decimal = precisionRound(position - lo, 4);
  return {
    position: position, // actual position, e.g. 2.4
    decimal: decimal, // decimal value above low position, e.g. 0.4
    hi: hi, // integer above position, e.g. 3
    lo: lo // integer below position, e.g. 2
  };
};

var interpolateArrayValues = function interpolateArrayValues(arr, decimal, hi, lo) {
  if (!Array.isArray(arr)) return;
  if (!isPrimitiveNumber(decimal)) return;
  if (!isPrimitiveNumber(hi)) return;
  if (!isPrimitiveNumber(lo)) return;
  var loValue = arr[lo];
  if (loValue === undefined) return;
  var hiValue = arr[hi];
  if (hiValue === undefined) return;
  var deltaValue = precisionRound(hiValue - loValue, 4);
  var decimalValue = precisionRound(decimal * deltaValue, 4);
  var value = precisionRound(loValue + decimalValue, 4);
  return precisionRound(value, 4);
};

module.exports = {
  // types
  correctInputType: correctInputType, // do not do a test for this yet
  // numbers (none yet)
  // mixed types
  print: print,
  numberToLetter: numberToLetter,
  // strings
  titleCaseWord: titleCaseWord,
  lowerCaseWord: lowerCaseWord,
  convertScToCc: convertScToCc,
  convertCcToSc: convertCcToSc,
  convertCcToSpace: convertCcToSpace,
  convertScToSpace: convertScToSpace,
  // object keys
  convertObjectKeyCase: convertObjectKeyCase,
  shiftObjectKeysColumn: shiftObjectKeysColumn,
  shiftArrayKeysColumn: shiftArrayKeysColumn,
  getKeyArray: getKeyArray,
  validateObjectKeysPresent: validateObjectKeysPresent,
  validateObjectKeys: validateObjectKeys,
  limitObjectKeys: limitObjectKeys,
  parseValuesObj2Levels: parseValuesObj2Levels,
  // objects and arrays
  roundAllValues: roundAllValues,
  parseValuesFromArrayOfObj1Level: parseValuesFromArrayOfObj1Level,
  convertArrayToObject: convertArrayToObject,
  convertObjectToArray: convertObjectToArray,
  subArrayByKey: subArrayByKey,
  totalValuesByKey: totalValuesByKey,
  averageValuesByKey: averageValuesByKey,
  mergeArraysOfObjectsByKey: mergeArraysOfObjectsByKey,
  filterSequentialItems: filterSequentialItems,
  // arrays
  totalAndAverageArrays: totalAndAverageArrays,
  deltaArray: deltaArray,
  immutableArrayInsert: immutableArrayInsert,
  immutableArraySplice: immutableArraySplice,
  removeAllItemsFromArray: removeAllItemsFromArray,
  addAllItemsToArray: addAllItemsToArray,
  getPositionToInterpolate: getPositionToInterpolate,
  interpolateArrayValues: interpolateArrayValues
};