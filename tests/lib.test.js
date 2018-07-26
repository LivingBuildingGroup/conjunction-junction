'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  isPrimitiveNumber, 
  isObjectLiteral,
  precisionRound,
  correctInputType,
  print,
  titleCaseWord, 
  lowerCaseWord,
  convertScToCc,
  convertCcToSc,
  convertCcToSpace,
  convertObjectKeyCase, 
  shiftObjectKeysColumn,
  shiftArrayKeysColumn,
  getKeyArray, 
  validateObjectKeysPresent,
  validateObjectKeys,
  limitObjectKeys,
  roundAllValues,
  subArrayByKey,
  totalAndAverageArrays,
  deltaArray,
  immutableArrayInsert,
  immutableArraySplice,
  removeAllItemsFromArray,
  addAllItemsToArray,
  getPositionToInterpolate,
  interpolateArrayValues,} = require('../index');

const {
  numbers, 
  nonNumbers, 
  nonObjects,
  nonNumberObjects, 
  nonNumberArrays,
  nonStringPrimitives,
  lowerStrings,
  upperStrings,
  nonStringNonNumbers,
  nonCompoundArrays }   = require('./helper-data');
process.env.DB_MODE = 'test';


describe('conjunction-junction lib', () => { 

  it('isPrimitiveNumber false on no parameters', () => { 
    const num = isPrimitiveNumber();
    expect(num).to.equal(false);
  });
  it('isPrimitiveNumber false on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const num = isPrimitiveNumber(item);
      expect(num).to.equal(false);
    });
  });
  it('isPrimitiveNumber false on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const num = isPrimitiveNumber(item);
      expect(num).to.equal(false);
    });
  });
  it('isPrimitiveNumber false on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const num = isPrimitiveNumber(item);
      expect(num).to.equal(false);
    });
  });
  it('isPrimitiveNumber true on number', () => { 
    numbers.forEach(number=>{
      const num = isPrimitiveNumber(number);
      expect(num).to.equal(true);
    });
  });

  it('isObjectLiteral false on no parameters', () => { 
    const object = isObjectLiteral();
    expect(object).to.equal(false);
  });
  it('isObjectLiteral false on nonObjects', () => { 
    nonObjects.forEach(item=>{
      const object = isObjectLiteral(item);
      expect(object).to.equal(false);
    });
  });
  it('isObjectLiteral true on object with no keys', () => { 
    const object = isObjectLiteral({});
    expect(object).to.equal(true);
  });
  it('isObjectLiteral true on object with keys', () => { 
    const object = isObjectLiteral({x:1});
    expect(object).to.equal(true);
  });

  it('titleCaseWord undefined on non-String input', () => { 
    nonStringPrimitives.forEach(item=>{
      const titleWord = titleCaseWord(item);
      expect(titleWord).to.equal(undefined);
    });
  });
  it('titleCaseWord undefined on non-String input', () => { 
    nonStringPrimitives.forEach(item=>{
      const titleWord = titleCaseWord(item);
      expect(titleWord).to.equal(undefined);
    });
  });
  it('titleCaseWord valid on valid input', () => { 
    lowerStrings.forEach((item, i)=>{
      const titleWord = titleCaseWord(item);
      expect(titleWord).to.equal(upperStrings[i]);
    });
  });
  it('titleCaseWord valid camelCase on valid input', () => { 
    const result = titleCaseWord('snake_case', 'cC');
    const expectedResult = 'SnakeCase';
    expect(result).to.equal(expectedResult);
  });

  it('convertScToCc valid on valid input', () => { 
    const strings = [
      'snake_case', 'snake case', 'snakeCase',
      'SNAKE', 'SnakeCase', 'snake-case',
      'snake_case-too', 'snake-case_too',
      3, 'snakeCase2', 'snake2Case', 'snake_2_case',
      'snake 2 case'
    ];
    const expectedResult = [
      'snakeCase', 'snake case', 'snakeCase',
      'SNAKE', 'SnakeCase', 'snake-case',
      'snakeCase-too', 'snake-caseToo',
      '3', 'snakeCase2', 'snake2Case', 'snake2Case',
      'snake 2 case'
    ];
    strings.forEach((s,i)=>{
      const result = convertScToCc(s);
      expect(result).to.equal(expectedResult[i]);
    });
  });
  it('convertScToCc empty string on invalid input', () => { 
    nonStringNonNumbers.forEach((x,i)=>{
      const result = convertScToCc(x);
      expect(result).to.equal('');
    });
  });

  it('convertCcToSc converts on valid input', () => { 
    const words           = ['theWord' ,'123 4 Happy' ,'camelCase', 'snake_case', 'mixed-up_case_Cases' ,'case 3', 'case4'];
    const expectedResults = ['the_word','123 4 _happy','camel_case','snake_case', 'mixed-up_case__cases','case 3', 'case4'];
    words.forEach((w,i)=>{
      const result = convertCcToSc(w);
      expect(result).to.equal(expectedResults[i]);
    });
  });
  it('convertCcToSc returns number as string', () => { 
    const result = convertCcToSc(53);
    expect(result).to.equal('53');
  });
  it('convertCcToSc returns empty string on invalid input', () => { 
    const result = convertCcToSc({x: 3});
    expect(result).to.equal('');
  });

  it('precisionRound', () => { 
    const arrayOfNumbers = [
      1,3,5,2000,2021,103567,
      1.0345823,
      1.304623,
      1.304423,
      1.09,
      1.089,
    ];
    const expectedResults =[
      1,3,5,2000,2021,103567,
      1.0346,
      1.3046,
      1.3044,
      1.09,
      1.089
    ];
    arrayOfNumbers.forEach((num,i)=>{
      expect(precisionRound(num, 4)).to.equal(expectedResults[i]);
    });
  });
  it('precisionRound non-num', () => { 
    nonNumbers.forEach(num=>{
      expect(precisionRound(num, 4)).to.equal(0);
    });
  });
  it('precisionRound no precision', () => { 
    expect(precisionRound(1.03984, 'x')).to.equal(0);
  });

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

  it('shiftObjectKeysColumn snake to camel', () => {
    const position1 = 0;
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestamp_created: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      first_name: 'Brad',
    };
    const expectedResult = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn camel to snake', () => {
    const position1 = 1;
    const position2 = 0;
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {
      id: 1,
      timestamp_created: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      first_name: 'Brad',
    };
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn camel to snake ignores extra keys', () => {
    const position1 = 1;
    const position2 = 0;
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
      extraKey: 'this should go away!'
    };
    const expectedResult = {
      id: 1,
      timestamp_created: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      first_name: 'Brad',
    };
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on invalid key lookup', () => {
    const position1 = 1;
    const position2 = 0;
    const key = 'components';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on invalid key array', () => {
    const position1 = 1;
    const position2 = 0;
    const key = 'components';
    const keys = {
      users: 'whoa! There should be an array here!'
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on invalid key compound array', () => {
    const position1 = 1;
    const position2 = 0;
    const key = 'components';
    const keys = {
      users: ['whoa! There should be a COMPOUND array here!']
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on invalid position1', () => {
    const position1 = {notNumber: true};
    const position2 = 0;
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on invalid position1', () => {
    const position1 = 2;
    const position2 = 'invalid!!!!';
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on non-string position1', () => {
    const position1 = 3; // position 3 is not a string
    const position2 = 0;
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on non-string position2', () => {
    const position1 = 0; 
    const position2 = 2;// position 3 is not a string
    const key = 'users';
    const keys = {
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
    };
    const object = {
      id: 1,
      timestampCreated: 2,
      username: 'bradgarner',
      password: 'somethingReallySecure',
      firstName: 'Brad',
    };
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftObjectKeysColumn empty object on non-object sent', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    };
    const object = 'not an object';
    const expectedResult = {};
    const result = shiftObjectKeysColumn(object, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });

  it('shiftArrayKeysColumn empty array if no array', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    };
    const array = 'not an array';
    const expectedResult = [];
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftArrayKeysColumn empty array if no key object', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = 'users';
    const keys = 'not an object';
    const array = [
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
    const expectedResult = [];
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftArrayKeysColumn return array if key not a string', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = ['not a string'];
    const keys = {
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
    };
    const array = [
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
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(array);
  });
  it('shiftArrayKeysColumn return array if position 1 NaN', () => {
    const position1 = null;
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    };
    const array = [
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
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(array);
  });
  it('shiftArrayKeysColumn return array if position 2 NaN', () => {
    const position1 = 1;
    const position2 = null;
    const key = 'users';
    const keys = {
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
    };
    const array = [
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
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(array);
  });
  it('shiftArrayKeysColumn return array if map not found', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = 'invalid key';
    const keys = {
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
    };
    const array = [
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
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(array);
  });
  it('shiftArrayKeysColumn return undefined if no match found', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    };
    const array = [
      'id',
      'timestamp_created',
      'username',
      'password',
      'first_name',
      'something_else',
      'last_name',
      'email',
      'pw_reset',
      'permissions',
    ];
    const expectedResult = [
      'id',
      'timestampCreated',
      'username',
      'password',
      'firstName',
      undefined,
      'lastName',
      'email',
      'pwReset',
      'permissions',
    ];
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('shiftArrayKeysColumn ok', () => {
    const position1 = 0; 
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    };
    const array = [
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
    const result = shiftArrayKeysColumn(array, keys, key, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });

  it('getKeyArray returns list of column 0, default action', () => {
    const action = null;
    const position1 = 0;
    // const position2 = 1; // leave this undefined intentionally
    const key = 'users';
    const keys = {
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
    const result = getKeyArray(keys, key, action, position1);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns list of column 0, explicit action', () => {
    const action = 'list';
    const position1 = 0;
    // const position2 = 1; // leave this undefined intentionally
    const key = 'users';
    const keys = {
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
    const result = getKeyArray(keys, key, action, position1);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns list of column 1', () => {
    const action = 'list';
    const position1 = 1;
    // const position2 = 1; // leave this undefined intentionally
    const key = 'users';
    const keys = {
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
    const result = getKeyArray(keys, key, action, position1);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns filter of column 0', () => {
    const action = 'filter';
    const position1 = 0;
    const position2 = 2; // filter by column 2
    const key = 'users';
    const keys = {
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
    };
    const expectedResult = [
      'username',
      'password',
      'first_name',
      'last_name',
      'email',
      'permissions',
    ];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns column 0 as column 1', () => {
    const action = 'field';
    const position1 = 0;
    const position2 = 1;
    const key = 'users';
    const keys = {
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
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray returns filter of column 0', () => {
    const action = 'object list';
    const position1 = 0;
    const position2 = 7; 
    const key = 'users';
    const keys = {
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
    };
    const expectedResult = {
      username: {min: 1 },
      password: {min: 8, max: 72 },
    };
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid key lookup', () => {
    const action = 'list';
    const position1 = 1;
    const position2 = 0;
    const key = 'components';
    const keys = {
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
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid key array', () => {
    const action = 'filter';
    const position1 = 1;
    const position2 = 0;
    const key = 'components';
    const keys = {
      users: 'whoa! There should be an array here!'
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid key compound array', () => {
    const action = 'list';
    const position1 = 1;
    const position2 = 0;
    const key = 'components';
    const keys = {
      users: ['whoa! There should be a COMPOUND array here!']
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid position1', () => {
    const action = 'object list';
    const position1 = {notNumber: true};
    const position2 = 0;
    const key = 'components';
    const keys = {
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
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on invalid position1', () => {
    const action = 'list';
    const position1 = 2;
    const position2 = 'invalid!!!!';
    const key = 'components';
    const keys = {
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
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on non-string position1', () => {
    const action = 'list';
    const position1 = 12; // position is invalid
    const position2 = 0;
    const key = 'components';
    const keys = {
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
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('getKeyArray empty array on non-string position2', () => {
    const action = 'list';
    const position1 = 0; 
    const position2 = -1;// position -1 is invalid
    const key = 'components';
    const keys = {
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
    };
    const expectedResult = [];
    const result = getKeyArray(keys, key, action, position1, position2);
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
    const itemToUpdate = 3;
    const expectedResult = [
      3,2,3,4,5
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
    expect(result).to.deep.equal(expectedResult);
  });
  it('immutableArrayInsert replaces index middle, primitives', () => {
    const index = 1;
    const array = [
      1,2,3,4,5
    ];
    const itemToUpdate = 3;
    const expectedResult = [
      1,3,3,4,5
    ];
    const result = immutableArrayInsert(index, array, itemToUpdate);
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

});