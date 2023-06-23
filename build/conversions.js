/* functions in this file handle unit conversions */

'use strict';

var _require = require('./basic'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    isObjectLiteral = _require.isObjectLiteral,
    precisionRound = _require.precisionRound;

// @@@@@@@@@@ DISTANCE @@@@@@@@@

var mmToInches = function mmToInches(mm) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(mm)) return;
  return precisionRound(mm * 0.0393701, round);
};

var mmToInchesRound = function mmToInchesRound(mm) {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(mm)) return;
  if (mm > 0 && mm < 12.5) {
    return 0.5;
  }
  return precisionRound(mm / 25, 0);
};

var inchesToMm = function inchesToMm(inches) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(inches)) return;
  return precisionRound(inches * 25.4, round);
};

var inchesToMmRound = function inchesToMmRound(inches) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  // input: number, output: either a number or undefined;
  if (!isPrimitiveNumber(inches)) return;
  if (round === 'half') {
    // this is used in profile-properties
    var halves = precisionRound(inches / 0.5, 0);
    return Math.floor(halves * 0.5 * 25);
  }

  var mm = Math.floor(inches * 25);
  if (inches < 1) {
    return mm;
  }
  var _inches = precisionRound(mm / 25, round);
  return precisionRound(_inches * 25, 0);
};

var mmToFt = function mmToFt(mm) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(mm)) return;
  return precisionRound(mm * 0.00328084, round);
};

var ftToMm = function ftToMm(ft) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(ft)) return;
  return precisionRound(ft * 304.8, round);
};

var mmToFtInches = function mmToFtInches(mm) {
  var inches = mmToInches(mm);
  var ft = Math.floor(inches / 12);
  var inchRemainderWidth = Math.round(inches - ft * 12);
  return [ft, inchRemainderWidth];
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

var kmToMi = function kmToMi(km) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (!isPrimitiveNumber(km)) return;
  return precisionRound(km * 0.621371, round);
};

var miToKm = function miToKm(mi) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  if (!isPrimitiveNumber(mi)) return;
  return precisionRound(mi * 1.60934, round);
};

// @@@@@@@@@@ AREA @@@@@@@@@

var sfToM2 = function sfToM2(sf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(sf)) return;
  return precisionRound(sf * 0.092903, round);
};

var m2ToSf = function m2ToSf(m2) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(m2)) return;
  return precisionRound(m2 * 10.7639, round);
};

var sfToAc = function sfToAc(sf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(sf)) return;
  return precisionRound(sf / 43560, round);
};

var acToSf = function acToSf(ac) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ac)) return;
  return precisionRound(ac * 43560, round);
};

var acToHa = function acToHa(ac) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ac)) return;
  return precisionRound(ac * 0.404686, round);
};

var haToAc = function haToAc(ha) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ha)) return;
  return precisionRound(ha * 2.47105, round);
};

var m2ToHa = function m2ToHa(m2) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(m2)) return;
  return precisionRound(m2 / 10000, round);
};

var haToM2 = function haToM2(ha) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ha)) return;
  return precisionRound(ha * 10000, round);
};

// @@@@@@@@@@ VOLUME @@@@@@@@@

var ciToCf = function ciToCf(ci) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / (12 * 12 * 12), round);
};

var cfToCi = function cfToCi(cf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf * (12 * 12 * 12), round);
};

var galsToCi = function galsToCi(gallons) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 231, round);
};

var ciToGals = function ciToGals(ci) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / 231, round);
};

var ciToCc = function ciToCc(ci) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci * 16.3871, round);
};

var ccToCi = function ccToCi(ci) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ci)) return;
  return precisionRound(ci * 0.0610237, round);
};

var galsToCf = function galsToCf(gallons) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 0.133681, round);
};

var cfToGals = function cfToGals(cf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 0.133681, round);
};

var m3ToL = function m3ToL(m3) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 1000, round);
};

var lToM3 = function lToM3(l) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(l)) return;
  return precisionRound(l / 1000, round);
};

var mlToL = function mlToL(ml) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ml)) return;
  return precisionRound(ml / 1000, round);
};

var lToMl = function lToMl(ml) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(ml)) return;
  return precisionRound(ml * 1000, round);
};

var ccToL = function ccToL(cc) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc * 0.001, round);
};

var lToCc = function lToCc(L) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(L)) return;
  return precisionRound(L * 1000, round);
};

var ccToCf = function ccToCf(cc) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc * 0.0000353147, round);
};

var cfToCc = function cfToCc(cf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 0.0000353147, round);
};

var lToCf = function lToCf(L) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(L)) return;
  return precisionRound(L * 0.0353147, round);
};

var cfToL = function cfToL(cf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf * 28.317, round);
};

var ccToM3 = function ccToM3(cc) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc * 1000000, round);
};

var m3ToCc = function m3ToCc(m3) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 / 1000000, round);
};

var m3ToCf = function m3ToCf(m3) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 35.3147, round);
};

var cfToM3 = function cfToM3(cf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 35.3147, round);
};

var galsToM3 = function galsToM3(gals) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 0.00378541, round);
};

var m3ToGals = function m3ToGals(m3) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 264.172, round);
};

var galsToL = function galsToL(gals) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 3.78541, round);
};

var lToGals = function lToGals(l) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(l)) return;
  return precisionRound(l * 0.264172, round);
};

// @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@

var galsToInches = function galsToInches(gallons, sf) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons) || !isPrimitiveNumber(sf)) return;
  if (sf === 0) return 0;
  var si = sf * 144;
  var ci = gallons * 231;
  return precisionRound(ci / si, round);
};

var inchesToGals = function inchesToGals(inches, sf) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(inches) || !isPrimitiveNumber(sf)) return;
  if (sf === 0) return 0;
  var si = sf * 144;
  var ci = si * inches;
  return ciToGals(ci, round);
};

var mmToL = function mmToL(mm, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(mm) || !isPrimitiveNumber(m2)) return;
  return precisionRound(mm * m2, round);
};

var lToMm = function lToMm(l, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(l) || !isPrimitiveNumber(m2)) return;
  return precisionRound(l / m2, round);
};

var kgToMm = function kgToMm(kg, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(kg)) return;
  if (!isPrimitiveNumber(m2)) return;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(kg / m2, round);
};

var mmToKg = function mmToKg(mm, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(mm)) return;
  if (!isPrimitiveNumber(m2)) return;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(mm * m2, round);
};

// @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@

var lM2ToGalSf = function lM2ToGalSf(lM2) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(lM2)) return;
  return precisionRound(lM2 * 0.02454239, round);
};

var galSfToLM2 = function galSfToLM2(gsf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(gsf)) return;
  return precisionRound(gsf * 40.745833577571, round);
};

// @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@

var galsToLbs = function galsToLbs(gallons) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 8.34, round);
};

var lbsToGals = function lbsToGals(lbs) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs / 8.34, round);
};

var kgToL = function kgToL(kg) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  if (!isPrimitiveNumber(kg)) return;
  return precisionRound(kg, round);
};

var lToKg = function lToKg(l) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  if (!isPrimitiveNumber(l)) return;
  return precisionRound(l, round);
};

var kgToCc = function kgToCc(kg) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(kg)) return;
  return precisionRound(kg * 1000, round);
};

var ccToKg = function ccToKg(cc) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(cc)) return;
  return precisionRound(cc / 1000, round);
};

// @@@@@@@@@@@@@@@@ VWC @@@@@@@@@@@@@@@@

var _convertToCf = function _convertToCf(units, qty) {
  var cf = units === 'cf' ? qty : units === 'ci' ? ciToCf(qty) : units === 'gals' ? ciToCf(galsToCi(qty)) : units === 'lbs' ? ciToCf(galsToCi(lbsToGals(qty))) : units === 'cc' ? ccToCf(qty) : units === 'l' ? lToCf(qty) : units === 'm3' ? m3ToCf(qty) : null;
  return cf;
};

var calcVwc = function calcVwc(volume, water) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

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

  var vwc = precisionRound(waterCF / volumeCF, round);
  return vwc;
};

// @@@@@@@@@@ FLOW RATE @@@@@@@@@

var cfSAcToLSHa = function cfSAcToLSHa(cfSAc) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(cfSAc)) return;
  var lSAc = cfToL(cfSAc, 15); // avoid compounding rounding error
  return haToAc(lSAc, round);
};

var lSHaToCfSAc = function lSHaToCfSAc(lSHa) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(lSHa)) return;
  var cfsHa = lToCf(lSHa, 15); // avoid compounding rounding error
  return acToHa(cfsHa, round);
};

var gpmToM3S = function gpmToM3S(gpm) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  if (!isPrimitiveNumber(gpm)) return;
  var gpS = gpm / 60;
  return galsToM3(gpS, round);
};

var m3SToGpm = function m3SToGpm(m3s) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(m3s)) return;
  var m3Min = m3s * 60;
  return m3ToGals(m3Min, round);
};

var gpmToLS = function gpmToLS(gpm) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(gpm)) return;
  var gpS = gpm / 60;
  return galsToL(gpS, round);
};

var lSToGpm = function lSToGpm(lS) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(lS)) return;
  var lMin = lS * 60;
  return lToGals(lMin, round);
};

// @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@

var gpmFtToM3SM = function gpmFtToM3SM(gpmFt) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

  if (!isPrimitiveNumber(gpmFt)) return;
  var gpSFt = gpmFt / 60;
  var m3SFt = galsToM3(gpSFt, 15);
  return metersToFeet(m3SFt, round);
};

var m3SMToGpmFt = function m3SMToGpmFt(m3SM) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(m3SM)) return;
  var m3MinM = m3SM * 60;
  var m3SFt = feetToMeters(m3MinM, 15);
  return m3ToGals(m3SFt, round);
};

var gpmFtToLSM = function gpmFtToLSM(gpmFt) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(gpmFt)) return;
  var gpSFt = gpmFt / 60;
  var gpSM = metersToFeet(gpSFt, 15);
  return galsToL(gpSM, round);
};

var lSMToGpmFt = function lSMToGpmFt(lSM) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(lSM)) return;
  var lMinM = lSM * 60;
  var lMinFt = feetToMeters(lMinM, 15);
  return lToGals(lMinFt, round);
};

var lMinMToM3SM = function lMinMToM3SM(lMinM) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;

  if (!isPrimitiveNumber(lMinM)) return;
  var lSM = lMinM / 60;
  return lToM3(lSM, round);
};

var m3SMToLMinM = function m3SMToLMinM(m3SM) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(m3SM)) return;
  var m3MinM = m3SM * 60;
  return m3ToL(m3MinM, round);
};

// @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

var gpmToInchesHr = function gpmToInchesHr(gpm, sf) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(gpm)) return;
  if (!isPrimitiveNumber(sf)) return;
  var gpHr = gpm * 60;
  return galsToInches(gpHr, sf, round);
};

var inchesHrToGpm = function inchesHrToGpm(inchesHr, sf) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(inchesHr)) return;
  if (!isPrimitiveNumber(sf)) return;
  var inchesMin = inchesHr / 60;
  return inchesToGals(inchesMin, sf, round);
};

var lMinToMmHr = function lMinToMmHr(lMin, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(lMin)) return;
  if (!isPrimitiveNumber(m2)) return;
  var lHr = lMin * 60;
  return lToMm(lHr, m2, round);
};

var mmHrToLMin = function mmHrToLMin(mmHr, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(mmHr)) return;
  if (!isPrimitiveNumber(m2)) return;
  var mmMin = mmHr / 60;
  return mmToL(mmMin, m2, round);
};

var lSToMmHr = function lSToMmHr(lS, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(lS)) return;
  if (!isPrimitiveNumber(m2)) return;
  var lHr = lS * 3600;
  return lToMm(lHr, m2, round);
};

var mmHrToLS = function mmHrToLS(mmHr, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(mmHr)) return;
  if (!isPrimitiveNumber(m2)) return;
  var mmMin = mmHr / 60;
  var mmS = mmMin / 60;
  return mmToL(mmS, m2, round);
};

var gpmToMmHr = function gpmToMmHr(gpm, sf) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(gpm)) return;
  if (!isPrimitiveNumber(sf)) return;
  var inchesHr = gpmToInchesHr(gpm, sf);
  var mmHr = inchesToMm(inchesHr, round);
  return mmHr;
};

var mmHrToGpm = function mmHrToGpm(mmHr, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(mmHr)) return;
  if (!isPrimitiveNumber(m2)) return;
  var lMin = mmHrToLMin(mmHr, m2);
  var gpm = lToGals(lMin, round);
  return gpm;
};

var m3sToMmHr = function m3sToMmHr(m3s, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(m3s)) return;
  if (!isPrimitiveNumber(m2)) return;
  var m3Hr = m3s * 3600;
  var lHr = m3ToL(m3Hr, 15);
  var mmHr = lToMm(lHr, m2, round);
  return mmHr;
};

var mmHrToM3S = function mmHrToM3S(mmHr, m2) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  if (!isPrimitiveNumber(mmHr)) return;
  if (!isPrimitiveNumber(m2)) return;
  var mmS = mmHr / 3600;
  var lS = mmToL(mmS, m2, 15);
  var m3s = lToM3(lS, round);
  return m3s;
};

// @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@

var lbsToKg = function lbsToKg(lbs) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs * 0.453592, round);
};

var kgToLbs = function kgToLbs(kg) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(kg)) return;
  return precisionRound(kg * 2.20462, round);
};

// @@@@@@@@@@ DENSITY @@@@@@@@@

var lbsCfToKgM3 = function lbsCfToKgM3(lbsCf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(lbsCf)) return;
  return precisionRound(lbsCf * 16.018463, round);
};

var kgM3ToLbsCf = function kgM3ToLbsCf(kgM3) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if (!isPrimitiveNumber(kgM3)) return;
  return precisionRound(kgM3 * 0.062428, round);
};

var psfToKgM2 = function psfToKgM2(psf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(psf)) return;
  return precisionRound(psf * 4.88243, round);
};

var kgM2ToPsf = function kgM2ToPsf(kM2) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  if (!isPrimitiveNumber(kM2)) return;
  return precisionRound(kM2 * 0.204816, round);
};

var psfToKM2 = function psfToKM2(psf) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // eslint-disable-next-line no-console
  console.warn('psfToKM2 is deprecated use psfToKgM2');
  return psfToKgM2(psf, round);
};

var kM2ToPsf = function kM2ToPsf(kM2) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // eslint-disable-next-line no-console
  console.warn('kM2ToPsf is deprecated use kgM2ToPsf');
  return kgM2ToPsf(kM2, round);
};

// @@@@@@@@@@ TEMPERATURE @@@@@@@@@

var celsiusToKelvin = function celsiusToKelvin(c) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // eslint-disable-next-line no-console
  console.warn('celsiusToKelvin is deprecated use cToK');
  return cToK(c, round);
};

var cToK = function cToK(c) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return precisionRound(c + 273.15, round);
};

var kelvinToCelsius = function kelvinToCelsius(k) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // eslint-disable-next-line no-console
  console.warn('kelvinToCelsius is deprecated use kToC');
  return kToC(k, round);
};

var kToC = function kToC(k) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
    Convert temperature in degrees Kelvin to degrees Celsius.
     :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return precisionRound(k - 273.15, round);
};

var celsiusToF = function celsiusToF(c) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // eslint-disable-next-line no-console
  console.warn('celsiusToF is deprecated use cToF');
  return cToF(c, round);
};

var cToF = function cToF(c) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return precisionRound(c * 1.8 + 32, round);
};

var fToCelsius = function fToCelsius(f) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  // eslint-disable-next-line no-console
  console.warn('fToCelsius is deprecated use fToC');
  return fToC(f, round);
};

var fToC = function fToC(f) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
    Convert temperature in degrees Celsius to degrees Kelvin.
     :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return precisionRound((f - 32) / 1.8, round);
};

// @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@

var getDewPointC = function getDewPointC(t_air_c, rel_humidity) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  // Compute the dew point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // rel_humidity: relative humidity in %
  // returns the dew point in degrees Celsius
  var A = 17.27;
  var B = 237.7;
  var alpha = A * t_air_c / (B + t_air_c) + Math.log(rel_humidity / 100.0);
  return precisionRound(alpha, round);
};

var getFrostPointC = function getFrostPointC(t_air_c, dew_point_c) {
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  // Compute the frost point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // dew_point_c: current dew point in degrees Celsius
  // returns the frost point in degrees Celsius
  var dew_point_k = 273.15 + dew_point_c;
  var t_air_k = 273.15 + t_air_c;
  var frost_point_k = dew_point_k - t_air_k + 2671.02 / (2954.61 / t_air_k + 2.193665 * Math.log(t_air_k) - 13.3448);
  return precisionRound(frost_point_k - 273.15, round);
};

// @@@@@@@@@@ SLOPE @@@@@@@@@

var pctToDeg = function pctToDeg(pct) {
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 90;
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return precisionRound(100 * range * pct / 100, round);
};

var degToPct = function degToPct(deg) {
  var range = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 90;
  var round = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 4;

  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return range === 0 ? 0 : precisionRound(100 * (deg / range) / 100, round);
};

// @@@@@@@@@@ ANGLES @@@@@@@@@

var degToRad = function degToRad(degrees) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
    Convert angular degrees to radians
     :param degrees: Value in degrees to be converted.
    :return: Value in radians
    :rtype: float
    */
  return precisionRound(degrees * (Math.PI / 180.0), round);
};

var radToDeg = function radToDeg(radians) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
    Convert radians to angular degrees
     :param radians: Value in radians to be converted.
    :return: Value in angular degrees
    :rtype: float
    */
  return precisionRound(radians * (180.0 / Math.PI), round);
};

// @@@@@@@@@@ SPEED @@@@@@@@@

var msToKph = function msToKph(ms) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
   * Convert meters per second to kilometers per hour
   */
  return precisionRound(ms * 3.6, round);
};

var msToMph = function msToMph(ms) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
   * Convert meters per second to miles per hour
   */
  return precisionRound(ms * 2.23694, round);
};

var mphToKph = function mphToKph(mph) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
   * Convert miles per hour to kilometers per hour
   */
  return precisionRound(mph * 1.60934, round);
};

var kphToMph = function kphToMph(kph) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
   * Convert kilometres per hour to miles per hour
   */
  return precisionRound(kph * 0.621371, round);
};

var kphToMs = function kphToMs(kph) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
   * Convert kilometres per hour to meters per second
   */
  return precisionRound(kph * 0.277778, round);
};

// @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@

var solarKwM2DayToUvProxy = function solarKwM2DayToUvProxy(kwM2) {
  var round = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 4;

  /*
   * VERY ROUGH estimate of UV Index
   * UV index scale is 0 (no UV) to mid-teens, or about 12 in most of the US outside the SW
   * Solar kW/M2/day is approximately 1 kW/M2/hour when very sunny, or about 8 kW/M2/day on a sunny day
   * Since these are directly proportionate, a close - BUT NOT SCIENTIFIC calculation is that 0 kW = 0 UVI, and 8 kW/M2/day = 12 UVI
   * So use a multiplier of 1.5.
   */
  return precisionRound(kwM2 * 1.5, round);
};

module.exports = {
  // @@@@@@@@@@ DISTANCE @@@@@@@@@
  mmToInches: mmToInches,
  mmToInchesRound: mmToInchesRound,
  inchesToMm: inchesToMm,
  inchesToMmRound: inchesToMmRound,

  mmToFt: mmToFt,
  ftToMm: ftToMm,

  mmToFtInches: mmToFtInches,

  feetToMeters: feetToMeters,
  metersToFeet: metersToFeet,

  kmToMi: kmToMi,
  miToKm: miToKm,

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

  lMinMToM3SM: lMinMToM3SM,
  m3SMToLMinM: m3SMToLMinM,

  // @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

  gpmToInchesHr: gpmToInchesHr,
  inchesHrToGpm: inchesHrToGpm,

  lMinToMmHr: lMinToMmHr,
  mmHrToLMin: mmHrToLMin,

  lSToMmHr: lSToMmHr,
  mmHrToLS: mmHrToLS,

  gpmToMmHr: gpmToMmHr,
  mmHrToGpm: mmHrToGpm,

  m3sToMmHr: m3sToMmHr,
  mmHrToM3S: mmHrToM3S,

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