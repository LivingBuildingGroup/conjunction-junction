'use strict';

const chai     = require('chai');
const expect   = chai.expect;

const { 
  formatTimestampForSql,
  escapeSpecial,
  unEscapeSpecial,
  formatDataForSql,
  formatObjectForKnex, 
  formatReqBodyForKnex,
  prefixCommonKeys, 
  createSqlFetchTableKeys,
  validateRawKnex, } = require('../index');
const {
  numbers, 
  nonNumberArrays,
  nonStringPrimitives,
  date1,
  date1String_d_t_z,
  date1StringDtz,
  date1StringDtmsz,       } = require('./helper-data');
process.env.DB_MODE = 'test';

describe('conjunction-junction db', ()=> { 

  it('formatTimestampForSql raw date', ()=> { 
    // input: a primitive value or a date that SHOULD be a timestamp
    // i.e. before calling this function, determine that it SHOULD be a timestamp
    // raw sqlOption returns a single-quote-wrapped string with time zone
    // knex sqlOption keeps uses a date object (and lets Knex handle the time zone)
    const value = date1;
    const sqlOption = {type:'raw'};
    const expectedResult = `'${date1String_d_t_z}'`;
    const result = formatTimestampForSql(value, sqlOption);
    expect(result).to.equal(expectedResult);
  });
  it('formatTimestampForSql raw string d t z', ()=> { 
    const value = date1String_d_t_z;
    const sqlOption = {type:'raw'};
    const expectedResult = `'${date1String_d_t_z}'`;
    const result = formatTimestampForSql(value, sqlOption);
    expect(result).to.equal(expectedResult);
  });
  it('formatTimestampForSql raw string dtz', ()=> { 
    const value = date1StringDtz;
    const sqlOption = {type:'raw'};
    const expectedResult = `'${date1StringDtz}'`;
    const result = formatTimestampForSql(value, sqlOption);
    expect(result).to.equal(expectedResult);
  });
  it('formatTimestampForSql raw string dtmsz', ()=> { 
    const value = date1StringDtmsz;
    const sqlOption = {type:'raw'};
    const expectedResult = `'${date1StringDtmsz}'`;
    const result = formatTimestampForSql(value, sqlOption);
    expect(result).to.equal(expectedResult);
  });
  it('formatTimestampForSql raw other', ()=> { 
    const values = [...nonNumberArrays, nonStringPrimitives, numbers];
    const sqlOption = {type:'raw'}; // don't pass to test default
    const expectedResult = 'null';
    values.forEach(value=>{
      const result = formatTimestampForSql(value);
      expect(result).to.equal(expectedResult);
    });
  });
  it('formatTimestampForSql knex date', ()=> { 
    const value = date1;
    const sqlOption = {type:'knex'};
    const expectedResult = date1;
    const result = formatTimestampForSql(value, sqlOption);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatTimestampForSql knex string', ()=> { 
    const value = date1String_d_t_z;
    const sqlOption = {type:'knex'};
    const expectedResult = date1;
    const result = formatTimestampForSql(value, sqlOption);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatTimestampForSql knex other', ()=> { 
    const values = [...nonNumberArrays, nonStringPrimitives, numbers];
    const sqlOption = {type:'knex'};
    const expectedResult = null;
    values.forEach(value=>{
      const result = formatTimestampForSql(value, sqlOption);
      expect(result).to.equal(expectedResult);
    });
  });
  
  it('escapeSpecial single quote', ()=> { 
    const word = 'Brad\'s';
    const expectedResult = 'Brad\'\'s';
    const result = escapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('escapeSpecial double quote', ()=> { 
    const word = 'escape double quotes (")';
    const expectedResult = 'escape double quotes ("")';
    const result = escapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('escapeSpecial both quotes', ()=> { 
    const word = 'escape both\' quotes (")';
    const expectedResult = 'escape both\'\' quotes ("")';
    const result = escapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('escapeSpecial mixed quotes', ()=> { 
    const word = '"escape "mixed\'" quotes (\'")';
    const expectedResult = '""escape ""mixed\'\'"" quotes (\'\'"")';
    const result = escapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });

  it('unEscapeSpecial double quotes', ()=> { 
    const word = '"un-escape ""double"" quotes (")';
    const expectedResult = '"un-escape "double" quotes (")';
    const result = unEscapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('unEscapeSpecial single quotes', ()=> { 
    const word = '"un-escape \'\'single\'\' quotes (")';
    const expectedResult = '"un-escape \'single\' quotes (")';
    const result = unEscapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('unEscapeSpecial mult single quotes', ()=> { 
    const word = '"un-escape \'\'\'single\'\' quotes (\'\')';
    const expectedResult = '"un-escape \'\'single\' quotes (\')';
    const result = unEscapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('unEscapeSpecial many single quotes', ()=> { 
    const word = '"un-escape \'\'\'single\'\'\'\'\'\')';
    const expectedResult = '"un-escape \'\'single\'\'\')';
    const result = unEscapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('unEscapeSpecial mult single quotes', ()=> { 
    const word = '"un-escape """single"" quotes ("")';
    const expectedResult = '"un-escape ""single" quotes (")';
    const result = unEscapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });
  it('unEscapeSpecial many single quotes', ()=> { 
    const word = '"un-escape """single"""""")';
    const expectedResult = '"un-escape ""single""")';
    const result = unEscapeSpecial(word);
    expect(result).to.equal(expectedResult);
  });

  it('formatDataForSql null raw', ()=> { 
    const nullValues = ['NaN', 'NAN', null, undefined, ''];
    const option = {type:'raw'};
    nullValues.forEach(value=>{
      const result = formatDataForSql(value, 'key', option);
      expect(result).to.equal('null');
    });
    // same but imply option, and no need for key if just null
    const result = formatDataForSql(nullValues[0]);
    expect(result).to.equal('null');
  });
  it('formatDataForSql null skip key default raw', ()=> { 
    // skip key (2nd parameter)
    // skip option (3rd parameter)
    // the 3rd parameter defaults to raw
    const nullValues = ['NaN', 'NAN', null, undefined, ''];
    const result = formatDataForSql(nullValues[0]);
    expect(result).to.equal('null');
  });
  it('formatDataForSql null knex', ()=> { 
    const nullValues = ['NaN', 'NAN', null, undefined, ''];
    const option = {type:'knex'};
    nullValues.forEach(value=>{
      const result = formatDataForSql(value, 'key', option);
      expect(result).to.equal(null);
    });
  });
  it('formatDataForSql null default to knex', ()=> { 
    const nullValues = ['NaN', 'NAN', null, undefined, ''];
    const option = {type:'bogus option'};
    const result = formatDataForSql(nullValues[0],'some key',option);
    expect(result).to.equal(null);
  });
  it('formatDataForSql array timestamp raw', ()=> { 
    const value = [date1, date1String_d_t_z];
    const option = {type:'raw'};
    const result = formatDataForSql(value,'timestamp', option);
    const expectedResult = `'{"${date1String_d_t_z}", "${date1String_d_t_z}"}'`;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql array timestamp raw with null', ()=> { 
    const value = [date1, 'blah blah', date1String_d_t_z];
    const option = {type:'raw'};
    const result = formatDataForSql(value,'timestamp', option);
    const expectedResult = `'{"${date1String_d_t_z}", null, "${date1String_d_t_z}"}'`;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql array string raw', ()=> { 
    const value = ['a string', 'blah blah', 'words...'];
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = '\'{"a string", "blah blah", "words..."}\'';
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql array string and number raw', ()=> { 
    const value = ['a string', 3, 'words...'];
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = '\'{"a string", 3, "words..."}\'';
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql compound arrays of numbers raw', ()=> { 
    const value = [[1,2,3],[4,5,6]];
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = '\'{{1,2,3}, {4,5,6}}\'';
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql compound arrays of numbers knex', ()=> { 
    const value = [[1,2,3],[4,5,6]];
    const option = {type:'knex'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = [[1,2,3],[4,5,6]];
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatDataForSql string raw', ()=> { 
    const value = 'a string';
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = `'${value}'`;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql string raw mixed quotes', ()=> { 
    const value = '"escape "mixed\'" quotes (\'")';
    const escapedValue = '""escape ""mixed\'\'"" quotes (\'\'"")';
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = `'${escapedValue}'`;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql string knex', ()=> { 
    const value = 'a string';
    const option = {type:'knex'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = value;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql string knex mixed quotes', ()=> { 
    const value = '"escape "mixed\'" quotes (\'")';
    const escapedValue = '""escape ""mixed\'\'"" quotes (\'\'"")';
    const option = {type:'knex'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = escapedValue;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql number raw', ()=> { 
    const value = 88;
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = value;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql number knex', ()=> { 
    const value = 88;
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = value;
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql object raw', ()=> { 
    const value = {key: 'value'};
    const option = {type:'raw'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = 'null';
    expect(result).to.equal(expectedResult);
  });
  it('formatDataForSql object knex', ()=> { 
    const value = {key: 'value'};
    const option = {type:'knex'};
    const result = formatDataForSql(value,'key', option);
    const expectedResult = null;
    expect(result).to.equal(expectedResult);
  });

  it('formatObjectForKnex', ()=> { 
    const original = {
      aString: 'a string',
      aNumber: 3,
      anObject: {key: 'some value'},
      anotherObject: {key: 33},
      arrayOfTimestamps: [
        date1, date1, date1
      ],
      arrayOfTimestampStrings: [
        date1String_d_t_z, date1String_d_t_z, date1String_d_t_z
      ],
      arrayOfArrays: [
        ['string', 'string'], [1,2]
      ],
      arrayOfNumbers: [ 1,2,3 ],
      timestamp: date1,
      stringTimestamp: date1String_d_t_z,
      anotherTimestamp: date1,
      arrayOfObjects: [ {key: 'val'} ],
    };
    const expectedResult = {
      aString: 'a string',
      aNumber: 3,
      anObject: null,
      anotherObject: null,
      arrayOfTimestamps: [
        date1, date1, date1
      ],
      arrayOfTimestampStrings: [
        date1, date1, date1
      ],
      arrayOfArrays: [
        ['string', 'string'], [1,2]
      ],
      arrayOfNumbers: [ 1,2,3 ],
      timestamp: date1,
      stringTimestamp: date1,
      anotherTimestamp: date1,
      arrayOfObjects: [ null ],
    };
    const result = formatObjectForKnex(original);
    expect(result).to.deep.equal(expectedResult);
  });

  it('formatReqBodyForKnex shift column', ()=> { 
    const body = {
      id: 7,
      username: 'brad',
      lastName: 'garner',
      badKey:   'delete this one'
    };
    const tableName = 'users';
    const option = {
      keysColumnStart: 1,
      keysColumnEnd:   0,
      keysColumnLimit: 3,
    };
    const expectedResult = {
      username:  'brad',
      last_name: 'garner',
    };
    const keys = {
      users: [
        // end here    start here   ignore   limit by
        ['username'  , 'username' , true    , true ],
        ['first_name', 'firstName', true    , true ],
        ['last_name' , 'lastName' , true    , true ],
      ],
    };
    const result = formatReqBodyForKnex(body, keys, tableName, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatReqBodyForKnex same column', ()=> { 
    const body = {
      id: 7,
      username:  'brad',
      last_name: 'garner',
      bad_key:   'delete this one'
    };
    const tableName = 'users';
    const option = {
      keysColumnStart: 0,
      keysColumnEnd:   0,
      keysColumnLimit: 3,
    };
    const expectedResult = {
      username:  'brad',
      last_name: 'garner',
    };
    const keys = {
      users: [
        // end here    start here   ignore   limit by
        ['username'  , 'username' , true    , true ],
        ['first_name', 'firstName', true    , true ],
        ['last_name' , 'lastName' , true    , true ],
      ],
    };
    const result = formatReqBodyForKnex(body, keys, tableName, option);
    expect(result).to.deep.equal(expectedResult);
  });

  it('prefixCommonKeys parent, always, cC', ()=> { 
    const keys = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name'
    ];
    const commonSc = [
      'id',
      'timestamp_created'
    ];
    const tableName = 'users';
    const options = {
      parent: true,
      alwaysPrefix: true,
      case: 'cC',
    };
    const expectedResult = [
      'users.id as usersId',
      'users.timestamp_created as usersTimestampCreated',
      'username as usersUsername',
      'password as usersPassword',
      'first_name as usersFirstName',
    ];
    const result = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys child, always, cC', ()=> { 
    const keys = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name'
    ];
    const commonSc = [
      'id',
      'timestamp_created'
    ];
    const tableName = 'users';
    const options = {
      alwaysPrefix: true,
      case: 'cC',
    };
    const expectedResult = [
      'users.id as usersId',
      'users.timestamp_created as usersTimestampCreated',
      'username as usersUsername',
      'password as usersPassword',
      'first_name as usersFirstName',
    ];
    const result = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys child, not always, cC', ()=> { 
    const keys = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name'
    ];
    const commonSc = [
      'id',
      'timestamp_created'
    ];
    const tableName = 'users';
    const options = {
      case: 'cC',
    };
    const expectedResult = [ // child = always tableName. as ~
      'users.id as usersId',
      'users.timestamp_created as usersTimestampCreated',
      'username',
      'password',
      'first_name as firstName',
    ];
    const result = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys child, not always, Sc', ()=> { 
    const keys = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name'
    ];
    const commonSc = [
      'id',
      'timestamp_created'
    ];
    const tableName = 'users';
    const expectedResult = [ // child = always tableName. as ~
      'users.id as users_id',
      'users.timestamp_created as users_timestamp_created',
      'username',
      'password',
      'first_name',
    ];
    const result = prefixCommonKeys(tableName, keys, commonSc);
    expect(result).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys child, always, Sc', ()=> { 
    const keys = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name'
    ];
    const commonSc = [
      'id',
      'timestamp_created'
    ];
    const options = {
      alwaysPrefix: true,
    };
    const tableName = 'users';
    const expectedResult = [ // child = always tableName. as ~
      'users.id as users_id',
      'users.timestamp_created as users_timestamp_created',
      'username as users_username',
      'password as users_password',
      'first_name as users_first_name',
    ];
    const result = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys same on valid input with default or given option 1', () => { 
    const tableName = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const commonSc = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as table_id', // default is child, child prefixes on common
      'table.id_user as table_id_user', 
      'slope_pct'
    ];
    const prefixedKeys = prefixCommonKeys(tableName, keys, commonSc);
    expect(prefixedKeys).to.deep.equal(expectedResult);
    const options = {
      case: 'Sc', 
      parent: false,
      alwaysPrefix: false,
    };
    const prefixedKeys1 = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys same on valid input with default or given option 1', () => { 
    const tableName = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const commonSc = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as table_id', // default is child, child prefixes on common
      'table.id_user as table_id_user', 
      'slope_pct'
    ];
    const options = {
      case: 'Sc', 
      parent: false,
      alwaysPrefix: false,
    };
    const prefixedKeys = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(prefixedKeys).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes parent input but not output', () => { 
    const tableName = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const commonSc = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as id', 
      'table.id_user as id_user', 
      'slope_pct'
    ];
    const options = {case: 'Sc', parent: true};
    const prefixedKeys1 = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes parent input and output if always', () => { 
    const tableName = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const commonSc = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as table_id', 
      'table.id_user as table_id_user', 
      'slope_pct as table_slope_pct'
    ];
    const options = {
      case: 'Sc', 
      parent: true,
      alwaysPrefix: true
    };
    const prefixedKeys1 = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes common if child', () => { 
    const tableName = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const commonSc = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as table_id', 
      'table.id_user as table_id_user', 
      'slope_pct'
    ];
    const options = {
      case: 'Sc', 
      parent: false,
      alwaysPrefix: false,
    };
    const prefixedKeys1 = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes all if child and always', () => { 
    const tableName = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const commonSc = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as table_id', 
      'table.id_user as table_id_user', 
      'slope_pct as table_slope_pct'
    ];
    const options = {
      case: 'Sc', 
      parent: false,
      alwaysPrefix: true,
    };
    const prefixedKeys1 = prefixCommonKeys(tableName, keys, commonSc, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });

  it('createSqlFetchTableKeys joinTo 000, keyLoc 000', ()=> { 
    const tableNames = ['profiles', 'cassettes', 'tests'];
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 'id';
    const joinTosArray = [0,0,0];
    const keyLocsArray = [0,0,0];
    const expectedResult = {
      fetch: 'profiles.id as id, cassettes.id as cassettesId, tests.id as testsId, mediaCfSf, wtAstmDry',
      tableName: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on profiles.id_test = tests.id',
    };
    const result1 = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    const result2 = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray});
    const result3 = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey});
    expect(result1).to.deep.equal(expectedResult);
    expect(result2).to.deep.equal(expectedResult);
    expect(result3).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 001, keyLoc 002', ()=> { 
    const tableNames = ['profiles', 'cassettes', 'tests'];
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 'id';
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,2];
    const expectedResult = {
      fetch: 'profiles.id as id, cassettes.id as cassettesId, tests.id as testsId, mediaCfSf, wtAstmDry',
      tableName: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on cassettes.id = tests.id_cassette',
    };
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 000, keyLoc 002', ()=> { 
    const tableNames = ['profiles', 'cassettes', 'tests'];
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 'id';
    const joinTosArray = [0,0,0];
    const keyLocsArray = [0,0,2];
    const expectedResult = {
      fetch: 'profiles.id as id, cassettes.id as cassettesId, tests.id as testsId, mediaCfSf, wtAstmDry',
      tableName: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on profiles.id = tests.id_profile',
    };
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 001, keyLoc 002', ()=> { 
    const tableNames = ['profiles', 'cassettes', 'tests'];
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 'id';
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,2];
    const expectedResult = {
      fetch: 'profiles.id as id, cassettes.id as cassettesId, tests.id as testsId, mediaCfSf, wtAstmDry',
      tableName: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on cassettes.id = tests.id_cassette',
    };
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 001, keyLoc 002 table not ending in s', ()=> { 
    const tableNames = ['profiles', 'weatherLoFreq', 'tests'];
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 'id';
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,2];
    const expectedResult = {
      fetch: 'profiles.id as id, cassettes.id as cassettesId, tests.id as testsId, mediaCfSf, wtAstmDry',
      tableName: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join weatherLoFreq on profiles.id_weatherLoFreq = weatherLoFreq.id left join tests on weatherLoFreq.id = tests.id_weatherLoFreq',
    };
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys undefined on invalid table', ()=> { 
    const tableNames = 'tables';
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 'id';
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,1];
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(undefined);
  });
  it('createSqlFetchTableKeys undefined on no key array', ()=> { 
    const tableNames = ['profiles', 'cassettes', 'tests'];
    const keysToFetch  = 'not an array';
    const matchingKey  = 'id';
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,1];
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(undefined);
  });
  it('createSqlFetchTableKeys undefined on match key not a string', ()=> { 
    const tableNames = ['profiles', 'cassettes', 'tests'];
    const keysToFetch = [
      'profiles.id as id',
      'cassettes.id as cassettesId',
      'tests.id as testsId',
      'mediaCfSf',
      'wtAstmDry',
    ];
    const matchingKey  = 3; // not a string
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,1];
    const result = createSqlFetchTableKeys({tableNames, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(undefined);
  });

  it('validateRawKnex errs data not an object', () => {
    const data = undefined;
    const result = validateRawKnex(data);
    expect(result).to.haveOwnProperty('message');
  });
  it('validateRawKnex errs data has no rows', () => {
    const data = {};
    const result = validateRawKnex(data);
    expect(result).to.haveOwnProperty('message');
  });
  it('validateRawKnex errs rows not array', () => {
    const data = {rows: 1};
    const result = validateRawKnex(data);
    expect(result).to.haveOwnProperty('message');
  });
  it('validateRawKnex errs rows empty', () => {
    const data = {rows: []};
    const result = validateRawKnex(data);
    expect(result).to.haveOwnProperty('message');
  });
  it('validateRawKnex errs rows 0 not an object', () => {
    const data = {rows: ['not an object']};
    const result = validateRawKnex(data);
    expect(result).to.haveOwnProperty('message');
  });
  it('validateRawKnex does not err if rows[0] is an object', () => {
    const data = {rows: [{key: 'val'}]};
    const result = validateRawKnex(data);
    expect(result).to.not.haveOwnProperty('message');
  });
  it('validateRawKnex', () => {
    const data = {rows: [{k: 'v'}, {k: 'a'}]};
    const expectedResult = [{k: 'v'}, {k: 'a'}];
    const result = validateRawKnex(data);
    expect(result).to.deep.equal(expectedResult);
  });
  
});