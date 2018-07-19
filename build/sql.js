/* general library of functions to format SQL statements, and to format
 * data for SQL. Wherever 'raw' is used, that is native SQL, specifically
 * postgresQL. 
 */

'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var dateTime = require('./date-time');

var _require = require('./basic'),
    isObjectLiteral = _require.isObjectLiteral;

var _require2 = require('./lib'),
    shiftObjectKeysColumn = _require2.shiftObjectKeysColumn,
    getKeyArray = _require2.getKeyArray,
    titleCaseWord = _require2.titleCaseWord,
    convertScToCc = _require2.convertScToCc,
    limitObjectKeys = _require2.limitObjectKeys;

var formatTimestampForSql = function formatTimestampForSql(value) {
  var sqlOption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { type: 'raw' };

  // input: a primitive value or a date that SHOULD be a timestamp
  // i.e. before calling this function, determine that it SHOULD be a timestamp
  // raw sqlOption returns a single-quote-wrapped string with time zone
  // knex sqlOption keeps uses a date object (and lets Knex handle the time zone)
  var type = sqlOption.type === 'raw' ? 'raw' : 'knex';
  // timestamps have only 2 valid input options: valid instanceof Date or properly formatted string
  // raw keeps the latter, knex keeps the former; below does the conversion
  // any other type of input on a timestamp key is nullified
  if (type === 'raw') {
    if (dateTime.isValidDate(value)) {
      return '\'' + dateTime.convertTimestampToString(value, 'd t z') + '\'';
    } else if (value && typeof value === 'string') {
      var timestamp = dateTime.convertStringToTimestamp(value);
      if (dateTime.isValidDate(timestamp)) {
        return '\'' + value + '\'';
      } else {
        return 'null';
      }
    } else {
      return 'null';
    }
  } else {
    // o === 'knex'
    if (dateTime.isValidDate(value)) {
      return value;
    } else if (value && typeof value === 'string') {
      var _timestamp = dateTime.convertStringToTimestamp(value);
      if (dateTime.isValidDate(_timestamp)) {
        return _timestamp;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }
};

var escapeSpecial = function escapeSpecial(data) {
  var single = data.split('\'');
  var noSingle = single.join('\'\'');
  var double = noSingle.split('"');
  var noDouble = double.join('""');
  return noDouble;
};

var unEscapeSpecial = function unEscapeSpecial(data) {
  var splitSingle = data.split('\'\'');
  var single = splitSingle.join('\'');
  var splitDouble = single.split('""');
  var double = splitDouble.join('"');
  return double;
};

var formatDataForSql = function formatDataForSql(data, key) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { type: 'raw' };

  // input: data: of any type, EXCEPT object literal
  // option: 'knex' formats data for object to use with knex, e.g. keeps arrays intact, and keeps timestamps as instances of Date, keeps null as null
  // option: 'raw' formats data for raw SQL, e.g. formats arrays as joined strings as '{1,2,3}', converts timestamps to string, converts null to a string 'null'
  // key: the key in the object, which is used to detect certain things, like timestamps (if consistent naming conventions are used)
  // output: data
  var type = option.type === 'raw' ? 'raw' : 'knex';
  var prefix = typeof option.prefix === 'string' ? option.prefix : '';
  var suffix = typeof option.suffix === 'string' ? option.suffix : '';
  var nullValues = ['NaN', 'NAN', null, undefined, ''];
  var isNull = void 0;
  nullValues.forEach(function (value) {
    if (data === value) {
      isNull = true;
    }
  });
  if (isNull) {
    if (type === 'raw') {
      return 'null';
    } else {
      return null;
    }
  }
  // validated: value is not null
  if (Array.isArray(data)) {
    var processedArray = [].concat(_toConsumableArray(data));
    if (key.includes('imestamp')) {
      processedArray = data.map(function (timestamp) {
        return formatTimestampForSql(timestamp, option);
      });
    }
    // check for compound arrays that contain empty arrays
    var processedArray2 = processedArray.map(function (item) {
      if (Array.isArray(item)) {
        if (item.length === 0) return null;
        if (type === 'raw') {
          return '{' + item.map(function (d) {
            return formatDataForSql(d, key, option);
          }) + '}';
        } else {
          return item.map(function (d) {
            return formatDataForSql(d, key, option);
          });
        }
      }
      if (key.includes('imestamp')) return item; // this is already in single quotes
      if (isObjectLiteral(item)) return null; // not returning nested objects
      if (typeof item === 'number') return item;
      if (type === 'raw') {
        // for raw SQL, add quotes to strings, which we'll check for as non-timestamps and non-numbers.
        return '"' + prefix + item + suffix + '"'; // arrays of strings should have all strings in double quotes
      }
      return '' + prefix + item + suffix;
    });
    // end processing of compound arrays
    // continue processing array
    // stringify if raw
    if (type === 'raw') {
      if (key.includes('imestamp')) {
        // timestamps come out wrapped in single quotes
        // change these to double quotes
        // then wrap the entire array in single quotes and curlies
        // replace only does 1st occurrence, and there is no replace all
        var stringifiedArray = processedArray2.join(', ');
        var splitArray = stringifiedArray.split('\'');
        var doubleQuoted = splitArray.join('"');
        return '\'{' + doubleQuoted + '}\'';
      } else {
        // processedArray2 should wrap strings in double quotes already
        return '\'{' + processedArray2.join(', ') + '}\'';
      }
    } else {
      return processedArray2;
    }
  }
  if (key.includes('imestamp')) {
    return formatTimestampForSql(data, option);
  }
  if (typeof data === 'string') {
    var escaped = escapeSpecial(data);
    if (type === 'raw') {
      return '\'' + prefix + escaped + suffix + '\'';
    } else {
      return '' + prefix + escaped + suffix;
    }
  } // end string
  // we are not sending nested objects to SQL
  if (isObjectLiteral(data)) {
    if (type === 'raw') {
      return 'null';
    } else {
      return null;
    }
  }
  return data; // if we meet none of the conditions above
};

var formatObjectForKnex = function formatObjectForKnex(object) {
  // variety for formatting options to convert a JSON to an acceptable format for use with knex
  // NOTE: this keeps arrays intact, and does not convert them to '{1,2,3}' format for use with raw SQL
  // NOTE: this keeps null as null vs. 'null' (string)
  var option = { type: 'knex' };
  var o = {};
  for (var key in object) {
    o[key] = formatDataForSql(object[key], key, option);
  }
  return o;
};

var formatReqBodyForKnex = function formatReqBodyForKnex(body, keys, table, option) {
  // input: body = req.body, expect to be sent in camelCase
  // keys: all keys
  // table: db table, corresponds with keys
  // action: HTTP method: put or post , defaults to 'PUT'
  // output: object formatted for Knex with ONLY the acceptable keys
  var keysColumnStart = option.keysColumnStart,
      keysColumnEnd = option.keysColumnEnd,
      keysColumnLimit = option.keysColumnLimit;


  var objectCase = shiftObjectKeysColumn(body, keys, table, keysColumnStart, keysColumnEnd);
  var objectForKnex = formatObjectForKnex(objectCase);
  var keysLimiting = getKeyArray(keys, table, keysColumnEnd, keysColumnLimit); // limit keys to column 0 if column 2 is true (POST)
  var objectLimited = limitObjectKeys(objectForKnex, keysLimiting);
  return objectLimited;
};

var prefixCommonKeys = function prefixCommonKeys(table, keys, common) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

  // options = {parent: boolean, alwaysPrefix: boolean, case: 'cC' || 'Sc'}
  // input: keys e.g. ['id', 'id_user as idUser', 'slope_pct as slopePct'] <<< 2 words max! ('as' is join)
  // input: common e.g. ['id', 'id_user']
  // input: option = 1 only if common, 2 = prefix regardless
  if (typeof table !== 'string') return;
  if (!Array.isArray(keys)) return;
  if (!Array.isArray(common)) return;
  // parent (only 1 per join) as true gets this format:
  // tests.id as id (identify table.field, but return unprefixed field)
  // parent as false (i.e. child) gets this format:
  // profiles.id as profiles_id (i.e. since id is common, it is prefixed for the children)
  var p = options.parent === true ? true : false;
  // always prefix supersedes parent (p), but generally should only be used on children
  // always prefix prefixes regardless of commonality of keys, e.g.
  // profiles.unique_field as profiles_unique_field
  var a = options.alwaysPrefix === true ? true : false;
  var c = options.case === 'cC' ? 'cC' : 'Sc'; // limit to Cc or Sc
  var newKeys = keys.map(function (key) {
    if (common.includes(key) || a) {
      // something gets edited
      if (common.includes(key)) {
        // COMMON: table gets dot prefix
        if (!p) {
          // common and child
          if (c === 'cC') {
            return table + '.' + key + ' as ' + table + titleCaseWord(key, 'cC');
          } else {
            return table + '.' + key + ' as ' + table + '_' + key;
          }
        } else if (a) {
          // common and parent and always
          if (c === 'cC') {
            return table + '.' + key + ' as ' + table + titleCaseWord(key, 'cC');
          } else {
            return table + '.' + key + ' as ' + table + '_' + key;
          }
        } else {
          // common and parent
          return table + '.' + key + ' as ' + key;
        }
      } else {
        // ALWAYS, BUT NOT COMMON, but always prefix column
        if (c === 'cC') {
          return key + ' as ' + table + titleCaseWord(key, 'cC');
        } else {
          return key + ' as ' + table + '_' + key;
        }
      }
    } else {
      // not common, not always
      // only checking here for cC conversion different from
      if (key.includes('_') && c === 'cC') {
        return key + ' as ' + convertScToCc(key);
      }
      return key; // returns key untouched if not common && not always
    }
  });
  return newKeys;
};

var createSqlFetchTableKeys = function createSqlFetchTableKeys(input) {
  var tables = input.tables,
      keysToFetch = input.keysToFetch,
      matchingKey = input.matchingKey,
      joinTosArray = input.joinTosArray,
      keyLocsArray = input.keyLocsArray,
      joinTypesArray = input.joinTypesArray;
  // input: array of tables: e.g. ['baseTables', 'optionalJoinTables', 'optionalJoinTables'] << tables always plural
  // input: keysToFetch: e.g. ['key1', 'key2', 'key3', 'key4', 'etc']
  // input: matchingKey: 'id' to be used as 'baseTables.id_optionalJoinTable = optionalJoinTables.id' <<< foreign key always singular
  // input: joinTosArray: e.g. [0,0,0,1] means: join indices 1 & 2 to index 0; join index 3 to index 1;
  // input: keyLocsArray: optional map of where foreign keys are stored.  Default is [0,0,0,0,0...] which means parent (farthest left) contains foreign keys of all children
  // input: joinTypeArray: LATER... allow switching between left (default), inner, right...
  // Alternate of [0,0,1], e.g., says in the 3rd instance, the child contains foreign keys for the parent.
  // output: fetch (keys), join statement; join with 'from' for a get; use separately in other statements;

  if (!Array.isArray(tables)) return;
  if (!Array.isArray(keysToFetch)) return;
  if (typeof matchingKey !== 'string') return;
  var joinTos = joinTosArray === undefined || !Array.isArray(joinTosArray) ? tables.map(function () {
    return 0;
  }) : joinTosArray.length !== tables.length ? tables.map(function () {
    return 0;
  }) : joinTosArray;
  var keyLocs = keyLocsArray === undefined || !Array.isArray(keyLocsArray) ? tables.map(function () {
    return 0;
  }) : keyLocsArray.length !== tables.length ? tables.map(function () {
    return 0;
  }) : keyLocsArray;
  var joinTypes = joinTypesArray === undefined || !Array.isArray(joinTypesArray) ? tables.map(function () {
    return 'left';
  }) : joinTypesArray.length !== tables.length ? tables.map(function () {
    return 'left';
  }) : joinTypesArray;

  var joinStatementArray = tables.map(function (joinTo, i) {
    var joinFrom = tables[joinTos[i]];
    var keyLoc = tables[keyLocs[i]];
    var joinDir = joinFrom === keyLoc ? 'down' : 'up';
    var joinKey = joinDir === 'down' ? matchingKey + '_' + joinTo.slice(0, joinTo.length - 1) : // e.g. id_profile if current table is profiles, and joining down
    matchingKey + '_' + joinFrom.slice(0, joinFrom.length - 1); // e.g. id_cassette if current table is profiles, and joining up to cassette
    var joinArrangement = joinDir === 'down' ? // i.e. key is to the left
    // e.g. cassettes.id_profile = profiles.id
    joinFrom + '.' + joinKey + ' = ' + joinTo + '.' + matchingKey :
    // e.g. coinuses.id_profile = profiles.id
    joinFrom + '.' + matchingKey + ' = ' + joinTo + '.' + joinKey;
    var joinType = joinTypes[i];
    return joinType + ' join ' + joinTo + ' on ' + joinArrangement;
  });

  var fetch = '' + keysToFetch.join(', ');
  var table = '' + tables[0];
  var joinWithoutSelf = joinStatementArray.slice(1, joinStatementArray.length);
  var join = '' + joinWithoutSelf.join(' ');
  return { fetch: fetch, table: table, join: join };
};

module.exports = {
  formatTimestampForSql: formatTimestampForSql,
  escapeSpecial: escapeSpecial,
  unEscapeSpecial: unEscapeSpecial,
  formatDataForSql: formatDataForSql,
  formatObjectForKnex: formatObjectForKnex,
  formatReqBodyForKnex: formatReqBodyForKnex,
  prefixCommonKeys: prefixCommonKeys,
  createSqlFetchTableKeys: createSqlFetchTableKeys
};