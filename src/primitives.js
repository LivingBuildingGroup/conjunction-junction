'use strict';
const { 
  convertStringToTimestamp,
  convertTimestampToString,
  isValidDate }       = require('./date-time');
const { 
  isPrimitiveNumber,
  precisionRound,
  isObjectLiteral }   = require('./basic');

// @@@@@@@@@@@@@@@ TYPES @@@@@@@@@@@@@@@@

const correctInputType = (value, key='', options={}) => {
  // ADD A LOWER BIG-O OPTION TO PASS IN AN OBJECT WITH:
  // { key: type, key: type}
  // Get data from input field and convert to a specified type
  const numberKeysSignatures  = Array.isArray(options.numberSignatures)  ? options.numberSignatures  : ['number','Lbs','nessIn','Sf','Cf','idSlope'];
  const integerKeysSignatures = Array.isArray(options.integerSignatures) ? options.integerSignatures : ['integer','idComponent','idProfile','idCassette', 'idStorm','idTest','initialPlantHealth'];
  const booleanKeysSignatures = Array.isArray(options.booleanSignatures) ? options.booleanSignatures : ['omit'];
  const lowercaseKeysSignatures = Array.isArray(options.lowercaseSignatures) ? options.lowercaseSignatures : [];
  const stringArraySignatures = Array.isArray(options.stringArraySignatures) ? options.stringArraySignatures : [];
  const floatArraySignatures = Array.isArray(options.floatArraySignatures) ? options.floatArraySignatures : [];
  const intArraySignatures = Array.isArray(options.intArraySignatures) ? options.intArraySignatures : [];
  const integerFailure = options.integerFailure;
  const numberFailure = options.numberFailure;

  let isNumber = false;
  let isInteger = false;
  let isBoolean = false;
  let isLowercase = false;
  let isStringArray = false;
  let isFloatArray = false;
  let isIntArray = false;

  let exactMatchFound = false;

  if(!exactMatchFound){
    stringArraySignatures.forEach(sig=>{
      if(key === sig) { isStringArray = true; exactMatchFound = true; }
  	});
  }
  if(!exactMatchFound){
    floatArraySignatures.forEach(sig=>{
      if(key === sig) { isFloatArray = true; exactMatchFound = true; }
  	});
  }
  if(!exactMatchFound){
    intArraySignatures.forEach(sig=>{
      if(key === sig) { isIntArray = true; exactMatchFound = true; }
  	});
  }
  if(!exactMatchFound){
    booleanKeysSignatures.forEach(sig=>{
    	if(key === sig) { isBoolean = true; exactMatchFound = true; }
  	});
  }
  if(!exactMatchFound){
    numberKeysSignatures.forEach(sig=>{
    	if(key === sig) { isNumber = true; exactMatchFound = true; }
 	  });
  }
  if(!exactMatchFound){
    integerKeysSignatures.forEach(sig=>{
    	if(key === sig) { isInteger = true; exactMatchFound = true; }
  	});
  }
  if(!exactMatchFound){
    lowercaseKeysSignatures.forEach(sig=>{
    	if(key === sig) { isLowercase = true; exactMatchFound = true; }
    });
  }

  if(!exactMatchFound){
    stringArraySignatures.forEach(sig=>{
      if(typeof key === 'string' && key.includes(sig)) {
        isStringArray = true;
      }
    });
    floatArraySignatures.forEach(sig=>{
      if(typeof key === 'string' && key.includes(sig)) {
        isFloatArray = true;
      }
    });
    intArraySignatures.forEach(sig=>{
      if(typeof key === 'string' && key.includes(sig)) {
        isIntArray = true;
      }
    });
    booleanKeysSignatures.forEach(sig=>{
      if(typeof key === 'string' && key.includes(sig)) {
        isBoolean = true;
      }
    });
    if(!isBoolean){
      numberKeysSignatures.forEach(sig=>{
        if(typeof key === 'string' && key.includes(sig)) {
          isNumber = true;
        }
      });
    }
    if(!isNumber && !isBoolean){
      integerKeysSignatures.forEach(sig=>{
        if(typeof key === 'string' && key.includes(sig)) {
          isInteger = true;
        }
      });
    }
    if(!isNumber && !isBoolean && !isInteger){
      lowercaseKeysSignatures.forEach(sig=>{
        if(typeof key === 'string' && key.includes(sig)) {
          isLowercase = true;
        }
      });
    }
  }

  let tryValue = 
  isStringArray && typeof value === 'string' ? value.split(',').map(v=>v.trim()) :
    isIntArray && typeof value === 'string' ? value.split(',').map(v=>parseInt(v, 10)) :
      isFloatArray && typeof value === 'string' ? value.split(',').map(v=>parseFloat(v)) :
        isBoolean && value === 'true' ? true :
          isBoolean && value === 'false' ? false :
            isNumber ? parseFloat(value) :
              isInteger ? parseInt(value, 10) :
                isLowercase ? `${value}`.toLowerCase() :
                  value ;

  if(isNumber && !isPrimitiveNumber(tryValue)){
    tryValue = typeof numberFailure !== 'undefined' ? numberFailure : tryValue;
  }
  if(isInteger && !isPrimitiveNumber(tryValue)){
    tryValue = typeof integerFailure !== 'undefined' ? integerFailure : tryValue;
  }
  const theValue = tryValue === value ? value : tryValue; // this prevents converting 0.00 to 0
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

const printNumber = (num, triggerSize = 999000, round = 2, nan='') => {
  return !isPrimitiveNumber(num)  ?
    nan :
    num >= triggerSize ?
      String.fromCharCode(8734) : // infinity
      precisionRound(num, round);
};

const numberToModNumber = (value, consolidateBy) => {
  // consolidate as in consolidate values from a range into a single value that can be used as an exact match
  // e.g. 22, 23, 24, 25, 26 consolidated by 5 = 20, 20, 20, 25, 25
  if(!consolidateBy) {
    return value;
  }
  if(isPrimitiveNumber(consolidateBy) && isPrimitiveNumber(value)){
    return consolidateBy === 0 ? 0 :
      precisionRound(Math.floor(value/consolidateBy) * consolidateBy, 2);
  }
  if(isObjectLiteral(consolidateBy)){
    return typeof consolidateBy[value] !== 'undefined' ?
      consolidateBy[value] :
      value;
  }
  return value;
};

const asNum = (num,def) => {
  console.warn('asNum is deprecated, please use "asNumber"');
  if(isPrimitiveNumber(num)){
    return num;
  }
  const defResult = isPrimitiveNumber(def) ? def : null ;
  return defResult;
};

const numberWithCommas = x => {
  if(!isPrimitiveNumber(x)){
    return '0';
  }
  const parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const trailingZeros = {
  ''      : true, 
  '0'     : true, 
  '00'    : true, 
  '000'   : true, 
  '0000'  : true, 
  '00000' : true, 
};

const leadingDecimals = {
  '.'      : true, 
  '.0'     : true, 
  '.00'    : true, 
  '.000'   : true, 
  '.0000'  : true, 
  '.00000' : true, 
  '0'      : true, 
  '0.'     : true, 
  '0.0'    : true, 
  '0.00'   : true,
  '0.000'  : true,
  '0.0000' : true,
  '0.00000': true,
  ''       : true,
};

const parseFloatInput = value => {
  if(leadingDecimals[value]){
    return value;
  }
  if(typeof value === 'string'){
    const arr = value.split('.');
    if(arr.length >= 1){
      const num = parseFloat(value) || 0;
      if(trailingZeros[arr[1]]){
        return `${num}.${arr[1]}`;
      }
    }
  }
  const newVal = parseFloat(value);
  return isNaN(newVal) ? '' : newVal;
};

const parseEvent = event => {
  const value = !event ? null :
    !event.target ? event :
      event.target.value ? event.target.value :
        event;
  return value;
};

const isValidHexAddress = str => {
  if(typeof str !== 'string'){
    return false;
  }
  if(str.length !== 4){
    return false;
  }
  if(str[0] !== '0'){
    return false;
  }
  if(str[1] !== 'x'){
    return false;
  }
  const re = /[0-9A-Fa-f]/g;
  if(!re.test(str[2])){
    return false;
  }
  re.lastIndex = 0;
  if(!re.test(str[3])){
    return false;
  }
  return true;
};

const isValidIpAddress = str => { 
  if(typeof str !== 'string'){
    return false;
  }
  // https://www.w3resource.com/javascript/form/ip-address-validation.php
  if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(str)){
    return true;
  }
  return false;
};

const r5 = num => {
  return Math.round(num/5) * 5;
};
const r10 = num => {
  return Math.round(num/10) * 10;
};
const r20 = num => {
  return Math.round(num/20) * 20;
};

// @@@@@@@@@@@@@@@ MIXED TYPES @@@@@@@@@@@@@@@@

const formatForPrint = (data, options) => {    //plan to deprecate this, continue function but rename
  const defaultOptions = {
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
    nullValue: 'null',
    // dateOptions
  };
  const o = isObjectLiteral(options) ?
    Object.assign({},defaultOptions, options) : 
    defaultOptions ;
  o.round         = isPrimitiveNumber(o.round)         ? o.round         : defaultOptions.round ;
  o.trueValue     = typeof o.trueValue    === 'string' ? o.trueValue     : defaultOptions.trueValue ;
  o.falseValue    = typeof o.falseValue   === 'string' ? o.falseValue    : defaultOptions.falseValue ;
  o.undefinedValue= typeof o.undefinedValue==='string' ? o.undefinedValue: defaultOptions.undefinedValue ;
  o.nullValue     = typeof o.nullValue    === 'string' ? o.nullValue     : defaultOptions.nullValue ;
  if(typeof data === 'string') {
    const timestamp = convertStringToTimestamp(data);
    if(isValidDate(timestamp)){
      return convertTimestampToString(timestamp, o.timestampFormat);
    } else if(typeof o.stringLength === 'number') {
      return data.slice(0, o.stringLength);
    }
    return data;
  }
  if(typeof data === 'number') {
    return printNumber(data, o.triggerSize, o.round, o.nan);
  }
  if(isValidDate(data)){
    return convertTimestampToString(data, o.timestampFormat);
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
    if(data) return o.trueValue;
    return o.falseValue;
  }
  if(data === undefined) {
    return o.undefinedValue;
  }
  if(data === null){
    return o.nullValue;
  }
  return ':(';
};

const numbers = [0,1,2,3,4,5,6,7,8,9];
const lettersCaps = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
const lettersLower = lettersCaps.map(l=>l.toLowerCase());
const letterCapsNumericHash = {};
const letterLowerNumericHash = {};
lettersCaps.forEach((l,i)=>{
  letterCapsNumericHash[l] = i+1;
});
lettersLower.forEach((l,i)=>{
  letterLowerNumericHash[l] = i+1;
});

const createAlphanumericArray = options => {
  const o = options || {};
  const allCaps     = !!o.allCaps && !o.allLower;
  const allLower    = !!o.allLower && !o.allCaps;
  const capsFirst   = !!o.capsFirst;
  const numbersLast = !!o.numbersLast;
  const onlyLetters = !!o.onlyLetters;
  const include0    = !!o.include0;
  const lettersArr  = 
    allCaps ? lettersCaps :
      allLower ? lettersLower :
      capsFirst ?
        [...lettersCaps, ...lettersLower] :
        [...lettersLower, ...lettersCaps];
  const numbersArr = include0 ?
    numbers : 
    numbers.slice(1,numbers.length) ;
  const fullArr = onlyLetters ?
    lettersArr: 
    numbersLast ?
      [...lettersArr, ...numbersArr] :
      [...numbersArr, ...lettersArr] ;
  return fullArr;
};

const numberToLetter = (num, options={}) => {
  const lower = !!options.lower; // default [backwards compatible] = caps
  const returnOnlyValid = !!options.returnOnlyValid;
  const lettersArr = lower ? lettersLower : lettersCaps;
  // 1-indexed, so 'A' = 1, not 0
  let theLetter = lettersArr[num-1];
  if(returnOnlyValid){
    if(num <= 0){ // negative
      return lettersArr[0];
    }
    if(!theLetter){ // not integer
      theLetter = lettersArr[precisionRound(num, 0)-1];
    }
    if(!theLetter){ // exceeding 26
      theLetter = lettersArr[lettersArr.length-1];
    }
  }
  return theLetter;
};

const letterToNumber = (letter, options={}) => {
  const returnOnlyValid = !!options.returnOnlyValid;
  if(typeof letter !== 'string'){
    return returnOnlyValid ? 0 : null ;
  }
  let theNumber = letterCapsNumericHash[letter] || letterLowerNumericHash[letter];
  if(!theNumber && returnOnlyValid){
    return 0;
  }
  return theNumber;
};

const isStringifiedNumber = s => {
  const n = parseFloat(s);
  if(`${s}` !== `${n}`){
    return;
  }
  return true;
};

// @@@@@@@@@@@@@@@ STRINGS @@@@@@@@@@@@@@@@

const titleCaseWord = (word, option) => {
  // input: string
  // option: 'cC' if the string is snake_case and you want camelCase (returned as SnakeCase or CamelCase)
  // output: capitalized string
  if(typeof word !== 'string') {
    return;
  }
  const front = word.slice(0,1);
  const end = word.slice(1,word.length);
  const doNotForceLowerCase = option && option.doNotForceLowerCase;
  const endCase = doNotForceLowerCase ? end : end.toLowerCase() ;
  const result = `${front.toUpperCase()}${endCase}`;
  return result;
};

const lowerCaseWord = word => {
  if(typeof word !== 'string') return '';
  const end = word.slice(1,word.length);
  const front = word.slice(0,1);
  return `${front.toLowerCase()}${end}`;
};

const convertScToCc = (word, divider='_', isPascal=false) => {
  // input: string in snake_case
  // disregards any other type of formatting, such as spaces and hyphens
  if(isPrimitiveNumber(word)) {
    return `${word}`;
  }
  if(typeof word !== 'string') {
    return '';
  }
  const array = word.split(divider);
  const first = array[0];
  const firstLetter = isPascal ? titleCaseWord(first[0]) : first[0].toLowerCase();
  const endLetters = first.slice(1,first.length);
  const firstWord = `${firstLetter}${endLetters}`;
  const others = array.slice(1,array.length);
  const othersCamel = others.map(word=>titleCaseWord(word));
  const result = `${firstWord}${othersCamel.join('')}`;
  return result;
};

const convertMixedStringToCc = (word, isPascal=false) => {
  if(typeof word !== 'string') {
    return '';
  }
  const re = /[^a-zA-Z0-9\d\s]/gi;
  const option = {doNotForceLowerCase: true};
  const conformedWord = word.replace(re, ' '); // all non alphanumeric to space
  const wordArr = conformedWord.split(' '); // split on spaces
  const filteredArr = wordArr.map(t=>t.trim()) // trim extra space
    .filter(t=>t!=='') // remove cells with only empty spaces
    .map((t,i)=>{
      if(isPascal && i===0){
        return titleCaseWord(t, option);
      } else if(i===0){
        return t.toLowerCase();
      }
      return titleCaseWord(t, option);
    }); // all lowercase
  const camel = filteredArr.join('');
  return camel;
};

const caps  = {A:true,B:true,C:true,D:true,E:true,F:true,G:true,H:true,I:true,J:true,K:true,L:true,M:true,N:true,O:true,P:true,Q:true,R:true,S:true,T:true,U:true,V:true,W:true,X:true,Y:true,Z:true};

const convertCcToSc = (word, divider, options={}) => {
  // Future efficiency improvement needed
  // input: string in camelCase
  // disregards any other type of formatting, such as spaces and hyphens
  if(isPrimitiveNumber(word)) return `${word}`;
  if(typeof word !== 'string') return '';
  const _divider = isPrimitiveNumber(divider) || typeof divider === 'string' ?
    divider : '_';
  let newWord = '';
  let numbers;
  if(options.numbers){
    numbers = {};
    for(let i=0;i<=9;i++){
      numbers[`${i}`] = true;
    }
  }
  let lastWasLetter;
  for(let i=0; i<= word.length; i++ ) {
    const c = word.charAt(i);
    const char =
      caps[c] ?
        `${_divider}${c.toLowerCase()}` :
        numbers && numbers[c] && lastWasLetter ?
          `${divider}${c}` :
          c;
    if(numbers && !numbers[c]){
      lastWasLetter = true;
    }
    newWord += char;
  }
  return newWord;
};

const convertScToSpace = (word, divider='_', replacer=' ') => {
  if(typeof word !== 'string') return '';
  const split = word.split(divider);
  return split.join(replacer);
};

const convertPhraseToPath = word => {
  if(typeof word !== 'string') return '';
  const noSpace = word.split(' ').join('-');
  const corrected = noSpace.replace(/[^a-z0-9-]/g, '');
  return corrected.toLowerCase();
};

const isValidEmail = mail => {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
    return true;
  }
  return false;
};

const tryToMakeInputSafe = input => {
  const safeInput = JSON.parse(JSON.stringify(input));
  if(Array.isArray(safeInput.answers)){
    safeInput.answers.forEach(a=>{
      if(typeof a.answer === 'string' && a.answer.includes('\'')){
        a.answer = a.answer.split('\'').join('');
      }
    });
  }
  ['name','company','email'].forEach(k=>{
    if(typeof safeInput[k] === 'string' &&  safeInput[k].includes('\'')){
      safeInput[k] =  safeInput[k].split('\'').join('');
    }
  });
  return safeInput;
};

module.exports = { 
  // types
  correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber,
  numberToModNumber,
  printNumber,
  asNum,
  numberWithCommas,
  parseFloatInput,
  parseEvent,
  isValidHexAddress,
  isValidIpAddress,
  r5,
  r10,
  r20,
  // mixed types
  formatForPrint,
  createAlphanumericArray,
  numberToLetter,
  letterToNumber,
  isStringifiedNumber,
  // strings
  titleCaseWord, 
  lowerCaseWord,
  convertScToCc,
  convertCcToSc,
  convertMixedStringToCc,
  convertScToSpace,
  convertPhraseToPath,
  isValidEmail,
  tryToMakeInputSafe,
};