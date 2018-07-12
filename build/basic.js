'use strict';

// @@@@@@@@@@@@@@@ TYPES @@@@@@@@@@@@@@@@

var isPrimitiveNumber = function isPrimitiveNumber(number) {
  var isNumberOrNull = !isNaN(number); // limits to Arrays, numbers, null
  var isNotNull = number !== null; // limits to Arrays, null
  var typeIsNumber = typeof number === 'number'; // eliminates Arrays
  return isNumberOrNull && isNotNull && typeIsNumber;
};

var isObjectLiteral = function isObjectLiteral(object) {
  var isObject = object instanceof Object;
  var isNotArray = !Array.isArray(object);
  return isObject && isNotArray;
};

// @@@@@@@@@@@@@@@ NUMBERS @@@@@@@@@@@@@@@@

var precisionRound = function precisionRound(number, precision) {
  if (!isPrimitiveNumber(number) || !isPrimitiveNumber(precision)) return 0;
  var factor = Math.pow(10, precision);
  if (factor === 0) return 0;
  return Math.round(number * factor) / factor;
};

module.exports = {
  isPrimitiveNumber: isPrimitiveNumber,
  isObjectLiteral: isObjectLiteral,
  precisionRound: precisionRound
};