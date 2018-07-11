'use strict';

const { 
  isPrimitiveNumber, 
  isObjectLiteral,
  precisionRound,
} = require('./functions/basic');

const {
  ciToCf,
  galsToInches,
  galsToCi,
  galsToCf,
  galsToLbs,
  lbsToGals,
  calcVwc,
  celsius2kelvin,
  kelvin2celsius,
  deg2rad,
  rad2deg,
} = require('./functions/conversions');

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
} = require('./functions/date-time');

const {
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
  interpolateArrayValues,
} = require('./functions/lib');

const { 
  formatTimestampForSql,
  escapeSpecial,
  unEscapeSpecial,
  formatDataForSql,
  formatObjectForKnex, 
  formatReqBodyForKnex,
  prefixCommonKeys, 
  createSqlFetchTableKeys,
} = require('./functions/sql');

const x = new Date();
console.log('new Date', x)
console.log(convertTimestampToString(x));
console.log(convertTimestampToIntegers(x))

module.exports = {
  // basic
  isPrimitiveNumber, 
  isObjectLiteral,
  precisionRound,
  
  // conversions
  ciToCf,
  galsToInches,
  galsToCi,
  galsToCf,
  galsToLbs,
  lbsToGals,
  calcVwc,
  celsius2kelvin,
  kelvin2celsius,
  deg2rad,
  rad2deg,
  
  // date-time
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
  
  // lib
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
  interpolateArrayValues,
  
  // sql
  formatTimestampForSql,
  escapeSpecial,
  unEscapeSpecial,
  formatDataForSql,
  formatObjectForKnex, 
  formatReqBodyForKnex,
  prefixCommonKeys, 
  createSqlFetchTableKeys,
};