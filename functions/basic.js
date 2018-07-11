'use strict';

// @@@@@@@@@@@@@@@ TYPES @@@@@@@@@@@@@@@@

const isPrimitiveNumber = number => {
  const isNumberOrNull = !isNaN(number); // limits to Arrays, numbers, null
  const isNotNull = number !== null; // limits to Arrays, null
  const typeIsNumber = typeof number === 'number'; // eliminates Arrays
  return isNumberOrNull && isNotNull && typeIsNumber;
};

const isObjectLiteral = object => {
  const isObject = object instanceof Object;
  const isNotArray = !Array.isArray(object);
  return isObject && isNotArray;
};

// @@@@@@@@@@@@@@@ NUMBERS @@@@@@@@@@@@@@@@

const precisionRound = (number, precision) => {
  if(!isPrimitiveNumber(number) || !isPrimitiveNumber(precision)) return 0;
  const factor = Math.pow(10, precision);
  if(factor === 0) return 0;
  return Math.round(number * factor) / factor;
};

module.exports = { 
  isPrimitiveNumber, 
  isObjectLiteral,
  precisionRound,
};