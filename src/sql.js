/* general library of functions to format SQL statements, and to format
 * data for SQL. Wherever 'raw' is used, that is native SQL, specifically
 * postgresQL. 
 */

'use strict';
const dateTime        = require('./date-time');

const {
  isObjectLiteral }   = require('./basic');
const { shiftObjectKeysColumn,
  getKeyArray, 
  titleCaseWord, 
  convertScToCc,
  limitObjectKeys,  } = require('./lib');

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

const escapeSpecial = data => {
  const single = data.split('\'');
  const noSingle = single.join('\'\'');
  const double = noSingle.split('"');
  const noDouble = double.join('""');
  return noDouble;
};

const unEscapeSpecial = data => {
  const splitSingle = data.split('\'\'');
  const single = splitSingle.join('\'');
  const splitDouble = single.split('""');
  const double = splitDouble.join('"');
  return double;
};

const formatDataForSql = (data, key, option={type:'raw'}) => {
  // input: data: of any type, EXCEPT object literal
  // option: 'knex' formats data for object to use with knex, e.g. keeps arrays intact, and keeps timestamps as instances of Date, keeps null as null
  // option: 'raw' formats data for raw SQL, e.g. formats arrays as joined strings as '{1,2,3}', converts timestamps to string, converts null to a string 'null'
  // key: the key in the object, which is used to detect certain things, like timestamps (if consistent naming conventions are used)
  // output: data
  const type = option.type === 'raw' ? 'raw' : 'knex' ;
  const prefix = typeof option.prefix === 'string' ?
    option.prefix : '' ;
  const suffix = typeof option.suffix === 'string' ?
    option.suffix : '' ;  
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
      if(isObjectLiteral(item))    return null; // not returning nested objects
      if(typeof item === 'number') return item;
      if(type === 'raw'){
        // for raw SQL, add quotes to strings, which we'll check for as non-timestamps and non-numbers.
        return `"${prefix}${item}${suffix}"`; // arrays of strings should have all strings in double quotes
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
      return 'null';
    } else {
      return null;
    }
  }
  return data; // if we meet none of the conditions above
};

const formatObjectForKnex = object => {
  // variety for formatting options to convert a JSON to an acceptable format for use with knex
  // NOTE: this keeps arrays intact, and does not convert them to '{1,2,3}' format for use with raw SQL
  // NOTE: this keeps null as null vs. 'null' (string)
  const option = {type:'knex'};
  const o = {};
  for (let key in object) {
    o[key] = formatDataForSql (object[key], key, option);
  }
  return o;
};

const formatReqBodyForKnex = (body, keys, table, option) => {
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

const prefixCommonKeys = (table, keys, common, options={}) => {
  // options = {parent: boolean, alwaysPrefix: boolean, case: 'cC' || 'Sc'}
  // input: keys e.g. ['id', 'id_user as idUser', 'slope_pct as slopePct'] <<< 2 words max! ('as' is join)
  // input: common e.g. ['id', 'id_user']
  // input: option = 1 only if common, 2 = prefix regardless
  if(typeof table !== 'string') return;
  if(!Array.isArray(keys))      return;
  if(!Array.isArray(common))    return;
  // parent (only 1 per join) as true gets this format:
  // tests.id as id (identify table.field, but return unprefixed field)
  // parent as false (i.e. child) gets this format:
  // profiles.id as profiles_id (i.e. since id is common, it is prefixed for the children)
  const p = options.parent === true ? true : false ;
  // always prefix supersedes parent (p), but generally should only be used on children
  // always prefix prefixes regardless of commonality of keys, e.g.
  // profiles.unique_field as profiles_unique_field
  const a = options.alwaysPrefix === true ? true : false ;
  const c = options.case === 'cC' ? 'cC' : 'Sc' ; // limit to Cc or Sc
  const newKeys = keys.map(key=>{
    if(common.includes(key) || a){ // something gets edited
      if(common.includes(key)){    // COMMON: table gets dot prefix
        if(!p) {                   // common and child
          if(c==='cC'){
            return `${table}.${key} as ${table}${titleCaseWord(key, 'cC')}`;
          } else {
            return `${table}.${key} as ${table}_${key}`; 
          }
        } else if(a) {             // common and parent and always
          if(c==='cC'){
            return `${table}.${key} as ${table}${titleCaseWord(key, 'cC')}`;
          } else {
            return `${table}.${key} as ${table}_${key}`; 
          }
        } else {                   // common and parent
          return   `${table}.${key} as ${key}`;
        }
      } else {                     // ALWAYS, BUT NOT COMMON, but always prefix column
        if(c==='cC'){
          return `${key} as ${table}${titleCaseWord(key, 'cC')}`;
        } else {
          return `${key} as ${table}_${key}`; 
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
  const { tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray, joinTypesArray } = input;
  // input: array of tables: e.g. ['baseTables', 'optionalJoinTables', 'optionalJoinTables'] << tables always plural
  // input: keysToFetch: e.g. ['key1', 'key2', 'key3', 'key4', 'etc']
  // input: matchingKey: 'id' to be used as 'baseTables.id_optionalJoinTable = optionalJoinTables.id' <<< foreign key always singular
  // input: joinTosArray: e.g. [0,0,0,1] means: join indices 1 & 2 to index 0; join index 3 to index 1;
  // input: keyLocsArray: optional map of where foreign keys are stored.  Default is [0,0,0,0,0...] which means parent (farthest left) contains foreign keys of all children
  // input: joinTypeArray: LATER... allow switching between left (default), inner, right...
  // Alternate of [0,0,1], e.g., says in the 3rd instance, the child contains foreign keys for the parent.
  // output: fetch (keys), join statement; join with 'from' for a get; use separately in other statements;
  if(!Array.isArray(tables)) return;
  if(!Array.isArray(keysToFetch)) return;
  if(typeof matchingKey !== 'string') return;
  const joinTos =
    joinTosArray   === undefined || !Array.isArray(joinTosArray)   ? tables.map(()=>0) :
      joinTosArray.length    !== tables.length                     ? tables.map(()=>0) :
        joinTosArray;
  const keyLocs =
    keyLocsArray   === undefined || !Array.isArray(keyLocsArray)   ? tables.map(()=>0) :
      keyLocsArray.length   !== tables.length                      ? tables.map(()=>0) :
        keyLocsArray;
  const joinTypes = 
    joinTypesArray === undefined || !Array.isArray(joinTypesArray) ? tables.map(()=>'left') :
      joinTypesArray.length !== tables.length                      ? tables.map(()=>'left') :
        joinTypesArray;

  const joinStatementArray = tables.map((joinTo, i)=>{
    const joinFrom = tables[joinTos[i]]; 
    const keyLoc   = tables[keyLocs[i]];
    const joinDir  = joinFrom === keyLoc ? 'down' : 'up' ;
    const joinKey  =  joinDir === 'down' ? 
      `${matchingKey}_${joinTo.slice(0,joinTo.length-1)}` : // e.g. id_profile if current table is profiles, and joining down
      `${matchingKey}_${joinFrom.slice(0,joinFrom.length-1)}` ; // e.g. id_cassette if current table is profiles, and joining up to cassette
    const joinArrangement = joinDir === 'down' ?                // i.e. key is to the left
    // e.g. cassettes.id_profile = profiles.id
    `${joinFrom}.${joinKey} = ${joinTo}.${matchingKey}` : 
      // e.g. coinuses.id_profile = profiles.id
      `${joinFrom}.${matchingKey} = ${joinTo}.${joinKey}` ; 
    const joinType = joinTypes[i];
    return `${joinType} join ${joinTo} on ${joinArrangement}`;
  });

  const fetch = `${keysToFetch.join(', ')}`;
  const table = `${tables[0]}`;
  const joinWithoutSelf = joinStatementArray.slice(1,joinStatementArray.length);
  const join =  `${joinWithoutSelf.join(' ')}`;
  return { fetch, table, join };
};

module.exports = { 
  formatTimestampForSql,
  escapeSpecial,
  unEscapeSpecial,
  formatDataForSql,
  formatObjectForKnex, 
  formatReqBodyForKnex,
  prefixCommonKeys, 
  createSqlFetchTableKeys,
};