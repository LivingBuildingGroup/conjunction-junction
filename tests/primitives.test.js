'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  // types
  correctInputType, // do not do a test for this yet
  // numbers
  generateRandomNumber,
  numberToModNumber,
  printNumber,
  asNum,
  parseFloatInput,
  // mixed types
  formatForPrint,
  print,
  numberToLetter,
  // strings
  titleCaseWord, 
  lowerCaseWord,
  convertScToCc,
  convertCcToSc,
  convertMixedStringToCc,
  convertScToSpace,
  isValidEmail,
} = require('../index');

const {
  nonObjects,
  nonStringPrimitives,
  lowerStrings,
  titleStrings,
  pascalStrings,
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
    expect(result).to.be.greaterThan(lower);
    expect(result).to.be.within(lower,upper);
  });

  const trailingZeros = {
    '0'     : true, 
    '00'    : true, 
    '000'   : true, 
    '0000'  : true, 
    '00000' : true, 
  };
  
  const leadingDecimals = {
    '.'      : true, 
    '.0'     : true, 
    '.00'    : true, 
    '.000'   : true, 
    '.0000'  : true, 
    '.00000' : true, 
    '0'      : true, 
    '0.'     : true, 
    '0.0'    : true, 
    '0.00'   : true,
    '0.000'  : true,
    '0.0000' : true,
    '0.00000': true,
    ''       : true,
  };

  const mixedStrings = [
    ['abc'       ,'abc'],
    ['a bc'      ,'aBc'],
    ['ABc'       ,'abc'],
    ['a b c'     ,'aBC'],
    ['a baby cat','aBabyCat'],
    ['a long  set       of   99spaces3 2','aLongSetOf99spaces32'],
    ['front gr soil  1'                  ,'frontGrSoil1'],
    ['Adafruit #3 Soil moisture '        ,'adafruit3SoilMoisture'],
    [
      'this has a l0t o% $h!t$ *n #@) (&we ~`+e="\'/|> don\'t.>?< want{}[]it',
      'thisHasAL0tOHTNWeEDonTWantIt'
    ],
  ];

  it('parseFloatInput leading decimal ok',()=>{
    for(let num in leadingDecimals){
      const result = parseFloatInput(num);
      expect(result).to.equal(num);
    }
  });
  it('parseFloatInput returns empty string',()=>{
    const nonleadingDecimals = {
      'a'   : true, 
      '.a'  : true, 
    };
    for(let num in nonleadingDecimals){
      const result = parseFloatInput(num);
      expect(result).to.equal('');
    }
  });
  it('parseFloatInput 0.',()=>{
    const nonleadingDecimals = {
      'a.'  : true, 
      'some words.'  : true, 
    };
    for(let num in nonleadingDecimals){
      const result = parseFloatInput(num);
      expect(result).to.equal('0.');
    }
  });
  it('parseFloatInput removes leading zero',()=>{
    const leadingDecimals = {
      '04'    : 4, 
      '0.4'   : 0.4, 
      '0080'  : 80, 
      '8'     : 8, 
      '8.'    : '8.', 
      '8.0'   : '8.0', 
      '08.0'  : '8.0', 
      '008.0' : '8.0', 
      '0740'  : 740, 
    };
    for(let num in leadingDecimals){
      const result = parseFloatInput(num);
      expect(result).to.equal(leadingDecimals[num]);
    }
  });
  it('parseFloatInput keeps trailing zeroes',()=>{
    for(let num in trailingZeros){
      const expectedResult = `7.${num}`;
      const result = parseFloatInput(expectedResult);
      expect(result).to.equal(expectedResult);
    }
  });
  it('parseFloatInput keeps trailing zeroes but removes leading zeroes',()=>{
    for(let num in trailingZeros){
      const expectedResult = `7.${num}`;
      const rawNum = `0${expectedResult}`;
      const result = parseFloatInput(rawNum);
      expect(result).to.equal(expectedResult);
    }
  });

  it('formatForPrint if data input variable is input',()=>{
    const result = formatForPrint(1.687123,'word');
    expect(result).to.equal(1.6871);
  });

  it('formatForPrint if data input variable is a string but not proper date format',()=>{
    const result = formatForPrint('date','word');
    expect(result).to.equal('date');
  });

  it('formatForPrint if data input variable is a string (proper date format)',()=>{
    const result = formatForPrint('2018-03-27 11:00:00 -0400','word');
    expect(result).to.equal('Tuesday, March 27, 2018, 11:00 AM');
  });

  // //it('formatForPrint if data input variable is a string (proper date format)',()=>{
  //   const result = formatForPrint("2018-03-27 11:00:00 -0400","word");
  //   expect(result).to.equal("Tuesday, March 27, 2018, 11:00 AM");
  // });

  it('formatForPrint if data input variable is an array (proper date format) object parameter is not an object',()=>{
    const array = [2,3,4,5,6];
    const result = formatForPrint(array,'word');
    expect(result).to.equal('2, 3, 4, 5, 6');
  });

  it('formatForPrint if data input variable is an array (proper date format), options paramter is an object',()=>{
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
  it('titleCaseWord valid on valid input (lower to title)', () => { 
    lowerStrings.forEach((item, i)=>{
      const titleWord = titleCaseWord(item, 'cC');
      expect(titleWord).to.equal(titleStrings[i]);
    });
  });
  it('titleCaseWord valid on valid input (Pascal to Pascal)', () => { 
    pascalStrings.forEach(item=>{
      const titleWord = titleCaseWord(item, {pascal: true, doNotForceLowerCase: true});
      expect(titleWord).to.equal(item);
    });
  });
  it('titleCaseWord valid camelCase on valid input', () => { 
    const result = titleCaseWord('snake_case');
    const expectedResult = 'Snake_case';
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
      'sNAKE', 'snakeCase', 'snake-case',
      'snakeCase-too', 'snake-caseToo',
      '3', 'snakeCase2', 'snake2Case', 'snake2Case',
      'snake 2 case'
    ];
    strings.forEach((s,i)=>{
      const result = convertScToCc(s);
      expect(result).to.equal(expectedResult[i]);
    });
  });
  it('convertScToCc kebab to cC SINGLE', () => { 
    const divider = '-';
    const isPascal = true;
    const result = convertScToCc('snake-case', divider, isPascal);
    expect(result).to.equal('SnakeCase');
  });
  it('convertScToCc kebab to cC', () => { 
    const strings = [
      'snakeCase', 'snake-case', // acceptable use cases
      'snake_case', 'snake case', // other cases
      'SNAKE', 'SnakeCase', 
      'snake_case-too', 'snake-case_too',
      3, 'snakeCase2', 'snake2Case', 'snake_2_case',
      'snake 2 case'
    ];
    const expectedResult = [
      'SnakeCase', 'SnakeCase',
      'Snake_case', 'Snake case', 
      'SNAKE', 'SnakeCase', 
      'Snake_caseToo', 'SnakeCase_too',
      '3', 'SnakeCase2', 'Snake2Case', 'Snake_2_case',
      'Snake 2 case'
    ];
    const divider = '-';
    const isPascal = true;
    strings.forEach((x,i)=>{
      const result = convertScToCc(x, divider, isPascal);
      expect(result).to.equal(expectedResult[i]);
    });
  });
  it('convertScToCc empty string on invalid input', () => { 
    nonStringNonNumbers.forEach((x,i)=>{
      const result = convertScToCc(x);
      expect(result).to.equal('');
    });
  });
  it('convertScToCc works on slashes', ()=>{
    const strings = [
      'rainTotalMm/s', 'rainTotalMm/h', 'rainTotalMmh',
      'runoffSheetL/s/ha', 'runoff_sheet_l/s/ha', 'targetMaxdrCfs/ac',
      'just some words case'
    ];
    const expectedResult = [
      'rainTotalMmS', 'rainTotalMmH', 'rainTotalMmh',
      'runoffSheetLSHa', 'runoff_sheet_lSHa', 'targetMaxdrCfsAc',
      'just some words case'
    ];
    strings.forEach((s,i)=>{
      const result = convertScToCc(s, '/');
      expect(result).to.equal(expectedResult[i]);
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
  it('convertCcToSc with space number', () => { 
    const result = convertCcToSc(53,' ');
    expect(result).to.equal('53');
  });
  it('convertCcToSc with space object', () => { 
    const result = convertCcToSc({obj:2},' ');
    expect(result).to.equal('');
  });
  it('convertCcToSc with space camel', () => { 
    const result = convertCcToSc('capiTalsToSpace',' ');
    expect(result).to.equal('capi tals to space');
  });
  it('convertCcToSc with space camel NOT number', () => { 
    const result = convertCcToSc('capiTalsTo7Space',' ');
    expect(result).to.equal('capi tals to7 space');
  });
  it('convertCcToSc with space camel number', () => { 
    const result = convertCcToSc('capiTalsTo7Space',' ',{numbers:true});
    expect(result).to.equal('capi tals to 7 space');
  });
  it('convertCcToSc with dash camel', () => { 
    const result = convertCcToSc('capiTals3ToDash','-');
    expect(result).to.equal('capi-tals3-to-dash');
  });
  it('convertCcToSc with dash camel NOT number', () => { 
    const result = convertCcToSc('capiTals4ToSpace','-');
    expect(result).to.equal('capi-tals4-to-space');
  });
  it('convertCcToSc with dash camel number', () => { 
    const result = convertCcToSc('capiTals4ToSpace','-',{numbers:true});
    expect(result).to.equal('capi-tals-4-to-space');
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
  mixedStrings.forEach(arr=>{
    it(`convertMixedStringToCc ${arr[0]} >> ${arr[1]}`, ()=>{
      const result = convertMixedStringToCc(arr[0]);
      expect(result).to.equal(arr[1]);
    });
  });


});