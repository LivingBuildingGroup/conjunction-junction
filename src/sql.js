/* general library of functions to format SQL statements, and to format
 * data for SQL. Wherever 'raw' is used, that is native SQL, specifically
 * postgresQL. 
 */

'use strict';
const dateTime        = require('./date-time');
const {
  isPrimitiveNumber,
  isObjectLiteral, 
  precisionRound}   = require('./basic');
const {
  titleCaseWord, 
  convertScToCc,  } = require('./primitives');
const { 
  shiftObjectKeysColumn,
  getKeyArray,
  limitObjectKeys,
  convertObjectKeyCase,  } = require('./objects');
const { isValidDate } = require('./date-time');

const formatTimestampForSql = (value, sqlOption={type:'raw'}) => {
  // input: a primitive value or a date that SHOULD be a timestamp
  // i.e. before calling this function, determine that it SHOULD be a timestamp
  // raw sqlOption returns a single-quote-wrapped string with time zone
  // knex sqlOption keeps uses a date object (and lets Knex handle the time zone)
  const type = sqlOption.type === 'raw' ? 'raw' : 'knex' ;
  // timestamps have only 2 valid input options: valid instanceof Date or properly formatted string
  // raw keeps the latter, knex keeps the former; below does the conversion
  // any other type of input on a timestamp key is nullified
  if(type==='raw') {
    if(dateTime.isValidDate(value)){
      return `'${dateTime.convertTimestampToString(value, 'd t z')}'`;
    } else if (value && typeof value === 'string') {
      const timestamp = dateTime.convertStringToTimestamp(value);
      if(dateTime.isValidDate(timestamp)){
        return `'${value}'`;
      } else {
        return 'null';
      }
    } else {
      return 'null';
    }
  } else { // o === 'knex'
    if(dateTime.isValidDate(value)){
      return value;
    } else if (value && typeof value === 'string') {
      const timestamp = dateTime.convertStringToTimestamp(value);
      if(dateTime.isValidDate(timestamp)){
        return timestamp;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};

// ADD QUESTION MARKS
const escapeSpecial = data => {
  if(typeof data === 'string'){
    // const double   = data.split('"');
    // const noDouble = double.join('\'');
    const single   = data.split('\'').join('\'\'');
    const question = single.split('?').join('$1');
    return question;
  }
  return data;
};

// ADD QUESTION MARKS
const unEscapeSpecial = data => {
  if(typeof data === 'string'){
    // const splitDouble = data.split('"');
    // const double = splitDouble.join('\'');
    const single = data.split('\'\'').join('\'').split('\'\'').join('\'').split('\'\'').join('\'');
    const question = single.split('$1').join('?');
    return question;
  }
  return data;
};

const unEscapeObject = o => {
  if(typeof o === 'string'){
    return unEscapeSpecial(o);
  }
  if(isPrimitiveNumber(o)){
    return o;
  }
  if(Array.isArray(o)){
    return o.map(subO=>unEscapeObject(subO));
  }
  if(isValidDate(o)){
    return o;
  }
  if(isObjectLiteral(o)){
    const newO = Object.assign({},o);
    for(let key in newO){
      newO[key] = unEscapeObject(newO[key]);
    }
    return newO;
  }
  return o;
};

const formatDataForSql = (data, key, option={type:'raw'}) => {
  // UPDATE THIS TO PREVENT \n--
  // input: data: of any type, EXCEPT object literal
  // option: 'knex' formats data for object to use with knex, e.g. keeps arrays intact, and keeps timestamps as instances of Date, keeps null as null
  // option: 'raw' formats data for raw SQL, e.g. formats arrays as joined strings as '{1,2,3}', converts timestamps to string, converts null to a string 'null'
  // key: the key in the object, which is used to detect certain things, like timestamps (if consistent naming conventions are used)
  // output: data
  const type = option.type === 'raw' ? 'raw' : 'knex' ;
  const allowJSON = !!option.allowJSON;
  const prefix = typeof option.prefix === 'string' ?
    option.prefix : '' ;
  const suffix = typeof option.suffix === 'string' ?
    option.suffix : '' ;  
  const round = isPrimitiveNumber(option.round) ? option.round : null ;
  const nullValues = ['NaN', 'NAN', null, undefined, ''];
  let isNull;
  nullValues.forEach(value=>{
    if(data === value) {
      isNull = true;
    }
  });
  if(isNull) {
    if(type==='raw') {
      return 'null';
    } else {
      return null;
    }
  }
  // validated: value is not null
  if(Array.isArray(data)) {
    let processedArray = [...data];
    if(key.includes('imestamp')){
      processedArray = data.map(timestamp=>formatTimestampForSql(timestamp, option));
    } 
    // check for compound arrays that contain empty arrays
    const processedArray2 = processedArray.map(item=>{
      if(Array.isArray(item)){
        if(item.length === 0) return null;
        if(type === 'raw'){
          return `{${item.map(d=>formatDataForSql(d, key, option))}}`;
        } else {
          return item.map(d=>formatDataForSql(d, key, option));
        }
      }
      if(key.includes('imestamp')) return item; // this is already in single quotes
      if(isObjectLiteral(item)){
        if(allowJSON){
          return `'${JSON.stringify(data)}'`;
        }
        return null; // not returning nested objects
      }
      if(isPrimitiveNumber(item)) {
        if(isPrimitiveNumber(round)){
          return precisionRound(item, round);
        }
        return item;
      }
      if(type === 'raw'){
        if(item === null || item === undefined){
          return 'null' ;
        }
        // for raw SQL, add quotes to strings, which we'll check for as non-timestamps and non-numbers.
        return `"${prefix}${escapeSpecial(item)}${suffix}"`; // arrays of strings should have all strings in double quotes
      }
      return `${prefix}${item}${suffix}`;
    });
    // end processing of compound arrays
    // continue processing array
    // stringify if raw
    if(type==='raw') {
      if(key.includes('imestamp')){
        // timestamps come out wrapped in single quotes
        // change these to double quotes
        // then wrap the entire array in single quotes and curlies
        // replace only does 1st occurrence, and there is no replace all
        const stringifiedArray = processedArray2.join(', ');
        const splitArray = stringifiedArray.split('\'');
        const doubleQuoted = splitArray.join('"');
        return `'{${doubleQuoted}}'`;
      } else {
        // processedArray2 should wrap strings in double quotes already
        return `'{${processedArray2.join(', ')}}'`;
      }
    } else {
      return processedArray2;
    }
  }
  if(key.includes('imestamp')){
    return formatTimestampForSql(data, option);
  }
  if(typeof data === 'string'){
    const escaped = escapeSpecial(data);
    if(type==='raw') {
      return `'${prefix}${escaped}${suffix}'`;
    } else {
      return `${prefix}${escaped}${suffix}`;
    }
  } // end string
  // we are not sending nested objects to SQL
  if(isObjectLiteral(data)) {
    if(type==='raw') {
      if(allowJSON){
        return `'${JSON.stringify(data)}'`;
      }
      return 'null';
    } else {
      return null;
    }
  }
  return data; // if we meet none of the conditions above
};

const formatObjectForKnex = (object, option) => {
  // variety for formatting options to convert a JSON to an acceptable format for use with knex
  // NOTE: this keeps arrays intact, and does not convert them to '{1,2,3}' format for use with raw SQL
  // NOTE: this keeps null as null vs. 'null' (string)
  const _option = isObjectLiteral(option) ? option : {type:'knex'};
  const o = {};
  for (let key in object) {
    o[key] = formatDataForSql (object[key], key, _option);
  }
  return o;
};

const formatReqBodyForKnex = (body, keys, table, option) => {
  console.error('formatReqBodyForKnex is deprecated! Change to formatPutBodyForKnex');
  // input: body = req.body, expect to be sent in camelCase
  // keys: all keys
  // table: db table, corresponds with keys
  // action: HTTP method: put or post , defaults to 'PUT'
  // output: object formatted for Knex with ONLY the acceptable keys
  const { keysColumnStart,
    keysColumnEnd,
    keysColumnLimit } = option;

  const objectCase    = shiftObjectKeysColumn(body, keys, table, keysColumnStart, keysColumnEnd);
  const objectForKnex = formatObjectForKnex(objectCase);
  const keyInput = {
    keys: keys,
    key: table,
    action: 'filter',
    position1: keysColumnEnd,
    position2: keysColumnLimit,
  };
  const keysLimiting  = getKeyArray(keyInput); // limit keys to column 0 if column 2 is true (POST)
  const objectLimited = limitObjectKeys(objectForKnex, keysLimiting);
  return objectLimited;
};

const prefixCommonKeys = (tableName, keys, common, options={}) => {
  // options = {parent: boolean, alwaysPrefix: boolean, case: 'cC' || 'Sc'}
  // input: keys e.g. ['id', 'id_user as idUser', 'slope_pct as slopePct'] <<< 2 words max! ('as' is join)
  // input: common e.g. ['id', 'id_user']
  // input: option = 1 only if common, 2 = prefix regardless
  if(typeof tableName !== 'string') return;
  if(!Array.isArray(keys))      return;
  if(!Array.isArray(common))    return;
  // parent (only 1 per join) as true gets this format:
  // tests.id as id (identify tableName.field, but return unprefixed field)
  // parent as false (i.e. child) gets this format:
  // profiles.id as profiles_id (i.e. since id is common, it is prefixed for the children)
  const p = options.parent === true ? true : false ;
  // always prefix supersedes parent (p), but generally should only be used on children
  // always prefix prefixes regardless of commonality of keys, e.g.
  // profiles.unique_field as profiles_unique_field
  const a = options.alwaysPrefix === true ? true : false ;
  const c = options.case === 'cC' ? 'cC' : 'Sc' ; // limit to Cc or Sc
  const newKeys = keys.map(key=>{
    const isIncluded = common.includes(key);
    if(isIncluded || a){ // something gets edited
      if(isIncluded){    // COMMON: table gets dot prefix
        if(!p) {                   // common and child
          if(c==='cC'){
            return `${tableName}.${key} as ${tableName}${titleCaseWord(key, 'cC')}`;
          } else {
            return `${tableName}.${key} as ${tableName}_${key}`; 
          }
        } else if(a) {             // common and parent and always
          if(c==='cC'){
            return `${tableName}.${key} as ${tableName}${titleCaseWord(key, 'cC')}`;
          } else {
            return `${tableName}.${key} as ${tableName}_${key}`; 
          }
        } else {                   // common and parent
          return   `${tableName}.${key} as ${key}`;
        }
      } else {                     // ALWAYS, BUT NOT COMMON, but always prefix column
        if(c==='cC'){
          return `${key} as ${tableName}${titleCaseWord(key, 'cC')}`;
        } else {
          return `${key} as ${tableName}_${key}`; 
        }
      }
    } else {                       // not common, not always
      // only checking here for cC conversion different from
      if(key.includes('_') && c === 'cC'){
        return `${key} as ${convertScToCc(key)}`;
      }
      return key; // returns key untouched if not common && not always
    }
  });
  return newKeys;
};

const createSqlFetchTableKeys = input => {
  const { tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray, joinTypesArray } = input;
  // input: array of tableNames: e.g. ['baseTables', 'optionalJoinTables', 'optionalJoinTables'] << tables always plural
  // input: keysToFetch: e.g. ['key1', 'key2', 'key3', 'key4', 'etc']
  // input: matchingKey: 'id' to be used as 'baseTables.id_optionalJoinTable = optionalJoinTables.id' <<< foreign key always singular
  // input: joinTosArray: e.g. [0,0,0,1] means: join indices 1 & 2 to index 0; join index 3 to index 1;
  // input: keyLocsArray: optional map of where foreign keys are stored.  Default is [0,0,0,0,0...] which means parent (farthest left) contains foreign keys of all children
  // input: joinTypeArray: LATER... allow switching between left (default), inner, right...
  // Alternate of [0,0,1], e.g., says in the 3rd instance, the child contains foreign keys for the parent.
  // output: fetch (keys), join statement; join with 'from' for a get; use separately in other statements;
  if(!Array.isArray(tableNames))      return;
  if(!Array.isArray(keysToFetch))     return;
  const tn = tableNames;
  if(typeof matchingKey !== 'string') return;
  const joinTos =
    !Array.isArray(joinTosArray)           ? tn.map(()=>0) :
      joinTosArray.length   !== tn.length  ? tn.map(()=>0) :
        joinTosArray;
  const keyLocs =
    !Array.isArray(keyLocsArray)           ? tn.map(()=>0) :
      keyLocsArray.length   !== tn.length  ? tn.map(()=>0) :
        keyLocsArray;
  const joinTypes = 
    !Array.isArray(joinTypesArray)        ? tn.map(()=>'left') :
      joinTypesArray.length !== tn.length ? tn.map(()=>'left') :
        joinTypesArray;

  const joinStatementArray = tn.map((joinTo, i)=>{
    const joinFrom     = tn[joinTos[i]]; 
    const keyLoc       = tn[keyLocs[i]];
    const joinDir      = joinFrom === keyLoc ? 'down' : 'up' ;
    const joinToTail   = joinTo.charAt(joinTo.length-1)     === 's' ? joinTo.slice(  0,joinTo.length-1)   : joinTo   ;
    const joinFromTail = joinFrom.charAt(joinFrom.length-1) === 's' ? joinFrom.slice(0,joinFrom.length-1) : joinFrom ;
    const joinKey      = joinDir === 'down' ? 
      `${matchingKey}_${joinToTail}` :            // e.g. id_profile if current table is profiles, and joining down
      `${matchingKey}_${joinFromTail}` ;          // e.g. id_cassette if current table is profiles, and joining up to cassette
    const joinArrangement = joinDir === 'down' ?  // i.e. key is to the left
      `${joinFrom}.${joinKey} = ${joinTo}.${matchingKey}` :   // e.g. cassettes.id_profile = profiles.id
      `${joinFrom}.${matchingKey} = ${joinTo}.${joinKey}` ; // e.g. coinuses.id_profile = profiles.id
    const joinType = joinTypes[i];
    return `${joinType} join ${joinTo} on ${joinArrangement}`;
  });

  const fetch = `${keysToFetch.join(', ')}`;
  const table = `${tn[0]}`;
  const joinWithoutSelf = joinStatementArray.slice(1,joinStatementArray.length);
  const join =  `${joinWithoutSelf.join(' ')}`;
  return { fetch, table, join };
};

const validateRawKnex = (data, label, camel, options={}) => {
  // options: { returnFirst: undefined, returnInvalid: [] }
  // options: { returnFirst: true,      returnInvalid: {} }
  const flag = typeof label === 'string' ? label : 'raw fetch';
  // IMPROVE THIS AS AN ALL-PURPOSE FUNCTION
  // make sure data argument is Raw format (key of rows)
  if(!isObjectLiteral(data))         {
    if(options.returnInvalid !== undefined){
      return options.returnInvalid;
    }
    return { message: `${flag} is not an object` };
  }
  if(!data.rows)                     {
    if(options.returnInvalid !== undefined){
      return options.returnInvalid;
    }
    return { message: `${flag} does not include rows` };
  }
  if(!Array.isArray(data.rows))      {
    if(options.returnInvalid !== undefined){
      return options.returnInvalid;
    }
    return { message: `${flag} rows is not an array` };
  }
  if(data.rows.length <= 0)          {
    if(options.returnInvalid !== undefined){
      return options.returnInvalid;
    }
    return { message: `${flag} rows is empty, stopping` };
  }
  if(!isObjectLiteral(data.rows[0])) {
    if(options.returnInvalid !== undefined){
      return options.returnInvalid;
    }
    return { message: `${flag} row 0 is not an object, stopping` };
  }
  // passed, now move onto options
  if(options.returnFirst){
    const first = data.rows[0];
    if(!isObjectLiteral(first)){
      if(options.returnInvalid){
        return options.returnInvalid;
      }
      return Object.assign({},first);
    }

    if(camel){
      return convertObjectKeyCase(first,'cC');
    }
    return Object.assign({},first);
  }

  if(camel){
    return data.rows.map(r=>convertObjectKeyCase(r,'cC'));
  }
  return [...data.rows];
};

module.exports = { 
  formatTimestampForSql,
  escapeSpecial,
  unEscapeSpecial,
  unEscapeObject,
  formatDataForSql,
  formatObjectForKnex, 
  formatReqBodyForKnex,
  prefixCommonKeys, 
  createSqlFetchTableKeys,
  validateRawKnex,
};