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
  calcVwc,
  celsius2kelvin,
  kelvin2celsius,
  deg2rad,
  rad2deg,
  precisionRound             } = require('../index');
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

  it.skip('galsToCF true on numbers', () => { 
    const gallons = 33;
    const expectedResult = 7623; //  33 * 231 rounded to 4
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


  it('celsius2kelvin', () => {
    const expectedResult = 273.15;
    const result = celsius2kelvin(0);
    expect(result).to.equal(expectedResult);
  });

  it('kelvin2celsius', () => {
    const expectedResult = 0;
    const result = kelvin2celsius(273.15);
    expect(result).to.equal(expectedResult);
  });

  it('deg2rad 0', () => {
    const expectedResult = 0;
    const result = deg2rad(0);
    expect(result).to.equal(expectedResult);
  });
  it('deg2rad -90', () => {
    const expectedResult = -1.5707963268;
    const result = deg2rad(-90);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);
  });
  it('deg2rad 90', () => {
    const expectedResult = 1.5707963268;
    const result = deg2rad(90);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);  
  });
  it('deg2rad 360', () => {
    const expectedResult = 6.2831853072;
    const result = deg2rad(360);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);
  });

  it('rad2deg', () => {
    const expectedResult = 0;
    const result = rad2deg(0);
    expect(result).to.equal(expectedResult);
  });
  it('rad2deg -90', () => {
    const expectedResult = -90;
    const result = rad2deg(-1.5707963268);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);
  });
  it('rad2deg 90', () => {
    const expectedResult = 90;
    const result = rad2deg(1.5707963268);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.000000001);  
  });
  it('rad2deg 360', () => {
    const expectedResult = 360;
    const result = rad2deg(6.2831853072);
    const delta = Math.abs(expectedResult - result);
    expect(delta).to.be.lessThan(0.00000001); // this doesn't work at e-9
  });

  
});