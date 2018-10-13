'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
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
} = require('../index');

const {
  nonObjects,
  nonStringPrimitives,
  lowerStrings,
  upperStrings,
  nonStringNonNumbers,
  nonCompoundArrays,
  date0, 
  date1,
  date2,
  date3,
  hour0, 
  hour1, 
  hour2, 
  hour3 }   = require('./helper-data');

describe('conjunction-junction primitives', () => { 

  it('correctInputType',()=>{

  });

  it('generateRandomNumber',()=>{
    const lower = 5;
    const upper = 23;
    const result = generateRandomNumber(lower, upper);
    console.log('result', result);
    expect(result).to.be.greaterThan(lower);
    expect(result).to.be.within(lower,upper);
  });

  it('print',()=>{

  });
  
  it('numberToLetter',()=>{

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

  it('lowerCaseWord',()=>{

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

  it('convertCcToSpace',()=>{

  });

});