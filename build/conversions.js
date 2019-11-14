/* functions in this file handle unit conversions */

'use strict';

var _require = require('./basic'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral,
    precisionRound = _require.precisionRound;

// @@@@@@@@@@ DISTANCE @@@@@@@@@

var mmToInches = function mmToInches(mm) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(mm)) return;
  return precisionRound(mm * 0.0393701, 4);
};

var inchesToMm = function inchesToMm(inches) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(inches)) return;
  return precisionRound(inches * 25.4, 4);
};

var feetToMeters = function feetToMeters(feet) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(feet)) return;
  return precisionRound(feet * 0.3048, 4);
};

var metersToFeet = function metersToFeet(meters) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(meters)) return;
  return precisionRound(meters * 3.28084, 4);
};

// @@@@@@@@@@ AREA @@@@@@@@@

var sfToM2 = function sfToM2(sf) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(sf)) return;
  return precisionRound(sf * 0.092903, 4);
};

var m2ToSf = function m2ToSf(m2) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(m2)) return;
  return precisionRound(m2 * 10.7639, 4);
};

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

var mmToL = function mmToL(mm, m2) {
  if (!isPrimitiveNumber(mm) || !isPrimitiveNumber(m2)) return;
  return precisionRound(mm * m2, 4);
};

var lToMm = function lToMm(l, m2) {
  if (!isPrimitiveNumber(l) || !isPrimitiveNumber(m2)) return;
  return precisionRound(l / m2, 4);
};

var galsToCi = function galsToCi(gallons) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 231, 4);
};

var ciToCc = function ciToCc(ci) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci * 16.3871, 4);
};

var ccToCi = function ccToCi(ci) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci * 0.0610237, 4);
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

var lbsCfToKgM3 = function lbsCfToKgM3(lbsCf) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(lbsCf)) return;
  return precisionRound(lbsCf * 16.018463, 4);
};

var kgM3ToLbsCf = function kgM3ToLbsCf(kgM3) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(kgM3)) return;
  return precisionRound(kgM3 * 0.062428, 4);
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

var lM2ToGalSf = function lM2ToGalSf(lM2) {
  if (!isPrimitiveNumber(lM2)) return;
  return precisionRound(lM2 * 0.02454239, 4);
};

var galSfToLM2 = function galSfToLM2(gsf) {
  if (!isPrimitiveNumber(gsf)) return;
  return precisionRound(gsf * 40.745833577571, 4);
};

var kgToL = function kgToL(kg) {
  // input: number, output: either a number or undefined;
  if (!isPrimitiveNumber(kg)) return;
  return kg;
};

var kgToMm = function kgToMm(kg, M2) {
  if (!isPrimitiveNumber(kg)) return;
  if (!isPrimitiveNumber(M2)) return;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(kg / M2, 4);
};

var ccToL = function ccToL(cc) {
  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc * 0.001, 4);
};

var lToCc = function lToCc(L) {
  if (!isPrimitiveNumber(L)) return;
  return precisionRound(L * 1000, 4);
};

var ccToCf = function ccToCf(cc) {
  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc * 0.0000353147, 4);
};

var lToCf = function lToCf(L) {
  if (!isPrimitiveNumber(L)) return;
  return precisionRound(L * 0.0353147, 4);
};

var cfToL = function cfToL(cf) {
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf * 28.317, 4);
};

var ccToM3 = function ccToM3(cc) {
  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc * 1000000, 4);
};

var m3ToCc = function m3ToCc(m3) {
  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 / 1000000, 4);
};

var m3ToCf = function m3ToCf(m3) {
  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 35.3147, 4);
};

var _convertToCf = function _convertToCf(units, qty) {
  var cf = units === 'cf' ? qty : units === 'ci' ? ciToCf(qty) : units === 'gals' ? ciToCf(galsToCi(qty)) : units === 'lbs' ? ciToCf(galsToCi(lbsToGals(qty))) : units === 'cc' ? ccToCf(qty) : units === 'l' ? lToCf(qty) : units === 'm3' ? m3ToCf(qty) : null;
  return cf;
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
  var waterUnits = typeof water.units === 'string' ? water.units.toLowerCase() : null;
  if (volumeUnits === waterUnits) {
    return precisionRound(water.qty / volume.qty);
  }
  if (volumeUnits === 'cc' && waterUnits === 'l') {
    return precisionRound(water.qty / (volume.qty / 1000));
  }

  var volumeCF = _convertToCf(volumeUnits, volume.qty);
  var waterCF = _convertToCf(waterUnits, water.qty);

  if (!isPrimitiveNumber(volumeCF)) return;
  if (!isPrimitiveNumber(waterCF)) return;

  if (volumeCF === 0) return; // return undefined vs 0, b/c we cannot calculate 0 CF (0 would not be an accurate result)

  var vwc = precisionRound(waterCF / volumeCF, 4);
  return vwc;
};

// @@@@@@@@@@ FLOW RATE @@@@@@@@@

var cfSAcToLSHa = function cfSAcToLSHa(cfSAc) {
  if (!isPrimitiveNumber(cfSAc)) return;
  return precisionRound(cfSAc * 69.9724518, 4);
};

var lSHaToCfSAc = function lSHaToCfSAc(lSHa) {
  if (!isPrimitiveNumber(lSHa)) return;
  return precisionRound(lSHa * 0.0142913386, 4);
};

// @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@

var lbsToKg = function lbsToKg(lbs) {
  if (!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs * 0.453592, 4);
};

var kgToLbs = function kgToLbs(kg) {
  if (!isPrimitiveNumber(kg)) return;
  return precisionRound(kg * 2.20462, 4);
};

// @@@@@@@@@@ DENSITY @@@@@@@@@

var psfToKM2 = function psfToKM2(psf) {
  console.warn('psfToKM2 is deprecated use psfToKgM2');
  if (!isPrimitiveNumber(psf)) return;
  return precisionRound(psf * 4.88243, 4);
};

var kM2ToPsf = function kM2ToPsf(kM2) {
  console.warn('kM2ToPsf is deprecated use kgM2ToPsf');
  if (!isPrimitiveNumber(kM2)) return;
  return precisionRound(kM2 * 0.204816, 4);
};

var psfToKgM2 = function psfToKgM2(psf) {
  if (!isPrimitiveNumber(psf)) return;
  return precisionRound(psf * 4.88243, 4);
};

var kgM2ToPsf = function kgM2ToPsf(kM2) {
  if (!isPrimitiveNumber(kM2)) return;
  return precisionRound(kM2 * 0.204816, 4);
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

var celsiusToF = function celsiusToF(celsius) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return celsius * 1.8 + 32;
};

var fToCelsius = function fToCelsius(f) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return (f - 32) / 1.8;
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

var getDewPointC = function getDewPointC(t_air_c, rel_humidity) {
  // Compute the dew point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // rel_humidity: relative humidity in %
  // returns the dew point in degrees Celsius
  var A = 17.27;
  var B = 237.7;
  var alpha = A * t_air_c / (B + t_air_c) + Math.log(rel_humidity / 100.0);
  return alpha;
};

var getFrostPointC = function getFrostPointC(t_air_c, dew_point_c) {
  // Compute the frost point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // dew_point_c: current dew point in degrees Celsius
  // returns the frost point in degrees Celsius
  var dew_point_k = 273.15 + dew_point_c;
  var t_air_k = 273.15 + t_air_c;
  var frost_point_k = dew_point_k - t_air_k + 2671.02 / (2954.61 / t_air_k + 2.193665 * Math.log(t_air_k) - 13.3448);
  return frost_point_k - 273.15;
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
  mmToInches: mmToInches,
  inchesToMm: inchesToMm,
  feetToMeters: feetToMeters,
  metersToFeet: metersToFeet,
  ciToCf: ciToCf,
  galsToInches: galsToInches,
  inchesToGals: inchesToGals,
  mmToL: mmToL,
  lToMm: lToMm,
  galsToCi: galsToCi,
  ciToCc: ciToCc,
  ccToCi: ccToCi,
  ciToGals: ciToGals,
  ccToCf: ccToCf,
  sfToM2: sfToM2,
  m2ToSf: m2ToSf,
  galsToCf: galsToCf,
  lbsCfToKgM3: lbsCfToKgM3,
  kgM3ToLbsCf: kgM3ToLbsCf,
  galsToLbs: galsToLbs,
  lbsToGals: lbsToGals,
  lM2ToGalSf: lM2ToGalSf,
  galSfToLM2: galSfToLM2,
  kgToL: kgToL,
  kgToMm: kgToMm,
  _convertToCf: _convertToCf,
  calcVwc: calcVwc,
  ccToL: ccToL,
  ccToM3: ccToM3,
  m3ToCc: m3ToCc,
  lToCc: lToCc,
  lToCf: lToCf,
  cfToL: cfToL,
  lbsToKg: lbsToKg,
  kgToLbs: kgToLbs,
  cfSAcToLSHa: cfSAcToLSHa,
  lSHaToCfSAc: lSHaToCfSAc,
  psfToKM2: psfToKM2,
  kM2ToPsf: kM2ToPsf,
  psfToKgM2: psfToKgM2,
  kgM2ToPsf: kgM2ToPsf,
  celsiusToKelvin: celsiusToKelvin,
  celsiusToF: celsiusToF,
  fToCelsius: fToCelsius,
  kelvinToCelsius: kelvinToCelsius,
  getDewPointC: getDewPointC,
  getFrostPointC: getFrostPointC,
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