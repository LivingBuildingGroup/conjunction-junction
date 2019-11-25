/* functions in this file handle unit conversions */

'use strict';

const { 
  isPrimitiveNumber, 
  isObjectLiteral, 
  precisionRound } = require('./basic');

// @@@@@@@@@@ DISTANCE @@@@@@@@@

const mmToInches = mm => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(mm)) return ;
  return precisionRound(mm  * 0.0393701, 4);
};

const inchesToMm = inches => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(inches)) return ;
  return precisionRound(inches * 25.4, 4);
};

const feetToMeters = (feet, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(feet)) return ;
  return precisionRound(feet * 0.3048, round);
};

const metersToFeet = (meters, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(meters)) return ;
  return precisionRound(meters * 3.28084, round);
};

// @@@@@@@@@@ AREA @@@@@@@@@

const sfToM2 = sf => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(sf)) return ;
  return precisionRound(sf * 0.092903, 4);
};

const m2ToSf = m2 => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(m2)) return ;
  return precisionRound(m2 * 10.7639, 4);
};

const sfToAc = sf => {
    // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(sf)) return ;
  return precisionRound(sf / 43560, 4);
};

const acToSf = ac => {
  // input: number, output: either a number or undefined;
// precision: 4 decimal places, set here
if(!isPrimitiveNumber(ac)) return ;
return precisionRound(ac * 43560, 4);
};

const acToHa = ac => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ac)) return ;
  return precisionRound(ac * 0.404686, 4);
};

const haToAc = ha => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ha)) return ;
  return precisionRound(ha * 2.47105, 4);
};

const m2ToHa = m2 => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(m2)) return ;
  return precisionRound(m2 / 10000, 4);
};

const haToM2 = ha => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ha)) return ;
  return precisionRound(ha * 10000, 4);
};

// @@@@@@@@@@ VOLUME @@@@@@@@@

const ciToCf = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / (12 * 12 * 12), 4);
};

const cfToCi = cf => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(cf)) return;
  return precisionRound(cf * (12 * 12 * 12), 4);
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
  if(!isPrimitiveNumber(ci)) return ;
  return precisionRound(ci / 231, 4);
};

const ciToCc = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return ;
  return precisionRound(ci * 16.3871, 4);
};

const ccToCi = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return ;
  return precisionRound(ci * 0.0610237, 4);
};

const galsToCf = gallons => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return ;
  return precisionRound(gallons * 0.133681, 4);
};

const cfToGals = cf => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(cf)) return ;
  return precisionRound(cf / 0.133681, 4);
};

const m3ToL = m3 => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 1000, 4);
};

const lToM3 = l => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(l)) return;
  return precisionRound(l / 1000, 4);
};

const mlToL = ml => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ml)) return;
  return precisionRound(ml / 1000, 4);
};

const lToMl = ml => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ml)) return;
  return precisionRound(ml * 1000, 4);
};

const ccToL = cc => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc * 0.001, 4);
};

const lToCc = L => {
  if(!isPrimitiveNumber(L)) return ;
  return precisionRound(L * 1000, 4);
};

const ccToCf = cc => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc * 0.0000353147, 4);
};

const cfToCc = cf => {
  if(!isPrimitiveNumber(cf)) return ;
  return precisionRound(cf / 0.0000353147, 4);
};

const lToCf = L => {
  if(!isPrimitiveNumber(L)) return ;
  return precisionRound(L * 0.0353147, 4);
};

const cfToL = cf => {
  if(!isPrimitiveNumber(cf)) return ;
  return precisionRound(cf * 28.317, 4);
};

const ccToM3 = cc => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc * 1000000, 4);
};

const m3ToCc = m3 => {
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 / 1000000, 4);
};

const m3ToCf = m3 => {
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 35.3147, 4);
};

const cfToM3 = cf => {
  if(!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 35.3147, 4);
};

const galsToM3 = gals => {
  if(!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 0.00378541, 8);
};

const m3ToGals = m3 => {
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 264.172, 4);
};

const galsToL = gals => {
  if(!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 3.78541, 4);
};

const lToGals = l => {
  if(!isPrimitiveNumber(l)) return;
  return precisionRound(l * 0.264172, 4);
};

// @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@

const galsToInches = (gallons, sf) => {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons) || !isPrimitiveNumber(sf)) return;
  if(sf === 0) return 0;
  const si = sf * 144;
  const ci = gallons * 231;
  return precisionRound(ci / si, 4);
}; 

const inchesToGals = (inches, sf) => {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(inches) || !isPrimitiveNumber(sf)) return;
  if(sf === 0) return 0;
  const si = sf * 144;
  const ci = si * inches;
  return ciToGals(ci);
}; 

const mmToL = (mm, m2) => {
  if(!isPrimitiveNumber(mm) || !isPrimitiveNumber(m2)) return;
  return precisionRound(mm * m2, 4);
};

const lToMm = (l, m2) => {
  if(!isPrimitiveNumber(l) || !isPrimitiveNumber(m2)) return;
  return precisionRound(l/m2, 4);
};

const kgToMm = (kg, m2) =>{
  if(!isPrimitiveNumber(kg)) return ;
  if(!isPrimitiveNumber(m2)) return ;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(kg/m2,4);
};

const mmToKg = (mm, m2) =>{
  if(!isPrimitiveNumber(mm)) return ;
  if(!isPrimitiveNumber(m2)) return ;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(mm*m2,4);
};

// @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@

const lM2ToGalSf = lM2 => {
  if(!isPrimitiveNumber(lM2)) return;
  return precisionRound(lM2 * 0.02454239, 4);
};

const galSfToLM2 = gsf => {
  if(!isPrimitiveNumber(gsf)) return;
  return precisionRound(gsf * 40.745833577571, 4);
};

// @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@

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

const kgToL = kg => {
  // input: number, output: either a number or undefined;
  if(!isPrimitiveNumber(kg)) return ;
  return kg;
};

const lToKg = l => {
  // input: number, output: either a number or undefined;
  if(!isPrimitiveNumber(l)) return ;
  return l;
};

const kgToCc = kg => {
  if(!isPrimitiveNumber(kg)) return ;
  return precisionRound(kg * 1000, 4);
};

const ccToKg = cc => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc / 1000, 4);
};

// @@@@@@@@@@@@@@@@ VWC @@@@@@@@@@@@@@@@

const _convertToCf = (units, qty) => {
  const cf = 
  units === 'cf' ? qty :
    units === 'ci' ? ciToCf(qty) :
      units === 'gals' ? ciToCf(galsToCi(qty)) :
        units === 'lbs'  ? ciToCf(galsToCi(lbsToGals(qty))) :
          units === 'cc' ? ccToCf(qty) :
            units === 'l' ? lToCf(qty) :
              units === 'm3' ? m3ToCf(qty) :
                null ;
  return cf;
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
  const waterUnits = 
  typeof water.units === 'string' ?
    water.units.toLowerCase() :
    null ;
  if(volumeUnits === waterUnits){
    return precisionRound(water.qty/(volume.qty));
  }
  if(volumeUnits === 'cc' && waterUnits === 'l'){
    return precisionRound(water.qty/(volume.qty/1000));
  }

  const volumeCF = _convertToCf(volumeUnits, volume.qty);
  const waterCF  = _convertToCf(waterUnits , water.qty);

  if(!isPrimitiveNumber(volumeCF)) return;
  if(!isPrimitiveNumber(waterCF))  return;

  if(volumeCF === 0) return; // return undefined vs 0, b/c we cannot calculate 0 CF (0 would not be an accurate result)

  const vwc = precisionRound(waterCF/volumeCF, 4);
  return vwc;
};

// @@@@@@@@@@ FLOW RATE @@@@@@@@@

const cfSAcToLSHa = cfSAc => {
  if(!isPrimitiveNumber(cfSAc)) return;
  const lSAc = cfToL(cfSAc);
  return haToAc(lSAc);
  // return precisionRound(cfSAc * 69.9724518, 4);
};

const lSHaToCfSAc = lSHa => {
  if(!isPrimitiveNumber(lSHa)) return;
  const cfsHa = lToCf(lSHa);
  return acToHa(cfsHa);
  // return precisionRound(lSHa * 0.0142913386, 4);
};

const gpmToM3S = gpm => {
  if(!isPrimitiveNumber(gpm)) return;
  const gpS = gpm / 60;
  return galsToM3(gpS);
};

const m3SToGpm = m3s => {
  if(!isPrimitiveNumber(m3s)) return;
  const m3Min = m3s * 60;
  return m3ToGals(m3Min);
};

const gpmToLS = gpm => {
  if(!isPrimitiveNumber(gpm)) return;
  const gpS = gpm / 60;
  return galsToL(gpS);
};

const lSToGpm = lS => {
  if(!isPrimitiveNumber(lS)) return;
  const lMin = lS * 60;
  return lToGals(lMin);
};

// @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@

const gpmFtToM3SM = gpmFt => {
  if(!isPrimitiveNumber(gpmFt)) return;
  const gpSFt = gpmFt / 60;
  const m3SFt = galsToM3(gpSFt);
  return metersToFeet(m3SFt, 8);
};

const m3SMToGpmFt = m3SM => {
  if(!isPrimitiveNumber(m3SM)) return;
  const m3MinM = m3SM * 60;
  const m3SFt = feetToMeters(m3MinM);
  return m3ToGals(m3SFt);
};

const gpmFtToLSM = gpmFt => {
  if(!isPrimitiveNumber(gpmFt)) return;
  const gpSFt = gpmFt / 60;
  const gpSM = metersToFeet(gpSFt, 8);
  return galsToL(gpSM);
};

const lSMToGpmFt = lSM => {
  if(!isPrimitiveNumber(lSM)) return;
  const lMinM = lSM * 60;
  const lMinFt = feetToMeters(lMinM, 8);
  return lToGals(lMinFt);
};

const lMinMToM3SM = lMinM => {
  if(!isPrimitiveNumber(lMinM)) return;
  const lSM = lMinM / 60;
  return lToM3(lSM, 8);
};

const m3SMToLMinM = m3SM => {
  if(!isPrimitiveNumber(m3SM)) return;
  const m3MinM = m3SM * 60;
  return m3ToL(m3MinM);
};

// @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

const gpmToInchesHr = (gpm, sf) => {
  if(!isPrimitiveNumber(gpm)) return;
  if(!isPrimitiveNumber(sf)) return;
  const gpHr = gpm * 60;
  return galsToInches(gpHr, sf);
};

const inchesHrToGpm = (inchesHr, sf) => {
  if(!isPrimitiveNumber(inchesHr)) return;
  if(!isPrimitiveNumber(sf)) return;
  const inchesMin = inchesHr / 60;
  return inchesToGals(inchesMin, sf);
};

const lMinToMmHr = (lMin, m2) => {
  if(!isPrimitiveNumber(lMin)) return;
  if(!isPrimitiveNumber(m2)) return;
  const lHr = lMin * 60;
  return lToMm(lHr, m2);
};

const mmHrToLMin = (mmHr, m2) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const mmMin = mmHr / 60;
  return mmToL(mmMin, m2);
};

const lSToMmHr = (lS, m2) => {
  if(!isPrimitiveNumber(lS)) return;
  if(!isPrimitiveNumber(m2)) return;
  const lHr = lS * 3600;
  return lToMm(lHr, m2);
};

const mmHrToLS = (mmHr, m2) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const mmMin = mmHr / 60;
  const mmS = mmMin / 60;
  return mmToL(mmS, m2);
};

const gpmToMmHr = (gpm, sf) => {
  if(!isPrimitiveNumber(gpm)) return;
  if(!isPrimitiveNumber(sf)) return;
  const inchesHr = gpmToInchesHr(gpm, sf);
  const mmHr = inchesToMm(inchesHr);
  return mmHr;
};

const mmHrToGpm = (mmHr, m2) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const lMin = mmHrToLMin(mmHr, m2);
  const gpm = lToGals(lMin);
  return gpm;
};


const m3sToMmHr = (m3s, m2) => {
  if(!isPrimitiveNumber(m3s)) return;
  if(!isPrimitiveNumber(m2)) return;
  const m3Hr = m3s * 3600;
  const lHr = m3ToL(m3Hr);
  const mmHr = lToMm(lHr, m2);
  return mmHr;
};

const mmHrToM3S = (mmHr, m2) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const mmS = mmHr / 3600;
  const lS = mmToL(mmS, m2);
  const m3s = lToM3(lS);
  return m3s;
};


// @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@

const lbsToKg = lbs => {
  if(!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs * 0.453592, 4);
};

const kgToLbs = kg => {
  if(!isPrimitiveNumber(kg)) return;
  return precisionRound(kg * 2.20462, 4);
};

// @@@@@@@@@@ DENSITY @@@@@@@@@

const lbsCfToKgM3 = lbsCf => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(lbsCf)) return;
  return precisionRound(lbsCf * 16.018463, 4);
};

const kgM3ToLbsCf = kgM3 => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(kgM3)) return;
  return precisionRound(kgM3 * 0.062428, 4);
};

const psfToKgM2 = psf => {
  if(!isPrimitiveNumber(psf)) return;
  return precisionRound(psf * 4.88243, 4);
};

const kgM2ToPsf = kM2 => {
  if(!isPrimitiveNumber(kM2)) return;
  return precisionRound(kM2 * 0.204816, 4);
};

const psfToKM2 = psf => {
  console.warn('psfToKM2 is deprecated use psfToKgM2');
  return psfToKgM2(psf);
};

const kM2ToPsf = kM2 => {
  console.warn('kM2ToPsf is deprecated use kgM2ToPsf');
  return kgM2ToPsf(kM2);
};

// @@@@@@@@@@ TEMPERATURE @@@@@@@@@

const celsiusToKelvin = c => {
  console.warn('celsiusToKelvin is deprecated use cToK');
  return cToK(c);
};

const cToK = c => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return c + 273.15;
};

const kelvinToCelsius = k => {
  console.warn('kelvinToCelsius is deprecated use kToC');
  return kToC( k);
};

const kToC = k => {
  /*
    Convert temperature in degrees Kelvin to degrees Celsius.

    :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return k - 273.15;
};

const celsiusToF = c => {
  console.warn('celsiusToF is deprecated use cToF');
  return cToF(c);
};

const cToF = c => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return (c * 1.8 ) + 32;
};

const fToCelsius = f => {
  console.warn('fToCelsius is deprecated use fToC');
  return fToC(f);
};

const fToC = f => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return (f - 32) / 1.8;
};

// @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@

const getDewPointC = (t_air_c, rel_humidity) => {
  // Compute the dew point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // rel_humidity: relative humidity in %
  // returns the dew point in degrees Celsius
  const A = 17.27;
  const B = 237.7;
  const alpha = ((A * t_air_c) / (B + t_air_c)) + Math.log(rel_humidity/100.0);
  return alpha;
};

const getFrostPointC = (t_air_c, dew_point_c) => {
  // Compute the frost point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // dew_point_c: current dew point in degrees Celsius
  // returns the frost point in degrees Celsius
  const dew_point_k = 273.15 + dew_point_c;
  const t_air_k = 273.15 + t_air_c;
  const frost_point_k = dew_point_k - t_air_k + 2671.02 / ((2954.61 / t_air_k) + 2.193665 * Math.log(t_air_k) - 13.3448);
  return frost_point_k - 273.15;
};


// @@@@@@@@@@ SLOPE @@@@@@@@@

const pctToDeg = (pct, range=90) => {
  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return 100 * range * pct / 100;
};

const degToPct = (deg, range=90) => {
  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return range === 0 ? 0 : 100 * (deg / range) / 100 ;
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

const kphToMs = kph => {
  /*
   * Convert kilometres per hour to meters per second
   */
  return kph * 0.277778;
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
  // @@@@@@@@@@ DISTANCE @@@@@@@@@
  mmToInches,
  inchesToMm,

  feetToMeters,
  metersToFeet,
  
  // @@@@@@@@@@ AREA @@@@@@@@@
  sfToM2,
  m2ToSf,

  sfToAc,
  acToSf,

  acToHa,
  haToAc,

  m2ToHa,
  haToM2,
  
  // @@@@@@@@@@ VOLUME @@@@@@@@@
  ciToCf,
  cfToCi,
  
  galsToCi,
  ciToGals,
  
  ciToCc,
  ccToCi,
  
  galsToCf,
  cfToGals,

  m3ToL,
  lToM3,

  mlToL,
  lToMl,
  
  ccToL,
  lToCc,
  
  ccToCf,
  cfToCc,

  lToCf,
  cfToL,

  ccToM3,
  m3ToCc,

  m3ToCf,
  cfToM3,

  galsToM3,
  m3ToGals,

  galsToL,
  lToGals,

  // @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@
  galsToInches,
  inchesToGals,

  mmToL,
  lToMm,
  
  kgToMm,
  mmToKg,

  // @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@
  lM2ToGalSf,
  galSfToLM2,

  // @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@
  galsToLbs,
  lbsToGals,

  kgToL,
  lToKg,

  kgToCc,
  ccToKg,

  // @@@@@@@@@@@@@@@@ VWC @@@@@@@@@@@@@@@@
  _convertToCf,
  calcVwc,

  // @@@@@@@@@@ FLOW RATE @@@@@@@@@
  cfSAcToLSHa,
  lSHaToCfSAc,

  gpmToM3S,
  m3SToGpm,

  gpmToLS,
  lSToGpm,

  // @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@
  gpmFtToM3SM,
  m3SMToGpmFt,

  gpmFtToLSM,
  lSMToGpmFt,

  lMinMToM3SM,
  m3SMToLMinM,

  // @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

  gpmToInchesHr,
  inchesHrToGpm,

  lMinToMmHr,
  mmHrToLMin,

  lSToMmHr,
  mmHrToLS,

  gpmToMmHr,
  mmHrToGpm,

  m3sToMmHr,
  mmHrToM3S,

  // @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@
  lbsToKg,
  kgToLbs,

  // @@@@@@@@@@ DENSITY @@@@@@@@@
  lbsCfToKgM3,
  kgM3ToLbsCf,

  psfToKM2,
  kM2ToPsf,

  psfToKgM2,
  kgM2ToPsf,
  
  // @@@@@@@@@@ TEMPERATURE @@@@@@@@@
  celsiusToKelvin,
  kelvinToCelsius,
  cToK,
  kToC,

  celsiusToF,
  fToCelsius,
  cToF,
  fToC,

  // @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@
  getDewPointC,
  getFrostPointC,
  
  // @@@@@@@@@@ SLOPE @@@@@@@@@
  pctToDeg,
  degToPct,
  
  // @@@@@@@@@@ ANGLES @@@@@@@@@
  degToRad,
  radToDeg,
  
  // @@@@@@@@@@ SPEED @@@@@@@@@
  msToKph,
  kphToMs,
  msToMph,
  mphToKph,
  kphToMph,
  
  // @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@
  solarKwM2DayToUvProxy,
};