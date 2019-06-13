'use strict';

var _require = require('./date-time'),
    convertStringToTimestamp = _require.convertStringToTimestamp,
    convertTimestampToString = _require.convertTimestampToString,
    isValidDate = _require.isValidDate,
    dateDelta = _require.dateDelta;

var _require2 = require('./basic'),
    isPrimitiveNumber = _require2.isPrimitiveNumber,
    precisionRound = _require2.precisionRound,
    isObjectLiteral = _require2.isObjectLiteral;

// @@@@@@@@@@@@@@@ TYPES @@@@@@@@@@@@@@@@

var correctInputType = function correctInputType(value) {
  var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // ADD A LOWER BIG-O OPTION TO PASS IN AN OBJECT WITH:
  // { key: type, key: type}
  // Get data from input field and convert to a specified type
  var numberKeysSignatures = Array.isArray(options.numberSignatures) ? options.numberSignatures : ['number', 'Lbs', 'nessIn', 'Sf', 'Cf', 'idSlope'];
  var integerKeysSignatures = Array.isArray(options.integerSignatures) ? options.integerSignatures : ['integer', 'idComponent', 'idProfile', 'idCassette', 'idStorm', 'idTest', 'initialPlantHealth'];
  var isNumber = false;
  var isInteger = false;
  numberKeysSignatures.forEach(function (sig) {
    if (key.includes(sig)) isNumber = true;
  });
  if (!isNumber) {
    integerKeysSignatures.forEach(function (sig) {
      if (key.includes(sig)) isInteger = true;
    });
  }
  var theValue = isNumber ? parseFloat(value) : isInteger ? parseInt(value, 10) : value;
  return theValue;
};

// @@@@@@@@@@@@@@@ NUMBERS @@@@@@@@@@@@@@@@

var generateRandomNumber = function generateRandomNumber(lower, upper) {
  var pct = Math.random(); // percent of span to use, i.e. the random number 0 to < 1
  var span = upper - lower; // span, e.g. lower of 50 and upper of 100 = span of 50
  var dist = pct * span; // distance of span, e.g. if random number is .10, and span is 50, then use 10% of the span, or 5
  var ran = lower + dist; // new random number, corrected for the lower range, e.g. if dist is 5, and lower range is 50, then our random number is 55 (lower range + the distance up that range)
  var num = Math.ceil(ran); // ceiling so we get an integer; since Math.random() is exclusive of 1, the ceiling allows to hit the bottom range at 0, and upper range at 0.99999...; optionally we could accept a parameter to allow this to be a specific decimaml
  return num;
};

// @@@@@@@@@@@@@@@ MIXED TYPES @@@@@@@@@@@@@@@@

var print = function print(data, options) {
  var defaultOptions = {
    round: 4,
    arrays: true,
    stringLength: 250,
    object: ':(',
    nan: 'NaN'
  };
  var o = isObjectLiteral(options) ? Object.assign({}, options, defaultOptions) : defaultOptions;
  var trueValue = typeof o.trueValue === 'string' ? o.trueValue : 'true';
  var falseValue = typeof o.falseValue === 'string' ? o.falseValue : 'false';
  var undefinedValue = typeof o.undefinedValue === 'string' ? o.undefinedValue : 'undefined';
  var nullValue = typeof o.nullValue === 'string' ? o.nullValue : 'null';
  if (typeof data === 'string') {
    var timestamp = convertStringToTimestamp(data);
    if (isValidDate(timestamp)) {
      var dateOptions = isObjectLiteral(o.dateOptions) ? o.dateOptions : null;
      return convertTimestampToString(timestamp, dateOptions);
    } else if (typeof o.stringLength === 'number') {
      return data.slice(0, o.stringLength);
    }
    return data;
  }
  if (typeof data === 'number') {
    if (typeof o.round === 'number') {
      return precisionRound(data, o.round);
    }
    return isPrimitiveNumber(data) ? data : o.nan;
  }
  if (isValidDate(data)) {
    return convertTimestampToString(data);
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

module.exports = {
  // types
  correctInputType: correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber: generateRandomNumber,
  // mixed types
  print: print,
  numberToLetter: numberToLetter,
  // strings
  titleCaseWord: titleCaseWord,
  lowerCaseWord: lowerCaseWord,
  convertScToCc: convertScToCc,
  convertCcToSc: convertCcToSc,
  convertCcToSpace: convertCcToSpace,
  convertScToSpace: convertScToSpace
};