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
  solarKwM2DayToUvProxy,             } = require('../index');
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
      qty: 40000,
    };
    const wat = {
      units: 'L',
      qty: 0.6,
    };
    const result = calcVwc(vol, wat);
    const expectedResult = 0.015; // 40,000cc = 40 L, 0.6L / 40L = 0.015
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

  
});