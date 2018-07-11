'use strict';

const chai = require('chai');
const expect = chai.expect;

const {
  isValidDate,
  calcDayOfYearFromTimestamp,
  getTheTimezoneOffset,
  isDaylightSavings,
  getDaysOfMonth,
  formatOffsetAsString,
  leadingZero,
  removeSpacesFromString,
  parseTimestampString,
  convertStringToTimestamp,
  convertTimestampToString,
  convertLocalStringTimestampToZuluStringTimestamp,
  dropZoneFromTimestamp,
  convertTimestampToIntegers,
  convertIntegersToTimestamp,
  totalMinsHoursDays,
  dateDelta,
  addTime,
  createTimeframes,
  rangeIsIncluded,
  printDate,
  createTimestampLabel,
} = require('../date-time');
const {
  datez, date0,date1,date2,date3,date4,date5,date6,date7,date8,date9,
  date1String_d_t_z, date1String_d_t_noz, date1StringDtz, date1StringDtzDef, date1StringDtmsz, date1String, date1TimeString,
  numbers, 
  nonNumbers, 
  nonObjects,
  nonNumberObjects, 
  nonNumberArrays,
  nonStringPrimitives,
  lowerStrings,
  upperStrings,
  nonStringNonNumbers,
  nonCompoundArrays,  // uniqueNumber0,uniqueNumber1,uniqueNumber2,uniqueNumber3,uniqueNumber4,uniqueNumber5,uniqueNumber6,uniqueNumber7,uniqueNumber8,uniqueNumber9,
} = require('./helper-data');

describe('conjunction-junction date-time', () => { 

  it('isValidDate new Date', () => {
    const date = new Date(); 
    const result = isValidDate(date);
    expect(result).to.equal(true);
  });
  it('isValidDate new Date(num)', () => {
    const date = new Date(1521383085716); 
    const result = isValidDate(date);
    expect(result).to.equal(true);
  });
  it('isValidDate convertStringToTimestamp', () => {
    const date = convertStringToTimestamp('2018-05-18 11:11:11 -0400'); 
    const result = isValidDate(date);
    expect(result).to.equal(true);
  });
  it('isValidDate loop thru helpers', () => {
    const dates = [datez,date0,date1,date2,date3,date4,date5,date6,date7,date8,date9];
    dates.forEach(date=>{
      const result = isValidDate(date);
      expect(result).to.equal(true);
    });
  });
  it('isValidDate not valid', () => {
    const nonDates = [
      ...numbers, 
      ...nonNumbers, 
      ...nonObjects,
      ...nonNumberObjects, 
      ...nonNumberArrays,
      ...nonStringPrimitives,
      ...lowerStrings,
      ...upperStrings,
      ...nonStringNonNumbers,
      ...nonCompoundArrays,
    ];
    nonDates.forEach(nonDate=>{
      const result = isValidDate(nonDate);
      expect(result).to.equal(false);
    });
  });

  it('calcDayOfYearFromTimestamp 1 on Jan 1', () => {
    const timestamp = new Date(2018,0,1,0,0,0);
    const expectedResult = 1;
    const result = calcDayOfYearFromTimestamp(timestamp);
    expect(result).to.equal(expectedResult);
  });
  it('calcDayOfYearFromTimestamp non-leap', () => {
    const timestamp = new Date(2017,2,31,0,0,0);
    const expectedResult = 31+28+31;
    const result = calcDayOfYearFromTimestamp(timestamp);
    expect(result).to.equal(expectedResult);
  });
  it('calcDayOfYearFromTimestamp leap', () => {
    const timestamp = new Date(2016,2,31,0,0,0);
    const expectedResult = 31+29+31;
    const result = calcDayOfYearFromTimestamp(timestamp);
    expect(result).to.equal(expectedResult);
  });

  it('getTheTimezoneOffset no date', () => {
    const result = getTheTimezoneOffset(); 
    // THIS ONLY WORKS IN DAYLIGHT SAVINGS TIME
    // CHANGE TO 300 IN STANDARD TIME
    expect(result).to.equal(-240);
  });
  it('getTheTimezoneOffset date with local zone', () => {
    const date = new Date();
    const result = getTheTimezoneOffset(date); 
    // THIS ONLY WORKS IN DAYLIGHT SAVINGS TIME
    // CHANGE TO 300 IN STANDARD TIME
    expect(result).to.equal(-240);
  });
  it('getTheTimezoneOffset date with UTC date', () => {
    const date = new Date();
    date.setUTCDate(23);
    const result = getTheTimezoneOffset(date); 
    expect(result).to.equal(-240);
  });
  it('getTheTimezoneOffset date with UTC hours', () => {
    const date = new Date();
    date.setUTCHours(23);
    const result = getTheTimezoneOffset(date); 
    expect(result).to.equal(-240);
  });

  it('isDaylightSavings no offset', () => {
    // ONLY WORKS IF DAYLIGHT SAVINGS, CHANGE TO FALSE IN WINTER
    const result = isDaylightSavings();
    expect(result).to.deep.equal(true);
  });
  it('isDaylightSavings enter local offset', () => {
    // ONLY WORKS IF DAYLIGHT SAVINGS, CHANGE TO FALSE IN WINTER
    const result = isDaylightSavings(-240);
    expect(result).to.deep.equal(true);
  });
  it('isDaylightSavings enter other offset', () => {
    // ONLY WORKS IF DAYLIGHT SAVINGS, CHANGE TO TRUE IN WINTER
    const result = isDaylightSavings(-300);
    expect(result).to.deep.equal(false);
  });

  it('getDaysOfMonth',()=>{

  });

  it('formatOffsetAsString -240 default colon', () => {
    const result = formatOffsetAsString(-240);
    expect(result).to.equal('-04:00');
  });
  it('formatOffsetAsString -240 true colon', () => {
    const result = formatOffsetAsString(-240, true);
    expect(result).to.equal('-04:00');
  });
  it('formatOffsetAsString -240 false colon', () => {
    const result = formatOffsetAsString(-240, false);
    expect(result).to.equal('-0400');
  });
  it('formatOffsetAsString 240 false colon', () => {
    const result = formatOffsetAsString(240, false);
    expect(result).to.equal('+0400');
  });
  it('formatOffsetAsString 240 true colon', () => {
    const result = formatOffsetAsString(240, true);
    expect(result).to.equal('+04:00');
  });

  it('leadingZero 03', () => {
    const result = leadingZero(3);
    expect(result).to.equal('03');
  });
  it('leadingZero 43', () => {
    const result = leadingZero(43);
    expect(result).to.equal('43');
  });
  it('leadingZero 0430', () => {
    const result = leadingZero(430, 4);
    expect(result).to.equal('0430');
  });
  it('leadingZero string 0430', () => {
    const result = leadingZero('430', 4);
    expect(result).to.equal('0430');
  });
  it('leadingZero string 43', () => {
    const result = leadingZero('43');
    expect(result).to.equal('43');
  });
  it('leadingZero string a', () => {
    const result = leadingZero('a');
    expect(result).to.equal('0a');
  });
  it('leadingZero string ab', () => {
    const result = leadingZero('ab');
    expect(result).to.equal('ab');
  });
  it('leadingZero string 1.2', () => {
    const result = leadingZero('1.2');
    expect(result).to.equal('1.2');
  });
  it('leadingZero 1.2', () => {
    const result = leadingZero(1.2);
    expect(result).to.equal('1.2');
  });
  it('leadingZero 1.2', () => {
    const result = leadingZero(1.2,5);
    expect(result).to.equal('001.2');
  });

  it('removeSpacesFromString neg', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19-0400',
      '2018-05-17T15:25:19 -0400',
      '2018-05-17 15:25:19-0400',
      '2018-05-17 15:25:19 -0400',
      '2018-05-17 15:25:19 -0400 ',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19-0400');
    });
  });
  it('removeSpacesFromString neg colon', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19-04:00',
      '2018-05-17T15:25:19 -04:00',
      '2018-05-17T15:25:19 -04:00 ',
      '2018-05-17 15:25:19-04:00',
      '2018-05-17 15:25:19 -04:00',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19-04:00');
    });
  });
  it('removeSpacesFromString neg seconds', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19.001-0400 ',
      '2018-05-17T15:25:19.001-0400',
      '2018-05-17T15:25:19.001 -0400',
      '2018-05-17 15:25:19.001-0400',
      '2018-05-17 15:25:19.001 -0400',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19.001-0400');
    });
  });
  it('removeSpacesFromString neg seconds colon', ()=>{
    const dateStrings = [
      ' 2018-05-17T15:25:19.001-04:00',
      '2018-05-17T15:25:19.001-04:00',
      '2018-05-17T15:25:19.001 -04:00',
      '2018-05-17 15:25:19.001-04:00',
      '2018-05-17 15:25:19.001 -04:00',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19.001-04:00');
    });
  });
  it('removeSpacesFromString plus', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19+0400',
      '2018-05-17T15:25:19 +0400',
      '2018-05-17 15:25:19+0400',
      '2018-05-17 15:25:19 +0400',
      '2018-05-17 15:25:19 +0400 ',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19+0400');
    });
  });
  it('removeSpacesFromString plus colon', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19+04:00',
      '2018-05-17T15:25:19 +04:00 ',
      '2018-05-17T15:25:19 +04:00',
      '2018-05-17 15:25:19+04:00',
      '2018-05-17 15:25:19 +04:00',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19+04:00');
    });
  });
  it('removeSpacesFromString plus seconds', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19.001+0400',
      '2018-05-17T15:25:19.001 +0400',
      ' 2018-05-17 15:25:19.001+0400',
      '2018-05-17 15:25:19.001+0400',
      '2018-05-17 15:25:19.001 +0400',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19.001+0400');
    });
  });
  it('removeSpacesFromString plus seconds colon', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19.001+04:00',
      '2018-05-17T15:25:19.001 +04:00',
      '2018-05-17 15:25:19.001+04:00',
      '2018-05-17 15:25:19.001+04:00 ',
      '2018-05-17 15:25:19.001 +04:00',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19.001+04:00');
    });
  });
  it('removeSpacesFromString zulu', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19Z',
      '2018-05-17T15:25:19 Z',
      '2018-05-17 15:25:19Z',
      '2018-05-17 15:25:19 Z',
      '2018-05-17 15:25:19 Z ',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19Z');
    });
  });
  it('removeSpacesFromString zulu seconds', ()=>{
    const dateStrings = [
      '2018-05-17T15:25:19.001Z',
      '2018-05-17T15:25:19.001 Z',
      '2018-05-17 15:25:19.001Z',
      '2018-05-17 15:25:19.001 Z',
      '2018-05-17 15:25:19.001 Z ',
    ];
    dateStrings.forEach(s=>{
      const result = removeSpacesFromString(s);
      expect(result).to.equal('2018-05-17T15:25:19.001Z');
    });
  });

  const validTimestampStrings = [
    // removeSpacesFromString narrows options down to these
    '2018-05-17T15:25:19-0400',
    '2018-05-17T15:25:19-04:00',
    '2018-05-17T15:25:19.001-0400',
    '2018-05-17T15:25:19.001-04:00',
    '2018-05-17T15:25:19+0400',
    '2018-05-17T15:25:19+04:00',
    '2018-05-17T15:25:19.001+0400',
    '2018-05-17T15:25:19.001+04:00',
    '2018-05-17T15:25:19Z',
    '2018-05-17T15:25:19.001Z',
  ];

  it('parseTimestampString T-0400', () => {
    const string = '2018-05-17T15:25:19-0400';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19-0400'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.',4,'+','not zulu'],
      timeSplit:     [15,25,19],
      ms: 0,
      offset:        -4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T-04:30', () => {
    const string = '2018-05-17T15:25:19-04:30';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19-04:30'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.',4.5,'+','not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            0,
      offset:        -4.5,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T.001-0400', () => {
    const string = '2018-05-17T15:25:19.001-0400';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001-0400'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [1,4,'+','not zulu'],
      timeSplit:     [15,25,19],
      ms:            1,
      offset:        -4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T.001-04:00', () => {
    const string = '2018-05-17T15:25:19.001-04:00';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001-04:00'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [1,4,'+','not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            1,
      offset:        -4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T+0430', () => {
    const string = '2018-05-17T15:25:19+0430';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19+0430'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.','-',4.5,'not zulu'],
      timeSplit:     [15,25,19],
      ms:            0,
      offset:        4.5,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T+04:00', () => {
    const string = '2018-05-17T15:25:19+04:00';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19+04:00'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.','-',4,'not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            0,
      offset:        4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T.001+0400', () => {
    const string = '2018-05-17T15:25:19.001+0400';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001+0400'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [1,'-',4,'not zulu'],
      timeSplit:     [15,25,19],
      ms:            1,
      offset:        4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T.001+04:00', () => {
    const string = '2018-05-17T15:25:19.001+04:00';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001+04:00'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [1,'-',4,'not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            1,
      offset:        4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString TZ', () => {
    const string = '2018-05-17T15:25:19Z';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19Z'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.','-','+','zulu'],
      timeSplit:     [15,25,19],
      ms:            0,
      offset:        0,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString T.001Z', () => {
    const string = '2018-05-17T15:25:19.001Z';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001Z'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [1,'-','+','zulu'],
      timeSplit:     [15,25,19],
      ms:            1,
      offset:        0,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString space no zone', () => {
    const string = '2018-05-17 15:25:19';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.', '-','+','not zulu'],
      timeSplit:     [15,25,19],
      ms:            0,
      offset:        0,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString space +04:00', () => {
    const string = '2018-05-17 15:25:19 +04:00';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19 +04:00'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      ['.', '-',  4 ,'not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            0,
      offset:        4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString space .001 +04:00', () => {
    const string = '2018-05-17 15:25:19.001 +04:00';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001 +04:00'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [ 1 , '-',  4 ,'not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            1,
      offset:        4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString space .001+04:00', () => {
    const string = '2018-05-17 15:25:19.001+04:00';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001+04:00'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [ 1 , '-',  4 ,'not zulu'],
      timeSplit:     [15,25,19,null],
      ms:            1,
      offset:        4,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });
  it('parseTimestampString space .001', () => {
    const string = '2018-05-17 15:25:19.001';
    const expectedResult = {
      dateTimeArray: ['2018-05-17','15:25:19.001'],
      dateArray:     ['2018','05','17'],
      dateArrayIntegers: [2018,5,17],
      splitters:     ['.', '-', '+', 'Z'],
      splitEnd:      [ 1 , '-', '+' ,'not zulu'],
      timeSplit:     [15,25,19],
      ms:            1,
      offset:        0,
    };
    const result = parseTimestampString(string);
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertStringToTimestamp +00:00', () => {
    const string = '2018-03-15T15:25:19+00:00';
    const expectedResult = new Date();
    expectedResult.setFullYear(2018);
    expectedResult.setMonth(2); // months are 0-index in date objects
    expectedResult.setDate(15);
    expectedResult.setHours(11); // CHANGE THIS TO 10 IN WINTER!
    expectedResult.setMinutes(25);
    expectedResult.setSeconds(19);
    expectedResult.setMilliseconds(0);
    const result = convertStringToTimestamp(string);
    console.log('string', string);
    console.log('tmstmp', result);
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertStringToTimestamp -04:00', () => {
    const string = '2018-03-15T15:25:19-04:00';
    const expectedResult = new Date();
    expectedResult.setFullYear(2018);
    expectedResult.setMonth(2); // months are 0-index in date objects
    expectedResult.setDate(15);
    expectedResult.setHours(15); // CHANGE THIS TO 14 IN WINTER!
    expectedResult.setMinutes(25);
    expectedResult.setSeconds(19);
    expectedResult.setMilliseconds(0);
    const result = convertStringToTimestamp(string);
    console.log('string', string);
    console.log('tmstmp', result);
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertStringToTimestamp space no zone', () => {
    const string = '2016-09-20 14:46:32';
    const expectedResult = new Date(
      2016,
      8, // months are 0-indexed
      20, 
      10, // change to 9 in winter; this is local hours, offset by local zone to create ZULU hours
      46, 
      32
    );
    expectedResult.setMilliseconds(0);
    const result = convertStringToTimestamp(string);
    console.log('string', string);
    console.log('tmstmp', result);
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertTimestampToString date only', () => {
    // 2018-05-17
    const result = convertTimestampToString(date1, 'date');
    expect(result).to.equal(date1String);
  });
  it('convertTimestampToString time only', () => {
    // 13:01:00
    const result = convertTimestampToString(date1, 'time');
    expect(result).to.equal(date1TimeString);
  });
  it('convertTimestampToString d t noz', () => {
    // 2018-05-17 13:01:00
    const result = convertTimestampToString(date1, 'd t noz');
    expect(result).to.equal(date1String_d_t_noz);
  });
  it('convertTimestampToString d t z', () => {
    // 2018-05-17 13:01:00 -0400
    const result = convertTimestampToString(date1, 'd t z');
    expect(result).to.equal(date1String_d_t_z);
  });
  it('convertTimestampToString default dtz', () => {
    // 2018-05-17T13:01:00-0400
    const result = convertTimestampToString(date1);
    expect(result).to.equal(date1StringDtzDef);
  });
  it('convertTimestampToString default dtz', () => {
    // 2018-05-17T13:01:00-04:00
    const result = convertTimestampToString(date1StringDtzDef);
    expect(result).to.equal(date1StringDtzDef);
  });
  // add to above: strings with dates only, no time

  it('convertLocalStringTimestampToZuluStringTimestamp date', () => {
    // Sep 20 2016 10:46:32
    const localStringTimestamp = new Date(1474382792682);
    const expectedResult = '2016-09-20 14:46:32 -0400';
    const result = convertLocalStringTimestampToZuluStringTimestamp(localStringTimestamp);
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertLocalStringTimestampToZuluStringTimestamp string no zone', () => {
    // Sep 20 2016 10:46:32
    const localStringTimestamp = '2016-09-20 14:46:32';
    const expectedResult = '2016-09-20 14:46:32 -0400';
    const result = convertLocalStringTimestampToZuluStringTimestamp(localStringTimestamp);
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertLocalStringTimestampToZuluStringTimestamp string zone', () => {
    // Sep 20 2016 10:46:32
    const localStringTimestamp = '2016-09-20T14:46:32.000';
    const expectedResult = '2016-09-20 14:46:32 -0400';
    const result = convertLocalStringTimestampToZuluStringTimestamp(localStringTimestamp);
    expect(result).to.deep.equal(expectedResult);
  });

  it('dropZoneFromTimestamp empty object on no date sent', () => {
    const expectedResult = {};
    const result = dropZoneFromTimestamp();
    expect(result).to.deep.equal(expectedResult);
  });
  it('dropZoneFromTimestamp crosses midnight', () => {
    // Sep 20 2016 23:46:32
    const timestamp = new Date(1474429592682);
    // ONLY WORKS IN SUMMER.  ADD 1 MORE HOUR IN WINTER.
    // Sep 21 2016 03:46:32
    const expectedResult = new Date(1474443992682);
    const result = dropZoneFromTimestamp(timestamp);
    expect(result).to.deep.equal(expectedResult);
  });
  it('dropZoneFromTimestamp same day', () => {
    // Sep 20 2016 10:46:32
    const timestamp = new Date(1474382792682);
    // ONLY WORKS IN SUMMER.  ADD 1 MORE HOUR IN WINTER.
    // Sep 20 2016 14:46:32
    const expectedResult = new Date(1474397192682);
    const result = dropZoneFromTimestamp(timestamp);
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertTimestampToIntegers valid', () => {
    const ms = 1514768461000;
    const dateAsString = 'Sun Dec 31 2017 20:01:01 GMT-0500 (EST)';
    const date = new Date(ms);
    const result = convertTimestampToIntegers(date);
    const expectedResult = {
      year: 2017,
      month: 12,
      date: 31,
      hours: 20,
      minutes: 1,
      seconds: 1,
      milliseconds: 0,
    };
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertTimestampToIntegers no date', () => {
    const result = convertTimestampToIntegers();
    const expectedResult = {};
    expect(result).to.deep.equal(expectedResult);
  });

  it('convertIntegersToTimestamp all explicit no offset', () => {
    const year     = 2018;
    const month    = 3;
    const date     = 4;
    const hours    = 5;
    const minutes  = 6;
    const seconds  = 7;
    const tzOffset = 0; 
    const newDate = new Date(
      year,
      month,
      date,
      hours,
      minutes,
      seconds
    );
    const expectedResult = newDate;
    const result = convertIntegersToTimestamp(
      year,
      month,
      date, 
      hours, 
      minutes, 
      seconds, 
      tzOffset
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('convertIntegersToTimestamp all default', () => {
    const today = new Date();
    const year  = today.getFullYear();
    const result = convertIntegersToTimestamp();
    const resultYear    = result.getFullYear();
    const resultMonth   = result.getMonth();
    const resultDate    = result.getDate();
    const resultHours   = result.getHours();
    const resultMinutes = result.getMinutes();
    const resultSeconds = result.getSeconds();
    expect(resultYear).to.equal(year);
    expect(resultMonth).to.equal(0);
    expect(resultDate).to.equal(1);
    expect(resultHours).to.equal(12-5); // default to noon, in Jan = -5 hour offset
    expect(resultMinutes).to.equal(0);
    expect(resultSeconds).to.equal(0);
  });
  it('convertIntegersToTimestamp using offset', () => {
    const year     = 2018;
    const month    = 3;
    const date     = 4;
    const hours    = 5;
    const minutes  = 6;
    const seconds  = 7;
    const tzOffset = -240; 
    const newDate = new Date(
      year,
      month,
      date,
      hours - 4, // change to -5 in winter
      minutes,
      seconds
    );
    const expectedResult = newDate;
    const result = convertIntegersToTimestamp(
      year,
      month,
      date, 
      hours, 
      minutes, 
      seconds, 
      tzOffset
    );
    expect(result).to.deep.equal(expectedResult);
  });

  it('totalMinsHoursDays', ()=>{

  });

  it('dateDelta default minutes', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 40;
    const result = dateDelta(date1, date2);
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta seconds', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 2400;
    const result = dateDelta(date1, date2, 'seconds');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta minutes', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 40;
    const result = dateDelta(date1, date2, 'minutes');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta hours', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 1;
    const result = dateDelta(date1, date2, 'hours');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta days 0', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 0;
    const result = dateDelta(date1, date2, 'days');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta days -30', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = -30;
    const result = dateDelta(date1, date0, 'days');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta months 0', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 0;
    const result = dateDelta(date1, date2, 'months');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta months 1', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 1;
    const result = dateDelta(date0, date1, 'months');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta years 0', () => {
    // Apr 22 2018 21:46:32
    const date0 = new Date(1524447992682); 
    // May 22 2018 20:56 PM
    const date1 = new Date(1527036992682); 
    // May 22 2018 21:36 PM
    const date2 = new Date(1527039392682); 
    const expectedResult = 0;
    const result = dateDelta(date1, date2, 'years');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta years 2', () => {
    // May 22 2016 21:46:32
    const date2016 = new Date(1463967392682); 
    // May 22 2018 21:36 PM
    const date2018 = new Date(1527039392682); 
    const expectedResult = 2;
    const result = dateDelta(date2016, date2018, 'years');
    expect(result).to.deep.equal(expectedResult);
  });
  it('dateDelta null on invalid option', () => {
    // May 22 2016 21:46:32
    const date2016 = new Date(1463967392682); 
    // May 22 2018 21:36 PM
    const date2018 = new Date(1527039392682); 
    const expectedResult = null;
    const result = dateDelta(date2016, date2018, 'x');
    expect(result).to.deep.equal(expectedResult);
  });

  it('addTime default minutes', () => {
    // May 22 2016 21:46:32
    const timestamp = new Date(1463967392682); 
    // May 22 2016 21:56:32
    const expectedResult = new Date(1463967992682);
    const result = addTime(timestamp, 10);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime seconds', () => {
    // May 22 2016 21:46:32
    const timestamp = new Date(1463967392682); 
    const option = 'seconds';
    // May 22 2016 21:56:32
    const expectedResult = new Date(1463967992682);
    const result = addTime(timestamp, 600, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime minutes', () => {
    // May 22 2016 21:46:32
    const timestamp = new Date(1463967392682); 
    const option = 'minutes';
    // May 22 2016 21:56:32
    const expectedResult = new Date(1463967992682);
    const result = addTime(timestamp, 10, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime hours', () => {
    // May 22 2016 21:56:32
    const timestamp = new Date(1463967992682); 
    const option = 'hours';
    // May 22 2016 23:56:32
    const expectedResult = new Date(1463975192682);
    const result = addTime(timestamp, 2, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime days', () => {
    // May 22 2016 23:56:32
    const timestamp = new Date(1463975192682);
    const option = 'days';
    // May 20 2016 23:46:32
    const expectedResult = new Date(1463802392682);
    const result = addTime(timestamp, -2, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime months', () => {
    // May 20 2016 23:46:32
    const timestamp = new Date(1463802392682);
    const option = 'months';
    // Sep 20 2016 23:46:32
    const expectedResult = new Date(1474429592682);
    const result = addTime(timestamp, 4, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime subtract months', () => {
    // Sun May 01 2016 00:00:00 GMT-0400
    const timestamp = new Date(1462075200000);
    const option = 'months';
    // Mon Feb 01 2016 00:00:00 GMT-0500
    
    const expectedResult = new Date(1454302800000);
    const result = addTime(timestamp, -3, option);
    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime years', () => {
    // Sep 20 2016 23:46:32
    const timestamp = new Date(1474429592682);
    const option = 'years';
    // Sep 20 2019 23:46:32
    const expectedResult = new Date(1569037592682);
    const result = addTime(timestamp, 3, option);

    expect(result).to.deep.equal(expectedResult);
  });
  it('addTime invalid option returns self', () => {
    // Sep 20 2016 23:46:32
    const timestamp = new Date(1474429592682);
    const option = 'huh?';
    // Sep 20 2019 23:46:32
    const expectedResult = null;
    const result = addTime(timestamp, 4, option);
    expect(result).to.deep.equal(timestamp);
  });

  it('createTimeframes', () => {

  });

  it('rangeIsIncluded invalid start date', () => {
    const eventStartIn = 'date6';
    const eventEndIn   = date8;
    const rangeStartIn = date1;
    const rangeEndIn   = date3;
    const expectedResult = {
      desc: 'error: at least one date is invalid',
      code: 11,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded invalid end date', () => {
    const eventStartIn = date6;
    const eventEndIn   = 'date8';
    const rangeStartIn = date1;
    const rangeEndIn   = date3;
    const expectedResult = {
      desc: 'error: at least one date is invalid',
      code: 11,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded invalid first of range date', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = 'date1';
    const rangeEndIn   = date3;
    const expectedResult = {
      desc: 'error: at least one date is invalid',
      code: 11,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded invalid end of range date', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date1;
    const rangeEndIn   = 'date3';
    const expectedResult = {
      desc: 'error: at least one date is invalid',
      code: 11,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded timeframe reversed', () => {
    const eventStartIn = date9;
    const eventEndIn   = date6;
    const rangeStartIn = date1;
    const rangeEndIn   = date3;
    const expectedResult = {
      desc: 'error: dates are mis-ordered',
      code: 12,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded range reversed', () => {
    const eventStartIn = date1;
    const eventEndIn   = date6;
    const rangeStartIn = date3;
    const rangeEndIn   = date1;
    const expectedResult = {
      desc: 'error: dates are mis-ordered',
      code: 12,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded entirely before', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date1;
    const rangeEndIn   = date3;
    const expectedResult = {
      desc: 'entirely before',
      code: 0,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded spans event', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date1;
    const rangeEndIn   = date9;
    const expectedResult = {
      desc: 'spans event',
      code: 1,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded spans start', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date1;
    const rangeEndIn   = date7;
    const expectedResult = {
      desc: 'spans start',
      code: 2,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded same start ends earlier', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date6;
    const rangeEndIn   = date7;
    const expectedResult = {
      desc: 'same start ends earlier',
      code: 3,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded exact match', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date6;
    const rangeEndIn   = date8;
    const expectedResult = {
      desc: 'exact match',
      code: 4,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded same start ends later', () => {
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date6;
    const rangeEndIn   = date9;
    const expectedResult = {
      desc: 'same start ends later',
      code: 5,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded subset', () => {
    const eventStartIn = date2;
    const eventEndIn   = date8;
    const rangeStartIn = date3;
    const rangeEndIn   = date7;
    const expectedResult = {
      desc: 'subset',
      code: 6,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded starts later same end', () => {
    const eventStartIn = date2;
    const eventEndIn   = date8;
    const rangeStartIn = date3;
    const rangeEndIn   = date8;
    const expectedResult = {
      desc: 'starts later same end',
      code: 7,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded spans end', () => {
    const eventStartIn = date2;
    const eventEndIn   = date7;
    const rangeStartIn = date4;
    const rangeEndIn   = date9;
    const expectedResult = {
      desc: 'spans end',
      code: 8,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it('rangeIsIncluded entirely after', () => {
    const eventStartIn = date1;
    const eventEndIn   = date3;
    const rangeStartIn = date4;
    const rangeEndIn   = date7;
    const expectedResult = {
      desc: 'entirely after',
      code: 9,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });
  it.skip('rangeIsIncluded error', () => {
    // the error is a failsafe; I don't think we have a way to reach it
    const eventStartIn = date6;
    const eventEndIn   = date8;
    const rangeStartIn = date1;
    const rangeEndIn   = date3;
    const expectedResult = {
      desc: 'error',
      code: 10,
    };
    const result = rangeIsIncluded(
      eventStartIn, 
      eventEndIn, 
      rangeStartIn, 
      rangeEndIn
    );
    expect(result).to.deep.equal(expectedResult);
  });

  it('printDate', () => {
    const date = new Date(1527039992682);
    const result = printDate(date);
    // CHANGE THE 9 TO 8 IN WINTER
    const expectedResult = 'Tuesday, May 22, 2018, 9:46 PM';
    expect(result).to.deep.equal(expectedResult);
  });

  it('createTimestampLabel', ()=>{

  });

});