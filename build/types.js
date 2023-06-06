'use strict';

var _require = require('./basic'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral;

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

module.exports = {
  asArray: asArray,
  asObject: asObject,
  asFunction: asFunction
};