/* functions in this file handle unit conversions */

'use strict';

var _require = require('./basic'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral,
    precisionRound = _require.precisionRound;

// @@@@@@@@@@ VOLUME @@@@@@@@@

var ciToCf = function ciToCf(ci) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / (12 * 12 * 12), 4);
};

// @@@@@@@@@@ LIQUID @@@@@@@@@

var galsToInches = function galsToInches(gallons, squareFeet) {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons) || !isPrimitiveNumber(squareFeet)) return;
  if (squareFeet === 0) return 0;
  var squareInches = squareFeet * 144;
  var cubicInches = gallons * 231;
  return precisionRound(cubicInches / squareInches, 4);
};

var inchesToGals = function inchesToGals(inches, squareFeet) {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(inches) || !isPrimitiveNumber(squareFeet)) return;
  if (squareFeet === 0) return 0;
  var squareInches = squareFeet * 144;
  var cubicInches = squareInches * inches;
  return ciToGals(cubicInches);
};

var galsToCi = function galsToCi(gallons) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 231, 4);
};

var ciToGals = function ciToGals(ci) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / 231, 4);
};

var galsToCf = function galsToCf(gallons) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 0.133681, 4);
};

var galsToLbs = function galsToLbs(gallons) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 8.34, 4);
};

var lbsToGals = function lbsToGals(lbs) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs / 8.34, 4);
};

var calcVwc = function calcVwc(volume, water) {
  /* input: {
    volume: {
      units,
      qty
    },
    water{
      units,
      qty
    },
  }
  */
  if (!isObjectLiteral(volume) || !isObjectLiteral(water)) return;
  var volumeUnits = typeof volume.units === 'string' ? volume.units.toLowerCase() : null;
  var volumeCF = volumeUnits === 'cf' ? volume.qty : volumeUnits === 'ci' ? ciToCf(volume.qty) : null;
  var waterUnits = typeof water.units === 'string' ? water.units.toLowerCase() : null;
  var waterCF = waterUnits === 'cf' ? water.qty : waterUnits === 'ci' ? ciToCf(water.qty) : waterUnits === 'gals' ? ciToCf(galsToCi(water.qty)) : waterUnits === 'lbs' ? ciToCf(galsToCi(lbsToGals(water.qty))) : null;
  if (!isPrimitiveNumber(volumeCF)) return;
  if (!isPrimitiveNumber(waterCF)) return;
  if (volumeCF === 0) return; // return undefined vs 0, b/c we cannot calculate 0 CF (0 would not be an accurate result)
  var vwc = precisionRound(waterCF / volumeCF, 4);
  return vwc;
};

// @@@@@@@@@@ TEMPERATURE @@@@@@@@@

var celsius2kelvin = function celsius2kelvin(celsius) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return celsius + 273.15;
};

var kelvin2celsius = function kelvin2celsius(kelvin) {
  /*
    Convert temperature in degrees Kelvin to degrees Celsius.
     :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return kelvin - 273.15;
};

// @@@@@@@@@@ ANGLES @@@@@@@@@


var deg2rad = function deg2rad(degrees) {
  /*
    Convert angular degrees to radians
     :param degrees: Value in degrees to be converted.
    :return: Value in radians
    :rtype: float
    */
  return degrees * (Math.PI / 180.0);
};

var rad2deg = function rad2deg(radians) {
  /*
    Convert radians to angular degrees
     :param radians: Value in radians to be converted.
    :return: Value in angular degrees
    :rtype: float
    */
  return radians * (180.0 / Math.PI);
};

module.exports = {
  ciToCf: ciToCf,
  galsToInches: galsToInches,
  inchesToGals: inchesToGals,
  galsToCi: galsToCi,
  ciToGals: ciToGals,
  galsToCf: galsToCf,
  galsToLbs: galsToLbs,
  lbsToGals: lbsToGals,
  calcVwc: calcVwc,
  celsius2kelvin: celsius2kelvin,
  kelvin2celsius: kelvin2celsius,
  deg2rad: deg2rad,
  rad2deg: rad2deg
};