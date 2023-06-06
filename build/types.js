'use strict';

var _require = require('./basic'),
    isObjectLiteral = _require.isObjectLiteral,
    isPrimitiveNumber = _require.isPrimitiveNumber;

var asArray = function asArray(x) {
  if (Array.isArray(x)) {
    return x;
  }
  return [];
};

var asObject = function asObject(x) {
  if (isObjectLiteral(x)) {
    return x;
  }
  return {};
};

var asFunction = function asFunction(x) {
  if (typeof x === 'function') {
    return x;
  }
  return function () {};
};

var asString = function asString(x) {
  if (typeof x === 'string') {
    return x;
  }
  return '';
};

var asNumber = function asNumber(x, def) {
  if (typeof def === 'undefined') {
    console.warn('please specify a default value when using asNumber');
  }
  if (isPrimitiveNumber(x)) {
    return x;
  }
  return def;
};

module.exports = {
  asArray: asArray,
  asObject: asObject,
  asFunction: asFunction,
  asString: asString,
  asNumber: asNumber
};