'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  // types
  correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber,
  // mixed types
  formatForPrint,
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
    const result = print(1.687777,'word');
    expect(result).to.equal(1.6878);
  });

  it('formatForPrint if data input variable is input',()=>{
    const result = formatForPrint(1.687123,'word');
    expect(result).to.equal(1.6871);
  });

  it('formatForPrint if data input varibale is a string but not proper date format',()=>{
    const result = formatForPrint('date','word');
    expect(result).to.equal('date');
  });

  it('formatForPrint if data input varibale is a string (proper date format)',()=>{
    const result = formatForPrint('2018-03-27 11:00:00 -0400','word');
    expect(result).to.equal('Tuesday, March 27, 2018, 11:00 AM');
  });

  // //it('formatForPrint if data input varibale is a string (proper date format)',()=>{
  //   const result = formatForPrint("2018-03-27 11:00:00 -0400","word");
  //   expect(result).to.equal("Tuesday, March 27, 2018, 11:00 AM");
  // });

  it('formatForPrint if data input varibale is an array (proper date format) object parameter is not an object',()=>{
    const array = [2,3,4,5,6];
    const result = formatForPrint(array,'word');
    expect(result).to.equal('2, 3, 4, 5, 6');
  });

  it('formatForPrint if data input varibale is an array (proper date format), options paramter is an object',()=>{
    const array = [2,3,4,5,6];
    const obj = {
      number:1,
      number2:2
    };
    const result = formatForPrint(array,obj);
    expect(result).to.equal('2, 3, 4, 5, 6');
  });

  it('formatForPrint if data input variable is an object',()=>{
    const obj = {
      number:1,
      number2:2
    };
    const result = formatForPrint(obj,'word');
    expect(result).to.equal(':(');
  });

  it('formatForPrint if data input variable is a boolean true',()=>{
    const boolean = true;
    const result = formatForPrint(boolean,'word');
    expect(result).to.equal('true');
  });

  it('formatForPrint if data input variable is a boolean false',()=>{
    const boolean = false;
    const result = formatForPrint(boolean,'word');
    expect(result).to.equal('false');
  });

  it('formatForPrint if data input variable is undefined',()=>{
    const res = undefined;
    const result = formatForPrint(res,'word');
    expect(result).to.equal('undefined');
  });

  it('formatForPrint if data input variable is null',()=>{
    const res = null;
    const result = formatForPrint(res,'word');
    expect(result).to.equal('null');
  });
  
  it('numberToLetter',()=>{
    const letter = numberToLetter(3);
    expect(letter).to.equal('C');
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
  it('lowerCaseWord returns input string with first letter lower case',()=>{
    const result = lowerCaseWord('WORD');
    expect(result).to.equal('wORD');
  });
  it('lowerCaseWord returns error message if input is invalid',()=>{
    const result = lowerCaseWord(1);
    expect(result).to.equal('');
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
  it('convertCcToSpace ', () => { 
    const result = convertCcToSpace(53);
    expect(result).to.equal('53');
  });
  it('convertCcToSpace ', () => { 
    const result = convertCcToSpace({obj:2});
    expect(result).to.equal('');
  });
  it('convertCcToSpace ', () => { 
    const result = convertCcToSpace('capiTalsToSpace');
    expect(result).to.equal('capi tals to space');
  });
  it('convertCcToSc returns number as string', () => { 
    const result = convertCcToSc(53);
    expect(result).to.equal('53');
  });
  it('convertCcToSc returns empty string on invalid input', () => { 
    const result = convertCcToSc({x: 3});
    expect(result).to.equal('');
  });
  it('convertScToSpace returns empty string on invalid input', () => { 
    const result = convertScToSpace(1);
    expect(result).to.equal('');
  });
  it('convertScToSpace returns input string without underscores (1 underscore)', () => { 
    const result = convertScToSpace('Hello_World');
    expect(result).to.equal('Hello World');
  });
  it('convertScToSpace returns input string without underscores (multiple underscores)', () => { 
    const result = convertScToSpace('Hello_W_o_r_l_d');
    expect(result).to.equal('Hello W o r l d');
  });


});