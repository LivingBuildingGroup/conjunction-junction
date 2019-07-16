'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./date-time'),
    convertTimestampToString = _require.convertTimestampToString,
    dateDelta = _require.dateDelta;

var _require2 = require('./basic'),
    isPrimitiveNumber = _require2.isPrimitiveNumber,
    precisionRound = _require2.precisionRound,
    isObjectLiteral = _require2.isObjectLiteral;

var _require3 = require('./primitives'),
    convertScToCc = _require3.convertScToCc,
    titleCaseWord = _require3.titleCaseWord,
    convertCcToSc = _require3.convertCcToSc;
// @@@@@@@@@@@@@@@ OBJECT KEYS @@@@@@@@@@@@@@@@

var convertObjectKeyCase = function convertObjectKeyCase(object) {
  var caseOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'cC';

  if (!isObjectLiteral(object)) return {};
  var c = caseOption === 'cC' ? 'cC' : caseOption === 'camel' ? 'cC' : 'Sc';
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

var prefixObjectKeys = function prefixObjectKeys(object, prefix) {
  if (!isObjectLiteral(object) || typeof prefix !== 'string') {
    return {};
  }
  var newObject = {};
  for (var key in object) {
    newObject['' + prefix + titleCaseWord(key)] = object[key];
  }
  return newObject;
};

var shiftObjectKeysColumn = function shiftObjectKeysColumn(object, keys, key, position1, position2) {
  console.error('shiftObjectKeysColumn is deprecated!');
  /* change this 
     send in a flattened object with all keys (server will have this loaded; front end has in state)
     look up the new key in that object as O(1)
     const newObj = {};
     for(let k in o){
       if(refObj.hasOwnProperty[oldK] && refObj[oldK].hasOwnProperty(newCase)){
         const newK = refObj[oldK][newCase];
         newObj[newK] = object[oldK];
       }
         newObj[oldK] = object[oldK];
        }
     }
  */
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
  console.error('shiftArrayKeysColumn is deprecated!');
  /* change this 
     send in a flattened object with all keys (server will have this loaded; front end has in state)
     look up the new key in that object as O(1)
     const newArr = array.map(oldK=>{
       if(refObj.hasOwnProperty(oldK)){
       return refObj[oldK][newCase];
       } else {
         return undefined;
       }
     });
     return newArr;
  */
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
  /* new version of list
    const list = [];
    for(let field in keys[table]){
      list.push(field);
    }
    return list;
  */
  if (column2 === 'match') {
    // returns a filtered list of keys (use position 1 if position 2 is an exact match to match)
    var newArray = [];
    keys[key].forEach(function (array) {
      if (array[position2] === match) newArray.push(array[position1]);
    });
    return newArray;
  }
  /* DO NOT THINK WE ARE USING THIS
    new version ?
  */
  if (column2 === 'filter') {
    // returns a filtered list of keys (use position 1 if position 2 is truthy)
    var _newArray = [];
    keys[key].forEach(function (array) {
      if (array[position2]) _newArray.push(array[position1]);
    });
    return _newArray;
  }
  /* new version
    change position2 to filterField, e.g. position2 might be "fix" or "post"
    change position1 to returnField, e.g. "snake" or "camel" or anything else.
    const list = [];
    for(let field in keys[table]){
      const thisOne = keys[table][field];
      if(thisOne[filterField]){
        list.push(thisOne[returnField]);
      }
    }
    return list;
  */
  if (column2 === 'reverse filter') {
    // returns a filtered list of keys (use position 1 if position 2 is falsey)
    var _newArray2 = [];
    keys[key].forEach(function (array) {
      if (!array[position2]) _newArray2.push(array[position1]);
    });
    return _newArray2;
  }
  /* eliminate the above */
  if (column2 === 'field') {
    // returns a list of keys AS other keys
    return keys[key].map(function (array) {
      if (array[position1] === array[position2]) return array[position1];
      return array[position1] + ' as ' + array[position2];
    });
  }
  /* new version
    change position1 to lookupField, e.g. "snake"
    change position1 to returnField, e.g. "camel"
    const list = [];
    for(let field in keys[table]){
      const thisOne = keys[table][field];
      if(thisOne[lookupField]===thisOne[returnField]) {
        list.push(thisOne[lookupField]);
      } else {
        list.push(`${thisOne[lookupField]} as ${thisOne[returnField]}`);
      }
    }
    return list;
  */
  if (column2 === 'object list') {
    // similar to above, but returns an object with the key as position 1, and value as the value of position 2 
    var newObject = {};
    keys[key].forEach(function (array) {
      if (array[position2] instanceof Object) newObject[array[position1]] = array[position2];
    });
    return newObject;
  } // eliminate the above
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
  // roundingKey e.g. { height: 1, width: 3, area: 2} = round height to 1 decimal place, round width to 3 decimal places, etc.
  if (isPrimitiveNumber(value)) {
    if (isPrimitiveNumber(roundingKey[key])) {
      return precisionRound(value, roundingKey[key]);
    } else if (isPrimitiveNumber(roundingKey.default)) {
      return precisionRound(value, roundingKey.default);
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
      arrayOfDataGroups: [],
      arrayOfKeys: [],
      arraysOfDataObjects: [{}]
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
  console.error('totalValuesByKey is deprecated, convert to summarizeValuesByKey.tot');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: sum of all values of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'key must be a string' };
  var value = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'index ' + i + ' key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        value += o[key];
        return 'index ' + i + ' key ' + key + ': ' + o[key] + ' added >>> new cum. value: ' + value;
      }
    }
  });
  return {
    value: value,
    messages: messages
  };
};

var averageValuesByKey = function averageValuesByKey(arrayOfObjects, key) {
  console.error('averageValuesByKey is deprecated, convert to summarizeValuesByKey.avg');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: sum of all values of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'key must be a string' };
  var value = 0;
  var counter = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'index ' + i + ' key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        counter++;
        value += o[key];
        return 'index ' + i + ' key ' + key + ': ' + o[key] + ' added >>> new cum. value: ' + value + ', counter: ' + counter;
      }
    }
  });
  var average = precisionRound(value / counter, 4);
  return {
    value: average,
    messages: messages
  };
};

var averageArray = function averageArray(array) {
  var countNonNumberValues = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (!Array.isArray(array)) {
    return;
  }
  var length = 0;
  var total = array.reduce(function (acc, c) {
    if (isPrimitiveNumber(c)) {
      length++;
    }
    var newValue = isPrimitiveNumber(c) ? c : 0;
    return acc + newValue;
  }, 0);
  var avg = countNonNumberValues ? total / array.length : total / length;
  return avg;
};

var minValuesByKey = function minValuesByKey(arrayOfObjects, key) {
  console.error('minValuesByKey is deprecated, convert to summarizeValuesByKey.min');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: lowest value of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'key must be a string' };
  var value = void 0;
  var counter = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'index ' + i + ' key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        counter++;
        if (value === undefined) {
          value = o[key];
        } else {
          value = Math.min(value, o[key]);
        }
        return 'index ' + i + ' key ' + key + ': ' + o[key] + ' >>> current lowest value: ' + value + ', counter: ' + counter;
      }
    }
  });
  return {
    value: value,
    messages: messages
  };
};

var maxValuesByKey = function maxValuesByKey(arrayOfObjects, key) {
  console.error('maxValuesByKey is deprecated, convert to summarizeValuesByKey.max');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: highest value of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'key must be a string' };
  var value = void 0;
  var counter = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'err: index ' + i + ' key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'err: index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        counter++;
        if (value === undefined) {
          value = o[key];
        } else {
          value = Math.max(value, o[key]);
        }
        return 'index ' + i + ' key ' + key + ': ' + o[key] + ' >>> current highest value: ' + value + ', counter: ' + counter;
      }
    }
  });
  return {
    value: value,
    messages: messages
  };
};

var summarizeValuesByKey = function summarizeValuesByKey(arrayOfObjects, key) {
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: highest value of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if (!Array.isArray(arrayOfObjects)) return { value: null, message: 'err: no array of objects' };
  if (typeof key !== 'string') return { value: null, message: 'err: key must be a string' };
  var max = void 0;
  var min = void 0;
  var tot = 0;
  var counter = 0;
  var messages = arrayOfObjects.map(function (o, i) {
    if (o[key] === undefined) {
      return 'err: index ' + i + ' key ' + key + ': was undefined';
    } else {
      if (!isPrimitiveNumber(o[key])) {
        return 'err: index ' + i + ' key ' + key + ': was ' + o[key] + ' (not a number)';
      } else {
        counter++;
        tot += o[key];
        if (max === undefined) {
          max = o[key];
        } else {
          max = Math.max(max, o[key]);
        }
        if (min === undefined) {
          min = o[key];
        } else {
          min = Math.min(min, o[key]);
        }
        return 'index ' + i + ' key ' + key + ': ' + o[key] + ' >>> current highest value: ' + max + ', >>> current lowest value: ' + min + ', added >>> new cum. value: ' + tot + ', counter: ' + counter;
      }
    }
  });
  return {
    max: max,
    min: min,
    avg: precisionRound(tot / counter, 4),
    tot: precisionRound(tot, 4),
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

  if (key1 === undefined || key2 === undefined) {
    return [];
  }
  var pre = prefix === undefined ? '' : prefix;
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
        merged['' + pre + key] = theMatch[key];
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
      extraLoggingKey = options.extraLoggingKey,
      keySignature = options.keySignature;

  if (typeof key !== 'string') return Object.assign({}, returnOnError, { message: 'key to check for sequentiality is not a string' });
  if (!isPrimitiveNumber(increment)) return Object.assign({}, returnOnError, { message: 'increment to check for sequentiality is not a number' });
  if (!isPrimitiveNumber(tolerance)) return Object.assign({}, returnOnError, { message: 'tolerance to check for sequentiality is not a number' });
  // validated
  var id = typeof extraLoggingKey === 'string' ? extraLoggingKey : 'id';
  var ks = typeof keySignature === 'string' ? keySignature : 'imestamp';
  var index = void 0,
      stop = void 0,
      message = void 0;
  var range = increment + tolerance;
  var tsUnits = key.includes(ks) && typeof timestampUnits === 'string' ? timestampUnits : key.includes(ks) ? 'minutes' : null;
  arr.forEach(function (o, i) {
    if (i === 0) {
      index = 0;
    } else {
      if (!stop) {
        if (isObjectLiteral(o)) {
          if (o.hasOwnProperty(key)) {
            var delta = key.includes(ks) ? dateDelta(o[key], arr[index][key], tsUnits) : o[key] - arr[index][key];
            var absDelta = Math.abs(delta);
            var stopValue = key.includes(ks) ? convertTimestampToString(o[key]) : o[key];
            var lastValue = key.includes(ks) ? convertTimestampToString(arr[index][key]) : arr[index][key];
            if (absDelta > range) {
              stop = i;
              message = 'in filterSequentialItems() at record ' + i + ' exceeded range of ' + range + ' (' + id + ': ' + o[id] + ', delta: ' + delta + ', absolute: ' + absDelta + ', key: ' + key + ', value at ' + i + ': ' + stopValue + ', value at last sequential index #' + index + '/' + id + ': ' + arr[index][id] + ': ' + lastValue + ')';
            } else if (absDelta === 0) {
              stop = i;
              message = 'at record ' + i + ' no sequentiality detected (' + id + ': ' + o[id] + ', delta: ' + delta + ', absolute: ' + absDelta + '), key: ' + key + ', value at ' + i + ': ' + stopValue + ', value at last sequential index #' + index + '/' + id + ': ' + arr[index][id] + ': ' + lastValue;
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
  if (!isPrimitiveNumber(index)) return [itemToUpdate].concat(_toConsumableArray(array));
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
  // object keys
  convertObjectKeyCase: convertObjectKeyCase,
  prefixObjectKeys: prefixObjectKeys,
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
  averageArray: averageArray,
  minValuesByKey: minValuesByKey,
  maxValuesByKey: maxValuesByKey,
  mergeArraysOfObjectsByKey: mergeArraysOfObjectsByKey,
  summarizeValuesByKey: summarizeValuesByKey,
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