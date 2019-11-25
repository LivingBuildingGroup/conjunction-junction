'use strict';

var _require = require('./date-time'),
    convertStringToTimestamp = _require.convertStringToTimestamp,
    convertTimestampToString = _require.convertTimestampToString,
    isValidDate = _require.isValidDate;

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
    if (typeof key === 'string' && typeof key.includes === 'function' && key.includes(sig)) {
      isNumber = true;
    }
  });
  if (!isNumber) {
    integerKeysSignatures.forEach(function (sig) {
      if (typeof key === 'string' && typeof key.includes === 'function' && key.includes(sig)) {
        isInteger = true;
      }
    });
  }
  var tryValue = isNumber ? parseFloat(value) : isInteger ? parseInt(value, 10) : value;
  // the line below prevents converting 0.00 to 0
  var theValue = tryValue === value ? value : tryValue;
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

var printNumber = function printNumber(num) {
  var triggerSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 999000;
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var nan = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

  return !isPrimitiveNumber(num) ? nan : num >= triggerSize ? String.fromCharCode(8734) : // infinity
  precisionRound(num, round);
};

var numberToModNumber = function numberToModNumber(value, consolidateBy) {
  // consolidate as in consolidate values from a range into a single value that can be used as an exact match
  // e.g. 22, 23, 24, 25, 26 consolidated by 5 = 20, 20, 20, 25, 25
  if (!consolidateBy) {
    return value;
  }
  if (isPrimitiveNumber(consolidateBy) && isPrimitiveNumber(value)) {
    return consolidateBy === 0 ? 0 : precisionRound(Math.floor(value / consolidateBy) * consolidateBy, 2);
  }
  if (isObjectLiteral(consolidateBy)) {
    return consolidateBy.hasOwnProperty(value) ? consolidateBy[value] : value;
  }
  return value;
};

// @@@@@@@@@@@@@@@ MIXED TYPES @@@@@@@@@@@@@@@@

var formatForPrint = function formatForPrint(data, options) {
  //plan to deprecate this, continue function but rename
  var defaultOptions = {
    round: 4,
    arrays: true,
    stringLength: 250,
    object: ':(',
    nan: 'NaN',
    triggerSize: 999999
  };
  var o = isObjectLiteral(options) ? Object.assign({}, defaultOptions, options) : defaultOptions;
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
    var round = isPrimitiveNumber(o.round) ? o.round : defaultOptions.round;
    return printNumber(data, o.triggerSize, round, o.nan);
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

var print = function print(data, options) {
  console.warn('The function print is deprecated, use formatForPrint instead');
  return formatForPrint(data, options);
};

var numberToLetter = function numberToLetter(num) {
  //took out option that did wasn't used in function
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
  if (typeof word !== 'string') return '';
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

var convertCcToSc = function convertCcToSc(word, divider) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Future efficiency improvement needed
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if (isPrimitiveNumber(word)) return '' + word;
  if (typeof word !== 'string') return '';
  var _divider = isPrimitiveNumber(divider) || typeof divider === 'string' ? divider : '_';
  var newWord = '';
  var caps = { A: true, B: true, C: true, D: true, E: true, F: true, G: true, H: true, I: true, J: true, K: true, L: true, M: true, N: true, O: true, P: true, Q: true, R: true, S: true, T: true, U: true, V: true, W: true, X: true, Y: true, Z: true };
  var numbers = void 0;
  if (options.numbers) {
    numbers = {};
    for (var i = 0; i <= 9; i++) {
      numbers['' + i] = true;
    }
  }
  var lastWasLetter = void 0;
  for (var _i = 0; _i <= word.length; _i++) {
    var c = word.charAt(_i);
    var char = caps[c] ? '' + _divider + c.toLowerCase() : numbers && numbers[c] && lastWasLetter ? '' + divider + c : c;
    if (numbers && !numbers[c]) {
      lastWasLetter = true;
    }
    newWord += char;
  }
  return newWord;
};

var convertCcToSpace = function convertCcToSpace(word) {
  console.warn('convertCcToSpace is deprecated, use convertCcToSc(word, " ")');
  return convertCcToSc(word, ' ');
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  // if(isPrimitiveNumber(word)) return `${word}`;
  // if(typeof word !== 'string') return '';
  // // const theWord = 'theWord';
  // let newWord = '';
  // const caps  = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  // const lower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; 
  // for(let i=0; i<= word.length; i++ ) {
  //   const char =
  //     caps.includes(word.charAt(i)) ?
  //       ` ${lower[caps.findIndex(letter=>letter===word.charAt(i))]}`
  //       : word.charAt(i);
  //   newWord += char;
  // }
  // return newWord;
};

var convertScToSpace = function convertScToSpace(word) {
  if (typeof word !== 'string') return '';
  var split = word.split('_');
  return split.join(' ');
};

module.exports = {
  // types
  correctInputType: correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber: generateRandomNumber,
  numberToModNumber: numberToModNumber,
  printNumber: printNumber,
  // mixed types
  formatForPrint: formatForPrint,
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