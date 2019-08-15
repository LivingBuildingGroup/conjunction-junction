'use strict';

const chai = require('chai');
const expect = chai.expect;

const { 
  ciToCf,
  galsToInches,
  galsToCi,
  galsToCf,
  galsToLbs,
  lbsToGals,
  lM2ToMm,
  mmToLM2,
  _convertToCf,
  calcVwc,
  celsiusToKelvin,
  kelvinToCelsius,
  pctToDeg,
  degToPct,
  degToRad,
  radToDeg,
  precisionRound,
  msToKph,
  kphToMs,
  msToMph,
  mphToKph,
  kphToMph,
  solarKwM2DayToUvProxy, 
  mmToInches,
  inchesToMm,
  feetToMeters,
  metersToFeet,
  ciToCc,
  ccToCi,
  ciToGals,
  kgToL,
  ccToL,
  lToCc,
  ccToCf,
  lToCf,
  ccToM3,
  m3ToCc,
  lbsToKg,
  kgToLbs,
  psfToKM2,
  kM2ToPsf,
  celsiusToF,
  fToCelsius,
  getDewPointC,
  getFrostPointC,
  calculateGradient,
  tempCorrection,
  gpmPerFtToTempCorrection,
  gpmToLiterPerMin,  
  literPerMinToGpm,
  gpmToCubicMetersPerMin,
  cubicMetersPerMinToGpm,
  acresToHectares,
  hectaresToAcres,
  galPerSecPerAcreToGalPerSecPerHectare,
  galPerSecPerHectareToGalPerSecPerAcre,
  acresToSqrFt,
  sqrFtToAcres,
  acreInchesToGals,
  galsToAcreInches,
  acreInchesToCubicMeters,
  cubicMetersToAcreInches,
  galPerSecPerAcreToLitersPerSecPerHectare,
  litersPerSecPerHectareToGalPerSecPerAcre,
  sqrFtToSqrMeters,
  sqrMetersToSqrFt,
  cubicFtToGals,
  galToCubicFt,
  litersToCubicFt,
  cubicFtToLiters,
  gpmToCubicFtPerSec,
  cubicFtPerSecToGpm,
  gpmToLiterPerSec,
  litersPerSecToGpm,
  cubicFtPerSecToLitersPerSec,
  litersPerSecToCubicFtPerSec,
  convertUnits,
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


describe('conjunction-junction conversions', () => { // mocha has built-in promise handling in before, after, beforeEach, afterEach, and it

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

  it('galsToCf true on numbers', () => { 
    const gallons = 33;
    const expectedResult = 4.4115; //  33 * 0.133681 rounded to 4
    const result = galsToCf(gallons);
    expect(result).to.equal(expectedResult);
  });

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
  it('lbsToGals true on arrays', () => { 
    const lbs = 83.4;
    const expectedResult = 10;
    const gals = lbsToGals(lbs);
    expect(gals).to.equal(expectedResult);
  });

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
  it('solarKwM2DayToUvProxy (5 decimal points)', () => {
    const expectedResult = 6.75;
    const result = precisionRound(solarKwM2DayToUvProxy(4.5),5);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInches, converts millimeters to inches (4 decimal points)', () => {
    const expectedResult = 0.8268;
    const result = precisionRound(mmToInches(21),4);
    expect(result).to.equal(expectedResult); 
  });
  it('mmToInches returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = mmToInches('input');
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMm converts inches to millimeters', () => {
    const expectedResult = 304.8;
    const result = inchesToMm(12);
    expect(result).to.equal(expectedResult); 
  });
  it('inchesToMm returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = inchesToMm('input');
    expect(result).to.equal(expectedResult); 
  });
  it('feetToMeters converts feet to meters', () => {
    const expectedResult = 6.096;
    const result = feetToMeters(20);
    expect(result).to.equal(expectedResult); 
  });
  it('feetToMeters returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = feetToMeters('input');
    expect(result).to.equal(expectedResult); 
  });
  it('metersToFeet converts meters to feet', () => {
    const expectedResult = 52.4934;
    const result = metersToFeet(16);
    expect(result).to.equal(expectedResult); 
  });
  it('metersToFeet returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = metersToFeet('input');
    expect(result).to.equal(expectedResult); 
  });
  it('ciToCc ', () => {
    const expectedResult = 376.9033;
    const result = ciToCc(23);
    expect(result).to.equal(expectedResult); 
  });
  it('ciToCc returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = ciToCc('input');
    expect(result).to.equal(expectedResult); 
  });
  it('ccToCi ', () => {
    const expectedResult = 0.6774;
    const result = ccToCi(11.1);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToCi returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = ccToCi('input');
    expect(result).to.equal(expectedResult); 
  });
  it('ciToGals ', () => {
    const expectedResult = 0.1429;
    const result = ciToGals(33);
    expect(result).to.equal(expectedResult); 
  });
  it('ciToGals returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = ciToGals('input');
    expect(result).to.equal(expectedResult); 
  });
  it('kgToL ', () => {
    const expectedResult = 102;
    const result = kgToL(102);
    expect(result).to.equal(expectedResult); 
  });
  it('kgToL returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = kgToL('input');
    expect(result).to.equal(expectedResult); 
  });
  it('ccToL ', () => {
    const expectedResult = 0.211;
    const result = ccToL(211);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToL returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = ccToL('input');
    expect(result).to.equal(expectedResult); 
  });
  it('lToCc ', () => {
    const expectedResult = 4000;
    const result = lToCc(4);
    expect(result).to.equal(expectedResult); 
  });
  it('lToCc returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = lToCc('input');
    expect(result).to.equal(expectedResult); 
  });
  it('ccToCf ', () => {
    const expectedResult = 0.0008;
    const result = ccToCf(23);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToCf returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = ccToCf('input');
    expect(result).to.equal(expectedResult); 
  });
  it('lToCf ', () => {
    const expectedResult = 0.8122;
    const result = lToCf(23);
    expect(result).to.equal(expectedResult); 
  });
  it('lToCf returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = lToCf('input');
    expect(result).to.equal(expectedResult); 
  });
  it('ccToM3 ', () => {
    const expectedResult = 0;
    const result = ccToM3(3);
    expect(result).to.equal(expectedResult); 
  });
  it('ccToM3 returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = ccToM3('input');
    expect(result).to.equal(expectedResult); 
  });
  it('m3ToCc ', () => {
    const expectedResult = 3000000000;
    const result = m3ToCc(3000);
    expect(result).to.equal(expectedResult); 
  });
  it('m3ToCc returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = m3ToCc('input');
    expect(result).to.equal(expectedResult); 
  });
  it('lbsToKg convert pounds to kilograms', () => {
    const expectedResult = 13.6078;
    const result = lbsToKg(30);
    expect(result).to.equal(expectedResult); 
  });
  it('lbsToKg returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = lbsToKg('input');
    expect(result).to.equal(expectedResult); 
  });
  it('kgToLbs converts kilograms to pounds', () => {
    const expectedResult = 88.1848;
    const result = kgToLbs(40);
    expect(result).to.equal(expectedResult); 
  });
  it('kgToLbs returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = kgToLbs('input');
    expect(result).to.equal(expectedResult); 
  });
  it('psfToKM2 ', () => {
    const expectedResult = 58.5892;
    const result = psfToKM2(12);
    expect(result).to.equal(expectedResult); 
  });
  it('psfToKM2 returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = psfToKM2('input');
    expect(result).to.equal(expectedResult); 
  });
  it('kM2ToPsf ', () => {
    const expectedResult = 4.9632;
    const result = kM2ToPsf(20);
    expect(result).to.equal(expectedResult); 
  });
  it('kM2ToPsf returns error message if input is not a number', () => {
    const expectedResult = 'Invalid input';
    const result = kM2ToPsf('input');
    expect(result).to.equal(expectedResult); 
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
  it('calculateGradient calculates gradient given height and length',()=>{
    const height = 1.2;
    const length = 12;
    const result = precisionRound(calculateGradient(height,length),4);
    const expectedResult = 0.1;
    expect(result).to.equal(expectedResult); 
  });
  it('tempCorrection receives temperature in Celsius and returns temperature correction',()=>{
    const temperature = 20;
    const result = precisionRound(tempCorrection(temperature),4);
    const expectedResult = 1.0001;
    expect(result).to.equal(expectedResult); 
  });
  it('gpmPerFtToTempCorrection calculates gallons per minute with flow rate, temperature correction, width and gpm per foot',()=>{
    const result = gpmPerFtToTempCorrection(0.98,1.00,1.00,0.98);
    const expectedResult = 0.98;
    expect(result).to.equal(expectedResult);
  });
  it('gpmPerFtToTempCorrection when flowRate input is less than 0',()=>{
    const result = gpmPerFtToTempCorrection(-1,1.00,1.00,0.80);
    const expectedResult = 0.80;
    expect(result).to.equal(expectedResult);
  });
  it('gpmToLiterPerMin converts gallons per minute to liters per minute',()=>{
    const result = precisionRound(gpmToLiterPerMin(12),4);
    const expectedResult = 45.4249;
    expect(result).to.equal(expectedResult);
  });
  it('gpmToLiterPerMin when input parameter is not a primitive number',()=>{
    const result = gpmToLiterPerMin('string');
    const expectedResult = null;
    expect(result).to.equal(expectedResult); 
  });
  it('literPerMinToGpm converts liters per minute to gallons per minute',()=>{
    const result = precisionRound(literPerMinToGpm(7),4);
    const expectedResult = 1.8492;
    expect(result).to.equal(expectedResult); 
  });
  it('literPerMinToGpm converts liters per minute to gallons per minute',()=>{
    const result = precisionRound(literPerMinToGpm(7),4);
    const expectedResult = 1.8492;
    expect(result).to.equal(expectedResult); 
  });
  it('gpmToCubicMetersPerMin converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(gpmToCubicMetersPerMin(8),4);
    const expectedResult = 0.0303;
    expect(result).to.equal(expectedResult); 
  });
  it('cubicMetersPerMinToGpm converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(cubicMetersPerMinToGpm(14),4);
    const expectedResult = 3698.4087;
    expect(result).to.equal(expectedResult); 
  });
  it('acresToHectares converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(acresToHectares(30),4);
    const expectedResult = 12.1406;
    expect(result).to.equal(expectedResult); 
  });
  it('hectaresToAcres converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(hectaresToAcres(15),4);
    const expectedResult = 37.0658;
    expect(result).to.equal(expectedResult); 
  });
  it('galPerSecPerHectareToGalPerSecPerAcre converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(galPerSecPerHectareToGalPerSecPerAcre(20),4);
    const expectedResult = 8.0937;
    expect(result).to.equal(expectedResult); 
  });
  it('galPerSecPerAcreToGalPerSecPerHectare converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(galPerSecPerAcreToGalPerSecPerHectare(14.5),4);
    const expectedResult = 35.8303;
    expect(result).to.equal(expectedResult); 
  });
  it('acresToSqrFt converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(acresToSqrFt(0.88),4);
    const expectedResult =38332.8;
    expect(result).to.equal(expectedResult); 
  });
  it('sqrFtToAcres converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(sqrFtToAcres(35.01),4);
    const expectedResult =0.0008;
    expect(result).to.equal(expectedResult); 
  });
  it('galsToAcreInches converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(galsToAcreInches(16.866),4);
    const expectedResult =0.0006;
    expect(result).to.equal(expectedResult); 
  });
  it('acreInchesToGals converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(acreInchesToGals(10.1),4);
    const expectedResult = 274258.2885;
    expect(result).to.equal(expectedResult); 
  });
  it('acreInchesToCubicMeters converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(acreInchesToCubicMeters(20.3),4);
    const expectedResult = 2086.6401;
    expect(result).to.equal(expectedResult); 
  });
  it('cubicMetersToAcreInches converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(cubicMetersToAcreInches(24.3),4);
    const expectedResult = 0.2364;
    expect(result).to.equal(expectedResult); 
  });
  it('litersPerSecPerHectareToGalPerSecPerAcre converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(litersPerSecPerHectareToGalPerSecPerAcre(4.04),4);
    const expectedResult = 0.4319;
    expect(result).to.equal(expectedResult); 
  });
  it('galPerSecPerAcreToLitersPerSecPerHectare converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(galPerSecPerAcreToLitersPerSecPerHectare(12),4);
    const expectedResult = 112.2475;
    expect(result).to.equal(expectedResult); 
  });
  it('sqrFtToSqrMeters converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(sqrFtToSqrMeters(9.6),4);
    const expectedResult = 0.8919;
    expect(result).to.equal(expectedResult); 
  });
  it('sqrMetersToSqrFt converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(sqrMetersToSqrFt(10.2),4);
    const expectedResult = 109.7919;
    expect(result).to.equal(expectedResult); 
  });
  it('cubicFtToGals converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(cubicFtToGals(20.6),4);
    const expectedResult = 154.0987;
    expect(result).to.equal(expectedResult); 
  });
  it('galToCubicFt converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(galToCubicFt(30.9),4);
    const expectedResult = 4.1307;
    expect(result).to.equal(expectedResult); 
  });
  it('cubicFtToLiters converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(cubicFtToLiters(4.8),4);
    const expectedResult = 135.9209;
    expect(result).to.equal(expectedResult); 
  });
  it('litersToCubicFt converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(litersToCubicFt(3.9),4);
    const expectedResult = 0.1377;
    expect(result).to.equal(expectedResult); 
  });
  it('gpmToCubicFtPerSec converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(gpmToCubicFtPerSec(30.1),4);
    const expectedResult = 0.0671;
    expect(result).to.equal(expectedResult); 
  });
  it('cubicFtPerSecToGpm converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(cubicFtPerSecToGpm(19.6),4);
    const expectedResult = 8797.0909;
    expect(result).to.equal(expectedResult); 
  });
  it('litersPerSecToGpm converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(litersPerSecToGpm(9),4);
    const expectedResult = 142.6529;
    expect(result).to.equal(expectedResult); 
  });
  it('gpmToLiterPerSec converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(gpmToLiterPerSec(6.6),4);
    const expectedResult = 0.4164;
    expect(result).to.equal(expectedResult); 
  });
  it('cubicFtPerSecToLitersPerSec converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(cubicFtPerSecToLitersPerSec(7.8),4);
    const expectedResult = 220.8714;
    expect(result).to.equal(expectedResult); 
  });
  it('litersPerSecToCubicFtPerSec converts gallons per minute to cubic meters per minute',()=>{
    const result = precisionRound(litersPerSecToCubicFtPerSec(9.0222),4);
    const expectedResult = 0.3186;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts ci to cf', () => { 
    const result = convertUnits('ci','cf',7623);
    const expectedResult = 4.4115;
    expect(result).to.equal(expectedResult);
  });
  // it('convertUnits converts gallons to inches',()=>{
  //   const result = precisionRound(convertUnits(),4);
  //   const expectedResult = 0.3186;
  //   expect(result).to.equal(expectedResult); 
  // });
  it('convertUnits converts gallons to ci',()=>{
    const result = precisionRound(convertUnits('gal','ci',33),4);
    const expectedResult = 7623;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts gallons to cf',()=>{
    const result = precisionRound(convertUnits('gal','cf',33),4);
    const expectedResult = 4.4115;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts gallons to pounds',()=>{
    const result = precisionRound(convertUnits('gal','lb',10),4);
    const expectedResult = 83.4;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts pounds to gallons',()=>{
    const result = precisionRound(convertUnits('lb','gal',83.4),4);
    const expectedResult = 10;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts celsius to kelvin',()=>{
    const result = precisionRound(convertUnits('c','kelvin',32),4);
    const expectedResult = 305.15;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts kelvin to celsius',()=>{
    const result = precisionRound(convertUnits('kelvin','c',273),4);
    const expectedResult = -0.15;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts pct to degrees',()=>{
    const result = precisionRound(convertUnits('pct','deg',0.5),4);
    const expectedResult = 45;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts degrees to pct',()=>{
    const result = precisionRound(convertUnits('deg','pct',45),4);
    const expectedResult = 0.5;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts radians to degrees',()=>{
    const result = precisionRound(convertUnits('rad','deg',2),4);
    const expectedResult = 114.5916;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts degrees to radians',()=>{
    const result = precisionRound(convertUnits('deg','rad',12),4);
    const expectedResult = 0.2094;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts m/s to kph',()=>{
    const result = precisionRound(convertUnits('ms','kph',10),4);
    const expectedResult = 36;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts kph to ms',()=>{
    const result = precisionRound(convertUnits('kph','ms',36),4);
    const expectedResult = 10;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts mph to ms',()=>{
    const result = precisionRound(convertUnits('mph','ms',20),4);
    const expectedResult = 8.9408;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts ms to mph',()=>{
    const result = precisionRound(convertUnits('ms','mph',12),4);
    const expectedResult = 26.8433;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts mph to kph',()=>{
    const result = precisionRound(convertUnits('mph','kph',51),4);
    const expectedResult = 82.0763;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts kph to mph',()=>{
    const result = precisionRound(convertUnits('kph','mph',150),4);
    const expectedResult = 93.2057;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts mm to inches',()=>{
    const result = precisionRound(convertUnits('mm','inch',762),4);
    const expectedResult = 30;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts inches to mm',()=>{
    const result = precisionRound(convertUnits('inch','mm',30),4);
    const expectedResult = 762;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts feet to meters',()=>{
    const result = precisionRound(convertUnits('foot','meter',99.0814),4);
    const expectedResult = 30.2;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts meters to feet',()=>{
    const result = precisionRound(convertUnits('meter','foot',30.2),4);
    const expectedResult = 99.0814;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts cc to ci',()=>{
    const result = precisionRound(convertUnits('cc','ci',20),4);
    const expectedResult = 1.2205;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts ci to cc',()=>{
    const result = precisionRound(convertUnits('ci','cc',1.2204),4);
    const expectedResult = 19.9988;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts ci to gallons',()=>{
    const result = precisionRound(convertUnits('ci','gal',200),4);
    const expectedResult = 0.8658;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts kilograms to liters',()=>{
    const result = precisionRound(convertUnits('kg','l',20),4);
    const expectedResult = 20;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts cc to liters',()=>{
    const result = precisionRound(convertUnits('cc','l',300),4);
    const expectedResult = 0.3;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts liters to cc',()=>{
    const result = precisionRound(convertUnits('l','cc',0.3),4);
    const expectedResult = 300;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts cc to cf',()=>{
    const result = precisionRound(convertUnits('cc','cf',200),4);
    const expectedResult = 0.0071;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts l to cf',()=>{
    const result = precisionRound(convertUnits('l','cf',240),4);
    const expectedResult = 8.4755;
    expect(result).to.equal(expectedResult); 
  });
  it('convertUnits converts cc to m3',()=>{
    const result = precisionRound(convertUnits('cc','m3',7000),4);
    const expectedResult = 0.007;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts m3 to cc',()=>{
    const result = precisionRound(convertUnits('m3','cc',0.007),4);
    const expectedResult = 7000;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts pounds to kilograms',()=>{
    const result = precisionRound(convertUnits('lb','kg',30.4),4);
    const expectedResult = 13.7892;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts kilograms to pounds',()=>{
    const result = precisionRound(convertUnits('kg','lb',20),4);
    const expectedResult = 44.0924;
    expect(result).to.equal(expectedResult);
  });
  // it('convertUnits converts psf to kM2',()=>{
  //   const result = precisionRound(convertUnits('psf','kM2',20),4);
  //   const expectedResult = 44.0924;
  //   expect(result).to.equal(expectedResult);
  // });
  // it('convertUnits converts kM2 to psf',()=>{
  //   const result = precisionRound(convertUnits('kM2','psf',20),4);
  //   const expectedResult = 44.0924;
  //   expect(result).to.equal(expectedResult);
  // });
  it('convertUnits converts celsius to fahrenheit',()=>{
    const result = precisionRound(convertUnits('c','f',0),4);
    const expectedResult = 32;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts fahrenheit to celsius',()=>{
    const result = precisionRound(convertUnits('f','c',32),4);
    const expectedResult = 0;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gpm to lpm',()=>{
    const result = precisionRound(convertUnits('gpm','lpm',7.9252),4);
    const expectedResult = 30.0001;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts lpm to gpm',()=>{
    const result = precisionRound(convertUnits('lpm','gpm',30),4);
    const expectedResult = 7.9252;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gpm to cubic meters per minute',()=>{
    const result = precisionRound(convertUnits('gpm','m3min',6604.3013),4);
    const expectedResult = 25;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts cubic meters per minute to gpm',()=>{
    const result = precisionRound(convertUnits('m3min','gpm',25),4);
    const expectedResult = 6604.3013;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts acres to hectares',()=>{
    const result = precisionRound(convertUnits('acre','ha',74.1316),4);
    const expectedResult = 30;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts hectares to acres',()=>{
    const result = precisionRound(convertUnits('ha','acre',30),4);
    const expectedResult = 74.1315;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts hectares to acres',()=>{
    const result = precisionRound(convertUnits('ha','acre',30),4);
    const expectedResult = 74.1315;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gallons per second per acre to gallons per second her hectare',()=>{
    const result = precisionRound(convertUnits('gpsacre','gpsha',15),4);
    const expectedResult = 37.0658;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gallons per second her hectare to gallons per second per acre',()=>{
    const result = precisionRound(convertUnits('gpsha','gpsacre',37.0658),4);
    const expectedResult = 15;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts acres to square feet',()=>{
    const result = precisionRound(convertUnits('acre','sf',15),4);
    const expectedResult = 653400;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts square feet to acres',()=>{
    const result = precisionRound(convertUnits('sf','acre',200),4);
    const expectedResult = 0.0046;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts acreInches to gallons',()=>{
    const result = precisionRound(convertUnits('acreInch','gal',14),4);
    const expectedResult = 380160.0039;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gallons to acreInches',()=>{
    const result = precisionRound(convertUnits('gal','acreInch',20),4);
    const expectedResult = 0.0007;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts acre inches to m3',()=>{
    const result = precisionRound(convertUnits('acreInch','m3',30),4);
    const expectedResult = 3083.7046;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts cubic meters to acreInches',()=>{
    const result = precisionRound(convertUnits('m3','acreInch',20),4);
    const expectedResult = 0.1946;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gallons per second per acre to liters per second per hectare',()=>{
    const result = precisionRound(convertUnits('gpsacre','literPerSecPerHa',9),4);
    const expectedResult = 84.1856;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts liters per second per hectare to gallons per second per acre',()=>{
    const result = precisionRound(convertUnits('literPerSecPerHa','gpsacre',8),4);
    const expectedResult = 0.8553;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts square feet to square meters',()=>{
    const result = precisionRound(convertUnits('sf','m2',20),4);
    const expectedResult = 1.8581;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts square meters to square feet',()=>{
    const result = precisionRound(convertUnits('m2','sf',2),4);
    const expectedResult = 21.5278;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts cubic feet to gallons',()=>{
    const result = precisionRound(convertUnits('ft3','gal',4),4);
    const expectedResult = 29.9221;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gallons to cubic feet',()=>{
    const result = precisionRound(convertUnits('gal','ft3',20),4);
    const expectedResult = 2.6736;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts liters to cubic feet',()=>{
    const result = precisionRound(convertUnits('liter','ft3',25),4);
    const expectedResult = 0.8829;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts cubic feet to liters',()=>{
    const result = precisionRound(convertUnits('ft3','liter',2),4);
    const expectedResult = 56.6337;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gpm to cubic feet per second',()=>{
    const result = precisionRound(convertUnits('gpm','ft3sec',20),4);
    const expectedResult = 0.0446;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts cubic feet per second to gpm',()=>{
    const result = precisionRound(convertUnits('ft3sec','gpm',0.0446),4);
    const expectedResult = 20.0179;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts liters per second to gpm',()=>{
    const result = precisionRound(convertUnits('litersec','gpm',2),4);
    const expectedResult = 31.7006;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts gpm to liters per second',()=>{
    const result = precisionRound(convertUnits('gpm','litersec',3),4);
    const expectedResult = 0.1893;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts cubic feet per second to liters per second',()=>{
    const result = precisionRound(convertUnits('ft3sec','litersec',3),4);
    const expectedResult = 84.9505;
    expect(result).to.equal(expectedResult);
  });
  it('convertUnits converts liters per second to cubic feet per second',()=>{
    const result = precisionRound(convertUnits('litersec','ft3sec',10),4);
    const expectedResult = 0.3531;
    expect(result).to.equal(expectedResult);
  });


});