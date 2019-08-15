/* functions in this file handle unit conversions */

'use strict';

const { isPrimitiveNumber, 
  isObjectLiteral, 
  precisionRound } = require('./basic');

// @@@@@@@@@@ DISTANCE @@@@@@@@@

const mmToInches = mm => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(mm)) return 'Invalid input';
  return precisionRound(mm  * 0.0393701, 4);
};

const inchesToMm = inches => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(inches)) return 'Invalid input';
  return precisionRound(inches * 25.4, 4);
};

const feetToMeters = feet => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(feet)) return 'Invalid input';
  return precisionRound(feet * 0.3048, 4);
};

const metersToFeet = meters => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(meters)) return 'Invalid input';
  return precisionRound(meters * 3.28084, 4);
};

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

const ciToCc = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return 'Invalid input';
  return precisionRound(ci * 16.3871, 4);
};

const ccToCi = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return 'Invalid input';
  return precisionRound(ci * 0.0610237, 4);
};

const ciToGals = ci => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return 'Invalid input';
  return precisionRound(ci / 231, 4);
};

const galsToCf = gallons => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return 'Invalid input';
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

const kgToL = kg => {
  // input: number, output: either a number or undefined;
  if(!isPrimitiveNumber(kg)) return 'Invalid input';
  return kg;
};

const ccToL = cc => {
  if(!isPrimitiveNumber(cc)) return 'Invalid input';
  return precisionRound(cc * 0.001, 4);
};

const lToCc = L => {
  if(!isPrimitiveNumber(L)) return 'Invalid input';
  return precisionRound(L * 1000, 4);
};

const ccToCf = cc => {
  if(!isPrimitiveNumber(cc)) return 'Invalid input';
  return precisionRound(cc * 0.0000353147, 4);
};

const lToCf = L => {
  if(!isPrimitiveNumber(L)) return 'Invalid input';
  return precisionRound(L * 0.0353147, 4);
};

const ccToM3 = cc => {
  if(!isPrimitiveNumber(cc)) return 'Invalid input';
  return precisionRound(cc / 1000000, 4);
};

const m3ToCc = m3 => {
  if(!isPrimitiveNumber(m3)) return 'Invalid input';
  return precisionRound(m3 * 1000000, 4);
};

const m3ToCf = m3 => {
  if(!isPrimitiveNumber(m3)) return 'Invalid input';
  return precisionRound(m3 * 35.3147, 4);
};

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

// @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@

const lbsToKg = lbs => {
  if(!isPrimitiveNumber(lbs)) return 'Invalid input';
  return precisionRound(lbs * 0.453592, 4);
};

const kgToLbs = kg => {
  if(!isPrimitiveNumber(kg)) return 'Invalid input';
  return precisionRound(kg * 2.20462, 4);
};

// @@@@@@@@@@ DENSITY @@@@@@@@@

const psfToKM2 = psf => {
  if(!isPrimitiveNumber(psf)) return 'Invalid input';
  return precisionRound(psf * 4.88243, 4);
};

const kM2ToPsf = kM2 => {
  if(!isPrimitiveNumber(kM2)) return 'Invalid input';
  return precisionRound(kM2 * 0.24816, 4);
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

const celsiusToF = celsius => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return (celsius * 1.8 ) + 32;
};

const fToCelsius = f => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return (f - 32) / 1.8;
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

const calculateGradient = (height, length) => { 
  if(!isPrimitiveNumber(height) || !isPrimitiveNumber(length)){
    return;
  }
  return height / length;
};

//temperature in Celsius
const tempCorrection = temperature => {
  if(!isPrimitiveNumber(temperature)){
    return;
  }
  return (temperature * temperature * 0.00044) - (0.042 * temperature) + 1.6641;
};

//width is in feet 
const gpmPerFtToTempCorrection = (flowRate,width,tempCorrection,gpmPerFt) =>{
  let result = 0;
  if(!isPrimitiveNumber(flowRate) || !isPrimitiveNumber(width) ||
   !isPrimitiveNumber(tempCorrection || !isPrimitiveNumber(gpmPerFt))){
    return;
  }
  if(flowRate > 0){
    result = (flowRate/width)*tempCorrection;
  }
  else{
    result = gpmPerFt;
  }
  return result;
};

const gpmToLiterPerMin = gpm =>{
  if(!isPrimitiveNumber(gpm)){
    return;
  }
  return gpm * 3.7854;
};

const literPerMinToGpm = litersPerMin =>{
  if(!isPrimitiveNumber(litersPerMin)){
    return;
  }
  return litersPerMin * 0.26417287472922;
};

const gpmToCubicMetersPerMin = gpm =>{
  if(!isPrimitiveNumber(gpm)){
    return;
  }
  return gpm * 0.00378541;
};

const cubicMetersPerMinToGpm = cubicMeterPerMin =>{
  if(!isPrimitiveNumber(cubicMeterPerMin)){
    return;
  }
  return cubicMeterPerMin * 264.172052;
};

// const gpmToCubicMeterPerMinPerFt = gpm =>{
//   return gpm * ;
// }

// const cubicMeterPerMinPerFtToGpm = cubicMeterPerMinPerFt =>{
//   return cubicMeterPerMinPerFt * ;
// };

//gpm/ft to cubic meters per SECOND per METER
//gpm/ft to cubic meters per SECOND per foot

const acresToHectares = acres => {
  if(!isPrimitiveNumber(acres)){
    return;
  }
  return acres *0.404686;
};

const hectaresToAcres = hectares =>{
  if(!isPrimitiveNumber(hectares)){
    return;
  }
  return hectares * 2.47105;
};

const galPerSecPerHectareToGalPerSecPerAcre = galPerSecPerHectares =>{
  if(!isPrimitiveNumber(galPerSecPerHectares)){
    return;
  }
  return galPerSecPerHectares * 0.404685642;
};

const galPerSecPerAcreToGalPerSecPerHectare = galPerSecPerAcres =>{
  if(!isPrimitiveNumber(galPerSecPerAcres)){
    return;
  }
  return galPerSecPerAcres * 2.47105381;
};

const acresToSqrFt = acres =>{
  if(!isPrimitiveNumber(acres)){
    return;
  }
  return acres * 43560;
};

const sqrFtToAcres = sqrFt =>{
  if(!isPrimitiveNumber(sqrFt)){
    return;
  }
  return sqrFt * 2.2957e-5;
};

const acreInchesToGals = acreInches =>{
  if(!isPrimitiveNumber(acreInches)){
    return;
  }
  return acreInches * 27154.285990761;
};

const galsToAcreInches = gallons =>{
  if(!isPrimitiveNumber(gallons)){
    return;
  }
  return  gallons * 0.00003682659895164399;
};


const acreInchesToCubicMeters = acreInches =>{
  if(!isPrimitiveNumber(acreInches)){
    return;
  }
  return acreInches * 102.79015312896;
};

const cubicMetersToAcreInches = cubicMeters=>{
  if(!isPrimitiveNumber(cubicMeters)){
    return;
  }
  return cubicMeters * 0.009728558325;
};

const litersPerSecPerHectareToGalPerSecPerAcre = litersPerSecPerHectare =>{
  if(!isPrimitiveNumber(litersPerSecPerHectare)){
    return;
  }
  return litersPerSecPerHectare * 0.106906637;
};

const galPerSecPerAcreToLitersPerSecPerHectare = galPerSecPerAcre =>{
  if(!isPrimitiveNumber(galPerSecPerAcre)){
    return;
  }
  return galPerSecPerAcre * 9.35395623;
};

const sqrFtToSqrMeters = sqrFt =>{
  if(!isPrimitiveNumber(sqrFt)){
    return;
  }
  return sqrFt * 0.092903;
};
 
const sqrMetersToSqrFt = sqrMeters =>{
  if(!isPrimitiveNumber(sqrMeters)){
    return;
  }
  return sqrMeters * 10.763910;
};

//cubic meters per second to gallons per minute  

const cubicFtToGals = cubicFt =>{
  if(!isPrimitiveNumber(cubicFt)){
    return;
  }
  return cubicFt * 7.48052;
};

const galToCubicFt = gallons =>{
  if(!isPrimitiveNumber(gallons)){
    return;
  }
  return gallons * 0.133681;
};

const cubicFtToLiters = cubicFt =>{
  if(!isPrimitiveNumber(cubicFt)){
    return;
  }
  return cubicFt * 28.316846;
};

const litersToCubicFt = liters =>{
  if(!isPrimitiveNumber(liters)){
    return;
  }
  return liters * 0.0353147;
};

const gpmToCubicFtPerSec = gpm =>{
  if(!isPrimitiveNumber(gpm)){
    return;
  }
  return gpm * 0.002228009259;
};

const cubicFtPerSecToGpm = cubicFtPerSec =>{
  if(!isPrimitiveNumber(cubicFtPerSec)){
    return;
  }
  return cubicFtPerSec * 448.831168831169;
};

const gpmToLiterPerSec = gpm =>{
  if(!isPrimitiveNumber(gpm)){
    return;
  }
  return gpm * 0.0630901964;
};

const litersPerSecToGpm = litersPerSec =>{
  if(!isPrimitiveNumber(litersPerSec)){
    return;
  }
  return litersPerSec * 15.850323141489;
};

const cubicFtPerSecToLitersPerSec = cubicFt =>{
  if(!isPrimitiveNumber(cubicFt)){
    return;
  }
  return cubicFt * 28.316846592;
};

const litersPerSecToCubicFtPerSec = litersPerSec =>{
  if(!isPrimitiveNumber(litersPerSec)){
    return;
  }
  return litersPerSec * 0.035314666721;
};

const convertUnits = (unit1,unit2,value) =>{
  if(!isPrimitiveNumber(value)){
    return;
  }
  const functionKey = `${unit1}_${unit2}`;
  //unit1 and unit2 must become lowerCase
  //all the units used in key must be singular 
  //gals,meters
  //in cases where the unit has format Ua/Ub, then it would be written as UaUb
  const functionObject = {
    'ci_cf': ciToCf,
    'gal_inch': galsToInches,
    'gal_ci': galsToCi,
    'gal_cf': galsToCf,
    'gal_lb': galsToLbs,
    'lb_gal': lbsToGals,
    // 'lM2_mm': lM2ToMm,
    // 'mm_lM2': mmToLM2,
    //convertToCf
    'c_kelvin': celsiusToKelvin,
    'kelvin_c': kelvinToCelsius,
    'pct_deg': pctToDeg,
    'deg_pct': degToPct,
    'deg_rad': degToRad,
    'rad_deg': radToDeg,
    'ms_kph': msToKph,
    'kph_ms': kphToMs,
    'ms_mph': msToMph,
    'mph_kph': mphToKph,
    'kph_mph': kphToMph,
    'mm_inch': mmToInches,
    'inch_mm': inchesToMm,
    'foot_meter': feetToMeters,
    'meter_foot': metersToFeet,
    'ci_cc': ciToCc,
    'cc_ci': ccToCi,
    'ci_gal': ciToGals,
    'kg_l': kgToL,
    'cc_l': ccToL,
    'l_cc': lToCc,
    'cc_cf': ccToCf,
    'l_cf': lToCf,
    'cc_m3': ccToM3,
    'm3_cc': m3ToCc,
    'lb_kg': lbsToKg,
    'kg_lb': kgToLbs,
    'psf_kM2': psfToKM2,
    'kM2_psf': kM2ToPsf,
    'c_f': celsiusToF,
    'f_c': fToCelsius,
    'gpm_lpm': gpmToLiterPerMin,
    'lpm_gpm': literPerMinToGpm,
    'gpm_m3min': gpmToCubicMetersPerMin,
    'm3min_gpm':cubicMetersPerMinToGpm,
    'acre_ha': acresToHectares,
    'ha_acre': hectaresToAcres,
    'gpsacre_gpsha': galPerSecPerAcreToGalPerSecPerHectare,
    'gpsha_gpsacre':galPerSecPerHectareToGalPerSecPerAcre,
    'acre_sf': acresToSqrFt,
    'sf_acre': sqrFtToAcres,
    'acreInch_gal': acreInchesToGals,
    'gal_acreInch': galsToAcreInches,
    'acreInch_m3': acreInchesToCubicMeters,
    'm3_acreInch': cubicMetersToAcreInches,
    'gpsacre_literPerSecPerHa':galPerSecPerAcreToLitersPerSecPerHectare,
    'literPerSecPerHa_gpsacre': litersPerSecPerHectareToGalPerSecPerAcre,
    'sf_m2': sqrFtToSqrMeters,
    'm2_sf': sqrMetersToSqrFt,
    'ft3_gal': cubicFtToGals,
    'gal_ft3': galToCubicFt,
    'liter_ft3': litersToCubicFt,
    'ft3_liter': cubicFtToLiters,
    'gpm_ft3sec': gpmToCubicFtPerSec,
    'ft3sec_gpm': cubicFtPerSecToGpm,
    'gpm_litersec': gpmToLiterPerSec,
    'litersec_gpm': litersPerSecToGpm,
    'ft3sec_litersec': cubicFtPerSecToLitersPerSec,
    'litersec_ft3sec': litersPerSecToCubicFtPerSec,
  };

  return typeof functionObject[functionKey] === 'function' ?
    functionObject[functionKey](value) : undefined;
}; 


module.exports = {
  mmToInches,
  inchesToMm,
  feetToMeters,
  metersToFeet,
  ciToCf,
  galsToInches,
  inchesToGals,
  galsToCi,
  ciToCc,
  ccToCi,
  ciToGals,
  ccToCf,
  galsToCf,
  galsToLbs,
  lbsToGals,
  kgToL,
  _convertToCf,
  calcVwc,
  ccToL,
  ccToM3,
  m3ToCc,
  lToCc,
  lToCf,
  lbsToKg,
  kgToLbs,
  psfToKM2,
  kM2ToPsf,
  celsiusToKelvin,
  celsiusToF,
  fToCelsius,
  kelvinToCelsius,
  getDewPointC,
  getFrostPointC,
  pctToDeg,
  degToPct,
  degToRad,
  radToDeg,
  msToKph,
  kphToMs,
  msToMph,
  mphToKph,
  kphToMph,
  solarKwM2DayToUvProxy,
  calculateGradient,
  tempCorrection,
  gpmPerFtToTempCorrection,
  gpmToLiterPerMin,
  literPerMinToGpm,
  gpmToCubicMetersPerMin,
  cubicMetersPerMinToGpm,
  acresToHectares,
  hectaresToAcres,
  galPerSecPerHectareToGalPerSecPerAcre,
  galPerSecPerAcreToGalPerSecPerHectare,
  acresToSqrFt,
  sqrFtToAcres,
  acreInchesToGals,
  galsToAcreInches,
  acreInchesToCubicMeters,
  cubicMetersToAcreInches,
  litersPerSecPerHectareToGalPerSecPerAcre,
  galPerSecPerAcreToLitersPerSecPerHectare,
  sqrFtToSqrMeters,
  sqrMetersToSqrFt,
  cubicFtToGals,
  galToCubicFt,
  cubicFtToLiters,
  litersToCubicFt,
  gpmToCubicFtPerSec,
  cubicFtPerSecToGpm,
  gpmToLiterPerSec,
  litersPerSecToGpm,
  litersPerSecToCubicFtPerSec,
  cubicFtPerSecToLitersPerSec,
  convertUnits,
};