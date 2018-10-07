/* functions in this file handle unit conversions */

'use strict';

const { isPrimitiveNumber, 
  isObjectLiteral, 
  precisionRound } = require('./basic');

// @@@@@@@@@@ VOLUME @@@@@@@@@

const ciToCf = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / (12 * 12 * 12), 4);
};

// @@@@@@@@@@ LIQUID @@@@@@@@@

const galsToInches = (gallons, squareFeet) => {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons) || !isPrimitiveNumber(squareFeet)) return;
  if(squareFeet === 0) return 0;
  const squareInches = squareFeet * 144;
  const cubicInches = gallons * 231;
  return precisionRound(cubicInches / squareInches, 4);
}; 

const inchesToGals = (inches, squareFeet) => {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(inches) || !isPrimitiveNumber(squareFeet)) return;
  if(squareFeet === 0) return 0;
  const squareInches = squareFeet * 144;
  const cubicInches = squareInches * inches;
  return ciToGals(cubicInches);
}; 

const galsToCi = gallons => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 231, 4);
};

const ciToGals = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / 231, 4);
};

const galsToCf = gallons => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 0.133681, 4);
};

const galsToLbs = gallons => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 8.34, 4);
};

const lbsToGals = lbs => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs / 8.34, 4);
};

const calcVwc = (volume, water) => {
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
  if(!isObjectLiteral(volume) || !isObjectLiteral(water)) return;
  const volumeUnits = 
    typeof volume.units === 'string' ?
      volume.units.toLowerCase() :
      null ;
  const volumeCF =
    volumeUnits === 'cf' ? volume.qty :
      volumeUnits === 'ci' ? ciToCf(volume.qty) :
        null ;
  const waterUnits = 
  typeof water.units === 'string' ?
    water.units.toLowerCase() :
    null ;
  const waterCF = 
    waterUnits === 'cf'   ? water.qty :
      waterUnits === 'ci'   ? ciToCf(water.qty) :
        waterUnits === 'gals' ? ciToCf(galsToCi(water.qty)) :
          waterUnits === 'lbs'  ? ciToCf(galsToCi(lbsToGals(water.qty))) :
            null;
  if(!isPrimitiveNumber(volumeCF)) return;
  if(!isPrimitiveNumber(waterCF))  return;
  if(volumeCF === 0) return; // return undefined vs 0, b/c we cannot calculate 0 CF (0 would not be an accurate result)
  const vwc = precisionRound(waterCF/volumeCF, 4);
  return vwc;
};

// @@@@@@@@@@ TEMPERATURE @@@@@@@@@

const celsiusToKelvin = celsius => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return celsius + 273.15;
};

const kelvinToCelsius =kelvin => {
  /*
    Convert temperature in degrees Kelvin to degrees Celsius.

    :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return kelvin - 273.15;
};

// @@@@@@@@@@ ANGLES @@@@@@@@@


const degToRad = degrees => {
  /*
    Convert angular degrees to radians

    :param degrees: Value in degrees to be converted.
    :return: Value in radians
    :rtype: float
    */
  return degrees * (Math.PI / 180.0);
};

const radToDeg = radians => {
  /*
    Convert radians to angular degrees

    :param radians: Value in radians to be converted.
    :return: Value in angular degrees
    :rtype: float
    */
  return radians * (180.0 / Math.PI);
};

// @@@@@@@@@@ SPEED @@@@@@@@@

const msToKph = ms => {
  /*
   * Convert meters per second to kilometers per hour
   */
  return ms * 3.6;
};

const msToMph = ms => {
  /*
   * Convert meters per second to miles per hour
   */
  return ms * 2.23694;
};

const mphToKph = mph => {
  /*
   * Convert miles per hour to kilometers per hour
   */
  return mph * 1.60934;
};

const kphToMph = kph => {
  /*
   * Convert kilometres per hour to miles per hour
   */
  return kph * 0.621371;
};

// @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@

const solarKwM2DayToUvProxy = kwM2 => {
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
  ciToCf,
  galsToInches,
  inchesToGals,
  galsToCi,
  ciToGals,
  galsToCf,
  galsToLbs,
  lbsToGals,
  calcVwc,
  celsiusToKelvin,
  kelvinToCelsius,
  degToRad,
  radToDeg,
  msToKph,
  msToMph,
  mphToKph,
  kphToMph,
  solarKwM2DayToUvProxy,
};