'use strict';

const logger   = require('../comm/logger').createLogger('./test/custom-and-db.log'); // logs to a file
const { keys } = require('../helpers/keys');
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
  createSqlFetchTableKeys, } = require('../helpers/db');
const { 
  createArraysForJoins,
  oneToOneJoinTree,
  createRawJoinInstructions,
  createRawJoin3Keys,     } = require('../helpers/db-custom');
const {
  numbers, 
  nonNumberArrays,
  nonStringPrimitives,
  date1,
  date1String_d_t_z,
  date1StringDtz,
  date1StringDtmsz,       } = require('../test/helpers');
process.env.DB_MODE = 'test';

describe('helpers db and custom', ()=> { 

  let keyObject,
    testsJoinInstructions,
    stormsJoinInstructions,
    cassettesJoinInstructions,
    profilesJoinInstructions,
    coinusesJoinInstructions,
    componentsJoinInstructions,
    testsJoinFetchTableKeys,
    stormsJoinFetchTableKeys,
    cassettesJoinFetchTableKeys,
    profilesJoinFetchTableKeys,
    coinusesJoinFetchTableKeys,
    componentsJoinFetchTableKeys;

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

  it('formatReqBodyForKnex simple keys users', ()=> { 
    const body = {
      id: 7,
      username: 'brad',
      lastName: 'garner',
      badKey: 'delete this one'
    };
    const table = 'users';
    const action = 'PUT';
    const expectedResult = {
      username: 'brad',
      last_name: 'garner',
    };
    const result = formatReqBodyForKnex(body, keys, table, action);
    expect(result).to.deep.equal(expectedResult);
  });
  it('formatReqBodyForKnex simple keys cassettes', ()=> { 
    const body = {
      id: 7,
      nameCassette: 'brad cassette',
      badKey: 'delete this one'
    };
    const table = 'cassettes';
    const action = 'PUT';
    const expectedResult = {
      name_cassette: 'brad cassette',
    };
    const result = formatReqBodyForKnex(body, keys, table, action);
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
    const common = [
      'id',
      'timestamp_created'
    ];
    const table = 'users';
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
    const result = prefixCommonKeys(table, keys, common, options);
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
    const common = [
      'id',
      'timestamp_created'
    ];
    const table = 'users';
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
    const result = prefixCommonKeys(table, keys, common, options);
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
    const common = [
      'id',
      'timestamp_created'
    ];
    const table = 'users';
    const options = {
      case: 'cC',
    };
    const expectedResult = [ // child = always table. as ~
      'users.id as usersId',
      'users.timestamp_created as usersTimestampCreated',
      'username',
      'password',
      'first_name as firstName',
    ];
    const result = prefixCommonKeys(table, keys, common, options);
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
    const common = [
      'id',
      'timestamp_created'
    ];
    const table = 'users';
    const expectedResult = [ // child = always table. as ~
      'users.id as users_id',
      'users.timestamp_created as users_timestamp_created',
      'username',
      'password',
      'first_name',
    ];
    const result = prefixCommonKeys(table, keys, common);
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
    const common = [
      'id',
      'timestamp_created'
    ];
    const options = {
      alwaysPrefix: true,
    };
    const table = 'users';
    const expectedResult = [ // child = always table. as ~
      'users.id as users_id',
      'users.timestamp_created as users_timestamp_created',
      'username as users_username',
      'password as users_password',
      'first_name as users_first_name',
    ];
    const result = prefixCommonKeys(table, keys, common, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys same on valid input with default or given option 1', () => { 
    const table = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const common = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as table_id', // default is child, child prefixes on common
      'table.id_user as table_id_user', 
      'slope_pct'
    ];
    const prefixedKeys = prefixCommonKeys(table, keys, common);
    expect(prefixedKeys).to.deep.equal(expectedResult);
    const options = {
      case: 'Sc', 
      parent: false,
      alwaysPrefix: false,
    };
    const prefixedKeys1 = prefixCommonKeys(table, keys, common, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys same on valid input with default or given option 1', () => { 
    const table = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const common = [
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
    const prefixedKeys = prefixCommonKeys(table, keys, common, options);
    expect(prefixedKeys).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes parent input but not output', () => { 
    const table = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const common = [
      'id', 
      'id_user'
    ];
    const expectedResult = [
      'table.id as id', 
      'table.id_user as id_user', 
      'slope_pct'
    ];
    const options = {case: 'Sc', parent: true};
    const prefixedKeys1 = prefixCommonKeys(table, keys, common, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes parent input and output if always', () => { 
    const table = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const common = [
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
    const prefixedKeys1 = prefixCommonKeys(table, keys, common, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes common if child', () => { 
    const table = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const common = [
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
    const prefixedKeys1 = prefixCommonKeys(table, keys, common, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });
  it('prefixCommonKeys prefixes all if child and always', () => { 
    const table = 'table';
    const keys = [
      'id', 
      'id_user', 
      'slope_pct'
    ];
    const common = [
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
    const prefixedKeys1 = prefixCommonKeys(table, keys, common, options);
    expect(prefixedKeys1).to.deep.equal(expectedResult);
  });

  // this populates hoisted keyObject
  // though it is not passed to createRawJoinInstructions as a parameter, but the function is called directly internal to createRawJoinInstructions...
  it('createArraysForJoins', ()=> { 
    // this function takes no parameters, so it requires manual update when we update keys.
    // can just output the actual result, see if it is reasonable, save that as expected result, and just use this to check for changes.
    const expectedResult = { 
      testsKeysSc: [ 
        'id',
        'id_user',
        'id_cassette',
        'id_storm',
        'slope_pct',
        'timestamp_created',
        'timestamp_on',
        'timestamp_off',
        'timestamp_end',
        'timestamp_start',
        'timestamp_rain_peak',
        'timestamp_retention_peak',
        'timestamp_runoff_peak_trans',
        'timestamp_runoff_peak_sheet',
        'timestamp_runoff_peak',
        'timestamp_runoff_last',
        'timestamp_absorbed_peak',
        'rain_rate_peak_in_sf_min',
        'runoff_rate_peak_in_sf_min',
        'runoff_rate_peak_reduction_pct',
        'runoff_delay_peak_mins',
        'runoff_delay_tail_mins',
        'absorbed_peak_pct',
        'links',
        'captions',
        'notes',
        'auto_off',
        'auto_end',
        'status_test',
        'error_level',
        'locked',
        'measurements',
        'indices' 
      ],
      stormsKeysSc: [ 
        'id',
        'id_user',
        'name_storm',
        'name_program',
        'durations_mins_raw',
        'duration_mins',
        'rates_dispensed_gpm_raw',
        'rates_dispensed_gpm',
        'rates_applied_gpm_raw',
        'rates_applied_gpm',
        'rates_overspray_gpm_raw',
        'rates_overspray_gpm',
        'timestamp_created',
        'timestamp_start_capture',
        'timestamp_end_capture',
        'pressure_max_raw',
        'pressure_min_raw',
        'pressure_raw',
        'rain_temp_c',
        'links',
        'captions',
        'notes',
        'locked',
        'id_user_locked',
        'error_level' 
      ],
      cassettesKeysSc: [ 
        'id',
        'id_user',
        'id_profile',
        'name_cassette',
        'size_sf',
        'wt_cassette_empty_lbs',
        'wt_initial_scale_lbs',
        'wt_dry_astm_lbs',
        'wt_max_astm_lbs',
        'media_cf',
        'initial_contents_lbs',
        'contents_dry_astm_lbs',
        'contents_max_astm_lbs',
        'cassette_max_lbs_water',
        'initial_water_lbs',
        'initial_pct_sat',
        'media_thickness_in_actual',
        'cassette_astm_dry_lbs_sf' ,
        'cassette_astm_max_lbs_sf' ,
        'cassette_thickness_in'    ,
        'total_ci'                 ,
        'initial_water_gals'       ,
        'initial_water_ci'         ,
        'initial_vwc'              ,
        'coinuse_details'          ,
        'timestamp_created',
        'timestamp_built',
        'timestamp_dismantled',
        'links',
        'captions',
        'notes',
        'locked',
        'id_user_locked',
        'error_level' 
      ],
      profilesKeysSc: [
        'id',
        'id_user',
        'name_profile',
        'media_thickness_in',
        'profile_astm_dry_lbs_sf',
        'profile_astm_max_lbs_sf',
        'profile_thickness_in',
        'media_cf_sf',
        'media_dry_lbs_sf',
        'media_max_lbs_sf',
        'coinuses_max_lbs_sf',
        'profile_max_vwc_pct',
        'profile_max_water_lbs_sf',
        'list_components',
        'timestamp_created',
        'links',
        'captions',
        'notes',
        'locked',
        'id_user_locked',
        'error_level' 
      ],
      componentsKeysSc: [ 
        'id',
        'id_user',
        'timestamp_created',
        'name_component',
        'type_component',
        'astm_dry_lbs_sf',
        'astm_dry_lbs_cf',
        'astm_max_lbs_sf',
        'astm_max_lbs_cf',
        'thickness_in',
        'links',
        'captions',
        'notes',
        'active',
        'locked',
        'id_user_locked',
        'error_level' 
      ],
      coinusesKeysSc: [ 
        'id',
        'id_user',
        'timestamp_created',
        'id_component',
        'id_profile',
        'layer_order',
        'astm_dry_lbs_sf',
        'astm_dry_lbs_cf',
        'astm_max_lbs_sf',
        'astm_max_lbs_cf',
        'thickness_in',
        'media_cf_sf',
        'notes',
        'archived'
      ],
      testsKeysScPrefixed: [ 
        'tests.id as id',
        'tests.id_user as id_user',
        'id_cassette',
        'id_storm',
        'slope_pct',
        'tests.timestamp_created as timestamp_created',
        'timestamp_on',
        'timestamp_off',
        'timestamp_end',
        'timestamp_start',
        'timestamp_rain_peak',
        'timestamp_retention_peak',
        'timestamp_runoff_peak_trans',
        'timestamp_runoff_peak_sheet',
        'timestamp_runoff_peak',
        'timestamp_runoff_last',
        'timestamp_absorbed_peak',
        'rain_rate_peak_in_sf_min',
        'runoff_rate_peak_in_sf_min',
        'runoff_rate_peak_reduction_pct',
        'runoff_delay_peak_mins',
        'runoff_delay_tail_mins',
        'absorbed_peak_pct',
        'tests.links as links',
        'tests.captions as captions',
        'tests.notes as notes',
        'auto_off',
        'auto_end',
        'status_test',
        'tests.error_level as error_level',
        'tests.locked as locked',
        'measurements',
        'indices' 
      ],
      testsKeysScPrefixedSub: [ 
        'tests.id as tests_id',
        'tests.id_user as tests_id_user',
        'id_cassette',
        'id_storm',
        'slope_pct',
        'tests.timestamp_created as tests_timestamp_created',
        'timestamp_on',
        'timestamp_off',
        'timestamp_end',
        'timestamp_start',
        'timestamp_rain_peak',
        'timestamp_retention_peak',
        'timestamp_runoff_peak_trans',
        'timestamp_runoff_peak_sheet',
        'timestamp_runoff_peak',
        'timestamp_runoff_last',
        'timestamp_absorbed_peak',
        'rain_rate_peak_in_sf_min',
        'runoff_rate_peak_in_sf_min',
        'runoff_rate_peak_reduction_pct',
        'runoff_delay_peak_mins',
        'runoff_delay_tail_mins',
        'absorbed_peak_pct',
        'tests.links as tests_links',
        'tests.captions as tests_captions',
        'tests.notes as tests_notes',
        'auto_off',
        'auto_end',
        'status_test',
        'tests.error_level as tests_error_level',
        'tests.locked as tests_locked',
        'measurements',
        'indices' 
      ],
      stormsKeysScPrefixed: [ 
        'storms.id as id',
        'storms.id_user as id_user',
        'name_storm',
        'name_program',
        'durations_mins_raw',
        'duration_mins',
        'rates_dispensed_gpm_raw',
        'rates_dispensed_gpm',
        'rates_applied_gpm_raw',
        'rates_applied_gpm',
        'rates_overspray_gpm_raw',
        'rates_overspray_gpm',
        'storms.timestamp_created as timestamp_created',
        'timestamp_start_capture',
        'timestamp_end_capture',
        'pressure_max_raw',
        'pressure_min_raw',
        'pressure_raw',
        'rain_temp_c',
        'storms.links as links',
        'storms.captions as captions',
        'storms.notes as notes',
        'storms.locked as locked',
        'storms.id_user_locked as id_user_locked',
        'storms.error_level as error_level' 
      ],
      stormsKeysScPrefixedSub: [ 
        'storms.id as storms_id',
        'storms.id_user as storms_id_user',
        'name_storm',
        'name_program',
        'durations_mins_raw',
        'duration_mins',
        'rates_dispensed_gpm_raw',
        'rates_dispensed_gpm',
        'rates_applied_gpm_raw',
        'rates_applied_gpm',
        'rates_overspray_gpm_raw',
        'rates_overspray_gpm',
        'storms.timestamp_created as storms_timestamp_created',
        'timestamp_start_capture',
        'timestamp_end_capture',
        'pressure_max_raw',
        'pressure_min_raw',
        'pressure_raw',
        'rain_temp_c',
        'storms.links as storms_links',
        'storms.captions as storms_captions',
        'storms.notes as storms_notes',
        'storms.locked as storms_locked',
        'storms.id_user_locked as storms_id_user_locked',
        'storms.error_level as storms_error_level' 
      ],
      cassettesKeysScPrefixed: [ 
        'cassettes.id as id',
        'cassettes.id_user as id_user',
        'cassettes.id_profile as id_profile',
        'name_cassette',
        'size_sf',
        'wt_cassette_empty_lbs',
        'wt_initial_scale_lbs',
        'wt_dry_astm_lbs',
        'wt_max_astm_lbs',
        'media_cf',
        'initial_contents_lbs',
        'contents_dry_astm_lbs',
        'contents_max_astm_lbs',
        'cassette_max_lbs_water',
        'initial_water_lbs',
        'initial_pct_sat',
        'media_thickness_in_actual',
        'cassette_astm_dry_lbs_sf' ,
        'cassette_astm_max_lbs_sf' ,
        'cassette_thickness_in'    ,
        'total_ci'                 ,
        'initial_water_gals'       ,
        'initial_water_ci'         ,
        'initial_vwc'              ,
        'coinuse_details'          ,
        'cassettes.timestamp_created as timestamp_created',
        'timestamp_built',
        'timestamp_dismantled',
        'cassettes.links as links',
        'cassettes.captions as captions',
        'cassettes.notes as notes',
        'cassettes.locked as locked',
        'cassettes.id_user_locked as id_user_locked',
        'cassettes.error_level as error_level' 
      ],
      cassettesKeysScPrefixedSub: [ 
        'cassettes.id as cassettes_id',
        'cassettes.id_user as cassettes_id_user',
        'cassettes.id_profile as cassettes_id_profile',
        'name_cassette',
        'size_sf',
        'wt_cassette_empty_lbs',
        'wt_initial_scale_lbs',
        'wt_dry_astm_lbs',
        'wt_max_astm_lbs',
        'media_cf',
        'initial_contents_lbs',
        'contents_dry_astm_lbs',
        'contents_max_astm_lbs',
        'cassette_max_lbs_water',
        'initial_water_lbs',
        'initial_pct_sat',
        'media_thickness_in_actual',
        'cassette_astm_dry_lbs_sf' ,
        'cassette_astm_max_lbs_sf' ,
        'cassette_thickness_in'    ,
        'total_ci'                 ,
        'initial_water_gals'       ,
        'initial_water_ci'         ,
        'initial_vwc'              ,
        'coinuse_details'          ,
        'cassettes.timestamp_created as cassettes_timestamp_created',
        'timestamp_built',
        'timestamp_dismantled',
        'cassettes.links as cassettes_links',
        'cassettes.captions as cassettes_captions',
        'cassettes.notes as cassettes_notes',
        'cassettes.locked as cassettes_locked',
        'cassettes.id_user_locked as cassettes_id_user_locked',
        'cassettes.error_level as cassettes_error_level' 
      ],
      profilesKeysScPrefixed: [ 
        'profiles.id as id',
        'profiles.id_user as id_user',
        'name_profile',
        'media_thickness_in',
        'profile_astm_dry_lbs_sf',
        'profile_astm_max_lbs_sf',
        'profile_thickness_in',
        'profiles.media_cf_sf as media_cf_sf',
        'media_dry_lbs_sf',
        'media_max_lbs_sf',
        'coinuses_max_lbs_sf',
        'profile_max_vwc_pct',
        'profile_max_water_lbs_sf',
        'list_components',
        'profiles.timestamp_created as timestamp_created',
        'profiles.links as links',
        'profiles.captions as captions',
        'profiles.notes as notes',
        'profiles.locked as locked',
        'profiles.id_user_locked as id_user_locked',
        'profiles.error_level as error_level' 
      ],
      profilesKeysScPrefixedSub: [ 
        'profiles.id as profiles_id',
        'profiles.id_user as profiles_id_user',
        'name_profile',
        'media_thickness_in',
        'profile_astm_dry_lbs_sf',
        'profile_astm_max_lbs_sf',
        'profile_thickness_in',
        'profiles.media_cf_sf as profiles_media_cf_sf',
        'media_dry_lbs_sf',
        'media_max_lbs_sf',
        'coinuses_max_lbs_sf',
        'profile_max_vwc_pct',
        'profile_max_water_lbs_sf',
        'list_components',
        'profiles.timestamp_created as profiles_timestamp_created',
        'profiles.links as profiles_links',
        'profiles.captions as profiles_captions',
        'profiles.notes as profiles_notes',
        'profiles.locked as profiles_locked',
        'profiles.id_user_locked as profiles_id_user_locked',
        'profiles.error_level as profiles_error_level' 
      ],
      componentsKeysScPrefixed: [
        'components.id as id',
        'components.id_user as id_user',
        'components.timestamp_created as timestamp_created',
        'name_component',
        'type_component',
        'components.astm_dry_lbs_sf as astm_dry_lbs_sf',
        'components.astm_dry_lbs_cf as astm_dry_lbs_cf',
        'components.astm_max_lbs_sf as astm_max_lbs_sf',
        'components.astm_max_lbs_cf as astm_max_lbs_cf',
        'components.thickness_in as thickness_in',
        'components.links as links',
        'components.captions as captions',
        'components.notes as notes',
        'components.active as active',
        'components.locked as locked',
        'components.id_user_locked as id_user_locked',
        'components.error_level as error_level' 
      ],
      componentsKeysScPrefixedSub: [
        'components.id as components_id',
        'components.id_user as components_id_user',
        'components.timestamp_created as components_timestamp_created',
        'name_component',
        'type_component',
        'components.astm_dry_lbs_sf as components_astm_dry_lbs_sf',
        'components.astm_dry_lbs_cf as components_astm_dry_lbs_cf',
        'components.astm_max_lbs_sf as components_astm_max_lbs_sf',
        'components.astm_max_lbs_cf as components_astm_max_lbs_cf',
        'components.thickness_in as components_thickness_in',
        'components.links as components_links',
        'components.captions as components_captions',
        'components.notes as components_notes',
        'components.active as components_active',
        'components.locked as components_locked',
        'components.id_user_locked as components_id_user_locked',
        'components.error_level as components_error_level' 
      ],
      coinusesKeysScPrefixed: [ 
        'coinuses.id as id',
        'coinuses.id_user as id_user',
        'coinuses.timestamp_created as timestamp_created',
        'id_component',
        'coinuses.id_profile as id_profile',
        'layer_order',
        'coinuses.astm_dry_lbs_sf as astm_dry_lbs_sf',
        'coinuses.astm_dry_lbs_cf as astm_dry_lbs_cf',
        'coinuses.astm_max_lbs_sf as astm_max_lbs_sf',
        'coinuses.astm_max_lbs_cf as astm_max_lbs_cf',
        'coinuses.thickness_in as thickness_in',
        'coinuses.media_cf_sf as media_cf_sf',
        'coinuses.notes as notes',
        'archived' 
      ],
      coinusesKeysScPrefixedSub: [ 
        'coinuses.id as coinuses_id',
        'coinuses.id_user as coinuses_id_user',
        'coinuses.timestamp_created as coinuses_timestamp_created',
        'id_component',
        'coinuses.id_profile as coinuses_id_profile',
        'layer_order',
        'coinuses.astm_dry_lbs_sf as coinuses_astm_dry_lbs_sf',
        'coinuses.astm_dry_lbs_cf as coinuses_astm_dry_lbs_cf',
        'coinuses.astm_max_lbs_sf as coinuses_astm_max_lbs_sf',
        'coinuses.astm_max_lbs_cf as coinuses_astm_max_lbs_cf',
        'coinuses.thickness_in as coinuses_thickness_in',
        'coinuses.media_cf_sf as coinuses_media_cf_sf',
        'coinuses.notes as coinuses_notes',
        'archived' 
      ] 
    };
    const result = createArraysForJoins();
    keyObject = result;
    expect(result).to.deep.equal(expectedResult);
  });

  // each of these hoists instructions for use in later tests
  it('createRawJoinInstructions tests', () => {
    const theTable = 'tests';
    const expectedResult = {
      matchingKey:    'id',
      tables:         [ 'tests', 'storms', 'cassettes', 'profiles' ],
      joinTosArray:   [ 0, 0, 0, 2 ],
      keyLocsArray:   [ 0, 0, 0, 2 ],
      joinTypesArray: [ 'left', 'left', 'left', 'left' ],
      keysToFetch: [
        'tests.id as id',
        'tests.id_user as id_user',
        'id_cassette',
        'id_storm',
        'slope_pct',
        'tests.timestamp_created as timestamp_created',
        'timestamp_on',
        'timestamp_off',
        'timestamp_end',
        'timestamp_start',
        'timestamp_rain_peak',
        'timestamp_retention_peak',
        'timestamp_runoff_peak_trans',
        'timestamp_runoff_peak_sheet',
        'timestamp_runoff_peak',
        'timestamp_runoff_last',
        'timestamp_absorbed_peak',
        'rain_rate_peak_in_sf_min',
        'runoff_rate_peak_in_sf_min',
        'runoff_rate_peak_reduction_pct',
        'runoff_delay_peak_mins',
        'runoff_delay_tail_mins',
        'absorbed_peak_pct',
        'tests.links as links',
        'tests.captions as captions',
        'tests.notes as notes',
        'auto_off',
        'auto_end',
        'status_test',
        'tests.error_level as error_level',
        'tests.locked as locked',
        'measurements',
        'indices',
        'storms.id as storms_id',
        'storms.id_user as storms_id_user',
        'name_storm',
        'name_program',
        'durations_mins_raw',
        'duration_mins',
        'rates_dispensed_gpm_raw',
        'rates_dispensed_gpm',
        'rates_applied_gpm_raw',
        'rates_applied_gpm',
        'rates_overspray_gpm_raw',
        'rates_overspray_gpm',
        'storms.timestamp_created as storms_timestamp_created',
        'timestamp_start_capture',
        'timestamp_end_capture',
        'pressure_max_raw',
        'pressure_min_raw',
        'pressure_raw',
        'rain_temp_c',
        'storms.links as storms_links',
        'storms.captions as storms_captions',
        'storms.notes as storms_notes',
        'storms.locked as storms_locked',
        'storms.id_user_locked as storms_id_user_locked',
        'storms.error_level as storms_error_level',
        'cassettes.id as cassettes_id',
        'cassettes.id_user as cassettes_id_user',
        'cassettes.id_profile as cassettes_id_profile',
        'name_cassette',
        'size_sf',
        'wt_cassette_empty_lbs',
        'wt_initial_scale_lbs',
        'wt_dry_astm_lbs',
        'wt_max_astm_lbs',
        'media_cf',
        'initial_contents_lbs',
        'contents_dry_astm_lbs',
        'contents_max_astm_lbs',
        'cassette_max_lbs_water',
        'initial_water_lbs',
        'initial_pct_sat',
        'media_thickness_in_actual',
        'cassette_astm_dry_lbs_sf' ,
        'cassette_astm_max_lbs_sf' ,
        'cassette_thickness_in'    ,
        'total_ci'                 ,
        'initial_water_gals'       ,
        'initial_water_ci'         ,
        'initial_vwc'              ,
        'coinuse_details'          ,
        'cassettes.timestamp_created as cassettes_timestamp_created',
        'timestamp_built',
        'timestamp_dismantled',
        'cassettes.links as cassettes_links',
        'cassettes.captions as cassettes_captions',
        'cassettes.notes as cassettes_notes',
        'cassettes.locked as cassettes_locked',
        'cassettes.id_user_locked as cassettes_id_user_locked',
        'cassettes.error_level as cassettes_error_level',
        'profiles.id as profiles_id',
        'profiles.id_user as profiles_id_user',
        'name_profile',
        'media_thickness_in',
        'profile_astm_dry_lbs_sf',
        'profile_astm_max_lbs_sf',
        'profile_thickness_in',
        'profiles.media_cf_sf as profiles_media_cf_sf',
        'media_dry_lbs_sf',
        'media_max_lbs_sf',
        'coinuses_max_lbs_sf',
        'profile_max_vwc_pct',
        'profile_max_water_lbs_sf',
        'list_components',
        'profiles.timestamp_created as profiles_timestamp_created',
        'profiles.links as profiles_links',
        'profiles.captions as profiles_captions',
        'profiles.notes as profiles_notes',
        'profiles.locked as profiles_locked',
        'profiles.id_user_locked as profiles_id_user_locked',
        'profiles.error_level as profiles_error_level'
      ]
    };
    const result = createRawJoinInstructions(theTable);
    testsJoinInstructions = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createRawJoinInstructions storms', () => {
    const theTable = 'storms';
    const expectedResult = {
      matchingKey:    'id',
      tables:         [ 'storms' ],
      joinTosArray:   [ 0 ],
      keyLocsArray:   [ 0 ],
      joinTypesArray: [ 'left' ],
      keysToFetch: [
        'storms.id as id',
        'storms.id_user as id_user',
        'name_storm',
        'name_program',
        'durations_mins_raw',
        'duration_mins',
        'rates_dispensed_gpm_raw',
        'rates_dispensed_gpm',
        'rates_applied_gpm_raw',
        'rates_applied_gpm',
        'rates_overspray_gpm_raw',
        'rates_overspray_gpm',
        'storms.timestamp_created as timestamp_created',
        'timestamp_start_capture',
        'timestamp_end_capture',
        'pressure_max_raw',
        'pressure_min_raw',
        'pressure_raw',
        'rain_temp_c',
        'storms.links as links',
        'storms.captions as captions',
        'storms.notes as notes',
        'storms.locked as locked',
        'storms.id_user_locked as id_user_locked',
        'storms.error_level as error_level'
      ]
    };
    const result = createRawJoinInstructions(theTable);
    stormsJoinInstructions = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createRawJoinInstructions cassettes', () => {
    const theTable = 'cassettes';
    const expectedResult = {
      matchingKey:    'id',
      tables:         [ 'cassettes', 'profiles' ],
      joinTosArray:   [ 0, 0 ],
      keyLocsArray:   [ 0, 0 ],
      joinTypesArray: [ 'left', 'left' ],
      keysToFetch: [
        'cassettes.id as id',
        'cassettes.id_user as id_user',
        'cassettes.id_profile as id_profile',
        'name_cassette',
        'size_sf',
        'wt_cassette_empty_lbs',
        'wt_initial_scale_lbs',
        'wt_dry_astm_lbs',
        'wt_max_astm_lbs',
        'media_cf',
        'initial_contents_lbs',
        'contents_dry_astm_lbs',
        'contents_max_astm_lbs',
        'cassette_max_lbs_water',
        'initial_water_lbs',
        'initial_pct_sat',
        'media_thickness_in_actual',
        'cassette_astm_dry_lbs_sf' ,
        'cassette_astm_max_lbs_sf' ,
        'cassette_thickness_in'    ,
        'total_ci'                 ,
        'initial_water_gals'       ,
        'initial_water_ci'         ,
        'initial_vwc'              ,
        'coinuse_details'          ,
        'cassettes.timestamp_created as timestamp_created',
        'timestamp_built',
        'timestamp_dismantled',
        'cassettes.links as links',
        'cassettes.captions as captions',
        'cassettes.notes as notes',
        'cassettes.locked as locked',
        'cassettes.id_user_locked as id_user_locked',
        'cassettes.error_level as error_level',
        'profiles.id as profiles_id',
        'profiles.id_user as profiles_id_user',
        'name_profile',
        'media_thickness_in',
        'profile_astm_dry_lbs_sf',
        'profile_astm_max_lbs_sf',
        'profile_thickness_in',
        'profiles.media_cf_sf as profiles_media_cf_sf',
        'media_dry_lbs_sf',
        'media_max_lbs_sf',
        'coinuses_max_lbs_sf',
        'profile_max_vwc_pct',
        'profile_max_water_lbs_sf',
        'list_components',
        'profiles.timestamp_created as profiles_timestamp_created',
        'profiles.links as profiles_links',
        'profiles.captions as profiles_captions',
        'profiles.notes as profiles_notes',
        'profiles.locked as profiles_locked',
        'profiles.id_user_locked as profiles_id_user_locked',
        'profiles.error_level as profiles_error_level'
      ]
    };
    const result = createRawJoinInstructions(theTable);
    cassettesJoinInstructions = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createRawJoinInstructions profiles', () => {
    const theTable = 'profiles';
    const expectedResult = {
      matchingKey:    'id',
      tables:         [ 'profiles' ],
      joinTosArray:   [ 0 ],
      keyLocsArray:   [ 0 ],
      joinTypesArray: [ 'left' ],
      keysToFetch: [
        'profiles.id as id',
        'profiles.id_user as id_user',
        'name_profile',
        'media_thickness_in',
        'profile_astm_dry_lbs_sf',
        'profile_astm_max_lbs_sf',
        'profile_thickness_in',
        'profiles.media_cf_sf as media_cf_sf',
        'media_dry_lbs_sf',
        'media_max_lbs_sf',
        'coinuses_max_lbs_sf',
        'profile_max_vwc_pct',
        'profile_max_water_lbs_sf',
        'list_components',
        'profiles.timestamp_created as timestamp_created',
        'profiles.links as links',
        'profiles.captions as captions',
        'profiles.notes as notes',
        'profiles.locked as locked',
        'profiles.id_user_locked as id_user_locked',
        'profiles.error_level as error_level'
      ]
    };
    const result = createRawJoinInstructions(theTable);
    profilesJoinInstructions = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createRawJoinInstructions components', () => {
    const theTable = 'components';
    const expectedResult = {
      matchingKey:    'id',
      tables:         [ 'components' ],
      joinTosArray:   [ 0 ],
      keyLocsArray:   [ 0 ],
      joinTypesArray: [ 'left' ],
      keysToFetch: [
        'components.id as id',
        'components.id_user as id_user',
        'components.timestamp_created as timestamp_created',
        'name_component',
        'type_component',
        'components.astm_dry_lbs_sf as astm_dry_lbs_sf',
        'components.astm_dry_lbs_cf as astm_dry_lbs_cf',
        'components.astm_max_lbs_sf as astm_max_lbs_sf',
        'components.astm_max_lbs_cf as astm_max_lbs_cf',
        'components.thickness_in as thickness_in',
        'components.links as links',
        'components.captions as captions',
        'components.notes as notes',
        'components.active as active',
        'components.locked as locked',
        'components.id_user_locked as id_user_locked',
        'components.error_level as error_level'
      ]
    };
    const result = createRawJoinInstructions(theTable);
    componentsJoinInstructions = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createRawJoinInstructions coinuses', () => {
    const theTable = 'coinuses';
    const expectedResult = {
      matchingKey:    'id',
      tables:         [ 'coinuses', 'components' ],
      joinTosArray:   [ 0, 0 ],
      keyLocsArray:   [ 0, 0 ],
      joinTypesArray: [ 'left', 'left' ],
      keysToFetch: [
        'coinuses.id as id',
        'coinuses.id_user as id_user',
        'coinuses.timestamp_created as timestamp_created',
        'id_component',
        'coinuses.id_profile as id_profile',
        'layer_order',
        'coinuses.astm_dry_lbs_sf as astm_dry_lbs_sf',
        'coinuses.astm_dry_lbs_cf as astm_dry_lbs_cf',
        'coinuses.astm_max_lbs_sf as astm_max_lbs_sf',
        'coinuses.astm_max_lbs_cf as astm_max_lbs_cf',
        'coinuses.thickness_in as thickness_in',
        'coinuses.media_cf_sf as media_cf_sf',
        'coinuses.notes as notes',
        'archived',
        'components.id as components_id',
        'components.id_user as components_id_user',
        'components.timestamp_created as components_timestamp_created',
        'name_component',
        'type_component',
        'components.astm_dry_lbs_sf as components_astm_dry_lbs_sf',
        'components.astm_dry_lbs_cf as components_astm_dry_lbs_cf',
        'components.astm_max_lbs_sf as components_astm_max_lbs_sf',
        'components.astm_max_lbs_cf as components_astm_max_lbs_cf',
        'components.thickness_in as components_thickness_in',
        'components.links as components_links',
        'components.captions as components_captions',
        'components.notes as components_notes',
        'components.active as components_active',
        'components.locked as components_locked',
        'components.id_user_locked as components_id_user_locked',
        'components.error_level as components_error_level'
      ]
    };
    const result = createRawJoinInstructions(theTable);
    coinusesJoinInstructions = result;
    expect(result).to.deep.equal(expectedResult);
  });


  // these hoist ~FetchTableKeys for later comparisons
  it('createSqlFetchTableKeys testsJoinInstructions', ()=> { 
    const expectedResult = {
      fetch: 'tests.id as id, tests.id_user as id_user, id_cassette, id_storm, slope_pct, tests.timestamp_created as timestamp_created, timestamp_on, timestamp_off, timestamp_end, timestamp_start, timestamp_rain_peak, timestamp_retention_peak, timestamp_runoff_peak_trans, timestamp_runoff_peak_sheet, timestamp_runoff_peak, timestamp_runoff_last, timestamp_absorbed_peak, rain_rate_peak_in_sf_min, runoff_rate_peak_in_sf_min, runoff_rate_peak_reduction_pct, runoff_delay_peak_mins, runoff_delay_tail_mins, absorbed_peak_pct, tests.links as links, tests.captions as captions, tests.notes as notes, auto_off, auto_end, status_test, tests.error_level as error_level, tests.locked as locked, measurements, indices, storms.id as storms_id, storms.id_user as storms_id_user, name_storm, name_program, durations_mins_raw, duration_mins, rates_dispensed_gpm_raw, rates_dispensed_gpm, rates_applied_gpm_raw, rates_applied_gpm, rates_overspray_gpm_raw, rates_overspray_gpm, storms.timestamp_created as storms_timestamp_created, timestamp_start_capture, timestamp_end_capture, pressure_max_raw, pressure_min_raw, pressure_raw, rain_temp_c, storms.links as storms_links, storms.captions as storms_captions, storms.notes as storms_notes, storms.locked as storms_locked, storms.id_user_locked as storms_id_user_locked, storms.error_level as storms_error_level, cassettes.id as cassettes_id, cassettes.id_user as cassettes_id_user, cassettes.id_profile as cassettes_id_profile, name_cassette, size_sf, wt_cassette_empty_lbs, wt_initial_scale_lbs, wt_dry_astm_lbs, wt_max_astm_lbs, media_cf, initial_contents_lbs, contents_dry_astm_lbs, contents_max_astm_lbs, cassette_max_lbs_water, initial_water_lbs, initial_pct_sat, media_thickness_in_actual, cassette_astm_dry_lbs_sf, cassette_astm_max_lbs_sf, cassette_thickness_in, total_ci, initial_water_gals, initial_water_ci, initial_vwc, coinuse_details, cassettes.timestamp_created as cassettes_timestamp_created, timestamp_built, timestamp_dismantled, cassettes.links as cassettes_links, cassettes.captions as cassettes_captions, cassettes.notes as cassettes_notes, cassettes.locked as cassettes_locked, cassettes.id_user_locked as cassettes_id_user_locked, cassettes.error_level as cassettes_error_level, profiles.id as profiles_id, profiles.id_user as profiles_id_user, name_profile, media_thickness_in, profile_astm_dry_lbs_sf, profile_astm_max_lbs_sf, profile_thickness_in, profiles.media_cf_sf as profiles_media_cf_sf, media_dry_lbs_sf, media_max_lbs_sf, coinuses_max_lbs_sf, profile_max_vwc_pct, profile_max_water_lbs_sf, list_components, profiles.timestamp_created as profiles_timestamp_created, profiles.links as profiles_links, profiles.captions as profiles_captions, profiles.notes as profiles_notes, profiles.locked as profiles_locked, profiles.id_user_locked as profiles_id_user_locked, profiles.error_level as profiles_error_level',
      table: 'tests',
      join: 'left join storms on tests.id_storm = storms.id left join cassettes on tests.id_cassette = cassettes.id left join profiles on cassettes.id_profile = profiles.id' 
    };
    const result = createSqlFetchTableKeys(testsJoinInstructions);
    logger.info('tests 3 keys', result);
    testsJoinFetchTableKeys = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys stormsJoinInstructions', ()=> { 
    const expectedResult = { 
      fetch: 'storms.id as id, storms.id_user as id_user, name_storm, name_program, durations_mins_raw, duration_mins, rates_dispensed_gpm_raw, rates_dispensed_gpm, rates_applied_gpm_raw, rates_applied_gpm, rates_overspray_gpm_raw, rates_overspray_gpm, storms.timestamp_created as timestamp_created, timestamp_start_capture, timestamp_end_capture, pressure_max_raw, pressure_min_raw, pressure_raw, rain_temp_c, storms.links as links, storms.captions as captions, storms.notes as notes, storms.locked as locked, storms.id_user_locked as id_user_locked, storms.error_level as error_level',
      table: 'storms',
      join: '' };
    const result = createSqlFetchTableKeys(stormsJoinInstructions);
    logger.info('storm 3 keys', result);
    stormsJoinFetchTableKeys = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys cassettesJoinInstructions', ()=> { 
    const expectedResult = {
      fetch: 'cassettes.id as id, cassettes.id_user as id_user, cassettes.id_profile as id_profile, name_cassette, size_sf, wt_cassette_empty_lbs, wt_initial_scale_lbs, wt_dry_astm_lbs, wt_max_astm_lbs, media_cf, initial_contents_lbs, contents_dry_astm_lbs, contents_max_astm_lbs, cassette_max_lbs_water, initial_water_lbs, initial_pct_sat, media_thickness_in_actual, cassette_astm_dry_lbs_sf, cassette_astm_max_lbs_sf, cassette_thickness_in, total_ci, initial_water_gals, initial_water_ci, initial_vwc, coinuse_details, cassettes.timestamp_created as timestamp_created, timestamp_built, timestamp_dismantled, cassettes.links as links, cassettes.captions as captions, cassettes.notes as notes, cassettes.locked as locked, cassettes.id_user_locked as id_user_locked, cassettes.error_level as error_level, profiles.id as profiles_id, profiles.id_user as profiles_id_user, name_profile, media_thickness_in, profile_astm_dry_lbs_sf, profile_astm_max_lbs_sf, profile_thickness_in, profiles.media_cf_sf as profiles_media_cf_sf, media_dry_lbs_sf, media_max_lbs_sf, coinuses_max_lbs_sf, profile_max_vwc_pct, profile_max_water_lbs_sf, list_components, profiles.timestamp_created as profiles_timestamp_created, profiles.links as profiles_links, profiles.captions as profiles_captions, profiles.notes as profiles_notes, profiles.locked as profiles_locked, profiles.id_user_locked as profiles_id_user_locked, profiles.error_level as profiles_error_level',
      table: 'cassettes',
      join: 'left join profiles on cassettes.id_profile = profiles.id' 
    };
    const result = createSqlFetchTableKeys(cassettesJoinInstructions);
    logger.info('cass 3 keys', result);
    cassettesJoinFetchTableKeys = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys profilesJoinInstructions', ()=> { 
    const expectedResult = { 
      fetch: 'profiles.id as id, profiles.id_user as id_user, name_profile, media_thickness_in, profile_astm_dry_lbs_sf, profile_astm_max_lbs_sf, profile_thickness_in, profiles.media_cf_sf as media_cf_sf, media_dry_lbs_sf, media_max_lbs_sf, coinuses_max_lbs_sf, profile_max_vwc_pct, profile_max_water_lbs_sf, list_components, profiles.timestamp_created as timestamp_created, profiles.links as links, profiles.captions as captions, profiles.notes as notes, profiles.locked as locked, profiles.id_user_locked as id_user_locked, profiles.error_level as error_level',
      table: 'profiles',
      join: '' 
    };
    const result = createSqlFetchTableKeys(profilesJoinInstructions);
    logger.info('profile 3 keys', result);
    profilesJoinFetchTableKeys = result;
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys coinusesJoinInstructions', ()=> { 
    const expectedResult = { 
      fetch: 'coinuses.id as id, coinuses.id_user as id_user, coinuses.timestamp_created as timestamp_created, id_component, coinuses.id_profile as id_profile, layer_order, coinuses.astm_dry_lbs_sf as astm_dry_lbs_sf, coinuses.astm_dry_lbs_cf as astm_dry_lbs_cf, coinuses.astm_max_lbs_sf as astm_max_lbs_sf, coinuses.astm_max_lbs_cf as astm_max_lbs_cf, coinuses.thickness_in as thickness_in, coinuses.media_cf_sf as media_cf_sf, coinuses.notes as notes, archived, components.id as components_id, components.id_user as components_id_user, components.timestamp_created as components_timestamp_created, name_component, type_component, components.astm_dry_lbs_sf as components_astm_dry_lbs_sf, components.astm_dry_lbs_cf as components_astm_dry_lbs_cf, components.astm_max_lbs_sf as components_astm_max_lbs_sf, components.astm_max_lbs_cf as components_astm_max_lbs_cf, components.thickness_in as components_thickness_in, components.links as components_links, components.captions as components_captions, components.notes as components_notes, components.active as components_active, components.locked as components_locked, components.id_user_locked as components_id_user_locked, components.error_level as components_error_level',
      table: 'coinuses',
      join:  'left join components on coinuses.id_component = components.id' 
    };
    const result = createSqlFetchTableKeys(coinusesJoinInstructions);
    logger.info('coin 3 keys', result);
    expect(result).to.deep.equal(expectedResult);
    coinusesJoinFetchTableKeys = result;
  });  
  it('createSqlFetchTableKeys componentsJoinInstructions', ()=> { 
    const expectedResult = {
      fetch: 'components.id as id, components.id_user as id_user, components.timestamp_created as timestamp_created, name_component, type_component, components.astm_dry_lbs_sf as astm_dry_lbs_sf, components.astm_dry_lbs_cf as astm_dry_lbs_cf, components.astm_max_lbs_sf as astm_max_lbs_sf, components.astm_max_lbs_cf as astm_max_lbs_cf, components.thickness_in as thickness_in, components.links as links, components.captions as captions, components.notes as notes, components.active as active, components.locked as locked, components.id_user_locked as id_user_locked, components.error_level as error_level',
      table: 'components',
      join: ''
    };
    const result = createSqlFetchTableKeys(componentsJoinInstructions);
    logger.info('compon 3 keys', result);
    componentsJoinFetchTableKeys = result;
    expect(result).to.deep.equal(expectedResult);
  });

  it('createSqlFetchTableKeys joinTo 000, keyLoc 000', ()=> { 
    const tables = ['profiles', 'cassettes', 'tests'];
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
      table: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on profiles.id_test = tests.id',
    };
    const result1 = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    const result2 = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray});
    const result3 = createSqlFetchTableKeys({tables, keysToFetch, matchingKey});
    expect(result1).to.deep.equal(expectedResult);
    expect(result2).to.deep.equal(expectedResult);
    expect(result3).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 001, keyLoc 002', ()=> { 
    const tables = ['profiles', 'cassettes', 'tests'];
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
      table: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on cassettes.id = tests.id_cassette',
    };
    const result = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 000, keyLoc 002', ()=> { 
    const tables = ['profiles', 'cassettes', 'tests'];
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
      table: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on profiles.id = tests.id_profile',
    };
    const result = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys joinTo 001, keyLoc 002', ()=> { 
    const tables = ['profiles', 'cassettes', 'tests'];
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
      table: 'profiles',
      // first 0 in joinToing says cassettes joins to 0 of tables (profiles); the 1 in joinToing says join tests to cassettes (not profiles); the 1 in keyLocping says the foreign key is in tests, not cassettes
      join: 'left join cassettes on profiles.id_cassette = cassettes.id left join tests on cassettes.id = tests.id_cassette',
    };
    const result = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(expectedResult);
  });
  it('createSqlFetchTableKeys undefined on tables', ()=> { 
    const tables = 'tables';
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
    const result = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(undefined);
  });
  it('createSqlFetchTableKeys undefined on no key array', ()=> { 
    const tables = ['profiles', 'cassettes', 'tests'];
    const keysToFetch  = 'not an array';
    const matchingKey  = 'id';
    const joinTosArray = [0,0,1];
    const keyLocsArray = [0,0,1];
    const result = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(undefined);
  });
  it('createSqlFetchTableKeys undefined on match key not a string', ()=> { 
    const tables = ['profiles', 'cassettes', 'tests'];
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
    const result = createSqlFetchTableKeys({tables, keysToFetch, matchingKey, joinTosArray, keyLocsArray});
    expect(result).to.deep.equal(undefined);
  });
  
  it('createRetentionRawSql', () => {

  });

  it('validateLinkUpdate', () => {

  });

  it('oneToOneJoinTree HAS NOT CHANGED', () => {
    // this test is just to confirm whether the tree changes
    // if this test fails, then the tree has changed, and the subsequent test will need to be updated below
    const expectedResult = {
      tests: [
        {
          table:       'tests',
          matchTo:     0, // self
          keyLocation: 0, // self
        },
        { 
          table:       'storms',
          matchTo:     0, // i.e. storms join to tests
          keyLocation: 0, // i.e. tests.id_storm === storms.id
        },
        { 
          table:       'cassettes',
          matchTo:     0, // i.e. cassettes join to tests
          keyLocation: 0, // i.e. tests.id_cassette === cassettes.id
        },
        { 
          table:       'profiles',
          matchTo:     2, // i.e. profiles join to cassettes
          keyLocation: 2, // i.e. cassettes.id_profile === profiles.id
        },
        { 
          table:       'coinuses',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        },
        { 
          table:       'components',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        },
      ],
      storms: [
        { 
          table:       'storms',
          matchTo:     0, // self
          keyLocation: 0, // self
        },
      ],
      cassettes: [
        { 
          table:       'cassettes',
          matchTo:     0, // self
          keyLocation: 0, // self
        },
        { 
          table:       'profiles',
          matchTo:     0, // i.e. profiles join to cassettes
          keyLocation: 0, // i.e. cassettes.id_profile === profiles.id
        },
        { 
          table:       'coinuses',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        },
        { 
          table:       'components',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        },
      ],
      profiles: [
        { 
          table:       'profiles',
          matchTo:     0, // self
          keyLocation: 0, // self
        },
        { 
          table:       'coinuses',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        },
        { 
          table:       'components',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        },
      ],
      components: [
        { 
          table:       'components',
          matchTo:     0, // self
          keyLocation: 0, // self
        },
        { 
          table:       'coinuses',
          matchTo:     null, // i.e. do not include
          keyLocation: null, // i.e. do not include
        }
      ],
      coinuses: [
        { 
          table:       'coinuses',
          matchTo:     0, // self
          keyLocation: 0, // self
        },
        { 
          table:       'components',
          matchTo:     0, // join to coinuses
          keyLocation: 0, // i.e. coinuses.id_component === components.id
        }
      ],
    };
    expect(oneToOneJoinTree).to.deep.equal(expectedResult);
  });


  it('createRawJoin3Keys tests', () => {
    const result = createRawJoin3Keys('tests');
    expect(result).to.deep.equal(testsJoinFetchTableKeys);
  });
  it('createRawJoin3Keys storms', () => {
    const result = createRawJoin3Keys('storms');
    expect(result).to.deep.equal(stormsJoinFetchTableKeys);
  });
  it('createRawJoin3Keys cassettes', () => {
    const result = createRawJoin3Keys('cassettes');
    expect(result).to.deep.equal(cassettesJoinFetchTableKeys);
  });
  it('createRawJoin3Keys profiles', () => {
    const result = createRawJoin3Keys('profiles');
    expect(result).to.deep.equal(profilesJoinFetchTableKeys);
  });
  it('createRawJoin3Keys coinuses', () => {
    const result = createRawJoin3Keys('coinuses');
    expect(result).to.deep.equal(coinusesJoinFetchTableKeys);
  });
  it('createRawJoin3Keys components', () => {
    const result = createRawJoin3Keys('components');
    expect(result).to.deep.equal(componentsJoinFetchTableKeys);
  });


});