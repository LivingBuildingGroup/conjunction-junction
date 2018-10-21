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

var mmToLM2 = function mmToLM2(mm) {
  // 1 M2 = 1,000,000 square millimeters
  // 1 mm thick over 1 M2 = 1,000,000 cubic millimeters
  // 1,000,000 cubic mm = 1 L
  return mm * 1000000;
};

var lM2ToMm = function lM2ToMm(L) {
  return L / 1000000;
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

var celsiusToKelvin = function celsiusToKelvin(celsius) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return celsius + 273.15;
};

var kelvinToCelsius = function kelvinToCelsius(kelvin) {
  /*
    Convert temperature in degrees Kelvin to degrees Celsius.
     :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return kelvin - 273.15;
};

// @@@@@@@@@@ SLOPE @@@@@@@@@

var pctToDeg = function pctToDeg(pct) {
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 90;

  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return 100 * range * pct / 100;
};

var degToPct = function degToPct(deg) {
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 90;

  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return range === 0 ? 0 : 100 * (deg / range) / 100;
};

// @@@@@@@@@@ ANGLES @@@@@@@@@

var degToRad = function degToRad(degrees) {
  /*
    Convert angular degrees to radians
     :param degrees: Value in degrees to be converted.
    :return: Value in radians
    :rtype: float
    */
  return degrees * (Math.PI / 180.0);
};

var radToDeg = function radToDeg(radians) {
  /*
    Convert radians to angular degrees
     :param radians: Value in radians to be converted.
    :return: Value in angular degrees
    :rtype: float
    */
  return radians * (180.0 / Math.PI);
};

// @@@@@@@@@@ SPEED @@@@@@@@@

var msToKph = function msToKph(ms) {
  /*
   * Convert meters per second to kilometers per hour
   */
  return ms * 3.6;
};

var msToMph = function msToMph(ms) {
  /*
   * Convert meters per second to miles per hour
   */
  return ms * 2.23694;
};

var mphToKph = function mphToKph(mph) {
  /*
   * Convert miles per hour to kilometers per hour
   */
  return mph * 1.60934;
};

var kphToMph = function kphToMph(kph) {
  /*
   * Convert kilometres per hour to miles per hour
   */
  return kph * 0.621371;
};

var kphToMs = function kphToMs(kph) {
  /*
   * Convert kilometres per hour to meters per second
   */
  return kph * 0.277778;
};

// @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@

var solarKwM2DayToUvProxy = function solarKwM2DayToUvProxy(kwM2) {
  /*
   * VERY ROUGH estimate of UV Index
   * UV index scale is 0 (no UV) to mid-teens, or about 12 in most of the US outside the SW
   * Solar kW/M2/day is approximately 1 kW/M2/hour when very sunny, or about 8 kW/M2/day on a sunny day
   * Since these are directly proportionate, a close - BUT NOT SCIENTIFIC calculation is that 0 kW = 0 UVI, and 8 kW/M2/day = 12 UVI
   * So use a multiplier of 1.5.
   */
  return kwM2 * 1.5;
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
  lM2ToMm: lM2ToMm,
  mmToLM2: mmToLM2,
  calcVwc: calcVwc,
  celsiusToKelvin: celsiusToKelvin,
  kelvinToCelsius: kelvinToCelsius,
  pctToDeg: pctToDeg,
  degToPct: degToPct,
  degToRad: degToRad,
  radToDeg: radToDeg,
  msToKph: msToKph,
  kphToMs: kphToMs,
  msToMph: msToMph,
  mphToKph: mphToKph,
  kphToMph: kphToMph,
  solarKwM2DayToUvProxy: solarKwM2DayToUvProxy
};