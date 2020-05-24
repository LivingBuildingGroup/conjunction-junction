'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  // @@@@@@@@@@ DISTANCE @@@@@@@@@
  mmToInches,
  mmToInchesRound,
  inchesToMm,
  inchesToMmRound,
 
  mmToFt,
  ftToMm,
  
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

  // @@@@@@ helpers @@@@@@
  precisionRound,
} = require('../index');
const {
  numbers, 
  nonNumbers, 
  nonObjects,
  nonNumberObjects, 
  nonNumberArrays,
  nonStringPrimitives,
  lowerStrings,
  upperStrings         } = require('./helper-data');


describe('conjunction-junction conversions', () => { 

  // @@@@@@@@@@ DISTANCE @@@@@@@@@
  it('mmToInches, converts millimeters to inches (4 decimal points)', () => {
    const expectedResult = 0.8268;
    const result = precisionRound(mmToInches(21),4);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInches returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = mmToInches('input');
    expect(result).to.equal(expectedResult); 
  });

  it('mmToInchesRound returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = mmToInchesRound('input');
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInchesRound 25 = 1', () => {
    const expectedResult = 1;
    const result = mmToInchesRound(25);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInchesRound 50 = 2', () => {
    const expectedResult = 2;
    const result = mmToInchesRound(50);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInchesRound 53 = 2', () => {
    const expectedResult = 2;
    const result = mmToInchesRound(53);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInchesRound 102 = 4', () => {
    const expectedResult = 4;
    const result = mmToInchesRound(102);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInchesRound 115 = 4', () => {
    const expectedResult = 4;
    const result = mmToInchesRound(102);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInchesRound 123 = 5', () => {
    const expectedResult = 5;
    const result = mmToInchesRound(123);
    expect(result).to.equal(expectedResult); 
  });

  it('inchesToMm converts inches to millimeters', () => {
    const expectedResult = 304.8;
    const result = inchesToMm(12);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMm returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = inchesToMm('input');
    expect(result).to.equal(expectedResult); 
  });

  it('inchesToMmRound returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = inchesToMmRound('input');
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 0.5 = 12', () => {
    const expectedResult = 12;
    const result = inchesToMmRound(0.5, 1);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 1 = 25', () => {
    const expectedResult = 25;
    const result = inchesToMmRound(1);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 2 = 50', () => {
    const expectedResult = 50;
    const result = inchesToMmRound(2);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 2.1 = 50', () => {
    const expectedResult = 50;
    const result = inchesToMmRound(2.1);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 3.3 = 75', () => {
    const expectedResult = 75;
    const result = inchesToMmRound(3.3);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 3.6 = 100', () => {
    const expectedResult = 100;
    const result = inchesToMmRound(3.6);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 4.8 = 125', () => {
    const expectedResult = 125;
    const result = inchesToMmRound(4.8);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 3.3 = 75', () => {
    const expectedResult = 75;
    const result = inchesToMmRound(3.3);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMmRound 5.1 = 125', () => {
    const expectedResult = 125;
    const result = inchesToMmRound(5.1);
    expect(result).to.equal(expectedResult); 
  });

    
  it('feetToMeters converts feet to meters', () => {
    const expectedResult = 6.096;
    const result = feetToMeters(20);
    expect(result).to.equal(expectedResult); 
  });
  it('feetToMeters returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = feetToMeters('input');
    expect(result).to.equal(expectedResult); 
  });
  it('metersToFeet converts meters to feet', () => {
    const expectedResult = 52.4934;
    const result = metersToFeet(16);
    expect(result).to.equal(expectedResult); 
  });
  it('metersToFeet returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = metersToFeet('input');
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ AREA @@@@@@@@@

  it('sfToM2', () => {
    const sf = 1;
    const m2 = 0.0929;
    const result = sfToM2(sf);
    expect(result).to.equal(m2);
  });

  it('m2ToSf', () => {
    const m2 = 1;
    const sf = 10.7639;
    const result = m2ToSf(m2);
    expect(result).to.equal(sf);  
  });

  it('sfToAc', () => {
    const sf = 43560;
    const ac = 1;
    const result = sfToAc(sf);
    expect(result).to.equal(ac);
  });

  it('acToSf', () => {
    const ac = 1;
    const sf = 43560;
    const result = acToSf(ac);
    expect(result).to.equal(sf);  
  });

  it('acToHa', () => {
    const ac = 1;
    const ha = 0.4047;
    const result = acToHa(ac);
    expect(result).to.equal(ha);
  });

  it('haToAc', () => {
    const ha = 1;
    const ac = 2.4711;
    const result = haToAc(ha);
    expect(result).to.equal(ac);  
  });

  it('m2ToHa', () => {
    const m2 = 1;
    const ha = 0.0001;
    const result = m2ToHa(m2);
    expect(result).to.equal(ha);
  });

  it('haToM2', () => {
    const ha = 1;
    const m2 = 10000;
    const result = haToM2(ha);
    expect(result).to.equal(m2);  
  });

  // @@@@@@@@@@ VOLUME @@@@@@@@@

  it('ciToCf undefined if no params', () => { 
    const result = ciToCf();
    expect(result).to.equal(undefined);
  });
  it('ciToCf undefined on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const result = ciToCf(item);
      expect(result).to.equal(undefined);
    });
  });
  it('ciToCf undefined on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const result = ciToCf(item);
      expect(result).to.equal(undefined);
    });
  });
  it('ciToCf undefined on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const result = ciToCf(item);
      expect(result).to.equal(undefined);
    });
  });
  it('ciToCf true on numbers', () => { 
    const ci = 7623;
    const expectedResult = 4.4115; //  7623 / (12*12*12) rounded to 4
    const result = ciToCf(ci);
    expect(result).to.equal(expectedResult);
  });

  it('cfToCi', () => {
    const val = 1;
    const expectedResult = 1728;
    const result = cfToCi(val);
    expect(result).to.equal(expectedResult);   
  });

  it('galsToCi undefined if no params', () => { 
    const result = galsToCi();
    expect(result).to.equal(undefined);
  });
  it('galsToCi undefined on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const result = galsToCi(item);
      expect(result).to.equal(undefined);
    });
  });
  it('galsToCi undefined on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const result = galsToCi(item);
      expect(result).to.equal(undefined);
    });
  });
  it('galsToCi undefined on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const result = galsToCi(item);
      expect(result).to.equal(undefined);
    });
  });
  it('galsToCi true on numbers', () => { 
    const gallons = 33;
    const expectedResult = 7623; //  33 * 231 rounded to 4
    const result = galsToCi(gallons);
    expect(result).to.equal(expectedResult);
  });

  it('ciToGals ', () => {
    const expectedResult = 0.1429;
    const result = ciToGals(33);
    expect(result).to.equal(expectedResult); 
  });
  it('ciToGals returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = ciToGals('input');
    expect(result).to.equal(expectedResult); 
  });

  it('ciToCc ', () => {
    const expectedResult = 376.9033;
    const result = ciToCc(23);
    expect(result).to.equal(expectedResult); 
  });
  it('ciToCc returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = ciToCc('input');
    expect(result).to.equal(expectedResult); 
  });

  it('ccToCi ', () => {
    const expectedResult = 0.6774;
    const result = ccToCi(11.1);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToCi returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = ccToCi('input');
    expect(result).to.equal(expectedResult); 
  });

  it('galsToCf true on numbers', () => { 
    const gallons = 33;
    const expectedResult = 4.4115; //  33 * 0.133681 rounded to 4
    const result = galsToCf(gallons);
    expect(result).to.equal(expectedResult);
  });

  it('cfToGals', () => { 
    const val = 1;
    const expectedResult = 7.4805;
    const result = cfToGals(val);
    expect(result).to.equal(expectedResult);   
  });

  it('m3ToL', () => { 
    const val = 1;
    const expectedResult = 1000;
    const result = m3ToL(val);
    expect(result).to.equal(expectedResult);   
  });

  it('lToM3', () => { 
    const val = 1;
    const expectedResult = 0.001;
    const result = lToM3(val);
    expect(result).to.equal(expectedResult);  
  });

  it('mlToL', () => { 
    const val = 1;
    const expectedResult = 0.001;
    const result = mlToL(val);
    expect(result).to.equal(expectedResult);  
  });

  it('lToMl', () => { 
    const val = 1;
    const expectedResult = 1000;
    const result = lToMl(val);
    expect(result).to.equal(expectedResult);  
  });

  it('ccToL ', () => {
    const expectedResult = 0.211;
    const result = ccToL(211);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToL returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = ccToL('input');
    expect(result).to.equal(expectedResult); 
  });

  it('lToCc ', () => {
    const expectedResult = 4000;
    const result = lToCc(4);
    expect(result).to.equal(expectedResult); 
  });
  it('lToCc returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = lToCc('input');
    expect(result).to.equal(expectedResult); 
  });




  
  it('ccToCf ', () => {
    const expectedResult = 0.0008;
    const result = ccToCf(23);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToCf returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = ccToCf('input');
    expect(result).to.equal(expectedResult); 
  });

  it('cfToCc', () => { 
    const val = 1;
    const expectedResult = 28316.8199;
    const result = cfToCc(val);
    expect(result).to.equal(expectedResult);  
  });

  it('lToCf ', () => {
    const expectedResult = 0.8122;
    const result = lToCf(23);
    expect(result).to.equal(expectedResult); 
  });
  it('lToCf returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = lToCf('input');
    expect(result).to.equal(expectedResult); 
  });

  it('cfToL', () => { 
    const val = 1;
    const expectedResult = 28.317;
    const result = cfToL(val);
    expect(result).to.equal(expectedResult);  
  });


  it('ccToM3 ', () => {
    const expectedResult = 3000000;
    const result = ccToM3(3);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToM3 returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = ccToM3('input');
    expect(result).to.equal(expectedResult); 
  });

  it('m3ToCc ', () => {
    const expectedResult = 0.003;
    const result = m3ToCc(3000);
    expect(result).to.equal(expectedResult); 
  });
  it('m3ToCc returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = m3ToCc('input');
    expect(result).to.equal(expectedResult); 
  });

  it('m3ToCf', () => { 
    const val = 1;
    const expectedResult = 35.3147;
    const result = m3ToCf(val);
    expect(result).to.equal(expectedResult);  
  });

  it('cfToM3', () => { 
    const val = 1;
    const expectedResult = 0.0283;
    const result = cfToM3(val);
    expect(result).to.equal(expectedResult);  
  });

  it('galsToM3', () => { 
    const val = 5;
    const expectedResult = 0.01892705;
    const result = galsToM3(val);
    expect(result).to.equal(expectedResult);  
  });

  it('m3ToGals', () => { 
    const val = 7;
    const expectedResult = 1849.204;
    const result = m3ToGals(val);
    expect(result).to.equal(expectedResult);  
  });

  it('galsToL', () => { 
    const val = 1;
    const expectedResult = 3.7854; // 3.78541
    const result = galsToL(val);
    expect(result).to.equal(expectedResult);  
  });

  it('lToGals', () => { 
    const val = 1;
    const expectedResult = 0.2642; // 0.264172
    const result = lToGals(val);
    expect(result).to.equal(expectedResult);  
  });

  // @@@@@@@@@@ VOLUME DEPTH, AREA @@@@@@@@@

  it('galsToInches undefined if no params', () => { 
    const result = galsToInches();
    expect(result).to.equal(undefined);
  });
  it('galsToInches undefined on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const result = galsToInches(item, item);
      expect(result).to.equal(undefined);
    });
  });
  it('galsToInches undefined on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const result = galsToInches(item, item);
      expect(result).to.equal(undefined);
    });
  });
  it('galsToInches undefined on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const result = galsToInches(item, item);
      expect(result).to.equal(undefined);
    });
  });
  it('galsToInches true on numbers', () => { 
    const gallons = 33;
    const squareFeet = 200;
    const expectedResult = 0.2647; //  0.26469 rounded to 4
    const result = galsToInches(gallons, squareFeet);
    expect(precisionRound(result,5)).to.equal(expectedResult);
  });

  it('inchesToGals', () => { 
    const inches = 1;
    const sf = 1;
    const expectedResult = 0.6234;
    const result = inchesToGals(inches, sf);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToGals 1 cf', () => { 
    const inches = 12;
    const sf = 1;
    const expectedResult = 7.4805;
    const result = inchesToGals(inches, sf);
    expect(result).to.equal(expectedResult); 
  });

  it('mmToL 1', () => { 
    const mm = 1;
    const m2 = 1;
    const expectedResult = 1;
    const result = mmToL(mm, m2);
    expect(result).to.equal(expectedResult);  
  });
  it('mmToL 8', () => { 
    const mm = 1;
    const m2 = 8;
    const expectedResult = 8;
    const result = mmToL(mm, m2);
    expect(result).to.equal(expectedResult);  
  });

  it('lToMm 1', () => { 
    const l = 8;
    const m2 = 8;
    const expectedResult = 1;
    const result = lToMm(l, m2);
    expect(result).to.equal(expectedResult);  
  });
  it('lToMm 10', () => { 
    const l = 80;
    const m2 = 8;
    const expectedResult = 10;
    const result = lToMm(l, m2);
    expect(result).to.equal(expectedResult);  
  });

  it('kgToMm 2', () => { 
    const kg = 16;
    const m2 = 8;
    const expectedResult = 2;
    const result = kgToMm(kg, m2);
    expect(result).to.equal(expectedResult);  
  });
  it('kgToMm 10', () => { 
    const l = 80;
    const m2 = 8;
    const expectedResult = 10;
    const result = kgToMm(l, m2);
    expect(result).to.equal(expectedResult); 
  });

  it('mmToKg 1', () => { 
    const mm = 1;
    const m2 = 1;
    const expectedResult = 1;
    const result = mmToKg(mm, m2);
    expect(result).to.equal(expectedResult);  
  });
  it('mmToKg 15', () => { 
    const mm = 15;
    const m2 = 1;
    const expectedResult = 15;
    const result = mmToKg(mm, m2);
    expect(result).to.equal(expectedResult);  
  });

  // @@@@@@@@@@@ VOLUME COMPOUND UNITS @@@@@@@@@@

  it('lM2ToGalSf', () => { 
    const lM2 = 55.63;
    const expectedResult = 1.3653;
    const gsf = lM2ToGalSf(lM2);
    expect(gsf).to.equal(expectedResult);
  });

  it('galSfToLM2', () => { 
    const gsf = 1.3653;
    const expectedResult = 55.6303;
    const lM2 = galSfToLM2(gsf);
    expect(lM2).to.equal(expectedResult);
  });

  // @@@@@@@@@@@@@ VOLUME DENSITY OF WATER @@@@@@@@@@@@

  it('galsToLbs undefined if no params', () => { 
    const lbs = galsToLbs();
    expect(lbs).to.equal(undefined);
  });
  it('galsToLbs undefined on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const num = galsToLbs(item);
      expect(num).to.equal(undefined);
    });
  });
  it('galsToLbs undefined on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const num = galsToLbs(item);
      expect(num).to.equal(undefined);
    });
  });
  it('galsToLbs undefined on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const num = galsToLbs(item);
      expect(num).to.equal(undefined);
    });
  });
  it('galsToLbs true on number', () => { 
    const gallons = 10;
    const expectedResult = 83.4;
    const lbs = galsToLbs(gallons);
    expect(lbs).to.equal(expectedResult);
  });
  
  it('lbsToGals undefined if no params', () => { 
    const gals = lbsToGals();
    expect(gals).to.equal(undefined);
  });
  it('lbsToGals undefined on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const num = lbsToGals(item);
      expect(num).to.equal(undefined);
    });
  });
  it('lbsToGals undefined on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const num = lbsToGals(item);
      expect(num).to.equal(undefined);
    });
  });
  it('lbsToGals undefined on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const num = lbsToGals(item);
      expect(num).to.equal(undefined);
    });
  });
  it('lbsToGals true', () => { 
    const lbs = 83.4;
    const expectedResult = 10;
    const gals = lbsToGals(lbs);
    expect(gals).to.equal(expectedResult);
  });

  it('kgToL ', () => {
    const expectedResult = 102;
    const result = kgToL(102);
    expect(result).to.equal(expectedResult); 
  });
  it('kgToL returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = kgToL('input');
    expect(result).to.equal(expectedResult); 
  });

  it('lToKg', () => { 
    const val = 111;
    const expectedResult = 111;
    const result = lToKg(val);
    expect(result).to.equal(expectedResult);  
  });

  it('kgToCc', () => { 
    const val = 111;
    const expectedResult = 111000;
    const result = kgToCc(val);
    expect(result).to.equal(expectedResult);  
  });

  it('ccToKg', () => { 
    const val = 111;
    const expectedResult = 0.111;
    const result = ccToKg(val);
    expect(result).to.equal(expectedResult);  
  });

  // @@@@@@@@@@@@@@@@ VWC @@@@@@@@@@@@@@@@

  it('_convertToCf cf', () => { 
    const units = 'cf';
    const cf = _convertToCf(units, 1);
    expect(cf).to.equal(1);
  });
  it('_convertToCf ci', () => { 
    const units = 'ci';
    const cf = _convertToCf(units, 40000);
    expect(cf).to.equal(23.1481);
  });
  it('_convertToCf gals', () => { 
    const units = 'gals';
    const cf = _convertToCf(units, 10);
    expect(cf).to.equal(1.3368);
  });
  it('_convertToCf lbs', () => { 
    const units = 'lbs';
    const cf = _convertToCf(units, 834);
    expect(cf).to.equal(13.3681);
  });
  it('_convertToCf cc', () => { 
    const units = 'cc';
    const cf = _convertToCf(units, 50000);
    expect(cf).to.equal(1.7657);
  });
  it('_convertToCf l', () => { 
    const units = 'l';
    const cf = _convertToCf(units, 100);
    expect(cf).to.equal(3.5315);
  });
  it('_convertToCf m3', () => { 
    const units = 'm3';
    const cf = _convertToCf(units, 10);
    expect(cf).to.equal(353.147);
  });
  it('_convertToCf anything else', () => { 
    const units = '??';
    const cf = _convertToCf(units, 1);
    expect(cf).to.equal(null);
  });

  it('calcVwc correct on v cf w cf', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'CF',
      qty: 1
    };
    const expectedResult = 0.3333;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc correct on v cf w cf', () => { 
    const volume = {
      units: 'cI', // caps doesn't matter
      qty: 5184,
    };
    const water = {
      units: 'CF',
      qty: 1,
    };
    const expectedResult = 0.3333;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc correct on v cf w ci', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'ci',
      qty: 1500
    };
    const expectedResult = 0.2894;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc correct on v cf w ci', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'ci',
      qty: 1500
    };
    // 1500 ci = 0.8681 cf
    // 0.8681 / 3 = 0.2894
    const expectedResult = 0.2894;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc correct on v cf w gals', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'GaLs', // caps shouldn't matter
      qty: 2
    };
    // 2 gals * 231 = 462 ci
    // 462 ci = 0.2674 cf
    // 0.2674 / 3 = 0.0891
    const expectedResult = 0.0891;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc correct on v cf w lbs', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'lBs', // caps shouldn't matter
      qty: 10
    };
    // 10 lbs = 1.1990 gals
    // 1.1990 gals * 231 = 276.969 ci
    // 276.969 ci = 0.1603 cf
    // 0.1603 / 3 = 0.0534
    const expectedResult = 0.0534;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc correct on 0', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'lBs', // caps shouldn't matter
      qty: 0
    };
    const expectedResult = 0;
    const result = calcVwc(volume, water);
    expect(result).to.equal(expectedResult);
  });
  it('calcVwc undefined if volume undefined', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'lBs', // caps shouldn't matter
      qty: 10
    };
    for(let key in volume){
      const newVolume = Object.assign({},
        volume, {
          [key]: null,
        });
      const result = calcVwc(newVolume, water);
      expect(result).to.equal(undefined);
    }
  });
  it('calcVwc undefined if water undefined', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = {
      units: 'lBs', // caps shouldn't matter
      qty: 10
    };
    for(let key in water){
      const newWater = Object.assign({},
        water, {
          [key]: null,
        });
      const result = calcVwc(volume, newWater);
      expect(result).to.equal(undefined);
    }
  });
  it('calcVwc undefined if water not an object', () => { 
    const volume = {
      units: 'CF',
      qty: 3
    };
    const water = 'not an object';
    const result = calcVwc(volume, water);
    expect(result).to.equal(undefined);
  });
  it('calcVwc undefined if volume not an object', () => { 
    const volume = 'not an object';
    const water = {
      units: 'lBs', // caps shouldn't matter
      qty: 10
    };
    const result = calcVwc(volume, water);
    expect(result).to.equal(undefined);
  });
  it('calcVwc vol cc water L', () => { 
    const vol = {
      units: 'cc',
      qty: 40000, // e.g. 4cm thick over 1M2
    };
    const wat = {
      units: 'L',
      qty: 3,
    };
    const result = calcVwc(vol, wat);
    const expectedResult = 0.075; // 40,000cc = 40 L, 3L / 40L = 0.075
    expect(result).to.equal(expectedResult);
  });

  // @@@@@@@@@@ FLOW RATE @@@@@@@@@

  it('cfSAcToLSHa', () => { 
    const val = 1;
    const expectedResult = 69.9727; // 69.9724518;
    const result = cfSAcToLSHa(val);
    expect(result).to.equal(expectedResult);  
  });

  it('lSHaToCfSAc', () => { 
    const val = 1;
    const expectedResult = 0.0143; // 0.0142913386;
    const result = lSHaToCfSAc(val);
    expect(result).to.equal(expectedResult);  
  });

  it('gpmToM3S', () => { 
    const val = 1;
    const expectedResult = 0.00006309; //0000630902
    const result = gpmToM3S(val);
    expect(result).to.equal(expectedResult); 
  });
  it('gpmToM3S 100', () => { 
    const val = 100;
    const expectedResult = 0.00630902; //0.00630902
    const result = gpmToM3S(val);
    expect(result).to.equal(expectedResult); 
  });
  it('m3SToGpm', () => { 
    const val = 1;
    const expectedResult = 15850.32;
    const result = m3SToGpm(val);
    expect(result).to.equal(expectedResult); 
  });

  it('gpmToLS', () => { 
    const val = 1;
    const expectedResult = 0.0631; // 00630932
    const result = gpmToLS(val);
    expect(result).to.equal(expectedResult); 
  });

  it('lSToGpm', () => { 
    const val = 1;
    const expectedResult = 15.8503;
    const result = lSToGpm(val);
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ FLOW RATE OVER FLOW LENGTH @@@@@@@@@

  it('gpmFtToM3SM', () => { 
    const val = 1;
    const expectedResult = 0.00020699; // 0.000206988833
    const result = gpmFtToM3SM(val);
    expect(result).to.equal(expectedResult); 
  });
  
  it('m3SMToGpmFt', () => { 
    const m3SM = 1;
    const expectedResult = 4831.1775; // 4831.17849
    const result = m3SMToGpmFt(m3SM);
    expect(result).to.equal(expectedResult); 
  });

  it('gpmFtToLSM', () => { 
    const val = 1;
    const expectedResult = 0.207; // 0.206988833
    const result = gpmFtToLSM(val);
    expect(result).to.equal(expectedResult); 
  });
  
  it('lSMToGpmFt', () => { 
    const val = 1;
    const expectedResult = 4.8312; // 4.83117849
    const result = lSMToGpmFt(val);
    expect(result).to.equal(expectedResult); 
  });

  it('lMinMToM3SM', () => { 
    const val = 60000;
    const expectedResult = 1;
    const result = lMinMToM3SM(val);
    expect(result).to.equal(expectedResult); 
  });

  it('m3SMToLMinM', () => { 
    const val = 1;
    const expectedResult = 60000;
    const result = m3SMToLMinM(val);
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ FLOW RATE, AREA @@@@@@@@@

  it('gpmToInchesHr', () => { 
    const gpm = 1; // 0.133681 cf = 1.604172 inches
    // 1.604172 inches per minute * 60 = 96.25032
    const sf = 1;
    const expectedResult = 96.25;
    const result = gpmToInchesHr(gpm, sf);
    expect(result).to.equal(expectedResult); 
  });
  
  it('inchesHrToGpm', () => { 
    const inchesHr = 1;
    const sf = 10;
    // 1 inch/hr = 0.623377 gal/hour
    // 0.623377 gal/hour = 0.01038962 gpm * 10SF = 0.1038962
    const expectedResult = 0.1039;
    const result = inchesHrToGpm(inchesHr, sf);
    expect(result).to.equal(expectedResult); 
  });
    
  it('lMinToMmHr', () => { 
    const l = 1;
    const m2 = 1;
    // 1 l/min = 60 l/h
    const expectedResult = 60;
    const result = lMinToMmHr(l, m2);
    expect(result).to.equal(expectedResult); 
  });
  it('lMinToMmHr 25m2', () => { 
    const l = 1;
    const m2 = 25;
    // 1 l/min = 60 l/h / 25m2 = 2.4
    const expectedResult = 2.4;
    const result = lMinToMmHr(l, m2);
    expect(result).to.equal(expectedResult); 
  });

  it('mmHrToLMin', () => { 
    const mmHr = 100;
    const m2 = 1;
    // 100 mm/h = 1.6667 mm/min 
    const expectedResult = 1.6667;
    const result = mmHrToLMin(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });
  it('mmHrToLMin 3m2', () => { 
    const mmHr = 100;
    const m2 = 3;
    // 100 mm/h = 1.6667 mm/min * 3 m2 = 5.0001 L/min
    const expectedResult = 5;
    const result = mmHrToLMin(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });
  
  it('lSToMmHr', () => { 
    const lS = 1;
    const m2 = 1;
    // 1 lS = 3600 l/h
    const expectedResult = 3600;
    const result = lSToMmHr(lS, m2);
    expect(result).to.equal(expectedResult); 
  });
  it('lSToMmHr 63', () => { 
    const lS = 63;
    const m2 = 7;
    // 63 lS = 226800 l/h / 7m2 = 32400
    const expectedResult = 32400;
    const result = lSToMmHr(lS, m2);
    expect(result).to.equal(expectedResult); 
  });
    
  it('mmHrToLS', () => { 
    const mmHr = 15;
    const m2 = 3;
    // 15 mmHr = 0.00416667 mm/s * 3 m2 = 0.0125
    const expectedResult = 0.0125;
    const result = mmHrToLS(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });

  it('gpmToMmHr', () => { 
    const gpm = 1;
    const sf = 10.7639; // 1 m2
    const expectedResult = 227.1243; // 227.125
    const result = gpmToMmHr(gpm, sf);
    expect(result).to.equal(expectedResult); 
  });
  it('gpmToMmHr 13', () => { 
    const gpm = 13;
    const sf = 10.7639; // 1 m2
    const expectedResult = 2952.623; // 2952.625
    const result = gpmToMmHr(gpm, sf);
    expect(result).to.equal(expectedResult); 
  });
  it('gpmToMmHr 17', () => { 
    const gpm = 1;
    const sf = 182.986; // 17 m2 = 182.986
    const expectedResult = 13.3604;
    const result = gpmToMmHr(gpm, sf);
    expect(result).to.equal(expectedResult); 
  });

  it('mmHrToGpm', () => { 
    const mmHr = 1;
    const m2 = 1;
    const expectedResult = 0.0044; // 0.00440287
    const result = mmHrToGpm(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });
  it('mmHrToGpm 11', () => { 
    const mmHr = 11;
    const m2 = 1;
    const expectedResult = 0.0484; // 0.0484315
    const result = mmHrToGpm(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });
  it('mmHrToGpm 7', () => { 
    const mmHr = 1;
    const m2 = 7;
    const expectedResult = 0.0308; // 0.0308201
    const result = mmHrToGpm(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });

  it('m3sToMmHr', () => { 
    const m3s = 1;
    const m2 = 1;
    // 1 m3s = 1,000 l
    // 1 hr = 3,600 s
    // 1000 * 3600
    const expectedResult = 3600000;
    const result = m3sToMmHr(m3s, m2);
    expect(result).to.equal(expectedResult); 
  });

  it('mmHrToM3S', () => { 
    const mmHr = 3600;
    const m2 = 1;
    // 1 mm over 1 m2 = 1 l
    // 3600 l / hr = 1 l/s
    // 1 l = 0.001 m3
    const expectedResult = 0.001;
    const result = mmHrToM3S(mmHr, m2);
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ MASS / WEIGHT @@@@@@@@@

  it('lbsToKg convert pounds to kilograms', () => {
    const expectedResult = 13.6078;
    const result = lbsToKg(30);
    expect(result).to.equal(expectedResult); 
  });
  it('lbsToKg returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = lbsToKg('input');
    expect(result).to.equal(expectedResult); 
  });

  it('kgToLbs converts kilograms to pounds', () => {
    const expectedResult = 88.1848;
    const result = kgToLbs(40);
    expect(result).to.equal(expectedResult); 
  });
  it('kgToLbs returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = kgToLbs('input');
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ DENSITY @@@@@@@@@

  it('lbsCfToKgM3', () => { 
    const val = 1;
    const expectedResult = 16.0185;
    const result = lbsCfToKgM3(val);
    expect(result).to.equal(expectedResult);
  });
      
  it('kgM3ToLbsCf', () => { 
    const val = 1;
    const expectedResult = 0.0624; // 0.062428
    const result = kgM3ToLbsCf(val);
    expect(result).to.equal(expectedResult); 
  });


  it('psfToKgM2', () => { 
    const val = 1;
    const expectedResult = 4.8824; // 4.88243
    const result = psfToKgM2(val);
    expect(result).to.equal(expectedResult);
  });
      
  it('kgM2ToPsf', () => { 
    const val = 1;
    const expectedResult = 0.2048; // 0.204816
    const result = kgM2ToPsf(val);
    expect(result).to.equal(expectedResult); 
  });

  it('psfToKM2 ', () => {
    const expectedResult = 58.5892;
    const result = psfToKM2(12);
    expect(result).to.equal(expectedResult); 
  });
  it('psfToKM2 returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = psfToKM2('input');
    expect(result).to.equal(expectedResult); 
  });

  it('kM2ToPsf ', () => {
    const expectedResult = 4.0963;
    const result = kM2ToPsf(20);
    expect(result).to.equal(expectedResult); 
  });
  it('kM2ToPsf returns error message if input is not a number', () => {
    const expectedResult = undefined;
    const result = kM2ToPsf('input');
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ TEMPERATURE @@@@@@@@@

  it('celsiusToKelvin', () => {
    const expectedResult = 273.15;
    const result = celsiusToKelvin(0);
    expect(result).to.equal(expectedResult);
  });

  it('kelvinToCelsius', () => {
    const expectedResult = 0;
    const result = kelvinToCelsius(273.15);
    expect(result).to.equal(expectedResult);
  });

  it('cToK', () => { 
  
  });
      
  it('kToC', () => { 
      
  });


  it('celsiusToF converts celsius to fahrenheit', () => {
    const expectedResult = 89.6;
    const result = celsiusToF(32);
    expect(result).to.equal(expectedResult); 
  });
  it('fToCelsius converts fahrenheit to celsious', () => {
    const expectedResult = 13.33;
    const result = precisionRound(fToCelsius(56),2);
    expect(result).to.equal(expectedResult); 
  });

  it('cToF', () => { 
  
  });
      
  it('fToC', () => { 
      
  });

  // @@@@@@@@@@@@@@ DEW POINT @@@@@@@@@@@@@@@

  it('getDewPointC computes dew point given ambient temperature and relative humidity', () => {
    const ambientTemp = 60;
    const rel_humidity = 30;
    const expectedResult = 13.33;
    const result = getDewPointC(ambientTemp,rel_humidity);
    expect(result).to.equal(expectedResult); 
  });
  it('getFrostPointC computes frost point in Celsius', () => {
    const ambientTemp = 60;
    const dewPoint = 0.25;
    const expectedResult = 13.33;
    const result = getDewPointC(ambientTemp,dewPoint);
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ SLOPE @@@@@@@@@

  it('pctToDeg 0', () => {
    const expectedResult = 0;
    const result = pctToDeg(0);
    expect(result).to.equal(expectedResult);
  });
  it('pctToDeg 50% = 45 deg default', () => {
    const expectedResult = 45;
    const result = pctToDeg(0.5); // 50%
    expect(result).to.equal(expectedResult);
  });
  it('pctToDeg 50% = 45 deg explicit 90 range', () => {
    const expectedResult = 45;
    const result = pctToDeg(0.5, 90); // 50%
    expect(result).to.equal(expectedResult);
  });
  it('pctToDeg 100% = 90 deg', () => {
    const expectedResult = 90;
    const result = pctToDeg(1.0); // 100%
    expect(result).to.equal(expectedResult);
  });

  it('degToPct 0', () => {
    const expectedResult = 0;
    const result = degToPct(0);
    expect(result).to.equal(expectedResult);
  });
  it('degToPct 45 deg = 50% default', () => {
    const expectedResult = 0.5;
    const result = degToPct(45); // 50%
    expect(result).to.equal(expectedResult);
  });
  it('degToPct 45 deg = 50% explicit 90 range', () => {
    const expectedResult = 0.5;
    const result = degToPct(45, 90); // 50%
    expect(result).to.equal(expectedResult);
  });
  it('degToPct 90 deg = 100%', () => {
    const expectedResult = 1;
    const result = degToPct(90); // 100%
    expect(result).to.equal(expectedResult);
  });

  // @@@@@@@@@@ ANGLES @@@@@@@@@

  it('degToRad 0', () => {
    const expectedResult = 0;
    const result = degToRad(0);
    expect(result).to.equal(expectedResult);
  });
  it('degToRad -90', () => {
    const expectedResult = -1.5707963268;
    const result = degToRad(-90);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);
  });
  it('degToRad 90', () => {
    const expectedResult = 1.5707963268;
    const result = degToRad(90);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);  
  });
  it('degToRad 360', () => {
    const expectedResult = 6.2831853072;
    const result = degToRad(360);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);
  });

  it('radToDeg', () => {
    const expectedResult = 0;
    const result = radToDeg(0);
    expect(result).to.equal(expectedResult);
  });
  it('radToDeg -90', () => {
    const expectedResult = -90;
    const result = radToDeg(-1.5707963268);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);
  });
  it('radToDeg 90', () => {
    const expectedResult = 90;
    const result = radToDeg(1.5707963268);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);  
  });
  it('radToDeg 360', () => {
    const expectedResult = 360;
    const result = radToDeg(6.2831853072);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.00000001); // this doesn't work at e-9
  });

  // @@@@@@@@@@ SPEED @@@@@@@@@

  it('msToKph, converts m/s to km/h (5 decimal points)', () => {
    const expectedResult = 18;
    const result = precisionRound(msToKph(5),5);
    expect(result).to.equal(expectedResult); 
  });

  it('kphToMs, converts km/h to m/s (5 decimal points)', () => {
    const expectedResult = 8.33334;
    const result = precisionRound(kphToMs(30),5);
    expect(result).to.equal(expectedResult); 
  });

  it('msToMph, converts m/s to miles per hour (5 decimal points)', () => {
    const expectedResult = 671.082;
    const result = precisionRound(msToMph(300),5);
    expect(result).to.equal(expectedResult); 
  });

  it('mphToKph, converts miles/hour to km/h (5 decimal points)', () => {
    const expectedResult = 4.34522;
    const result = precisionRound(mphToKph(2.7),5);
    expect(result).to.equal(expectedResult); 
  });

  it('kphToMph, converts miles/hour to km/h (5 decimal points)', () => {
    const expectedResult = 1.98839;
    const result = precisionRound(kphToMph(3.2),5);
    expect(result).to.equal(expectedResult); 
  });

  // @@@@@@@@@@ SOLAR IRRADIATION @@@@@@@@@

  it('solarKwM2DayToUvProxy (5 decimal points)', () => {
    const expectedResult = 6.75;
    const result = precisionRound(solarKwM2DayToUvProxy(4.5),5);
    expect(result).to.equal(expectedResult); 
  });


});