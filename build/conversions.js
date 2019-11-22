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
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(feet)) return;
  return precisionRound(feet * 0.3048, round);
};

var metersToFeet = function metersToFeet(meters) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(meters)) return;
  return precisionRound(meters * 3.28084, round);
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

var sfToAc = function sfToAc(sf) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(sf)) return;
  return precisionRound(sf / 43560, 4);
};

var acToSf = function acToSf(ac) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ac)) return;
  return precisionRound(ac * 43560, 4);
};

var acToHa = function acToHa(ac) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ac)) return;
  return precisionRound(ac * 0.404686, 4);
};

var haToAc = function haToAc(ha) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ha)) return;
  return precisionRound(ha * 2.47105, 4);
};

var m2ToHa = function m2ToHa(m2) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(m2)) return;
  return precisionRound(m2 / 10000, 4);
};

var haToM2 = function haToM2(ha) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ha)) return;
  return precisionRound(ha * 10000, 4);
};

// @@@@@@@@@@ VOLUME @@@@@@@@@

var ciToCf = function ciToCf(ci) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / (12 * 12 * 12), 4);
};

var cfToCi = function cfToCi(cf) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf * (12 * 12 * 12), 4);
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

var galsToCf = function galsToCf(gallons) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 0.133681, 4);
};

var cfToGals = function cfToGals(cf) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 0.133681, 4);
};

var m3ToL = function m3ToL(m3) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 1000, 4);
};

var lToM3 = function lToM3(l) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(l)) return;
  return precisionRound(l / 1000, 4);
};

var mlToL = function mlToL(ml) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ml)) return;
  return precisionRound(ml / 1000, 4);
};

var lToMl = function lToMl(ml) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ml)) return;
  return precisionRound(ml * 1000, 4);
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

var cfToCc = function cfToCc(cf) {
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 0.0000353147, 4);
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

var cfToM3 = function cfToM3(cf) {
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 35.3147, 4);
};

var galsToM3 = function galsToM3(gals) {
  if (!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 0.00378541, 8);
};

var m3ToGals = function m3ToGals(m3) {
  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 264.172, 4);
};

var galsToL = function galsToL(gals) {
  if (!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 3.78541, 4);
};

var lToGals = function lToGals(l) {
  if (!isPrimitiveNumber(l)) return;
  return precisionRound(l * 0.264172, 4);
};

// @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@

var galsToInches = function galsToInches(gallons, sf) {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons) || !isPrimitiveNumber(sf)) return;
  if (sf === 0) return 0;
  var si = sf * 144;
  var ci = gallons * 231;
  return precisionRound(ci / si, 4);
};

var inchesToGals = function inchesToGals(inches, sf) {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(inches) || !isPrimitiveNumber(sf)) return;
  if (sf === 0) return 0;
  var si = sf * 144;
  var ci = si * inches;
  return ciToGals(ci);
};

var mmToL = function mmToL(mm, m2) {
  if (!isPrimitiveNumber(mm) || !isPrimitiveNumber(m2)) return;
  return precisionRound(mm * m2, 4);
};

var lToMm = function lToMm(l, m2) {
  if (!isPrimitiveNumber(l) || !isPrimitiveNumber(m2)) return;
  return precisionRound(l / m2, 4);
};

var kgToMm = function kgToMm(kg, m2) {
  if (!isPrimitiveNumber(kg)) return;
  if (!isPrimitiveNumber(m2)) return;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(kg / m2, 4);
};

var mmToKg = function mmToKg(mm, m2) {
  if (!isPrimitiveNumber(mm)) return;
  if (!isPrimitiveNumber(m2)) return;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(mm * m2, 4);
};

// @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@

var lM2ToGalSf = function lM2ToGalSf(lM2) {
  if (!isPrimitiveNumber(lM2)) return;
  return precisionRound(lM2 * 0.02454239, 4);
};

var galSfToLM2 = function galSfToLM2(gsf) {
  if (!isPrimitiveNumber(gsf)) return;
  return precisionRound(gsf * 40.745833577571, 4);
};

// @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@

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

var kgToL = function kgToL(kg) {
  // input: number, output: either a number or undefined;
  if (!isPrimitiveNumber(kg)) return;
  return kg;
};

var lToKg = function lToKg(l) {
  // input: number, output: either a number or undefined;
  if (!isPrimitiveNumber(l)) return;
  return l;
};

var kgToCc = function kgToCc(kg) {
  if (!isPrimitiveNumber(kg)) return;
  return precisionRound(kg * 1000, 4);
};

var ccToKg = function ccToKg(cc) {
  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc / 1000, 4);
};

// @@@@@@@@@@@@@@@@ VWC @@@@@@@@@@@@@@@@

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
  var lSAc = cfToL(cfSAc);
  return haToAc(lSAc);
  // return precisionRound(cfSAc * 69.9724518, 4);
};

var lSHaToCfSAc = function lSHaToCfSAc(lSHa) {
  if (!isPrimitiveNumber(lSHa)) return;
  var cfsHa = lToCf(lSHa);
  return acToHa(cfsHa);
  // return precisionRound(lSHa * 0.0142913386, 4);
};

var gpmToM3S = function gpmToM3S(gpm) {
  if (!isPrimitiveNumber(gpm)) return;
  var gpS = gpm / 60;
  return galsToM3(gpS);
};

var m3SToGpm = function m3SToGpm(m3s) {
  if (!isPrimitiveNumber(m3s)) return;
  var m3Min = m3s * 60;
  return m3ToGals(m3Min);
};

var gpmToLS = function gpmToLS(gpm) {
  if (!isPrimitiveNumber(gpm)) return;
  var gpS = gpm / 60;
  return galsToL(gpS);
};

var lSToGpm = function lSToGpm(lS) {
  if (!isPrimitiveNumber(lS)) return;
  var lMin = lS * 60;
  return lToGals(lMin);
};

// @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@

var gpmFtToM3SM = function gpmFtToM3SM(gpmFt) {
  if (!isPrimitiveNumber(gpmFt)) return;
  var gpSFt = gpmFt / 60;
  var m3SFt = galsToM3(gpSFt);
  return metersToFeet(m3SFt, 8);
};

var m3SMToGpmFt = function m3SMToGpmFt(m3SM) {
  if (!isPrimitiveNumber(m3SM)) return;
  var m3MinM = m3SM * 60;
  var m3SFt = feetToMeters(m3MinM);
  return m3ToGals(m3SFt);
};

var gpmFtToLSM = function gpmFtToLSM(gpmFt) {
  if (!isPrimitiveNumber(gpmFt)) return;
  var gpSFt = gpmFt / 60;
  var gpSM = metersToFeet(gpSFt, 8);
  return galsToL(gpSM);
};

var lSMToGpmFt = function lSMToGpmFt(lSM) {
  if (!isPrimitiveNumber(lSM)) return;
  var lMinM = lSM * 60;
  var lMinFt = feetToMeters(lMinM, 8);
  return lToGals(lMinFt);
};

// @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

var gpmToInchesHr = function gpmToInchesHr(gpm, sf) {
  if (!isPrimitiveNumber(gpm)) return;
  if (!isPrimitiveNumber(sf)) return;
  var gpHr = gpm * 60;
  return galsToInches(gpHr, sf);
};

var inchesHrToGpm = function inchesHrToGpm(inchesHr, sf) {
  if (!isPrimitiveNumber(inchesHr)) return;
  if (!isPrimitiveNumber(sf)) return;
  var inchesMin = inchesHr / 60;
  return inchesToGals(inchesMin, sf);
};

var lMinToMmHr = function lMinToMmHr(lMin, m2) {
  if (!isPrimitiveNumber(lMin)) return;
  if (!isPrimitiveNumber(m2)) return;
  var lHr = lMin * 60;
  return lToMm(lHr, m2);
};

var mmHrToLMin = function mmHrToLMin(mmHr, m2) {
  if (!isPrimitiveNumber(mmHr)) return;
  if (!isPrimitiveNumber(m2)) return;
  var mmMin = mmHr / 60;
  return mmToL(mmMin, m2);
};

var lSToMmHr = function lSToMmHr(lS, m2) {
  if (!isPrimitiveNumber(lS)) return;
  if (!isPrimitiveNumber(m2)) return;
  var lHr = lS * 3600;
  return lToMm(lHr, m2);
};

var mmHrToLS = function mmHrToLS(mmHr, m2) {
  if (!isPrimitiveNumber(mmHr)) return;
  if (!isPrimitiveNumber(m2)) return;
  var mmMin = mmHr / 60;
  var mmS = mmMin / 60;
  return mmToL(mmS, m2);
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

var psfToKgM2 = function psfToKgM2(psf) {
  if (!isPrimitiveNumber(psf)) return;
  return precisionRound(psf * 4.88243, 4);
};

var kgM2ToPsf = function kgM2ToPsf(kM2) {
  if (!isPrimitiveNumber(kM2)) return;
  return precisionRound(kM2 * 0.204816, 4);
};

var psfToKM2 = function psfToKM2(psf) {
  console.warn('psfToKM2 is deprecated use psfToKgM2');
  return psfToKgM2(psf);
};

var kM2ToPsf = function kM2ToPsf(kM2) {
  console.warn('kM2ToPsf is deprecated use kgM2ToPsf');
  return kgM2ToPsf(kM2);
};

// @@@@@@@@@@ TEMPERATURE @@@@@@@@@

var celsiusToKelvin = function celsiusToKelvin(c) {
  console.warn('celsiusToKelvin is deprecated use cToK');
  return cToK(c);
};

var cToK = function cToK(c) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return c + 273.15;
};

var kelvinToCelsius = function kelvinToCelsius(k) {
  console.warn('kelvinToCelsius is deprecated use kToC');
  return kToC(k);
};

var kToC = function kToC(k) {
  /*
    Convert temperature in degrees Kelvin to degrees Celsius.
     :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return k - 273.15;
};

var celsiusToF = function celsiusToF(c) {
  console.warn('celsiusToF is deprecated use cToF');
  return cToF(c);
};

var cToF = function cToF(c) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return c * 1.8 + 32;
};

var fToCelsius = function fToCelsius(f) {
  console.warn('fToCelsius is deprecated use fToC');
  return fToC(f);
};

var fToC = function fToC(f) {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return (f - 32) / 1.8;
};

// @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@

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
  // @@@@@@@@@@ DISTANCE @@@@@@@@@
  mmToInches: mmToInches,
  inchesToMm: inchesToMm,

  feetToMeters: feetToMeters,
  metersToFeet: metersToFeet,

  // @@@@@@@@@@ AREA @@@@@@@@@
  sfToM2: sfToM2,
  m2ToSf: m2ToSf,

  sfToAc: sfToAc,
  acToSf: acToSf,

  acToHa: acToHa,
  haToAc: haToAc,

  m2ToHa: m2ToHa,
  haToM2: haToM2,

  // @@@@@@@@@@ VOLUME @@@@@@@@@
  ciToCf: ciToCf,
  cfToCi: cfToCi,

  galsToCi: galsToCi,
  ciToGals: ciToGals,

  ciToCc: ciToCc,
  ccToCi: ccToCi,

  galsToCf: galsToCf,
  cfToGals: cfToGals,

  m3ToL: m3ToL,
  lToM3: lToM3,

  mlToL: mlToL,
  lToMl: lToMl,

  ccToL: ccToL,
  lToCc: lToCc,

  ccToCf: ccToCf,
  cfToCc: cfToCc,

  lToCf: lToCf,
  cfToL: cfToL,

  ccToM3: ccToM3,
  m3ToCc: m3ToCc,

  m3ToCf: m3ToCf,
  cfToM3: cfToM3,

  galsToM3: galsToM3,
  m3ToGals: m3ToGals,

  galsToL: galsToL,
  lToGals: lToGals,

  // @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@
  galsToInches: galsToInches,
  inchesToGals: inchesToGals,

  mmToL: mmToL,
  lToMm: lToMm,

  kgToMm: kgToMm,
  mmToKg: mmToKg,

  // @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@
  lM2ToGalSf: lM2ToGalSf,
  galSfToLM2: galSfToLM2,

  // @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@
  galsToLbs: galsToLbs,
  lbsToGals: lbsToGals,

  kgToL: kgToL,
  lToKg: lToKg,

  kgToCc: kgToCc,
  ccToKg: ccToKg,

  // @@@@@@@@@@@@@@@@ VWC @@@@@@@@@@@@@@@@
  _convertToCf: _convertToCf,
  calcVwc: calcVwc,

  // @@@@@@@@@@ FLOW RATE @@@@@@@@@
  cfSAcToLSHa: cfSAcToLSHa,
  lSHaToCfSAc: lSHaToCfSAc,

  gpmToM3S: gpmToM3S,
  m3SToGpm: m3SToGpm,

  gpmToLS: gpmToLS,
  lSToGpm: lSToGpm,

  // @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@
  gpmFtToM3SM: gpmFtToM3SM,
  m3SMToGpmFt: m3SMToGpmFt,

  gpmFtToLSM: gpmFtToLSM,
  lSMToGpmFt: lSMToGpmFt,

  // @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

  gpmToInchesHr: gpmToInchesHr,
  inchesHrToGpm: inchesHrToGpm,

  lMinToMmHr: lMinToMmHr,
  mmHrToLMin: mmHrToLMin,

  lSToMmHr: lSToMmHr,
  mmHrToLS: mmHrToLS,

  // @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@
  lbsToKg: lbsToKg,
  kgToLbs: kgToLbs,

  // @@@@@@@@@@ DENSITY @@@@@@@@@
  lbsCfToKgM3: lbsCfToKgM3,
  kgM3ToLbsCf: kgM3ToLbsCf,

  psfToKM2: psfToKM2,
  kM2ToPsf: kM2ToPsf,

  psfToKgM2: psfToKgM2,
  kgM2ToPsf: kgM2ToPsf,

  // @@@@@@@@@@ TEMPERATURE @@@@@@@@@
  celsiusToKelvin: celsiusToKelvin,
  kelvinToCelsius: kelvinToCelsius,
  cToK: cToK,
  kToC: kToC,

  celsiusToF: celsiusToF,
  fToCelsius: fToCelsius,
  cToF: cToF,
  fToC: fToC,

  // @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@
  getDewPointC: getDewPointC,
  getFrostPointC: getFrostPointC,

  // @@@@@@@@@@ SLOPE @@@@@@@@@
  pctToDeg: pctToDeg,
  degToPct: degToPct,

  // @@@@@@@@@@ ANGLES @@@@@@@@@
  degToRad: degToRad,
  radToDeg: radToDeg,

  // @@@@@@@@@@ SPEED @@@@@@@@@
  msToKph: msToKph,
  kphToMs: kphToMs,
  msToMph: msToMph,
  mphToKph: mphToKph,
  kphToMph: kphToMph,

  // @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@
  solarKwM2DayToUvProxy: solarKwM2DayToUvProxy
};