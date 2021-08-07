/* functions in this file handle unit conversions */

'use strict';

const { 
  isPrimitiveNumber, 
  isObjectLiteral, 
  precisionRound } = require('./basic');

// @@@@@@@@@@ DISTANCE @@@@@@@@@

const mmToInches = (mm, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(mm)) return ;
  return precisionRound(mm  * 0.0393701, round);
};

const mmToInchesRound = mm => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(mm)) return ;
  return precisionRound(mm  / 25, 0);
};

const inchesToMm = (inches, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(inches)) return ;
  return precisionRound(inches * 25.4, round);
};

const inchesToMmRound = (inches, round=0) => {
  // input: number, output: either a number or undefined;
  if(!isPrimitiveNumber(inches)) return ;
  if(round === 'half'){
    const halves = precisionRound(inches/0.5, 0);
    return Math.floor(halves * 0.5 * 25);
  }
  
  const mm = Math.floor(inches * 25);
  if(inches < 1) {
    return mm;
  }
  const _inches = precisionRound(mm/25, round);
  return precisionRound(_inches * 25, 0);
};

const mmToFt = (mm, round=4) => {
  if(!isPrimitiveNumber(mm)) return ;
  return precisionRound(mm * 0.00328084, round);
};

const ftToMm = (ft, round=4) => {
  if(!isPrimitiveNumber(ft)) return ;
  return precisionRound(ft * 304.8, round);
};

const mmToFtInches = mm => {
  const inches = mmToInches(mm);
  const ft = Math.floor(inches/12);
  const inchRemainderWidth = Math.round(inches - (ft * 12));
  return [ft,inchRemainderWidth];
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

const kmToMi = (km, round=2) => {
  if(!isPrimitiveNumber(km)) return ;
  return precisionRound(km * 0.621371, round);
};

const miToKm = (mi, round=2) => {
  if(!isPrimitiveNumber(mi)) return ;
  return precisionRound(mi * 1.60934, round);
};

// @@@@@@@@@@ AREA @@@@@@@@@

const sfToM2 = (sf, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(sf)) return ;
  return precisionRound(sf * 0.092903, round);
};

const m2ToSf = (m2, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(m2)) return ;
  return precisionRound(m2 * 10.7639, round);
};

const sfToAc = (sf, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(sf)) return ;
  return precisionRound(sf / 43560, round);
};

const acToSf = (ac, round=4) => {
  // input: number, output: either a number or undefined;
// precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ac)) return ;
  return precisionRound(ac * 43560, round);
};

const acToHa = (ac, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ac)) return ;
  return precisionRound(ac * 0.404686, round);
};

const haToAc = (ha, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ha)) return ;
  return precisionRound(ha * 2.47105, round);
};

const m2ToHa = (m2, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(m2)) return ;
  return precisionRound(m2 / 10000, round);
};

const haToM2 = (ha, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ha)) return ;
  return precisionRound(ha * 10000, round);
};

// @@@@@@@@@@ VOLUME @@@@@@@@@

const ciToCf = (ci, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return;
  return precisionRound(ci / (12 * 12 * 12), round);
};

const cfToCi = (cf, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(cf)) return;
  return precisionRound(cf * (12 * 12 * 12), round);
};

const galsToCi = (gallons, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 231, round);
};

const ciToGals = (ci, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return ;
  return precisionRound(ci / 231, round);
};

const ciToCc = (ci, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return ;
  return precisionRound(ci * 16.3871, round);
};

const ccToCi = (ci, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ci)) return ;
  return precisionRound(ci * 0.0610237, round);
};

const galsToCf = (gallons, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return ;
  return precisionRound(gallons * 0.133681, round);
};

const cfToGals = (cf, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(cf)) return ;
  return precisionRound(cf / 0.133681, round);
};

const m3ToL = (m3, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 1000, round);
};

const lToM3 = (l, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(l)) return;
  return precisionRound(l / 1000, round);
};

const mlToL = (ml, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ml)) return;
  return precisionRound(ml / 1000, round);
};

const lToMl = (ml, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(ml)) return;
  return precisionRound(ml * 1000, round);
};

const ccToL = (cc, round=4) => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc * 0.001, round);
};

const lToCc = (L, round=4) => {
  if(!isPrimitiveNumber(L)) return ;
  return precisionRound(L * 1000, round);
};

const ccToCf = (cc, round=4) => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc * 0.0000353147, round);
};

const cfToCc = (cf, round=4) => {
  if(!isPrimitiveNumber(cf)) return ;
  return precisionRound(cf / 0.0000353147, round);
};

const lToCf = (L, round=4) => {
  if(!isPrimitiveNumber(L)) return ;
  return precisionRound(L * 0.0353147, round);
};

const cfToL = (cf, round=4) => {
  if(!isPrimitiveNumber(cf)) return ;
  return precisionRound(cf * 28.317, round);
};

const ccToM3 = (cc, round=10) => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc * 1000000, round);
};

const m3ToCc = (m3, round=4) => {
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 / 1000000, round);
};

const m3ToCf = (m3, round=4) => {
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 35.3147, round);
};

const cfToM3 = (cf, round=10) => {
  if(!isPrimitiveNumber(cf)) return;
  return precisionRound(cf / 35.3147, round);
};

const galsToM3 = (gals, round=10) => {
  if(!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 0.00378541, round);
};

const m3ToGals = (m3, round=4) => {
  if(!isPrimitiveNumber(m3)) return;
  return precisionRound(m3 * 264.172, round);
};

const galsToL = (gals, round=4) => {
  if(!isPrimitiveNumber(gals)) return;
  return precisionRound(gals * 3.78541, round);
};

const lToGals = (l, round=4) => {
  if(!isPrimitiveNumber(l)) return;
  return precisionRound(l * 0.264172, round);
};

// @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@

const galsToInches = (gallons, sf, round=4) => {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons) || !isPrimitiveNumber(sf)) return;
  if(sf === 0) return 0;
  const si = sf * 144;
  const ci = gallons * 231;
  return precisionRound(ci / si, round);
}; 

const inchesToGals = (inches, sf, round=4) => {
  // input: numbers, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(inches) || !isPrimitiveNumber(sf)) return;
  if(sf === 0) return 0;
  const si = sf * 144;
  const ci = si * inches;
  return ciToGals(ci, round);
}; 

const mmToL = (mm, m2, round=4) => {
  if(!isPrimitiveNumber(mm) || !isPrimitiveNumber(m2)) return;
  return precisionRound(mm * m2, round);
};

const lToMm = (l, m2, round=4) => {
  if(!isPrimitiveNumber(l) || !isPrimitiveNumber(m2)) return;
  return precisionRound(l/m2, round);
};

const kgToMm = (kg, m2, round=4) =>{
  if(!isPrimitiveNumber(kg)) return ;
  if(!isPrimitiveNumber(m2)) return ;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(kg/m2,round);
};

const mmToKg = (mm, m2, round=4) =>{
  if(!isPrimitiveNumber(mm)) return ;
  if(!isPrimitiveNumber(m2)) return ;
  // assumption 1 kg = 1 L
  // assumption 1L / 1 M2 = 1mm
  return precisionRound(mm*m2,round);
};

// @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@

const lM2ToGalSf = (lM2, round=4) => {
  if(!isPrimitiveNumber(lM2)) return;
  return precisionRound(lM2 * 0.02454239, round);
};

const galSfToLM2 = (gsf, round=4) => {
  if(!isPrimitiveNumber(gsf)) return;
  return precisionRound(gsf * 40.745833577571, round);
};

// @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@

const galsToLbs = (gallons, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(gallons)) return;
  return precisionRound(gallons * 8.34, round);
};

const lbsToGals = (lbs, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs / 8.34, round);
};

const kgToL = (kg, round=4) => {
  // input: number, output: either a number or undefined;
  if(!isPrimitiveNumber(kg)) return ;
  return precisionRound(kg, round);
};

const lToKg = (l, round=4) => {
  // input: number, output: either a number or undefined;
  if(!isPrimitiveNumber(l)) return ;
  return precisionRound(l, round);
};

const kgToCc = (kg, round=4) => {
  if(!isPrimitiveNumber(kg)) return ;
  return precisionRound(kg * 1000, round);
};

const ccToKg = (cc, round=4) => {
  if(!isPrimitiveNumber(cc)) return ;
  return precisionRound(cc / 1000, round);
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

const calcVwc = (volume, water, round=4) => {
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
    return precisionRound(water.qty/volume.qty);
  }
  if(volumeUnits === 'cc' && waterUnits === 'l'){
    return precisionRound(water.qty/(volume.qty/1000));
  }

  const volumeCF = _convertToCf(volumeUnits, volume.qty);
  const waterCF  = _convertToCf(waterUnits , water.qty);

  if(!isPrimitiveNumber(volumeCF)) return;
  if(!isPrimitiveNumber(waterCF))  return;

  if(volumeCF === 0) return; // return undefined vs 0, b/c we cannot calculate 0 CF (0 would not be an accurate result)

  const vwc = precisionRound(waterCF/volumeCF, round);
  return vwc;
};

// @@@@@@@@@@ FLOW RATE @@@@@@@@@

const cfSAcToLSHa = (cfSAc, round=4) => {
  if(!isPrimitiveNumber(cfSAc)) return;
  const lSAc = cfToL(cfSAc, 15); // avoid compounding rounding error
  return haToAc(lSAc, round);
};

const lSHaToCfSAc = (lSHa, round=4) => {
  if(!isPrimitiveNumber(lSHa)) return;
  const cfsHa = lToCf(lSHa, 15); // avoid compounding rounding error
  return acToHa(cfsHa, round);
};

const gpmToM3S = (gpm, round=10) => {
  if(!isPrimitiveNumber(gpm)) return;
  const gpS = gpm / 60;
  return galsToM3(gpS, round);
};

const m3SToGpm = (m3s, round=4) => {
  if(!isPrimitiveNumber(m3s)) return;
  const m3Min = m3s * 60;
  return m3ToGals(m3Min, round);
};

const gpmToLS = (gpm, round=4) => {
  if(!isPrimitiveNumber(gpm)) return;
  const gpS = gpm / 60;
  return galsToL(gpS, round);
};

const lSToGpm = (lS, round=4) => {
  if(!isPrimitiveNumber(lS)) return;
  const lMin = lS * 60;
  return lToGals(lMin, round);
};

// @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@

const gpmFtToM3SM = (gpmFt, round=8) => {
  if(!isPrimitiveNumber(gpmFt)) return;
  const gpSFt = gpmFt / 60;
  const m3SFt = galsToM3(gpSFt, 15);
  return metersToFeet(m3SFt, round);
};

const m3SMToGpmFt = (m3SM, round=4) => {
  if(!isPrimitiveNumber(m3SM)) return;
  const m3MinM = m3SM * 60;
  const m3SFt = feetToMeters(m3MinM, 15);
  return m3ToGals(m3SFt, round);
};

const gpmFtToLSM = (gpmFt, round=4) => {
  if(!isPrimitiveNumber(gpmFt)) return;
  const gpSFt = gpmFt / 60;
  const gpSM = metersToFeet(gpSFt, 15);
  return galsToL(gpSM, round);
};

const lSMToGpmFt = (lSM, round=4) => {
  if(!isPrimitiveNumber(lSM)) return;
  const lMinM = lSM * 60;
  const lMinFt = feetToMeters(lMinM, 15);
  return lToGals(lMinFt, round);
};

const lMinMToM3SM = (lMinM, round=12) => {
  if(!isPrimitiveNumber(lMinM)) return;
  const lSM = lMinM / 60;
  return lToM3(lSM, round);
};

const m3SMToLMinM = (m3SM, round=4) => {
  if(!isPrimitiveNumber(m3SM)) return;
  const m3MinM = m3SM * 60;
  return m3ToL(m3MinM, round);
};

// @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

const gpmToInchesHr = (gpm, sf, round=4) => {
  if(!isPrimitiveNumber(gpm)) return;
  if(!isPrimitiveNumber(sf)) return;
  const gpHr = gpm * 60;
  return galsToInches(gpHr, sf, round);
};

const inchesHrToGpm = (inchesHr, sf, round=4) => {
  if(!isPrimitiveNumber(inchesHr)) return;
  if(!isPrimitiveNumber(sf)) return;
  const inchesMin = inchesHr / 60;
  return inchesToGals(inchesMin, sf, round);
};

const lMinToMmHr = (lMin, m2, round=4) => {
  if(!isPrimitiveNumber(lMin)) return;
  if(!isPrimitiveNumber(m2)) return;
  const lHr = lMin * 60;
  return lToMm(lHr, m2, round);
};

const mmHrToLMin = (mmHr, m2, round=4) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const mmMin = mmHr / 60;
  return mmToL(mmMin, m2, round);
};

const lSToMmHr = (lS, m2, round=4) => {
  if(!isPrimitiveNumber(lS)) return;
  if(!isPrimitiveNumber(m2)) return;
  const lHr = lS * 3600;
  return lToMm(lHr, m2, round);
};

const mmHrToLS = (mmHr, m2, round=4) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const mmMin = mmHr / 60;
  const mmS = mmMin / 60;
  return mmToL(mmS, m2, round);
};

const gpmToMmHr = (gpm, sf, round=4) => {
  if(!isPrimitiveNumber(gpm)) return;
  if(!isPrimitiveNumber(sf)) return;
  const inchesHr = gpmToInchesHr(gpm, sf);
  const mmHr = inchesToMm(inchesHr, round);
  return mmHr;
};

const mmHrToGpm = (mmHr, m2, round=4) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const lMin = mmHrToLMin(mmHr, m2);
  const gpm = lToGals(lMin, round);
  return gpm;
};


const m3sToMmHr = (m3s, m2, round=4) => {
  if(!isPrimitiveNumber(m3s)) return;
  if(!isPrimitiveNumber(m2)) return;
  const m3Hr = m3s * 3600;
  const lHr = m3ToL(m3Hr, 15);
  const mmHr = lToMm(lHr, m2, round);
  return mmHr;
};

const mmHrToM3S = (mmHr, m2, round=4) => {
  if(!isPrimitiveNumber(mmHr)) return;
  if(!isPrimitiveNumber(m2)) return;
  const mmS = mmHr / 3600;
  const lS = mmToL(mmS, m2, 15);
  const m3s = lToM3(lS, round);
  return m3s;
};


// @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@

const lbsToKg = (lbs, round=4) => {
  if(!isPrimitiveNumber(lbs)) return;
  return precisionRound(lbs * 0.453592, round);
};

const kgToLbs = (kg, round=4) => {
  if(!isPrimitiveNumber(kg)) return;
  return precisionRound(kg * 2.20462, round);
};

// @@@@@@@@@@ DENSITY @@@@@@@@@

const lbsCfToKgM3 = (lbsCf, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(lbsCf)) return;
  return precisionRound(lbsCf * 16.018463, round);
};

const kgM3ToLbsCf = (kgM3, round=4) => {
  // input: number, output: either a number or undefined;
  // precision: 4 decimal places, set here
  if(!isPrimitiveNumber(kgM3)) return;
  return precisionRound(kgM3 * 0.062428, round);
};

const psfToKgM2 = (psf, round=4) => {
  if(!isPrimitiveNumber(psf)) return;
  return precisionRound(psf * 4.88243, round);
};

const kgM2ToPsf = (kM2, round=4) => {
  if(!isPrimitiveNumber(kM2)) return;
  return precisionRound(kM2 * 0.204816, round);
};

const psfToKM2 = (psf, round=4) => {
  // eslint-disable-next-line no-console
  console.warn('psfToKM2 is deprecated use psfToKgM2');
  return psfToKgM2(psf, round);
};

const kM2ToPsf = (kM2, round=4) => {
  // eslint-disable-next-line no-console
  console.warn('kM2ToPsf is deprecated use kgM2ToPsf');
  return kgM2ToPsf(kM2, round);
};

// @@@@@@@@@@ TEMPERATURE @@@@@@@@@

const celsiusToKelvin = (c, round=4) => {
  // eslint-disable-next-line no-console
  console.warn('celsiusToKelvin is deprecated use cToK');
  return cToK(c, round);
};

const cToK = (c, round=4) => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Kelvin
    :rtype: float
    */
  return precisionRound(c + 273.15, round);
};

const kelvinToCelsius = (k, round=4) => {
  // eslint-disable-next-line no-console
  console.warn('kelvinToCelsius is deprecated use kToC');
  return kToC(k, round);
};

const kToC = (k, round=4) => {
  /*
    Convert temperature in degrees Kelvin to degrees Celsius.

    :param kelvin: Degrees Kelvin
    :return: Degrees Celsius
    :rtype: float
    */
  return precisionRound(k - 273.15, round);
};

const celsiusToF = (c, round=4) => {
  // eslint-disable-next-line no-console
  console.warn('celsiusToF is deprecated use cToF');
  return cToF(c, round);
};

const cToF = (c, round=4) => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return precisionRound((c * 1.8 ) + 32, round);
};

const fToCelsius = (f, round=4) => {
  // eslint-disable-next-line no-console
  console.warn('fToCelsius is deprecated use fToC');
  return fToC(f, round);
};

const fToC = (f, round=4) => {
  /*
    Convert temperature in degrees Celsius to degrees Kelvin.

    :param celsius: Degrees Celsius
    :return: Degrees Fahrenheit
    :rtype: float
    */
  return precisionRound((f - 32) / 1.8, round);
};

// @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@

const getDewPointC = (t_air_c, rel_humidity, round=4) => {
  // Compute the dew point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // rel_humidity: relative humidity in %
  // returns the dew point in degrees Celsius
  const A = 17.27;
  const B = 237.7;
  const alpha = ((A * t_air_c) / (B + t_air_c)) + Math.log(rel_humidity/100.0);
  return precisionRound(alpha, round);
};

const getFrostPointC = (t_air_c, dew_point_c, round=4) => {
  // Compute the frost point in degrees Celsius
  // adapted from https://gist.github.com/sourceperl/45587ea99ff123745428
  // t_air_c: current ambient temperature in degrees Celsius
  // dew_point_c: current dew point in degrees Celsius
  // returns the frost point in degrees Celsius
  const dew_point_k = 273.15 + dew_point_c;
  const t_air_k = 273.15 + t_air_c;
  const frost_point_k = dew_point_k - t_air_k + 2671.02 / ((2954.61 / t_air_k) + 2.193665 * Math.log(t_air_k) - 13.3448);
  return precisionRound(frost_point_k - 273.15, round);
};


// @@@@@@@@@@ SLOPE @@@@@@@@@

const pctToDeg = (pct, range=90, round=4) => {
  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return precisionRound(100 * range * pct / 100, round);
};

const degToPct = (deg, range=90, round=4) => {
  /*
    Convert percent slope to degrees
    :param pct: Value in percent to be converted. Percent is rise over run, in same units, e.g. 2% = 2 units of rise to 100 units of run, such as 2 inches rise per 100 inches run
    :param range: portion of circle to consider; e.g. for slope from horizontal we might consider only 90 degrees, whereas 0 is flat, and 90 is vertical
    :return: Value in degrees
    :rtype: float
    */
  return range === 0 ? 0 : 
    precisionRound(100 * (deg / range) / 100, round) ;
};

// @@@@@@@@@@ ANGLES @@@@@@@@@

const degToRad = (degrees, round=4) => {
  /*
    Convert angular degrees to radians

    :param degrees: Value in degrees to be converted.
    :return: Value in radians
    :rtype: float
    */
  return precisionRound(degrees * (Math.PI / 180.0), round);
};

const radToDeg = (radians, round=4) => {
  /*
    Convert radians to angular degrees

    :param radians: Value in radians to be converted.
    :return: Value in angular degrees
    :rtype: float
    */
  return precisionRound(radians * (180.0 / Math.PI), round);
};

// @@@@@@@@@@ SPEED @@@@@@@@@

const msToKph = (ms, round=4) => {
  /*
   * Convert meters per second to kilometers per hour
   */
  return precisionRound(ms * 3.6, round);
};

const msToMph = (ms, round=4) => {
  /*
   * Convert meters per second to miles per hour
   */
  return precisionRound(ms * 2.23694, round);
};

const mphToKph = (mph, round=4) => {
  /*
   * Convert miles per hour to kilometers per hour
   */
  return precisionRound(mph * 1.60934, round);
};

const kphToMph = (kph, round=4) => {
  /*
   * Convert kilometres per hour to miles per hour
   */
  return precisionRound(kph * 0.621371, round);
};

const kphToMs = (kph, round=4) => {
  /*
   * Convert kilometres per hour to meters per second
   */
  return precisionRound(kph * 0.277778, round);
};

// @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@

const solarKwM2DayToUvProxy = (kwM2, round=4) => {
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
  mmToInches,
  mmToInchesRound,
  inchesToMm,
  inchesToMmRound,

  mmToFt,
  ftToMm,
  
  mmToFtInches,
  
  feetToMeters,
  metersToFeet,
  
  kmToMi,
  miToKm,

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