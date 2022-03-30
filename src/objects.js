'use strict';
const { 
  convertTimestampToString,
  dateDelta }         = require('./date-time');
const { isPrimitiveNumber,
  precisionRound,
  isObjectLiteral }   = require('./basic');
const { convertScToCc,
  titleCaseWord,
  convertCcToSc }     = require('./primitives');
const { isValidDate } = require('./date-time');
// @@@@@@@@@@@@@@@ OBJECT KEYS @@@@@@@@@@@@@@@@

const convertObjectKeyCase = (object, caseOption='cC') => {
  if(!isObjectLiteral(object)) return {};
  const c = 
    caseOption === 'cC' ? 'cC' : 
      caseOption === 'camel' ? 'cC' :
        'Sc';
  const newObject = {};
  for(let key in object){
    if(c==='cC'){
      const newKey = key.includes('_') ?
        convertScToCc(key) : key ;
      newObject[newKey] = object[key];
    } else {
      const newKey = convertCcToSc(key);
      newObject[newKey] = object[key];
    }
  }
  return newObject;
};

const prefixObjectKeys = (object, prefix) => {
  if(!isObjectLiteral(object) || typeof prefix !== 'string') {
    return {} ;
  }
  const newObject = {};
  for(let key in object){
    newObject[`${prefix}${titleCaseWord(key)}`] = object[key];
  }
  return newObject;
};

const shiftObjectKeysColumn = (object, keys, key, position1, position2) => {
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
  if(!isObjectLiteral(keys)) {
    console.error('shiftObjectKeysColumn FAILED: keys is not instanceof Object');
    return{};
  }
  if(!(Array.isArray(keys[key]))) {
    console.error(`shiftObjectKeysColumn FAILED: keys[${key}] is not an array`);
    return{};
  }
  if(!(Array.isArray(keys[key][0]))){
  // position 1 must be a number, and must be valid index
    console.error(`shiftObjectKeysColumn FAILED: keys[${key}][0] is an array`);
    return {};
  }
  if(isNaN(position1) || isNaN(position2)) {
    console.error(`shiftObjectKeysColumn FAILED: ${position1} or ${position2} is NaN`);
    return {};
  }
  if(typeof keys[key][0][position1] !== 'string') {
    console.error(`shiftObjectKeysColumn FAILED: keys[${key}][0][${position1}] is a not string (${keys[key][0][position1]})`);
    return{};
  }
  if(typeof keys[key][0][position2] !== 'string') {
    console.error(`shiftObjectKeysColumn FAILED: keys[${key}][0][${position2}] is a not string (${keys[key][0][position2]})`);
    return {};
  }
  if(object instanceof Object){
    let newObject = {};

    keys[key].forEach(rowOfKeys=>{
      if(object[rowOfKeys[position1]] !== undefined) {
        newObject[rowOfKeys[position2]] = object[rowOfKeys[position1]];
      }
    });
    return newObject;

  } else {
    return {};
  }

};

const shiftArrayKeysColumn = (array, keys, key, position1, position2) => {
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
  if(!Array.isArray(array))        return [];
  if(!isObjectLiteral(keys))       return [];
  if(typeof key !== 'string')      return array;
  if(!isPrimitiveNumber(position1))return array;
  if(!isPrimitiveNumber(position2))return array;
  if(!Array.isArray(keys[key]))    return array;
  const keyMap = {};
  keys[key].forEach(row=>{
    keyMap[row[position1]] = row[position2];
  });
  const newArray = array.map(string=>keyMap[string]);
  return newArray;
};

const getKeyArray = input => {
  // input: key to look up in keys, 1 or 2 positions in the array of keys
  // output: array of keys  
  if(!isObjectLiteral(input)) return [];
  const {keys, key, action, position1, position2, match} = input;
  // keys must be an object
  if(!isObjectLiteral(keys)) return [];
  // key within keys must be array of arrays
  if(!(Array.isArray(keys[key]))) return [];
  if(!(Array.isArray(keys[key][0]))) return [];
  // position 1 must be a number, and must be valid index
  if(!isPrimitiveNumber(position1)) return [];
  if(!(keys[key][0][position1])) return [];
  // position 2 can be undefined, but if defined, must be a number and must exist
  if(position2 !== undefined){
    if(!isPrimitiveNumber(position2)) return [];
    if(keys[key][0][position2]===undefined) return [];
  }
  // decipher action
  const column1 = // column 1 must be a field; check first line only
    typeof keys[key][0][position1] === 'string' ? 'field' : null ;
  const column2 = 
    !action ? 'list' :
      action === 'list' ? 'list' :
        position2 === undefined ? 'list' :
          action;

  if(column1 !== 'field') return [];
  // six possible actions
  if(column2 === 'list') { // returns a list of keys in this column
    return keys[key].map(array=>array[position1]);
  }
  /* new version of list
    const list = [];
    for(let field in keys[table]){
      list.push(field);
    }
    return list;
  */
  if(column2 === 'match') { // returns a filtered list of keys (use position 1 if position 2 is an exact match to match)
    let newArray = [];
    keys[key].forEach(array=>{
      if(array[position2] === match) newArray.push(array[position1]);
    });
    return newArray;
  }
  /* DO NOT THINK WE ARE USING THIS
    new version ?
  */
  if(column2 === 'filter') { // returns a filtered list of keys (use position 1 if position 2 is truthy)
    let newArray = [];
    keys[key].forEach(array=>{
      if(array[position2]) newArray.push(array[position1]);
    });
    return newArray;
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
  if(column2 === 'reverse filter') { // returns a filtered list of keys (use position 1 if position 2 is falsey)
    let newArray = [];
    keys[key].forEach(array=>{
      if(!array[position2]) newArray.push(array[position1]);
    });
    return newArray;
  }
  /* eliminate the above */
  if(column2 === 'field') { // returns a list of keys AS other keys
    return keys[key].map(array=>{
      if(array[position1]===array[position2]) return array[position1];
      return `${array[position1]} as ${array[position2]}`;
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
  if(column2 === 'object list') { // similar to above, but returns an object with the key as position 1, and value as the value of position 2 
    let newObject = {};
    keys[key].forEach(array=>{
      if(array[position2] instanceof Object) newObject[array[position1]] = array[position2];
    });
    return newObject;
  } // eliminate the above
  return [];
};

const validateObjectKeysPresent = (object, arrayOfKeys) => {
  if(!Array.isArray(arrayOfKeys)) return {
    message: 'Missing array of keys',
  };
  if(!isObjectLiteral(object)) return {
    message: 'Invalid input',
  };
  const missingField = arrayOfKeys.find(key => (!(key in object)));
  if (missingField) {
    const response = {
      message: 'Missing field',
      location: missingField
    };
    return response;
  }
  return 'ok';
};

const validateObjectKeys = (object, type, rowOfKeys) => { // type = new or existing
  if(!isObjectLiteral(object)) return {
    message: 'Invalid input',
  };
  // input: object to validate
  // input: type: new or not
  // input: rowOfKeys: array of keys to check against.
  // checks object to ensure all keys are present.
  // output: ok if validated, else response object identifying missing keys
  if(!(Array.isArray(rowOfKeys))) return 'ok';
  if(rowOfKeys.length <= 0) return 'ok';
  const isPresent = type === 'new' ?
    validateObjectKeysPresent(object, rowOfKeys) :
    'ok';
  if (isPresent !== 'ok' && type === 'new') {
    return isPresent; 
  } else {
    return 'ok';
  }
};

const limitObjectKeys = (object, limitingKeys) => {
  if(!isObjectLiteral(object)) return {};
  if(!Array.isArray(limitingKeys)) return object;
  const limitedObject = {};
  for(let key in object){
    if(limitingKeys.includes(key)){
      limitedObject[key] = object[key];
    }
  }
  return limitedObject;
};

const parseValuesObj2Levels = (query, object, searchInKey, returnKey) => {
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
  
  let focusId = 0; // so we default to something vs undefined
  for (let key in object) {
    if (object[key][searchInKey] === query) {
      focusId = object[key][returnKey];
    }
  }
  return focusId;
};

// @@@@@@@@@@@@@@@ OBJECTS & ARRAYS @@@@@@@@@@@@@@@@

const roundAllValues = (value, roundingKey, key) => {
  // roundingKey e.g. { height: 1, width: 3, area: 2} = round height to 1 decimal place, round width to 3 decimal places, etc.
  if(isPrimitiveNumber(value)){
    if(isPrimitiveNumber(roundingKey[key])){
      return precisionRound(value, roundingKey[key]);
    } else if(isPrimitiveNumber(roundingKey.default)){
      return precisionRound(value, roundingKey.default);
    } else {
      return value;
    }
  } else if(typeof value === 'string'){
    return value;
  } else if(Array.isArray(value)){
    return value.map(v=>{
      return roundAllValues(v, roundingKey, key);
    });
  } else if(isObjectLiteral(value)){
    const returnObject = {};
    for(let k in value){
      returnObject[k] = roundAllValues(value[k], roundingKey, k);
    }
    return returnObject;
  }
  return value;
};

const parseValuesFromArrayOfObj1Level=(array,key)=>{
  // input: [ {key: 1, random: 6}, {key: 2, other: 5} ], 'key'  
  // output [1,2]
  if (Array.isArray(array)) {
    return array.map(item=>item[key]);
  }
  return [];
};

const convertArrayToObject = (array, key='id')=>{
  // input: [ {id:0}, {id:1} ]      output {0:{},1:{}}
  const newObject = {};
  if (Array.isArray(array)) {
    array.forEach(obj=>{
      if(isObjectLiteral(obj)){
        newObject[`${obj[key]}`] = obj;
      }
    });
    return newObject;
  }
  return {};
};

const convertObjectToArray = object =>{
  // input {0:{},1:{}}         output: [ {}, {} ]      
  const newArray = [];
  if (typeof object === 'object' && !Array.isArray(object)) {
    for (let prop in object) {
      newArray.push(object[prop]);
    }
    return newArray;
  }
  return [];
};

const subArrayByKey = (array, groupBy) => {
  if(!Array.isArray(array) || typeof groupBy !== 'string'){
    return {
      groupBy,
      arrayOfDataGroups: [],
      arrayOfKeys: [],
      arraysOfDataObjects: [{}],
    };
  }
  const dGs = [];
  const dOs = [];
  const kO  = {};
  array.forEach(item=>{
    const index = dGs.findIndex(v=>v===item[groupBy]);
    if(index >= 0){
      dOs[index].push(item);
    } else {
      dOs.push([]);
      dOs[dOs.length-1].push(item);
      dGs.push(item[groupBy]);
    }
    for(let k in item){
      if(!kO[k]) kO[k] = true;
    }
  });
  const keys = [];
  for(let k in kO){
    keys.push(k);
  }
  keys.sort();
  return {
    groupBy,
    arraysOfDataObjects: dOs,
    arrayOfDataGroups: dGs,
    arrayOfKeys: keys,
  };
};

const totalValuesByKey = (arrayOfObjects, key) => {
  console.error('totalValuesByKey is deprecated, convert to summarizeValuesByKey.tot');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: sum of all values of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if(!Array.isArray(arrayOfObjects)) return {value: null, message: 'no array of objects'};
  if(typeof key !== 'string') return {value: null, message: 'key must be a string'};
  let value = 0;
  const messages = arrayOfObjects.map((o,i)=>{
    if(o[key] === undefined){
      return `index ${i} key ${key}: was undefined`;
    } else {
      if(!isPrimitiveNumber(o[key])){
        return `index ${i} key ${key}: was ${o[key]} (not a number)`;
      } else {
        value += o[key];
        return `index ${i} key ${key}: ${o[key]} added >>> new cum. value: ${value}`;
      }
    }
  });
  return {
    value,
    messages,
  };
};

const averageValuesByKey = (arrayOfObjects, key) => {
  console.error('averageValuesByKey is deprecated, convert to summarizeValuesByKey.avg');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: sum of all values of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if(!Array.isArray(arrayOfObjects)) return {value: null, message: 'no array of objects'};
  if(typeof key !== 'string') return {value: null, message: 'key must be a string'};
  let value = 0;
  let counter = 0;
  const messages = arrayOfObjects.map((o,i)=>{
    if(o[key] === undefined){
      return `index ${i} key ${key}: was undefined`;
    } else {
      if(!isPrimitiveNumber(o[key])){
        return `index ${i} key ${key}: was ${o[key]} (not a number)`;
      } else {
        counter ++;
        value += o[key];
        return `index ${i} key ${key}: ${o[key]} added >>> new cum. value: ${value}, counter: ${counter}`;
      }
    }
  });
  const average = precisionRound(value/counter, 4);
  return {
    value: average,
    messages,
  };
};

const averageArray = (array, countNonNumberValues=true) => {
  if(!Array.isArray(array)){
    return;
  }
  let length = 0;
  const total = array.reduce((acc, c)=>{
    if(isPrimitiveNumber(c)){
      length++;
    }
    const newValue = isPrimitiveNumber(c) ? c : 0;
    return acc + newValue;
  },0);
  const avg = countNonNumberValues ? 
    total / array.length :
    total / length;
  return avg;
};

const minValuesByKey = (arrayOfObjects, key) => {
  console.error('minValuesByKey is deprecated, convert to summarizeValuesByKey.min');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: lowest value of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if(!Array.isArray(arrayOfObjects)) return {value: null, message: 'no array of objects'};
  if(typeof key !== 'string') return {value: null, message: 'key must be a string'};
  let value;
  let counter = 0;
  const messages = arrayOfObjects.map((o,i)=>{
    if(o[key] === undefined){
      return `index ${i} key ${key}: was undefined`;
    } else {
      if(!isPrimitiveNumber(o[key])){
        return `index ${i} key ${key}: was ${o[key]} (not a number)`;
      } else {
        counter ++;
        if(value === undefined) {
          value = o[key];
        } else {
          value = Math.min(value, o[key]);
        }
        return `index ${i} key ${key}: ${o[key]} >>> current lowest value: ${value}, counter: ${counter}`;
      }
    }
  });
  return {
    value,
    messages,
  };
};

const maxValuesByKey = (arrayOfObjects, key) => {
  console.error('maxValuesByKey is deprecated, convert to summarizeValuesByKey.max');
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: highest value of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if(!Array.isArray(arrayOfObjects)) return {value: null, message: 'no array of objects'};
  if(typeof key !== 'string') return {value: null, message: 'key must be a string'};
  let value;
  let counter = 0;
  const messages = arrayOfObjects.map((o,i)=>{
    if(o[key] === undefined){
      return `err: index ${i} key ${key}: was undefined`;
    } else {
      if(!isPrimitiveNumber(o[key])){
        return `err: index ${i} key ${key}: was ${o[key]} (not a number)`;
      } else {
        counter ++;
        if(value === undefined) {
          value = o[key];
        } else {
          value = Math.max(value, o[key]);
        }
        return `index ${i} key ${key}: ${o[key]} >>> current highest value: ${value}, counter: ${counter}`;
      }
    }
  });
  return {
    value,
    messages,
  };
};

const summarizeValuesByKey = (arrayOfObjects, key) => {
  // input: array of objects, and a single key (for numeric keys, stringify numbers)
  // output: highest value of all matching keys with numeric values
  // output: array of messages identifying how each index was handled
  if(!Array.isArray(arrayOfObjects)) return {value: null, message: 'err: no array of objects'};
  if(typeof key !== 'string') return {value: null, message: 'err: key must be a string'};
  let max;
  let min;
  let tot = 0;
  let counter = 0;
  const messages = arrayOfObjects.map((o,i)=>{
    if(o[key] === undefined){
      return `err: index ${i} key ${key}: was undefined`;
    } else {
      if(!isPrimitiveNumber(o[key])){
        return `err: index ${i} key ${key}: was ${o[key]} (not a number)`;
      } else {
        counter ++;
        tot += o[key];
        if(max === undefined) {
          max = o[key];
        } else {
          max = Math.max(max, o[key]);
        }
        if(min === undefined){
          min = o[key];
        } else {
          min = Math.min(min, o[key]);
        }
        return `index ${i} key ${key}: ${o[key]} >>> current highest value: ${max}, >>> current lowest value: ${min}, added >>> new cum. value: ${tot}, counter: ${counter}`;
      }
    }
  });
  return {
    max,
    min,
    avg: precisionRound(tot/counter, 4),
    tot: precisionRound(tot, 4),
    messages,
  };
};

const mergeArraysOfObjectsByKey = (arr1, arr2, options) => {
  if(!Array.isArray(arr1))      return [];
  if(!Array.isArray(arr2))      return arr1;
  if(!isObjectLiteral(options)) return [];
  const { key1, key2, prefix } = options;
  if(key1 === undefined || key2 === undefined){
    return [];
  }
  const pre = prefix === undefined ? '' : prefix;
  const combo = arr1.map((obj1,i)=>{ // follow primary list of objects
    const merged = Object.assign({}, obj1);
    // this handles arrays of unmatched length.
    // if arr1 is longer than arr2, returns this PORTION of arr1 (returns entire array a few lines up)
    if(!isObjectLiteral(arr2[i])) {
      return obj1;
    }
    let theMatch = {};
    // improve this by looking for other ways to match
    const delta = dateDelta(obj1[key1], arr2[i][key2]);
    if(delta <= 2) {
      theMatch = arr2[i];
    } else {
      theMatch = arr2.find(c=>{
        const delta = dateDelta(obj1[key1], arr2[i][key2]);
        if(delta <= 2){
          return c;
        }
      });
    }
    for (let key in theMatch){
      if(merged.hasOwnProperty(key)){
        merged[`${pre}${key}`] = theMatch[key];
      } else {
        merged[key] = theMatch[key];
      }
    }
    return merged;
  });
  return combo;
};

const filterSequentialItems = (arr, options) => {
  // input: sorted array, options (see below for options)
  // output: array containing ONLY sequential items, starting with index 0
  // does not sort, does not skip. Checks each item you sent in as supposed to be sequential, and ensures it is actually sequential
  const returnOnError = { index: 0, stop: 0 };
  if(!Array.isArray(arr))           return Object.assign({}, returnOnError, { message: 'array to check for sequentiality is not an array'});
  if(!isObjectLiteral(options))     return Object.assign({}, returnOnError, { message: 'options for array sequentiality is not an object'});
  const {
    key, 
    increment, 
    tolerance, 
    timestampUnits, 
    extraLoggingKey, 
    keySignature } = options;
  if(typeof key !== 'string')       return Object.assign({}, returnOnError, { message: 'key to check for sequentiality is not a string'});
  if(!isPrimitiveNumber(increment)) return Object.assign({}, returnOnError, { message: 'increment to check for sequentiality is not a number'});
  if(!isPrimitiveNumber(tolerance)) return Object.assign({}, returnOnError, { message: 'tolerance to check for sequentiality is not a number'});
  // validated
  const id = typeof extraLoggingKey === 'string' ? extraLoggingKey : 'id' ;
  const ks = typeof keySignature    === 'string' ? keySignature    : 'imestamp' ;
  let index, stop, message, extraValues = {};
  const range = increment + tolerance;
  const tsUnits = key.includes(ks) && typeof timestampUnits === 'string' ?
    timestampUnits :
    key.includes(ks) ?
      'minutes' :
      null; 
  arr.forEach((o,i)=>{
    if(i===0){
      index = 0;
    } else {
      if(!stop){
        if(isObjectLiteral(o)){
          if(o[key] !== undefined){
            const delta = key.includes(ks) ?
              dateDelta(o[key], arr[index][key], tsUnits) :
              o[key] - arr[index][key];
            const absDelta  = Math.abs(delta);
            const stopValue = key.includes(ks) ? convertTimestampToString(o[key]         , 'd t z') : o[key];
            const lastValue = key.includes(ks) ? convertTimestampToString(arr[index][key], 'd t z') : arr[index][key];
            if(absDelta > range){
              stop = i;
              message = `in filterSequentialItems() at record ${i} exceeded range of ${range} (value at last sequential index #${index}/${id}: ${arr[index][id]}: ${convertTimestampToString(arr[index][key], 'd t z')}; failure at ${id}: ${o[id]}, delta: ${delta}, absolute: ${absDelta}, key: ${key}, value at ${i}: ${stopValue})`;
              extraValues = {
                priorValidIndex: index,
                priorValidId: arr[index][id],
                priorValidValue: arr[index][key],
                value: o[key],
                delta,
                absDelta,
              };
            } else if (absDelta === 0){
              stop = i;
              message = `at record ${i} no sequentiality detected (value at last sequential index #${index}/${id}: ${arr[index][id]}: ${lastValue}, ${id}: ${o[id]}, delta: ${delta}, absolute: ${absDelta}), key: ${key}, value at ${i}: ${stopValue}`;
            } else {
              message = 'ok';
              index = i; // success!
            }
          } else { // o[key] === undefined
            stop = i;
            message = `at record ${i}/${id}: ${o[id]} key of ${key} not found.`;
          }
        } else { // o id not an object
          stop = i;
          message = `at record ${i}/${id}: ${o[id]} no sequentiality object found.`;
        }
      }
    }
  });
  return Object.assign({},
    extraValues,
    {
      index,
      stop,
      message,
    }
  );
};

const consolidateTimeOrderedArray = (arr, _count, tsKey, keyTypes) => {
  if(!Array.isArray(arr)){
    throw {
      message: 'at consolidateTimeOrderedArray arr is not an array',
    };
  }
  const newArr = [];
  let hour   = 0;
  let minute = 0;
  let newDp  = {};
  // increments MUST be denominators of 60
  const count = 60%_count === 0 ? _count : 60;
  if(60%_count !== 0){
    console.log(`count requested = ${_count}, but ${count} will be used as ${_count} is not a divisor of 60.`);
  }

  arr.forEach((d,i)=>{
    if(!isValidDate(d[tsKey])){
      throw {
        message: `at consolidateTimeOrderedArray ${d[tsKey]} at index ${i} is ${d[tsKey]}, not a date`,
      };
    }
    const thisHour = d[tsKey].getHours();
    const thisMin  = d[tsKey].getMinutes();
    const shouldAdvance = i === 0 || thisHour !== hour || thisMin % count === 0;
    if(shouldAdvance){
      // restart
      hour   = thisHour;
      minute = thisMin;
      newDp  = {};
    }

    // use the latest timestamp key
    newDp[tsKey] = d[tsKey];

    for(let key in keyTypes){
      // if first time visiting this key
      const aggType = keyTypes[key];
      // only aggregate numbers; do nothing if not a number
      if(isPrimitiveNumber(d[key])){
        // initialize if needed
        if(typeof newDp[key] === 'undefined'){
          newDp[key] = 
            aggType === 'mean' ? [d[key]] :
              d[key];
        } else {
          if(aggType === 'mean'){
            newDp[key].push(d[key]);
          } else if(aggType === 'max'){
            newDp[key] = Math.max(newDp[key], d[key]);
          } else if(aggType === 'sum'){
            newDp[key] += d[key];
          }
        }
      }
    }
    if(shouldAdvance){
      newArr.push(newDp);
    }
  }); // end loop to populate newArr

  newArr.forEach(d=>{
    for(let k in d){
      if(Array.isArray(d[k])){
        d[k] = averageArray(d[k], false);
      }
    }
  });

  return newArr;
  
};

// @@@@@@@@@@@@@@@ ARRAYS @@@@@@@@@@@@@@@@

const totalAndAverageArrays = (compoundArray, precision=4) => {
  // input: array of arrays of numbers
  // output: { totaled: single array of numbers (sum), averaged: single array of numbers (average)
  // no reinforcement of array length
  let validated = true;
  const errors = [];
  if(!Array.isArray(compoundArray)) {
    validated = false;
    errors.push('input is not an array');
  }
  if(validated){
    compoundArray.forEach(subArray=>{
      if(!Array.isArray(subArray)){
        validated = false;
        errors.push('input is not a compound array');
        return {totaled: [], averaged: [], errors };
      }
    });
  }
  if(!validated) return {totaled: [], averaged: [], errors };

  const totalsArray = [];
  compoundArray.forEach((subArray,j)=>{
    subArray.forEach((num, i)=>{
      // if not a primitive number, ignore it, but log the error
      if(!isPrimitiveNumber(num)){
        errors.push(`error at array ${j}:${i}`);
      } else if(totalsArray[i]){
        totalsArray[i] += num ;
      } else {
        totalsArray[i]  = num ;        
      }
    });
  });
  const averagesArray = totalsArray.map(num=>{
    return precisionRound(num/compoundArray.length, precision);
  });
  return {
    totaled: totalsArray,
    averaged: averagesArray,
    errors,
  };
};

const deltaArray = (array1, array2) => {
  // input: two arrays of numbers
  // output: new array containing the difference between the two numbers
  // array length is reinforced
  let validated = true;
  if(!Array.isArray(array1)) validated = false;
  if(!Array.isArray(array2)) validated = false;
  if(validated === true){
    if(array1.length !== array2.length) validated = false;
  }
  if(!validated) return [];

  const arrayOfDeltas = array1.map((num, i)=>{
    const delta = isNaN(num - array2[i]) ? null :
      precisionRound(num - array2[i], 4);
    return delta;
  });

  return arrayOfDeltas;
};

const immutableArrayInsert = (index, array, itemToUpdate, replace=true) => {
  // input: index: integer to replace in array.
  // input: array: existing array to edit
  // input: itemToUpdate: what to put into the array: can be any data type
  // output: new array with item added (prepended, appended, replaced, based on index)
  // invalid index defaults to prepend
  // REPLACE if true will replace the item at the existing index
  // if replace is false, itemToUpdate will be inserted BEFORE the index in question
  if(!Array.isArray(array))      return [];
  if(itemToUpdate === undefined) return array;
  if (!isPrimitiveNumber(index)) return [itemToUpdate, ...array];
  if (index <= 0){
    const remainder = replace ? array.slice(1,array.length) : array ;
    const newArray = [itemToUpdate, ...remainder];
    return newArray;
  }
  if (index >= array.length -1 && replace){
    const remainder = array.slice(0,array.length-1);
    const newArray =  [...remainder, itemToUpdate];
    return newArray;
  }
  const remainderFront = array.slice(0,index);
  const backIndex = replace ? index+1 : index;
  const remainderBack = array.slice(backIndex,array.length);
  const newArray = [...remainderFront, itemToUpdate, ...remainderBack];
  return newArray;
};

const immutableArraySplice = (index, array) => {
  // input: index: integer to delete from array.
  // input: array: existing array to edit
  // output: new array with item removed
  // invalid index does nothing
  if(!Array.isArray(array)) return [];
  if(!isPrimitiveNumber(index)||index<0) return array;
  if (index > array.length -1) return array;
  if (index === 0){
    return array.slice(1,array.length);
  }
  if (index === array.length -1){
    return array.slice(0,array.length-1);
  }
  const remainderFront = array.slice(0, index);
  const remainderBack = array.slice(index+1, array.length);
  const newArray = [...remainderFront, ...remainderBack];

  return newArray;
};

const removeAllItemsFromArray = (array, items) => {
  // input: array of values (currently only accepting primitives)
  // items: items to remove from the array
  // if items ARE on the array, they are removed
  // if items are NOT on the array, they are ignored
  if(!Array.isArray(items)) return array;
  if(!Array.isArray(array)) return;

  let newArray = [...array];

  items.forEach(itemToRemove=>{
    const index = newArray.findIndex(exItem=>exItem===itemToRemove);
    newArray = index >= 0 ?
      immutableArraySplice(index, newArray) :
      newArray;
  });

  return newArray;
};

const addAllItemsToArray = (array, items) => {
  // input: array, only accepting primitives now
  // input: items to add to array (only primitives now)
  // first remove all items from array to avoid duplicates
  // then add all items to end of array
  if(!Array.isArray(items)) return array;
  if(!Array.isArray(array)) return;
  
  const removedArray = removeAllItemsFromArray(array,items);
  return [...removedArray, ...items];
};

const getPositionToInterpolate = (value, increment) => {
  // input: numeric value and numeric value of 1 increment
  const position = precisionRound(
    value / increment, 4); // intentionally rounded to 4, not 8
  const lo = Math.floor(position);
  const hi = Math.ceil(position);
  const decimal = precisionRound(position - lo, 4);
  return {
    position, // actual position, e.g. 2.4
    decimal,  // decimal value above low position, e.g. 0.4
    hi,       // integer above position, e.g. 3
    lo,       // integer below position, e.g. 2
  };
};

const interpolateArrayValues = (arr, decimal, hi, lo) => {
  if(!Array.isArray(arr))         return;
  if(!isPrimitiveNumber(decimal)) return;
  if(!isPrimitiveNumber(hi))      return;
  if(!isPrimitiveNumber(lo))      return;
  const loValue = arr[lo];
  if(loValue === undefined)       return;
  const hiValue = arr[hi];
  if(hiValue === undefined)       return;
  const deltaValue = precisionRound(hiValue - loValue,4);
  const decimalValue = precisionRound(decimal * deltaValue,4);
  const value = precisionRound(loValue + decimalValue,4);
  return precisionRound(value,4);
};

const _getType = o => {
  return Array.isArray(o) ? 'array' : 
	  isObjectLiteral(o) ? 'object' :
      isPrimitiveNumber(o) ? 'number' :
        o === null ? 'null' :
          typeof o; // boolean, string
};

const _diffObjectsInner = (o1, o2) => {
  const type1 = _getType(o1);
  const type2 = _getType(o2);
  let o3 = {};
  if(type1 !== type2){
    const o1Print = 
      type1 === 'object' || type1 === 'array' ? 
        ` ${JSON.stringify(o1,null,2)}` : 
        type1 === 'null' || type1 === 'undefined' ?
          '' :
          ` ${o1}`;
    const o2Print = 
      type2 === 'object' || type2 === 'array' ? 
        ` ${JSON.stringify(o2,null,2)}` : 
        type2 === 'null' || type2 === 'undefined' ?
          '' :
          ` ${o2}`;
    o3 = `!DIFF! ${type1}${o1Print} vs ${type2}${o2Print} !DIFF!`;
  } else if(type1 === 'object'){
    for(let k in o1){
      o3[k] = _diffObjectsInner(o1[k], o2[k]);
    }
  } else if(type1 === 'array'){
    o3 = o1.map((o1sub,i)=>{
      return _diffObjectsInner(o1sub, o2[i]);
    });
  } else {
    o3 = o1 === o2 ? '' :
      `!DIFF! ${o1} vs ${o2} !DIFF!`;
  }
  return o3;
};



const diffObjects = (o1, o2) => {
  const o3 = _diffObjectsInner(o1, o2);
  return o3;
};

module.exports = { 
  // object keys
  convertObjectKeyCase, 
  prefixObjectKeys,
  shiftObjectKeysColumn,
  shiftArrayKeysColumn,
  getKeyArray, 
  validateObjectKeysPresent,
  validateObjectKeys,
  limitObjectKeys,
  parseValuesObj2Levels,
  // objects and arrays
  roundAllValues,
  parseValuesFromArrayOfObj1Level,
  convertArrayToObject,
  convertObjectToArray,
  subArrayByKey,
  totalValuesByKey,
  averageValuesByKey,
  averageArray,
  minValuesByKey,
  maxValuesByKey,
  mergeArraysOfObjectsByKey,
  summarizeValuesByKey,
  filterSequentialItems,
  consolidateTimeOrderedArray,
  // arrays
  totalAndAverageArrays,
  deltaArray,
  immutableArrayInsert,
  immutableArraySplice,
  removeAllItemsFromArray,
  addAllItemsToArray,
  getPositionToInterpolate,
  interpolateArrayValues,
  diffObjects
};