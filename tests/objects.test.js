'use strict';

const chai = require('chai');
const { addTime } = require('../build/date-time');
const expect = chai.expect;

const { 
  // object keys
  convertObjectKeyCase, 
  prefixObjectKeys,
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
  convertTimestampToString
} = require('../index');

const {
  nonObjects,
  nonStringPrimitives,
  nonCompoundArrays,
  date0, 
  date1,
  date2,
  date3,
  date5,
  hour0, 
  hour1, 
  hour2, 
  hour3,
  hour5 }   = require('./helper-data');

describe('conjunction-junction objects', () => { 

  it('convertObjectKeyCase empty string on invalid input', () => { 
    const objects = [
      {
        id: 1,
        id2: 2,
        snake_case: 'snakeCase',
        camelCase: {
          snake_case: 'this is not recursive'
        },
        number_item: 3,
        numberItem: 4,
      },
      {
        nothing: 0,
        should: 'change',
        here: null,
      }
    ];
    const expectedResults = [
      {
        id: 1,
        id2: 2,
        snakeCase: 'snakeCase',
        camelCase: {
          snake_case: 'this is not recursive'
        },
        numberItem: 4,
      },
      {
        nothing: 0,
        should: 'change',
        here: null,
      }
    ];
    objects.forEach((o,i)=>{
      const result = convertObjectKeyCase(o);
      expect(result).to.deep.equal(expectedResults[i]);
    });
  });
  it('convertObjectKeyCase cC t Sc', () => {
    const o = {
      snake_key: 'same',
      camelCase: 'change',
      camel_snakeCase: 'part-change',
    };
    const expectedResult = {
      snake_key: 'same',
      camel_case: 'change',
      camel_snake_case: 'part-change',
    };
    const result = convertObjectKeyCase(o, 'Sc');
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertObjectKeyCase empty object on invalid input', () => {
    nonObjects.forEach(o=>{
      const result = convertObjectKeyCase(o);
      expect(result).to.deep.equal({});
    });
  });

  it('getKeyArray returns list of column 0, default action', () => {
    const input = {
      action: null,
      position1: 0,
      // const position2 = 1; // leave this undefined intentionally
      key: 'users',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name',
      'last_name',
      'email',
      'pw_reset',
      'permissions',
    ];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns list of column 0, explicit action', () => {
    const input = {
      action: 'list',
      position1: 0,
      // position2: 1, // leave this undefined intentionally
      key: 'users',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name',
      'last_name',
      'email',
      'pw_reset',
      'permissions',
    ];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns list of column 1', () => {
    const input = {
      action: 'list',
      position1: 1,
      // position2: 1, // leave this undefined intentionally
      key: 'users',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [
      'id',
      'timestampCreated',
      'username',
      'password',
      'firstName',
      'lastName',
      'email',
      'pwReset',
      'permissions',
    ];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns filter of column 0', () => {
    const input = {
      action: 'filter',
      position1: 0,
      position2: 2, // filter by column 2
      key: 'users',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [
      'username',
      'password',
      'first_name',
      'last_name',
      'email',
      'permissions',
    ];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns column 0 as column 1', () => {
    const input = {
      action: 'field',
      position1: 0,
      position2: 1,
      key: 'users',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [
      'id',
      'timestamp_created as timestampCreated',
      'username',
      'password',
      'first_name as firstName',
      'last_name as lastName',
      'email',
      'pw_reset as pwReset',
      'permissions',
    ];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns filter of column 0', () => {
    const input = {
      action: 'object list',
      position1: 0,
      position2: 7, 
      key: 'users',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = {
      username: {min: 1 },
      password: {min: 8, max: 72 },
    };
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns match of column 0', () => {
    const input = {
      action: 'match',
      position1: 0,
      position2: 4, 
      key: 'users',
      match: 'bag',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    'bag', false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    'shoe', false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    'hat' , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    'hat' , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    'hat' , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    'shoe' , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    'bag' , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    'bag' , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    'shoe' , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [
      'id',
      'email',
      'pw_reset',
    ];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid key lookup', () => {
    const input = {
      action: 'list',
      position1: 1,
      position2: 0,
      key: 'components',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid key array', () => {
    const input = {
      action: 'filter',
      position1: 1,
      position2: 0,
      key: 'components',
      keys: {
        users: 'whoa! There should be an array here!'
      }
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid key compound array', () => {
    const input = {
      action: 'list',
      position1: 1,
      position2: 0,
      key: 'components',
      keys: {
        users: ['whoa! There should be a COMPOUND array here!']
      }
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid position1', () => {
    const input = {
      action: 'object list',
      position1: {notNumber: true},
      position2: 0,
      key: 'components',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid position1', () => {
    const input = {
      action: 'list',
      position1: 2,
      position2: 'invalid!!!!',
      key: 'components',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      },
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on non-string position1', () => {
    const input = {
      action: 'list',
      position1: 12, // position is invalid
      position2: 0,
      key: 'components',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on non-string position2', () => {
    const input = {
      action: 'list',
      position1: 0, 
      position2: -1,// position -1 is invalid
      key: 'components',
      keys: {
        users: [
        //snake all             cC all              2POST   3POST req. 4PUT  5STRING 6TRIM 7SIZES 8NAME 9DEFINITIONS
          ['id'               ,'id'                ,false,  false,    false, false,  false, false,'user id'          ,'unique id'],
          ['timestamp_created','timestampCreated'  ,false,  false,    false, false,  false, false,'timestamp created','date and time of record creation'],
          ['username'         ,'username'          ,true ,  true ,    true , true ,  true , {min: 1 },'username'     ,'username'], 
          ['password'         ,'password'          ,true ,  true ,    true , true ,  true , {min: 8, max: 72 },'password','hashed password'],    
          ['first_name'       ,'firstName'         ,true ,  true ,    true , true ,  false, false,'first name'       ,'user\'s first name'], 
          ['last_name'        ,'lastName'          ,true ,  true ,    true , true ,  false, false,'last name'        ,'user\'s last name'], 
          ['email'            ,'email'             ,true ,  true ,    true , true ,  false, false,'user\'s email'    ,'user\'s email is only used for password recovery'], 
          ['pw_reset'         ,'pwReset'           ,false,  false,    true , true ,  false, false,'password reset'   ,'true if user must reset password'], 
          ['permissions'      ,'permissions'       ,true ,  true ,    true , false,  false, false,'permissions'      ,'user\'s permissions, including which server endpoints are authorized'], 
        ],
      }
    };
    const expectedResult = [];
    const result = getKeyArray(input);
    expect(result).to.deep.equal(expectedResult);
  });

  it('validateObjectKeysPresent ok when present', () => {
    const object = {
      username: 'brad',
      password: 'somethinghardtoguess##',
    };
    const arrayOfKeys = ['username', 'password'];
    const expectedResult = 'ok';
    const result = validateObjectKeysPresent(object, arrayOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeysPresent ok when extra present', () => {
    const object = {
      username: 'brad',
      password: 'somethinghardtoguess##',
      somethingElse: 'what\'s this doing here?',
    };
    const arrayOfKeys = ['username', 'password'];
    const expectedResult = 'ok';
    const result = validateObjectKeysPresent(object, arrayOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeysPresent reports missing field', () => {
    const object = {
      username: 'brad',
      somethingElse: 'what\'s this doing here?',
    };
    const arrayOfKeys = ['username', 'password'];
    const expectedResult = {
      message: 'Missing field',
      location: 'password',
    };
    const result = validateObjectKeysPresent(object, arrayOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeysPresent reports missing array', () => {
    const object = {
      username: 'brad',
      somethingElse: 'what\'s this doing here?',
    };
    const expectedResult = {
      message: 'Missing array of keys',
    };
    const result = validateObjectKeysPresent(object);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeysPresent reports missing input', () => {
    const arrayOfKeys = ['username', 'password'];
    const expectedResult = {
      message: 'Invalid input',
    };
    const result = validateObjectKeysPresent('not an object', arrayOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });

  it('validateObjectKeys ok if all keys present', () => {
    const object = {
      key: 1,
      anotherKey: 'Hey ya\'ll!',
    };
    const type = 'new';
    const rowOfKeys = ['key'];
    const expectedResult = 'ok';
    const result = validateObjectKeys(object, type, rowOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeys reports missing key', () => {
    const object = {
      wrongKey: 1,
      anotherKey: 'Hey ya\'ll!',
    };
    const type = 'new';
    const rowOfKeys = ['key'];
    const expectedResult = {
      message: 'Missing field',
      location: 'key',
    };
    const result = validateObjectKeys(object, type, rowOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeys ignores missing key if not new', () => {
    const object = {
      wrongKey: 1,
      anotherKey: 'Hey ya\'ll!',
    };
    const type = 'not new';
    const rowOfKeys = ['key'];
    const expectedResult = 'ok';
    const result = validateObjectKeys(object, type, rowOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeys reports invalid input', () => {
    const object = 'not an object';
    const type = 'not new';
    const rowOfKeys = ['key'];
    const expectedResult = {message: 'Invalid input'};
    const result = validateObjectKeys(object, type, rowOfKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeys ok if no array passed in', () => {
    const object = {
      wrongKey: 1,
      anotherKey: 'Share a coke and a smile',
    };
    const type = 'not new';
    const expectedResult = 'ok';
    const result = validateObjectKeys(object, type);
    expect(result).to.deep.equal(expectedResult);
  });
  it('validateObjectKeys ok if no type passed in', () => {
    const object = {
      wrongKey: 1,
      anotherKey: 'Wassssup?',
    };    
    const expectedResult = 'ok';
    const result = validateObjectKeys(object);
    expect(result).to.deep.equal(expectedResult);
  });

  it('limitObjectKeys limits on valid input', () => {
    const object = {
      key1: 1,
      key2: 2,
      string: 'a string',
      arr: [1, 'two', 3],
    };
    const limitingKeys = ['key1', 'string', 'arr'];
    const expectedResult = {
      key1: 1,
      string: 'a string',
      arr: [1, 'two', 3],
    };
    const result = limitObjectKeys(object, limitingKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('limitObjectKeys returns empty object on invalid input', () => {
    const object = 'not an object';
    const limitingKeys = ['key1', 'string', 'arr'];
    const expectedResult = {};
    const result = limitObjectKeys(object, limitingKeys);
    expect(result).to.deep.equal(expectedResult);
  });
  it('limitObjectKeys does not limit if no limits passed', () => {
    const object = {
      key1: 1,
      key2: 2,
      string: 'a string',
      arr: [1, 'two', 3],
    };
    const expectedResult = {
      key1: 1,
      key2: 2,
      string: 'a string',
      arr: [1, 'two', 3],
    };
    const result = limitObjectKeys(object);
    expect(result).to.deep.equal(expectedResult);
  });
  it('limitObjectKeys ignores extra keys in limited', () => {
    const object = {
      key1: 1,
      key2: 2,
      string: 'a string',
      arr: [1, 'two', 3],
    };
    const limitingKeys = ['key1', 'string', 'arr', 'we', 'can', 'keep', 'going'];
    const expectedResult = {
      key1: 1,
      string: 'a string',
      arr: [1, 'two', 3],
    };
    const result = limitObjectKeys(object, limitingKeys);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseValuesObj2Levels',()=>{
    const input = {
      obj1 : {
        sk1: 'value1',
        retValue1: 'wrong return',
      },
      obj2 : {
        sk2: 'value2',
        retValue2: 'correct return',
      },
      obj3 : {
        sk3: 'value3',
        retValue3: 'wrong return',
      }
    };
    const expectedResult = 'correct return';
    const result = parseValuesObj2Levels('value2',input,'sk2','retValue2');
    expect(result).to.deep.equal(expectedResult);
  });
  
  it('roundAllValues', ()=>{
    const roundingKey = {
      two: 2,
    };
    const object = {
      two: 2.222,
    };
    const expectedResult = {
      two: 2.22,
    };
    const result = roundAllValues(object, roundingKey);
    expect(result).to.deep.equal(expectedResult);
  });
  it('roundAllValues long', ()=>{
    const roundingKey = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
    };
    const object = {
      one: [1.1243, 2.34343, 5],
      two: 2.222,
      three: 3.3333333,
      four: 4.4444444444,
      arrayOfNums: [
        2,3,4
      ],
      arrayMixed: [
        1,2,{two: 2.2222222,}
      ],
      five: {
        six: 6.2454254523543253253,
        seven: 7,
      },
    };
    const expectedResult = {
      two: 2.22,
      three: 3.333,
      four: 4.4444,
      arrayOfNums: [
        2,3,4
      ],
      one: [1.1, 2.3, 5],
      arrayMixed: [
        1,2,{two: 2.22,}
      ],
      five: {
        six: 6.245425,
        seven: 7,
      },
    };
    const result = roundAllValues(object, roundingKey);
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseValuesFromArrayOfObj1Level returns an empty array if input is not an array',()=>{
    const array = 1;
    const result = parseValuesFromArrayOfObj1Level(array,'key');
    const expectedResult = [];
    expect(result).to.deep.equal(expectedResult);
  });

  it('parseValuesFromArrayOfObj1Level ',()=>{
    const array = [{key: 1, random: 6}, {key: 2, other: 5}];
    const result = parseValuesFromArrayOfObj1Level(array,'key');
    const expectedResult = [1,2];
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertArrayToObject returns empty object when input is not an array',()=>{
    const array = 1;
    const key = 'id';
    const result = convertArrayToObject(array,key);
    const expectedResult = {};
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertArrayToObject returns object corresponding to array',()=>{
    const array = [ {number:0}, {number:1} ];
    const key = 'number';
    const result = convertArrayToObject(array,key);
    const expectedResult = {
      0:{
        number: 0,
      },
      1:{
        number: 1,
      }
    };
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertArrayToObject returns empty object if input array contains no objects',()=>{
    const array = [1,2,3] ;
    const key = 'id';
    const result = convertArrayToObject(array,key);
    const expectedResult = {};
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertArrayToObject returns object corresponding to array when input array is made up of objects and other types',()=>{
    // const array.id = {};
    const array = [1, {id:1} ] ;
    const key = 'id';
    const result = convertArrayToObject(array,key);
    const expectedResult = {1:{ id: 1}};
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertObjectToArray returns an empty array if input is not an object',()=>{
    const obj = 1;
    const result = convertObjectToArray(obj);
    const expectedResult = [];
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertObjectToArray returns an empty array if input is not an object',()=>{
    const obj = ['string',2];
    const result = convertObjectToArray(obj);
    const expectedResult = [];
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertObjectToArray returns an array corresponding to the input object (1 key)',()=>{
    const obj = {number:1};
    const result = convertObjectToArray(obj);
    const expectedResult = [1];
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertObjectToArray returns an array corresponding to the input object (1 key)',()=>{
    const obj = {number:1,number2:2,number3:3};
    const result = convertObjectToArray(obj);
    const expectedResult = [1,2,3];
    expect(result).to.deep.equal(expectedResult);
  });

  it('subArrayByKey returns empty arrays if input array is not an array', () => {
    const array = 'string';
    const groupBy = 'key1';
    const expectedResult = {
      groupBy: 'key1',
      arrayOfDataGroups: [],
      arrayOfKeys: [],
      arraysOfDataObjects: [{}],
    };
    const result = subArrayByKey(array, groupBy);
    expect(result).to.deep.equal(expectedResult);
  });

  it('subArrayByKey returns empty arrays if input groupBy is not a string', () => {
    const array = [1,2,3];
    const groupBy = 1;
    const expectedResult = {
      groupBy: 1,
      arrayOfDataGroups: [],
      arrayOfKeys: [],
      arraysOfDataObjects: [{}],
    };
    const result = subArrayByKey(array, groupBy);
    expect(result).to.deep.equal(expectedResult);
  });
  
  it('subArrayByKey', () => {
    const array = [
      {
        key1: 1,
        key2: 2,
        string: 'a string',
        arr: [1, 'two', 3],
      },
      {
        key1: 111,
        key2: 21,
        string: 'another string',
        arr: [17, 'too', 33],
      },
      {
        key1: 1,
        key2: 23,
        string: 'one more string',
        arr: [77, 'TOO', 9],
      },
    ];
    const groupBy = 'key1';
    const expectedResult = {
      groupBy: 'key1',
      arrayOfDataGroups: [1, 111],
      arrayOfKeys: ['arr','key1','key2','string'],
      arraysOfDataObjects: [
        [
          {
            key1: 1,
            key2: 2,
            string: 'a string',
            arr: [1, 'two', 3],
          },
          {
            key1: 1,
            key2: 23,
            string: 'one more string',
            arr: [77, 'TOO', 9],
          },
        ],
        [
          {
            key1: 111,
            key2: 21,
            string: 'another string',
            arr: [17, 'too', 33],
          },
        ],
      ],
    };
    const result = subArrayByKey(array, groupBy);
    expect(result).to.deep.equal(expectedResult);
  });

  it('summarizeValuesByKey', () => {
    const arrayOfObjects = [
      {
        platform_runoff1a_gals_tot: 3,
        platform_runoff1b_gals_tot: 5,
        platform_runoff2a_gals_tot: 7, 
      },
      {
        platform_runoff1a_gals_tot: 9,
        platform_runoff1b_gals_tot: 15,
        platform_runoff2a_gals_tot: 27, 
      },
    ];
    const key = 'platform_runoff1a_gals_tot';
    const expectedResult = {
      max: 9,
      min: 3,
      avg: 6,
      tot: 12,
      messages: [
        'index 0 key platform_runoff1a_gals_tot: 3 >>> current highest value: 3, >>> current lowest value: 3, added >>> new cum. value: 3, counter: 1',
        'index 1 key platform_runoff1a_gals_tot: 9 >>> current highest value: 9, >>> current lowest value: 3, added >>> new cum. value: 12, counter: 2',
      ],
    };
    const result = summarizeValuesByKey(arrayOfObjects, key);
    expect(result).to.deep.equal(expectedResult);
  });

  it('summarizeValuesByKey returns error message if input array is not an array', () => {
    const arrayOfObjects = 'Not an array';
    const key = 'platform_runoff1a_gals_tot';
    const expectedResult = {
      value : null,
      message: 'err: no array of objects',
    };
    const result = summarizeValuesByKey(arrayOfObjects, key);
    expect(result).to.deep.equal(expectedResult);
  });

  it('summarizeValuesByKey returns error message if input key is not a string', () => {
    const arrayOfObjects = [{number:1},{number2:2}];
    const key = 123;
    const expectedResult = {
      value: null,
      message: 'err: key must be a string',
    };
    const result = summarizeValuesByKey(arrayOfObjects, key);
    expect(result).to.deep.equal(expectedResult);
  });

  it('summarizeValuesByKey returns object with error messages when key is not present in some of the objects and undefined in one of them', () => {
    const arrayOfObjects = [{number:1,number3:3},{number:1,number2:null,number3:3},{number:1,number3:3}];
    const key = 'number2';
    const expectedResult = {
      max: undefined,
      min: undefined,
      avg: 0,
      tot: 0,
      messages: [
        'err: index 0 key number2: was undefined',
        'err: index 1 key number2: was null (not a number)',
        'err: index 2 key number2: was undefined'
      ],
    };
    const result = summarizeValuesByKey(arrayOfObjects, key);
    expect(result).to.deep.equal(expectedResult);
  });

  it('summarizeValuesByKey returns object with error mesage for one object in input array', () => {
    const arrayOfObjects = [{number:1,number2:'string',number3:3},{number:1,number2:4,number3:3},{number:1,number2:6,number3:3}];
    const key = 'number2';
    const expectedResult = {
      max: 6,
      min: 4,
      avg: 5,
      tot: 10,
      messages: [
        'err: index 0 key number2: was string (not a number)',
        'index 1 key number2: 4 >>> current highest value: 4, >>> current lowest value: 4, added >>> new cum. value: 4, counter: 1',
        'index 2 key number2: 6 >>> current highest value: 6, >>> current lowest value: 4, added >>> new cum. value: 10, counter: 2'
      ],
    };
    const result = summarizeValuesByKey(arrayOfObjects, key);
    expect(result).to.deep.equal(expectedResult);
  });

  it('mergeArraysOfObjectsByKey empty array if no arr1', () => {
    const o1 = 'not an array';
    const o2 = [
      {
        timestamp: date0,
        key4: 4,
        key5: 5,
      },
      {
        timestamp: date1,
        key6: 6,
      },
    ];
    const expectedResult = [];
    const mergeOptions = {key1: 'timestamp', key2: 'timestamp', prefix: 'prefix_'};
    const result = mergeArraysOfObjectsByKey(o1, o2, mergeOptions);
    expect(result).to.deep.equal(expectedResult);
  });
  it('mergeArraysOfObjectsByKey arr1 if arr2 not array', () => {
    const o1 = [
      {
        timestamp: date0,
        key1: 1,
        key2: 2,
      },
      {
        timestamp: date1,
        key3: 3,
      },
    ];
    const o2 = 'not an array';
    const expectedResult = o1;
    const mergeOptions = {key1: 'timestamp', key2: 'timestamp', prefix: 'prefix_'};
    const result = mergeArraysOfObjectsByKey(o1, o2, mergeOptions);
    expect(result).to.deep.equal(expectedResult);
  });
  it('mergeArraysOfObjectsByKey empty array if no options', () => {
    const o1 = [
      {
        timestamp: date0,
        key1: 1,
        key2: 2,
      },
      {
        timestamp: date1,
        key3: 3,
      },
    ];
    const o2 = [
      {
        timestamp: date0,
        key4: 4,
        key5: 5,
      },
      {
        timestamp: date1,
        key6: 6,
      },
    ];
    const expectedResult = [];
    const mergeOptions = 'not an object';
    const result = mergeArraysOfObjectsByKey(o1, o2, mergeOptions);
    expect(result).to.deep.equal(expectedResult);
  });
  it('mergeArraysOfObjectsByKey empty array if options key missing', () => {
    const o1 = [
      {
        timestamp: date0,
        key1: 1,
        key2: 2,
      },
      {
        timestamp: date1,
        key3: 3,
      },
    ];
    const o2 = [
      {
        timestamp: date0,
        key4: 4,
        key5: 5,
      },
      {
        timestamp: date1,
        key6: 6,
      },
    ];
    const expectedResult = [];
    const requiredOptionsKeys = {key1: 'timestamp', key2: 'timestamp'};
    for(let k in requiredOptionsKeys){
      const mO = Object.assign({}, requiredOptionsKeys, {[k]: undefined});
      const result = mergeArraysOfObjectsByKey(o1, o2, mO);
      expect(result).to.deep.equal(expectedResult);
    }
  });
  it('mergeArraysOfObjectsByKey', () => {
    const o1 = [
      {
        timestamp: date0,
        key1: 1,
        key2: 2,
      },
      {
        timestamp: date1,
        key3: 3,
      },
    ];
    const o2 = [
      {
        timestamp: date0,
        key4: 4,
        key5: 5,
      },
      {
        timestamp: date1,
        key6: 6,
      },
    ];
    const expectedResult = [
      {
        timestamp: date0,
        prefix_timestamp: date0,
        key1: 1,
        key2: 2,
        key4: 4,
        key5: 5,
      },
      {
        timestamp: date1,
        prefix_timestamp: date1,
        key3: 3,
        key6: 6,
      },
    ];
    const mergeOptions = {key1: 'timestamp', key2: 'timestamp', prefix: 'prefix_'};
    const result = mergeArraysOfObjectsByKey(o1, o2, mergeOptions);
    expect(result).to.deep.equal(expectedResult);
  });

  it('filterSequentialItems all ok 1 minute',()=>{
    const options = {
      key : 'timestamp', 
      increment: 1, 
      tolerance: 0, 
      timestampUnits: 'minutes', 
      // extraLoggingKey: 
    };
    const arr = [
      {
        id: 1,
        timestamp: date0,
      },
      {
        id: 2,
        timestamp: date1,
      },
      {
        id: 3,
        timestamp: date2,
      },
    ];
    const expectedResult = {
      index: 2,
      stop: undefined,
      message: 'ok',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems part ok 1 minute',()=>{
    const options = {
      key : 'timestamp', 
      increment: 1, 
      tolerance: 0, 
      timestampUnits: 'minutes', 
      // extraLoggingKey: 
    };
    const arr = [
      {
        id: 0,
        timestamp: date0,
      },
      {
        id: 1,
        timestamp: date1,
      },
      {
        id: 2,
        timestamp: date3,
      },
    ];
    const e = {
      priorValidIndex: 1,
      priorValidId: 1,
      priorValidValue: date1,
      value: date3,
      delta: -2,
      absDelta: 2,

      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems all ok 60 minute',()=>{
    const options = {
      key : 'timestamp', 
      increment: 60, 
      tolerance: 0, 
      timestampUnits: 'minutes', 
      // extraLoggingKey: 
    };
    const arr = [
      {
        id: 1,
        timestamp: hour0,
      },
      {
        id: 2,
        timestamp: hour1,
      },
      {
        id: 3,
        timestamp: hour2,
      },
    ];
    const expectedResult = {
      index: 2,
      stop: undefined,
      message: 'ok',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems part ok 60 minute',()=>{
    const options = {
      key : 'timestamp', 
      increment: 60, 
      tolerance: 0, 
      timestampUnits: 'minutes', 
      // extraLoggingKey: 
    };
    const arr = [
      {
        id: 0,
        timestamp: hour0,
      },
      {
        id: 1,
        timestamp: hour1,
      },
      {
        id: 2,
        timestamp: hour3,
      },
    ];
    const e = {
      priorValidIndex: 1,
      priorValidId: 1,
      priorValidValue: hour1,
      value: hour3,
      delta: -120,
      absDelta: 120,
      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems errs if not array', ()=>{
    const arr = 'not an array';
    const options = {
      key: 'id',
      increment: 1,
      tolerance: 0,
    };
    const expectedResult = {
      index: 0, stop: 0,
      message: 'array to check for sequentiality is not an array',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems errs if no options object', ()=>{
    const arr = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      }
    ];
    const options = 'not an object';
    const expectedResult = {
      index: 0, 
      stop: 0,
      message: 'options for array sequentiality is not an object',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems errs if key not a string', ()=>{
    const arr = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      }
    ];
    const options = {
      key: 3,
      increment: 'one',
      tolerance: 0,
    };
    const expectedResult = {
      index: 0, 
      stop: 0,
      message: 'key to check for sequentiality is not a string',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems errs if increment NaN', ()=>{
    const arr = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      }
    ];
    const options = {
      key: 'id',
      increment: 'one',
      tolerance: 0,
    };
    const expectedResult = {
      index: 0, 
      stop: 0,
      message: 'increment to check for sequentiality is not a number',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems errs if tolerance NaN', ()=>{
    const arr = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 3,
      }
    ];
    const options = {
      key: 'id',
      increment: 1,
      tolerance: 'zero',
    };
    const expectedResult = {
      index: 0, 
      stop: 0,
      message: 'tolerance to check for sequentiality is not a number',
    };
    const result = filterSequentialItems(arr, options);
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems omits trailing gap integer key', ()=>{
    const arr = [
      {
        id: 1,
      },
      {
        id: 2,
      },
      {
        id: 4,
      }
    ];
    const options = {
      key: 'id',
      increment: 1,
      tolerance: 0,
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 1,
      priorValidId: 2,
      priorValidValue: 2,
      value: 4,
      delta: 2,
      absDelta: 2,

      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${arr[e.stop].id})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems omits trailing gap timestamp key', ()=>{
    const arr = [
      {
        timestamp: date0,
      },
      {
        timestamp: date1,
      },
      {
        timestamp: date5,
      }
    ];
    const options = {
      key: 'timestamp',
      increment: 1,
      tolerance: 0,
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 1,
      priorValidId: undefined,
      priorValidValue: date1,
      value: date5,
      delta: -4,
      absDelta: 4,

      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems omits trailing gap timestamp key hours', ()=>{
    const arr = [
      {
        timestamp: hour0,
      },
      {
        timestamp: hour1,
      },
      {
        timestamp: hour5,
      }
    ];
    const options = {
      key: 'timestamp',
      increment: 1,
      tolerance: 0,
      timestampUnits: 'hours',
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 1,
      priorValidId: undefined,
      priorValidValue: hour1,
      value: hour5,
      delta: -4,
      absDelta: 4,

      index: 1,
      stop: 2
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems omits trailing negative gap integer key', ()=>{
    const arr = [
      {
        id: 5,
      },
      {
        id: 6,
      },
      {
        id: 2,
      }
    ];
    const options = {
      key: 'id',
      increment: 1,
      tolerance: 0,
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 1,
      priorValidId: 6,
      priorValidValue: 6,
      value: 2,
      delta: -4,
      absDelta: 4,

      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${arr[e.stop].id})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems omits trailing negative gap timestamp key', ()=>{
    const arr = [
      {
        timestamp: date1,
      },
      {
        timestamp: date2,
      },
      {
        timestamp: date0,
      }
    ];
    const options = {
      key: 'timestamp',
      increment: 1,
      tolerance: 0,
      timestampUnits: 'minutes',
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 1,
      priorValidId: undefined,
      priorValidValue: date2,
      value: date0,
      delta: 2,
      absDelta: 2,

      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems omits trailing negative gap timestamp key hours', ()=>{
    const arr = [
      {
        timestamp: hour1,
      },
      {
        timestamp: hour2,
      },
      {
        timestamp: hour0,
      }
    ];
    const options = {
      key: 'timestamp',
      increment: 1,
      tolerance: 0,
      timestampUnits: 'hours',
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 1,
      priorValidId: undefined,
      priorValidValue: hour2,
      value: hour0,
      delta: 2,
      absDelta: 2,
      index: 1,
      stop: 2,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems returns 1st item only if not sequential integer key', ()=>{
    const arr = [
      {
        id: 5,
      },
      {
        id: 16,
      },
      {
        id: 20,
      }
    ];
    const options = {
      key: 'id',
      increment: 1,
      tolerance: 0,
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 0,
      priorValidId: 5,
      priorValidValue: 5,
      value: 16,
      delta: 11,
      absDelta: 11,

      index: 0,
      stop: 1,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${arr[e.stop].id})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems returns 1st item only if not sequential timestamp key', ()=>{
    const arr = [
      {
        timestamp: date0,
      },
      {
        timestamp: date5,
      },
      {
        timestamp: date2,
      }
    ];
    const options = {
      key: 'timestamp',
      increment: 1,
      tolerance: 0,
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 0,
      priorValidId: undefined,
      priorValidValue: date0,
      value: date5,
      delta: -5,
      absDelta: 5,
      
      index: 0,
      stop: 1,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    expect(result).to.deep.equal(expectedResult);
  });
  it('filterSequentialItems returns 1st item only if not sequential timestamp key hours', ()=>{
    const arr = [
      {
        timestamp: hour0,
      },
      {
        timestamp: hour5,
      },
      {
        timestamp: hour2,
      }
    ];
    const options = {
      key: 'timestamp',
      increment: 1,
      tolerance: 0,
      timestampUnits: 'hours',
    };
    const result = filterSequentialItems(arr, options);
    const e = {
      priorValidIndex: 0,
      priorValidId: undefined,
      priorValidValue: hour0,
      value: hour5,
      delta: -5,
      absDelta: 5,

      index: 0,
      stop: 1,
    };
    const expectedResult = Object.assign({},
      e, {
        message: `in filterSequentialItems() at record ${e.stop} exceeded range of ${options.increment} (value at last sequential index #${e.priorValidIndex}/id: ${e.priorValidId}: ${convertTimestampToString(e.priorValidValue, 'd t z')}; failure at id: ${arr[e.stop].id}, delta: ${e.delta}, absolute: ${e.absDelta}, key: ${options.key}, value at ${e.stop}: ${convertTimestampToString(arr[e.stop].timestamp, 'd t z')})`
      });
    expect(result).to.deep.equal(expectedResult);
  });

  it('consolidateTimeOrderedArray', ()=>{
    const tsKey = 'timestamp';
    const count = 5;
    const startTime = new Date(2021,0,1,10,3);
    const keyTypes = {
      mean: 'mean',
      max: 'max',
      sum: 'sum',
    };
    const arr = [
      {
        mean: 0,
        max: 1,
        sum: 2,
      },
      {
        mean: 0,
        max: 1,
        sum: 2,
      },
      {
        mean: 0,
        max: 1,
        sum: 2,
      },
    ];
    arr.forEach((x,i)=>{
      x.timestamp = addTime(startTime, i, 'minute');
    });
    const expectedResult = [
      {
        mean: 0,
        max: 1,
        sum: 6,
        timestamp: addTime(startTime, arr.length-1, 'minute')
      }
    ];
    const result = consolidateTimeOrderedArray(arr, count, tsKey, keyTypes);
    console.log('expectedResult',expectedResult)
    console.log('result',result)
    expect(result).to.deep.equal(expectedResult);
  });

  it('totalAndAverageArrays fails nicely on non-compound array', () => {
    nonCompoundArrays.forEach(x=>{
      const result = totalAndAverageArrays(x);
      expect(result.totaled).to.deep.equal([]);
      expect(result.averaged).to.deep.equal([]);
      expect(result.errors).to.include('input is not a compound array');
    });
  });
  it('totalAndAverageArrays fails nicely on non-array input', () => {
    nonStringPrimitives.forEach(x=>{
      const result = totalAndAverageArrays(x);
      expect(result).to.deep.equal({totaled: [], averaged: [], errors: ['input is not an array']});
    });
  });
  it('totalAndAverageArrays works on valid input 1', () => {
    const compoundArrays = [
      [  1,  2,  3,  4,  5 ],
      [  1,  2,  3,  4,  5 ],
      [  1,  2,  3,  4,  5 ],
      [  1,  2,  3,  4,  5 ],
    ];
    const totaled =  [ 4,  8, 12, 16,  20 ];
    const averaged = [ 1,  2,  3,  4,   5 ];
    const result = totalAndAverageArrays(compoundArrays);
    expect(result).to.deep.equal({totaled, averaged, errors: []});
  });
  it('totalAndAverageArrays works on valid input 2', () => {
    const compoundArrays = [
      [  1,  2,  3,  4,  5 ],
      [  1,  3,  6,  4,  5 ],
      [  1,  2,  3,  8, 15 ],
      [  1,  1,  3,  4,  5 ],
    ];
    const totaled  = [ 4, 8,   15, 20,  30 ];
    const averaged = [ 1, 2, 3.75,  5, 7.5 ];
    const result = totalAndAverageArrays(compoundArrays);
    expect(result).to.deep.equal({totaled, averaged, errors: []});
  });
  it('totalAndAverageArrays works on varied-length arrays', () => {
    const compoundArrays = [
      [  1,  2,    3,  4,    5    ],
      [  1,  3,    6,  4          ],
      [  1,  2,    3,  8,   15    ],
      [  1,  1,    3,  4,    5, 6 ],
    ];
    const totaled = [
      4,  8,   15, 20,   25, 6
    ];
    const averaged = [
      1,  2, 3.75,  5, 6.25, 1.5
    ];
    const result = totalAndAverageArrays(compoundArrays);
    expect(result).to.deep.equal({totaled, averaged, errors: []});
  });
  it('totalAndAverageArrays ignores non-numbers in arrays', () => {
    const compoundArrays = [
      [  1,  2,    3,  4,    5    ],
      [  1,  3,    6, 'x'         ],
      [  1,  2,  '3',  8,   15    ],
      [  1,  1,    3,  4,    5, 6 ],
    ];
    const totaled = [
      4,  8,   12, 16,   25, 6
    ];
    const averaged = [
      1,  2,    3,  4, 6.25, 1.5
    ];
    const result = totalAndAverageArrays(compoundArrays);
    expect(result).to.deep.equal({totaled, averaged, errors: ['error at array 1:3', 'error at array 2:2']});
  });

  it('deltaArray 1', () => {
    const array1         = [1,2,3,4,5,6,7,8,9];
    const array2         = [0,1,2,3,4,5,6,7,8];
    const expectedResult = [1,1,1,1,1,1,1,1,1];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray -1', () => {
    const array1         = [ 0, 1, 2, 3, 4, 5, 6, 7, 8];
    const array2         = [ 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const expectedResult = [-1,-1,-1,-1,-1,-1,-1,-1,-1];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray mixed', () => {
    const array1         = [ 0,  1.5, 3       , 2.111111, 4.55567, 2.22332];
    const array2         = [ 0,    2, 2.111111, 3       , 1      , 1      ];
    const expectedResult = [ 0, -0.5, 0.8889  ,-0.8889   , 3.5557 ,1.2233 ];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray returns null on non-numbers', () => {
    const array1         = [ 0,  1.5, 3       , 'y' , 4.55567, 2.22332];
    const array2         = [ 0,  'x', 2.111111, 3   , 1      , 1      ];
    const expectedResult = [ 0, null, 0.8889  , null, 3.5557 ,1.2233 ];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray fails on mixed length arrays 1', () => {
    const array1         = [ 0,  1.5, 3       , 2.111111, 4.55567, 2.22332, 4];
    const array2         = [ 0,    2, 2.111111, 3       , 1      , 1      ];
    const expectedResult = [ ];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray fails on mixed length arrays 2', () => {
    const array1         = [ 0,  1.5, 3       , 2.111111, 4.55567, 2.22332];
    const array2         = [ 0,    2, 2.111111, 3       , 1               ];
    const expectedResult = [ ];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray fails on non-arrays 1', () => {
    const array1         = 'string';
    const array2         = [ 0,    2, 2.111111, 3       , 1               ];
    const expectedResult = [ ];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('deltaArray fails on non-arrays 2', () => {
    const array1         = [ 0,  1.5, 3       , 2.111111, 4.55567, 2.22332];
    const array2         = 'string';
    const expectedResult = [ ];
    const result = deltaArray(array1, array2);
    expect(result).to.deep.equal(expectedResult);
  });
  
  it('immutableArrayInsert replaces index 0, primitives', () => {
    const index = 0;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 9;
    const expectedResult = [
      9,2,3,4,5
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert inserts before index 0, primitives', () => {
    const index = 0;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 9;
    const expectedResult = [
      9,1,2,3,4,5
    ];
    const replace = false;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert replaces index middle, primitives', () => {
    const index = 1;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 9;
    const expectedResult = [
      1,9,3,4,5
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert inserts before index 1, primitives', () => {
    const index = 1;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 9;
    const expectedResult = [
      1,9,2,3,4,5
    ];
    const replace = false;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert replaces index last, primitives', () => {
    const index = 4;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 3;
    const expectedResult = [
      1,2,3,4,3
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert inserts before index last, primitives', () => {
    const index = 4;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 8;
    const expectedResult = [
      1,2,3,4,8,5
    ];
    const replace = false;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert adds to end index=length no replace, primitives', () => {
    const index = 5;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 8;
    const expectedResult = [
      1,2,3,4,5,8
    ];
    const replace = false;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert adds to end index>length no replace, primitives', () => {
    const index = 95;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 8;
    const expectedResult = [
      1,2,3,4,5,8
    ];
    const replace = false;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert replace end index=length with replace, primitives', () => {
    const index = 5;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 8;
    const expectedResult = [
      1,2,3,4,8
    ];
    const replace = true;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert replace end index>length with replace, primitives', () => {
    const index = 55;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 8;
    const expectedResult = [
      1,2,3,4,8
    ];
    const replace = true;
    const result = immutableArrayInsert(index, array, itemToUpdate, replace);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert prepends on null, primitives', () => {
    const index = null;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 3;
    const expectedResult = [
      3,1,2,3,4,5
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert replaces last on overshoot, primitives', () => {
    const index = 99;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 3;
    const expectedResult = [
      1,2,3,4,3
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert preprends, objects, NaN index', () => {
    const index = 'not a number';
    const array = [
      {x:1}, {x:2}, {x:3}
    ];
    const itemToUpdate = {y:2};
    const expectedResult = [
      {y:2}, {x:1}, {x:2}, {x:3}
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert returns empty array if not sent an array', () => {
    const index = 3;
    const array = 'not an array';
    const itemToUpdate = {y:2};
    const expectedResult = [];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert returns array if sent undefined to update', () => {
    const index = 2;
    const array = [
      {x:1}, {x:2}, {x:3}
    ];
    const expectedResult = [
      {x:1}, {x:2}, {x:3}
    ];
    const result = immutableArrayInsert(index, array);
    expect(result).to.deep.equal(expectedResult);
  });

  it('immutableArraySplice front primitives', () => {
    const index = 0;
    const array = [
      1,2,3,4,5
    ];
    const expectedResult = [
      2,3,4,5
    ];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArraySplice middle primitives', () => {
    const index = 2;
    const array = [
      1,2,3,4,5
    ];
    const expectedResult = [
      1,2,4,5
    ];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArraySplice end primitives', () => {
    const index = 4;
    const array = [
      1,2,3,4,5
    ];
    const expectedResult = [
      1,2,3,4
    ];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArraySplice overshoot returns array, primitives', () => {
    const index = 88;
    const array = [
      1,2,3,4,5
    ];
    const expectedResult = [
      1,2,3,4,5
    ];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArraySplice returns empty array, if not sent array, primitives', () => {
    const index = 3;
    const array = 'not an array, bucko!';
    const expectedResult = [];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArraySplice returns array if negative index, primitives', () => {
    const index = -2;
    const array = [
      1,2,3,4,5
    ];
    const expectedResult = [
      1,2,3,4,5
    ];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArraySplice returns array if negative index, primitives', () => {
    const index = 'not a number';
    const array = [
      1,2,3,4,5
    ];
    const expectedResult = [
      1,2,3,4,5
    ];
    const result = immutableArraySplice(index, array);
    expect(result).to.deep.equal(expectedResult);
  });

  it('removeAllItemsFromArray undefined on no array', () => {
    const array = 'not an array';
    const items = ['one', 'cat', 33, 'horse', 'cow'];
    const expectedResult = undefined;
    const result = removeAllItemsFromArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });
  it('removeAllItemsFromArray array on no items', () => {
    const array = ['one', 'cat', 33, 'horse', 'cow'];
    const items = 'not an array';
    const result = removeAllItemsFromArray(array, items);
    expect(result).to.deep.equal(array);
  });
  it('removeAllItemsFromArray first last, ignore', () => {
    const array = ['one', 5, 37, 'cat'];
    const items = ['one', 'cat', 'dog'];
    const expectedResult = [5, 37];
    const result = removeAllItemsFromArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });
  it('removeAllItemsFromArray mixed', () => {
    const array = ['one', 5, 37, 'cat',77,33,2,1,3,'pig','goat'];
    const items = ['one', 'cat', 33, 'horse', 'cow'];
    const expectedResult = [5, 37,77,2,1,3,'pig','goat'];
    const result = removeAllItemsFromArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });
  it('removeAllItemsFromArray no match', () => {
    const array = [5, 37,77,2,1,3,'pig','goat'];
    const items = ['one', 'cat', 33, 'horse', 'cow'];
    const expectedResult = [5, 37,77,2,1,3,'pig','goat'];
    const result = removeAllItemsFromArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });
  it('removeAllItemsFromArray empty array if remove all', () => {
    const array = [5, 37,77,2,1,3,'pig','goat'];
    const items = [5, 37,77,2,1,3,'pig','goat'];
    const expectedResult = [];
    const result = removeAllItemsFromArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });

  it('addAllItemsToArray undefined on no array', () => {
    const array = 'not an array';
    const items = ['one', 'cat', 33, 'horse', 'cow'];
    const expectedResult = undefined;
    const result = addAllItemsToArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addAllItemsToArray array on no items', () => {
    const array = ['one', 'cat', 33, 'horse', 'cow'];
    const items = 'not an array';
    const result = addAllItemsToArray(array, items);
    expect(result).to.deep.equal(array);
  });
  it('addAllItemsToArray adds mixed positions', () => {
    const array = ['one', 'cat', 33, 'horse', 'cow'];
    const items = ['one', 33, 'cow', 'dog'];
    const expectedResult = ['cat','horse','one', 33, 'cow','dog'];
    const result = addAllItemsToArray(array, items);
    expect(result).to.deep.equal(expectedResult);
  });

  it('getPositionToInterpolate no decimal', () => {
    const value = 3;
    const increments = 1;
    const expectedResult = {
      position: 3,
      decimal: 0,
      hi: 3,
      lo: 3
    };
    const result = getPositionToInterpolate(value, increments);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getPositionToInterpolate decimal', () => {
    const value = .0143;
    const increment = .007;
    const expectedResult = {
      position: 2.0429, // 0.0143 / 0.007 
      decimal: 0.0429,
      hi: 3,
      lo: 2,
    };
    const result = getPositionToInterpolate(value, increment);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getPositionToInterpolate decimal 2', () => {
    const value = .0011;
    const increment = .00025;
    const expectedResult = {
      position: 4.4,
      decimal: 0.4,
      hi: 5,
      lo: 4,
    };
    const result = getPositionToInterpolate(value, increment);
    expect(result).to.deep.equal(expectedResult);
  });

  it('interpolateArrayValues decimal', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0.5;
    const hi = 3;
    const lo = 2;
    const expectedResult = 17.5;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues no decimal', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0;
    const hi = 2;
    const lo = 2;
    const expectedResult = 15;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues no decimal, hi skips', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0;
    const hi = 4;
    const lo = 2;
    const expectedResult = 15;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues undefined if not array', () => {
    const arr = 'not an array';
    const decimal = 0;
    const hi = 4;
    const lo = 2;
    const expectedResult = undefined;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues undefined if decimal not number', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 'not a number';
    const hi = 4;
    const lo = 2;
    const expectedResult = undefined;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues undefined if hi not number', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0;
    const hi = 'not a number';
    const lo = 2;
    const expectedResult = undefined;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues undefined if lo not number', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0;
    const hi = 4;
    const lo = 'not a number';
    const expectedResult = undefined;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues undefined if undershoots array', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0;
    const hi = 4;
    const lo = -3;
    const expectedResult = undefined;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });
  it('interpolateArrayValues undefined if overshoots array', () => {
    const arr = [5,10,15,20,25,30];
    const decimal = 0;
    const hi = 4;
    const lo = 33;
    const expectedResult = undefined;
    const result = interpolateArrayValues(arr, decimal, hi, lo);
    expect(result).to.deep.equal(expectedResult);
  });

});