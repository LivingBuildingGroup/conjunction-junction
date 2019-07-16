'use strict';
const { convertStringToTimestamp,
  convertTimestampToString,
  isValidDate,
  dateDelta }       = require('./date-time');
const { isPrimitiveNumber,
  precisionRound,
  isObjectLiteral } = require('./basic');

// @@@@@@@@@@@@@@@ TYPES @@@@@@@@@@@@@@@@

const correctInputType = (value, key='', options={}) => {
  // ADD A LOWER BIG-O OPTION TO PASS IN AN OBJECT WITH:
  // { key: type, key: type}
  // Get data from input field and convert to a specified type
  const numberKeysSignatures  = Array.isArray(options.numberSignatures) ? options.numberSignatures   : ['number','Lbs','nessIn','Sf','Cf','idSlope'];
  const integerKeysSignatures = Array.isArray(options.integerSignatures) ? options.integerSignatures : ['integer','idComponent','idProfile','idCassette', 'idStorm','idTest','initialPlantHealth'];
  let isNumber = false;
  let isInteger = false;
  numberKeysSignatures.forEach(sig=>{
    if(key.includes(sig)) isNumber = true;
  });
  if(!isNumber){
    integerKeysSignatures.forEach(sig=>{
      if(key.includes(sig)) isInteger = true;
    });
  }
  const tryValue = 
  isNumber ? parseFloat(value)  :
    isInteger ? parseInt(value, 10):
      value ;
  // the line below prevents converting 0.00 to 0
  const theValue = tryValue === value ? value : tryValue;
  return theValue;
};

// @@@@@@@@@@@@@@@ NUMBERS @@@@@@@@@@@@@@@@

const generateRandomNumber = (lower, upper) => {
  const pct  = Math.random();  // percent of span to use, i.e. the random number 0 to < 1
  const span = upper - lower;  // span, e.g. lower of 50 and upper of 100 = span of 50
  const dist = pct * span ;    // distance of span, e.g. if random number is .10, and span is 50, then use 10% of the span, or 5
  const ran  = lower + dist ;  // new random number, corrected for the lower range, e.g. if dist is 5, and lower range is 50, then our random number is 55 (lower range + the distance up that range)
  const num  = Math.ceil(ran); // ceiling so we get an integer; since Math.random() is exclusive of 1, the ceiling allows to hit the bottom range at 0, and upper range at 0.99999...; optionally we could accept a parameter to allow this to be a specific decimaml
  return num;
};

// @@@@@@@@@@@@@@@ MIXED TYPES @@@@@@@@@@@@@@@@

const print = (data, options) => {
  const defaultOptions = {
    round: 4,
    arrays: true,
    stringLength: 250,
    object: ':(',
    nan: 'NaN',
  };
  const o = isObjectLiteral(options) ?
    Object.assign({},options, defaultOptions) : 
    defaultOptions ;
  const trueValue     = typeof o.trueValue    === 'string' ? o.trueValue    : 'true' ;
  const falseValue    = typeof o.falseValue   === 'string' ? o.falseValue   : 'false' ;
  const undefinedValue= typeof o.undefinedValue==='string' ? o.undefinedValue:'undefined' ;
  const nullValue     = typeof o.nullValue    === 'string' ? o.nullValue    : 'null' ;
  if(typeof data === 'string') {
    const timestamp = convertStringToTimestamp(data);
    if(isValidDate(timestamp)){
      const dateOptions = isObjectLiteral(o.dateOptions) ? 
        o.dateOptions : null ;
      return convertTimestampToString(timestamp, dateOptions);
    } else if(typeof o.stringLength === 'number') {
      return data.slice(0, o.stringLength);
    }
    return data;
  }
  if(typeof data === 'number') {
    if(typeof o.round === 'number'){
      return precisionRound(data, o.round);
    }
    return isPrimitiveNumber(data) ? data : o.nan;
  }
  if(isValidDate(data)){
    return convertTimestampToString(data);
  }
  if(Array.isArray(data)){
    if(o.arrays) {
      const arrayToString = data.join(', ');
      if(typeof o.stringLength === 'number') {
        return arrayToString.slice(0, o.stringLength);
      }
      return arrayToString;
    }
  }
  if(isObjectLiteral(data)) {
    return o.object;
  }
  if(typeof data === 'boolean'){
    if(data) return trueValue;
    return falseValue;
  }
  if(data === undefined) {
    return undefinedValue;
  }
  if(data === null){
    return nullValue;
  }
  return ':(';
};

const numberToLetter = (num, option) => {
  // 1-indexed, not 0-indexed, so subtract 1
  // move to conjunction-junction
  // make A if neg, Z if over
  // round number
  // exercise option for caps or lowercase
  const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  const rawLetter = letters[num-1];
  return rawLetter;
};

// @@@@@@@@@@@@@@@ STRINGS @@@@@@@@@@@@@@@@

const titleCaseWord = (word, option) => {
  // input: string
  // option: 'cC' if the string is snake_case and you want camelCase (returned as SnakeCase or CamelCase)
  // output: capitalized string
  if(typeof word !== 'string') return;
  const end = word.slice(1,word.length);
  const endCase = option === 'cC' ? convertScToCc(end) : end ;
  const front = word.slice(0,1);
  return `${front.toUpperCase()}${endCase}`;
};

const lowerCaseWord = word => {
  if(typeof word !== 'string') return;
  const end = word.slice(1,word.length);
  const front = word.slice(0,1);
  return `${front.toLowerCase()}${end}`;
};

const convertScToCc = word => {
  // input: string in snake_case
  // disregards any other type of formatting, such as spaces and hyphens
  if(isPrimitiveNumber(word)) return `${word}`;
  if(typeof word !== 'string') return '';
  const array = word.split('_');
  const first = array[0];
  const others = array.slice(1,array.length);
  const othersCamel = others.map(word=>titleCaseWord(word));
  return `${first}${othersCamel.join('')}`;
};

const convertCcToSc = word => {
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if(isPrimitiveNumber(word)) return `${word}`;
  if(typeof word !== 'string') return '';
  // const theWord = 'theWord';
  let newWord = '';
  const caps  = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  const lower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; 
  for(let i=0; i<= word.length; i++ ) {
    const char =
      caps.includes(word.charAt(i)) ?
        `_${lower[caps.findIndex(letter=>letter===word.charAt(i))]}`
        : word.charAt(i);
    newWord += char;
  }
  return newWord;
};

const convertCcToSpace = word => {
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if(isPrimitiveNumber(word)) return `${word}`;
  if(typeof word !== 'string') return '';
  // const theWord = 'theWord';
  let newWord = '';
  const caps  = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  const lower = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']; 
  for(let i=0; i<= word.length; i++ ) {
    const char =
      caps.includes(word.charAt(i)) ?
        ` ${lower[caps.findIndex(letter=>letter===word.charAt(i))]}`
        : word.charAt(i);
    newWord += char;
  }
  return newWord;
};

const convertScToSpace = word => {
  if(typeof word !== 'string') return;
  const split = word.split('_');
  return split.join(' ');
};

module.exports = { 
  // types
  correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber,
  // mixed types
  print,
  numberToLetter,
  // strings
  titleCaseWord, 
  lowerCaseWord,
  convertScToCc,
  convertCcToSc,
  convertCcToSpace,
  convertScToSpace,
};