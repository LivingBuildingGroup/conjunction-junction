'use strict';
// GENERAL VALID AND INVALID INPUTS

const {convertTimestampToString,
  convertStringToTimestamp} = require('../date-time');
const {isObjectLiteral}     = require('../basic');

const numbers           = [ -0.5 , -1.3 , 0 , 1 , 3 , 1.3 ];
const nonNumbers        = ['string', undefined, null, {}, [] ];
const nonObjects        = ['string', -1, 0, 3, undefined, null, [], [1,2], [{x:1}, {x:2}] ];  
const nonNumberObjects  = [{x: 'string'}, {x: undefined}, {x: null}, {x: []}, {x: [1,2]}, {x: ['string'] } ];
const nonNumberArrays   = [['string'], [undefined], [null], [[]], [[1,2]], [['string']] ];
const nonStringPrimitives=[...numbers, undefined, null];
const lowerStrings      = ['rabbit', 'bunny', 'cat', 'dog', 'mouse'];
const upperStrings      = ['Rabbit', 'Bunny', 'Cat', 'Dog', 'Mouse'];
const nonStringNonNumbers=[undefined, null, ...nonNumberArrays, ...nonNumberObjects];
const nonCompoundArrays = [['string'], [undefined], [null], ['x'], [1,2], ['string'] ];

const min1 = 1000 * 60;

const ms0 = 1526576400000;
const ms1 = ms0 + min1;
const ms2 = ms1 + min1;
const ms3 = ms2 + min1;
const ms4 = ms3 + min1;
const ms5 = ms4 + min1;
const ms6 = ms5 + min1;
const ms7 = ms6 + min1;
const ms8 = ms7 + min1;
const ms9 = ms8 + min1;
const msz = ms0 - min1;

const datez = new Date(msz);
const date0 = new Date(ms0);
const date1 = new Date(ms1);
const date2 = new Date(ms2);
const date3 = new Date(ms3);
const date4 = new Date(ms4);
const date5 = new Date(ms5);
const date6 = new Date(ms6);
const date7 = new Date(ms7);
const date8 = new Date(ms8);
const date9 = new Date(ms9);

const date1String       = '2018-05-17';
const date1TimeString   = '13:01:00';
const date1String_d_t_noz='2018-05-17 13:01:00';
const date1String_d_t_z = '2018-05-17 13:01:00 -0400';
const date1StringDtzDef = '2018-05-17T13:01:00-04:00';
// not created via convertTimestampToString
const date1StringDtz    = '2018-05-17T13:01:00-0400';
const date1StringDtmsz  = '2018-05-17T13:01:00.000-0400';
const date1p            = 'Thursday, May 17, 2018, 1:01 PM';

const datezs = convertTimestampToString(datez, 'd t z');
const date0s = convertTimestampToString(date0, 'd t z');
const date1s = convertTimestampToString(date1, 'd t z');
const date2s = convertTimestampToString(date2, 'd t z');
const date3s = convertTimestampToString(date3, 'd t z');
const date4s = convertTimestampToString(date4, 'd t z');
const date5s = convertTimestampToString(date5, 'd t z');
const date6s = convertTimestampToString(date6, 'd t z');
const date7s = convertTimestampToString(date7, 'd t z');
const date8s = convertTimestampToString(date8, 'd t z');
const date9s = convertTimestampToString(date9, 'd t z');

const uniqueNumber0 = new Date().getTime();
const uniqueNumber1 = uniqueNumber0 + 10;
const uniqueNumber2 = uniqueNumber1 + 10;
const uniqueNumber3 = uniqueNumber2 + 10;
const uniqueNumber4 = uniqueNumber3 + 10;
const uniqueNumber5 = uniqueNumber4 + 10;
const uniqueNumber6 = uniqueNumber5 + 10;
const uniqueNumber7 = uniqueNumber6 + 10;
const uniqueNumber8 = uniqueNumber7 + 10;
const uniqueNumber9 = uniqueNumber8 + 10;

const formatFetchForComparison = d => {
  // recursive!
  if(isObjectLiteral(d)){
    const o = {};
    for(let key in d){
      o[key] = formatFetchForComparison(d[key]);
    }
    return o;
  } else if(Array.isArray(d)){
    return d.map(dat=>formatFetchForComparison(dat));
  } else if(d instanceof Date){
    return convertTimestampToString(d, 'd t z');
  } else if (typeof d === 'string'){
    if(convertStringToTimestamp(d) instanceof Date){
      const dt = convertStringToTimestamp(d);
      return convertTimestampToString(dt, 'd t z');
    }
    return d;
  } else {
    return d;
  }
};

module.exports = {
  numbers, 
  nonNumbers, 
  nonObjects,
  nonNumberObjects, 
  nonNumberArrays,
  nonStringPrimitives,
  lowerStrings,
  upperStrings,
  nonStringNonNumbers,
  nonCompoundArrays,
  date1StringDtzDef,
  date1String_d_t_z,
  date1String_d_t_noz,
  date1StringDtz,
  date1StringDtmsz,
  date1p,
  date1String,
  date1TimeString,

  min1,

  msz,
  ms0,
  ms1,
  ms2,
  ms3,
  ms4,
  ms5,
  ms6,
  ms7,
  ms8,
  ms9,

  datez,
  date0,
  date1,
  date2,
  date3,
  date4,
  date5,
  date6,
  date7,
  date8,
  date9,

  datezs,
  date0s,
  date1s,
  date2s,
  date3s,
  date4s,
  date5s,
  date6s,
  date7s,
  date8s,
  date9s,

  uniqueNumber0,
  uniqueNumber1,
  uniqueNumber2,
  uniqueNumber3,
  uniqueNumber4,
  uniqueNumber5,
  uniqueNumber6,
  uniqueNumber7,
  uniqueNumber8,
  uniqueNumber9,

  formatFetchForComparison,
};