'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
  var booleanKeysSignatures = Array.isArray(options.booleanSignatures) ? options.booleanSignatures : ['omit'];
  var lowercaseKeysSignatures = Array.isArray(options.lowercaseSignatures) ? options.lowercaseSignatures : [];
  var stringArraySignatures = Array.isArray(options.stringArraySignatures) ? options.stringArraySignatures : [];
  var floatArraySignatures = Array.isArray(options.floatArraySignatures) ? options.floatArraySignatures : [];
  var intArraySignatures = Array.isArray(options.intArraySignatures) ? options.intArraySignatures : [];
  var integerFailure = options.integerFailure;
  var numberFailure = options.numberFailure;

  var isNumber = false;
  var isInteger = false;
  var isBoolean = false;
  var isLowercase = false;
  var isStringArray = false;
  var isFloatArray = false;
  var isIntArray = false;

  var exactMatchFound = false;

  if (!exactMatchFound) {
    stringArraySignatures.forEach(function (sig) {
      if (key === sig) {
        isStringArray = true;exactMatchFound = true;
      }
    });
  }
  if (!exactMatchFound) {
    floatArraySignatures.forEach(function (sig) {
      if (key === sig) {
        isFloatArray = true;exactMatchFound = true;
      }
    });
  }
  if (!exactMatchFound) {
    intArraySignatures.forEach(function (sig) {
      if (key === sig) {
        isIntArray = true;exactMatchFound = true;
      }
    });
  }
  if (!exactMatchFound) {
    booleanKeysSignatures.forEach(function (sig) {
      if (key === sig) {
        isBoolean = true;exactMatchFound = true;
      }
    });
  }
  if (!exactMatchFound) {
    numberKeysSignatures.forEach(function (sig) {
      if (key === sig) {
        isNumber = true;exactMatchFound = true;
      }
    });
  }
  if (!exactMatchFound) {
    integerKeysSignatures.forEach(function (sig) {
      if (key === sig) {
        isInteger = true;exactMatchFound = true;
      }
    });
  }
  if (!exactMatchFound) {
    lowercaseKeysSignatures.forEach(function (sig) {
      if (key === sig) {
        isLowercase = true;exactMatchFound = true;
      }
    });
  }

  if (!exactMatchFound) {
    stringArraySignatures.forEach(function (sig) {
      if (typeof key === 'string' && key.includes(sig)) {
        isStringArray = true;
      }
    });
    floatArraySignatures.forEach(function (sig) {
      if (typeof key === 'string' && key.includes(sig)) {
        isFloatArray = true;
      }
    });
    intArraySignatures.forEach(function (sig) {
      if (typeof key === 'string' && key.includes(sig)) {
        isIntArray = true;
      }
    });
    booleanKeysSignatures.forEach(function (sig) {
      if (typeof key === 'string' && key.includes(sig)) {
        isBoolean = true;
      }
    });
    if (!isBoolean) {
      numberKeysSignatures.forEach(function (sig) {
        if (typeof key === 'string' && key.includes(sig)) {
          isNumber = true;
        }
      });
    }
    if (!isNumber && !isBoolean) {
      integerKeysSignatures.forEach(function (sig) {
        if (typeof key === 'string' && key.includes(sig)) {
          isInteger = true;
        }
      });
    }
    if (!isNumber && !isBoolean && !isInteger) {
      lowercaseKeysSignatures.forEach(function (sig) {
        if (typeof key === 'string' && key.includes(sig)) {
          isLowercase = true;
        }
      });
    }
  }

  var tryValue = isStringArray && typeof value === 'string' ? value.split(',').map(function (v) {
    return v.trim();
  }) : isIntArray && typeof value === 'string' ? value.split(',').map(function (v) {
    return parseInt(v, 10);
  }) : isFloatArray && typeof value === 'string' ? value.split(',').map(function (v) {
    return parseFloat(v);
  }) : isBoolean && value === 'true' ? true : isBoolean && value === 'false' ? false : isNumber ? parseFloat(value) : isInteger ? parseInt(value, 10) : isLowercase ? ('' + value).toLowerCase() : value;

  if (isNumber && !isPrimitiveNumber(tryValue)) {
    tryValue = typeof numberFailure !== 'undefined' ? numberFailure : tryValue;
  }
  if (isInteger && !isPrimitiveNumber(tryValue)) {
    tryValue = typeof integerFailure !== 'undefined' ? integerFailure : tryValue;
  }
  var theValue = tryValue === value ? value : tryValue; // this prevents converting 0.00 to 0
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
    return typeof consolidateBy[value] !== 'undefined' ? consolidateBy[value] : value;
  }
  return value;
};

var asNum = function asNum(num, def) {
  console.warn('asNum is deprecated, please use "asNumber"');
  if (isPrimitiveNumber(num)) {
    return num;
  }
  var defResult = isPrimitiveNumber(def) ? def : null;
  return defResult;
};

var numberWithCommas = function numberWithCommas(x) {
  if (!isPrimitiveNumber(x)) {
    return '0';
  }
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

var trailingZeros = {
  '': true,
  '0': true,
  '00': true,
  '000': true,
  '0000': true,
  '00000': true
};

var leadingDecimals = {
  '.': true,
  '.0': true,
  '.00': true,
  '.000': true,
  '.0000': true,
  '.00000': true,
  '0': true,
  '0.': true,
  '0.0': true,
  '0.00': true,
  '0.000': true,
  '0.0000': true,
  '0.00000': true,
  '': true
};

var parseFloatInput = function parseFloatInput(value) {
  if (leadingDecimals[value]) {
    return value;
  }
  if (typeof value === 'string') {
    var arr = value.split('.');
    if (arr.length >= 1) {
      var num = parseFloat(value) || 0;
      if (trailingZeros[arr[1]]) {
        return num + '.' + arr[1];
      }
    }
  }
  var newVal = parseFloat(value);
  return isNaN(newVal) ? '' : newVal;
};

var parseEvent = function parseEvent(event) {
  var value = !event ? null : !event.target ? event : event.target.value ? event.target.value : event;
  return value;
};

var isValidHexAddress = function isValidHexAddress(str) {
  if (typeof str !== 'string') {
    return false;
  }
  if (str.length !== 4) {
    return false;
  }
  if (str[0] !== '0') {
    return false;
  }
  if (str[1] !== 'x') {
    return false;
  }
  var re = /[0-9A-Fa-f]/g;
  if (!re.test(str[2])) {
    return false;
  }
  re.lastIndex = 0;
  if (!re.test(str[3])) {
    return false;
  }
  return true;
};

var isValidIpAddress = function isValidIpAddress(str) {
  if (typeof str !== 'string') {
    return false;
  }
  // https://www.w3resource.com/javascript/form/ip-address-validation.php
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)) {
    return true;
  }
  return false;
};

var r5 = function r5(num) {
  return Math.round(num / 5) * 5;
};
var r10 = function r10(num) {
  return Math.round(num / 10) * 10;
};
var r20 = function r20(num) {
  return Math.round(num / 20) * 20;
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
    triggerSize: 999999,
    timestampFormat: null, // defaults to full time
    trueValue: 'true',
    falseValue: 'false',
    undefinedValue: 'undefined',
    nullValue: 'null'
    // dateOptions
  };
  var o = isObjectLiteral(options) ? Object.assign({}, defaultOptions, options) : defaultOptions;
  o.round = isPrimitiveNumber(o.round) ? o.round : defaultOptions.round;
  o.trueValue = typeof o.trueValue === 'string' ? o.trueValue : defaultOptions.trueValue;
  o.falseValue = typeof o.falseValue === 'string' ? o.falseValue : defaultOptions.falseValue;
  o.undefinedValue = typeof o.undefinedValue === 'string' ? o.undefinedValue : defaultOptions.undefinedValue;
  o.nullValue = typeof o.nullValue === 'string' ? o.nullValue : defaultOptions.nullValue;
  if (typeof data === 'string') {
    var timestamp = convertStringToTimestamp(data);
    if (isValidDate(timestamp)) {
      return convertTimestampToString(timestamp, o.timestampFormat);
    } else if (typeof o.stringLength === 'number') {
      return data.slice(0, o.stringLength);
    }
    return data;
  }
  if (typeof data === 'number') {
    return printNumber(data, o.triggerSize, o.round, o.nan);
  }
  if (isValidDate(data)) {
    return convertTimestampToString(data, o.timestampFormat);
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
    if (data) return o.trueValue;
    return o.falseValue;
  }
  if (data === undefined) {
    return o.undefinedValue;
  }
  if (data === null) {
    return o.nullValue;
  }
  return ':(';
};

var numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var lettersCaps = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
var lettersLower = lettersCaps.map(function (l) {
  return l.toLowerCase();
});
var letterCapsNumericHash = {};
var letterLowerNumericHash = {};
lettersCaps.forEach(function (l, i) {
  letterCapsNumericHash[l] = i + 1;
});
lettersLower.forEach(function (l, i) {
  letterLowerNumericHash[l] = i + 1;
});

var createAlphanumericArray = function createAlphanumericArray(options) {
  var o = options || {};
  var allCaps = !!o.allCaps && !o.allLower;
  var allLower = !!o.allLower && !o.allCaps;
  var capsFirst = !!o.capsFirst;
  var numbersLast = !!o.numbersLast;
  var onlyLetters = !!o.onlyLetters;
  var include0 = !!o.include0;
  var lettersArr = allCaps ? lettersCaps : allLower ? lettersLower : capsFirst ? [].concat(lettersCaps, _toConsumableArray(lettersLower)) : [].concat(_toConsumableArray(lettersLower), lettersCaps);
  var numbersArr = include0 ? numbers : numbers.slice(1, numbers.length);
  var fullArr = onlyLetters ? lettersArr : numbersLast ? [].concat(_toConsumableArray(lettersArr), _toConsumableArray(numbersArr)) : [].concat(_toConsumableArray(numbersArr), _toConsumableArray(lettersArr));
  return fullArr;
};

var numberToLetter = function numberToLetter(num) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var lower = !!options.lower; // default [backwards compatible] = caps
  var returnOnlyValid = !!options.returnOnlyValid;
  var lettersArr = lower ? lettersLower : lettersCaps;
  // 1-indexed, so 'A' = 1, not 0
  var theLetter = lettersArr[num - 1];
  if (returnOnlyValid) {
    if (num <= 0) {
      // negative
      return lettersArr[0];
    }
    if (!theLetter) {
      // not integer
      theLetter = lettersArr[precisionRound(num, 0) - 1];
    }
    if (!theLetter) {
      // exceeding 26
      theLetter = lettersArr[lettersArr.length - 1];
    }
  }
  return theLetter;
};

var letterToNumber = function letterToNumber(letter) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var returnOnlyValid = !!options.returnOnlyValid;
  if (typeof letter !== 'string') {
    return returnOnlyValid ? 0 : null;
  }
  var theNumber = letterCapsNumericHash[letter] || letterLowerNumericHash[letter];
  if (!theNumber && returnOnlyValid) {
    return 0;
  }
  return theNumber;
};

var isStringifiedNumber = function isStringifiedNumber(s) {
  var n = parseFloat(s);
  if ('' + s !== '' + n) {
    return;
  }
  return true;
};

// @@@@@@@@@@@@@@@ STRINGS @@@@@@@@@@@@@@@@

var titleCaseWord = function titleCaseWord(word, option) {
  // input: string
  // option: 'cC' if the string is snake_case and you want camelCase (returned as SnakeCase or CamelCase)
  // output: capitalized string
  if (typeof word !== 'string') {
    return;
  }
  var front = word.slice(0, 1);
  var end = word.slice(1, word.length);
  var doNotForceLowerCase = option && option.doNotForceLowerCase;
  var endCase = doNotForceLowerCase ? end : end.toLowerCase();
  var result = '' + front.toUpperCase() + endCase;
  return result;
};

var lowerCaseWord = function lowerCaseWord(word) {
  if (typeof word !== 'string') return '';
  var end = word.slice(1, word.length);
  var front = word.slice(0, 1);
  return '' + front.toLowerCase() + end;
};

var convertScToCc = function convertScToCc(word) {
  var divider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';
  var isPascal = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  // input: string in snake_case
  // disregards any other type of formatting, such as spaces and hyphens
  if (isPrimitiveNumber(word)) {
    return '' + word;
  }
  if (typeof word !== 'string') {
    return '';
  }
  var array = word.split(divider);
  var first = array[0];
  var firstLetter = isPascal ? titleCaseWord(first[0]) : first[0].toLowerCase();
  var endLetters = first.slice(1, first.length);
  var firstWord = '' + firstLetter + endLetters;
  var others = array.slice(1, array.length);
  var othersCamel = others.map(function (word) {
    return titleCaseWord(word);
  });
  var result = '' + firstWord + othersCamel.join('');
  return result;
};

var convertMixedStringToCc = function convertMixedStringToCc(word) {
  var isPascal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (typeof word !== 'string') {
    return '';
  }
  var re = /[^a-zA-Z0-9\d\s]/gi;
  var option = { doNotForceLowerCase: true };
  var conformedWord = word.replace(re, ' '); // all non alphanumeric to space
  var wordArr = conformedWord.split(' '); // split on spaces
  var filteredArr = wordArr.map(function (t) {
    return t.trim();
  }) // trim extra space
  .filter(function (t) {
    return t !== '';
  }) // remove cells with only empty spaces
  .map(function (t, i) {
    if (isPascal && i === 0) {
      return titleCaseWord(t, option);
    } else if (i === 0) {
      return t.toLowerCase();
    }
    return titleCaseWord(t, option);
  }); // all lowercase
  var camel = filteredArr.join('');
  return camel;
};

var caps = { A: true, B: true, C: true, D: true, E: true, F: true, G: true, H: true, I: true, J: true, K: true, L: true, M: true, N: true, O: true, P: true, Q: true, R: true, S: true, T: true, U: true, V: true, W: true, X: true, Y: true, Z: true };

var convertCcToSc = function convertCcToSc(word, divider) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  // Future efficiency improvement needed
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if (isPrimitiveNumber(word)) return '' + word;
  if (typeof word !== 'string') return '';
  var _divider = isPrimitiveNumber(divider) || typeof divider === 'string' ? divider : '_';
  var newWord = '';
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

var convertScToSpace = function convertScToSpace(word) {
  var divider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '_';
  var replacer = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ' ';

  if (typeof word !== 'string') return '';
  var split = word.split(divider);
  return split.join(replacer);
};

var convertPhraseToPath = function convertPhraseToPath(word) {
  if (typeof word !== 'string') return '';
  var noSpace = word.split(' ').join('-');
  var corrected = noSpace.replace(/[^a-z0-9-]/g, '');
  return corrected.toLowerCase();
};

var isValidEmail = function isValidEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
};

var tryToMakeInputSafe = function tryToMakeInputSafe(input) {
  var safeInput = JSON.parse(JSON.stringify(input));
  if (Array.isArray(safeInput.answers)) {
    safeInput.answers.forEach(function (a) {
      if (typeof a.answer === 'string' && a.answer.includes('\'')) {
        a.answer = a.answer.split('\'').join('');
      }
    });
  }
  ['name', 'company', 'email'].forEach(function (k) {
    if (typeof safeInput[k] === 'string' && safeInput[k].includes('\'')) {
      safeInput[k] = safeInput[k].split('\'').join('');
    }
  });
  return safeInput;
};

module.exports = {
  // types
  correctInputType: correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber: generateRandomNumber,
  numberToModNumber: numberToModNumber,
  printNumber: printNumber,
  asNum: asNum,
  numberWithCommas: numberWithCommas,
  parseFloatInput: parseFloatInput,
  parseEvent: parseEvent,
  isValidHexAddress: isValidHexAddress,
  isValidIpAddress: isValidIpAddress,
  r5: r5,
  r10: r10,
  r20: r20,
  // mixed types
  formatForPrint: formatForPrint,
  createAlphanumericArray: createAlphanumericArray,
  numberToLetter: numberToLetter,
  letterToNumber: letterToNumber,
  isStringifiedNumber: isStringifiedNumber,
  // strings
  titleCaseWord: titleCaseWord,
  lowerCaseWord: lowerCaseWord,
  convertScToCc: convertScToCc,
  convertCcToSc: convertCcToSc,
  convertMixedStringToCc: convertMixedStringToCc,
  convertScToSpace: convertScToSpace,
  convertPhraseToPath: convertPhraseToPath,
  isValidEmail: isValidEmail,
  tryToMakeInputSafe: tryToMakeInputSafe
};