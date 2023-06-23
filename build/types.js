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
  return function () {
    console.warn('no function provided');
  };
};

var asString = function asString(x, def) {
  if (typeof x === 'string') {
    return x;
  }
  return typeof def === 'string' ? def : '';
};

var asBoolean = function asBoolean(x, def) {
  if (typeof x === 'boolean') {
    return x;
  }
  return !!def;
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
  asBoolean: asBoolean,
  asNumber: asNumber
};