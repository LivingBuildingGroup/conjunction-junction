'use strict';
const chai = require('chai');
const expect = chai.expect;
const { 
  isPrimitiveNumber, 
  isObjectLiteral,
  precisionRound,} = require('../index');
const {
  numbers, 
  nonNumbers, 
  nonObjects,
  nonNumberObjects, 
  nonNumberArrays, }   = require('./helper-data');

describe('conjunction-junction basic', () => { 

  it('isPrimitiveNumber false on no parameters', () => { 
    const num = isPrimitiveNumber();
    expect(num).to.equal(false);
  });
  it('isPrimitiveNumber false on nonNumbers', () => { 
    nonNumbers.forEach(item=>{
      const num = isPrimitiveNumber(item);
      expect(num).to.equal(false);
    });
  });
  it('isPrimitiveNumber false on nonNumberObjects', () => { 
    nonNumberObjects.forEach(item=>{
      const num = isPrimitiveNumber(item);
      expect(num).to.equal(false);
    });
  });
  it('isPrimitiveNumber false on nonNumberArrays', () => { 
    nonNumberArrays.forEach(item=>{
      const num = isPrimitiveNumber(item);
      expect(num).to.equal(false);
    });
  });
  it('isPrimitiveNumber true on number', () => { 
    numbers.forEach(number=>{
      const num = isPrimitiveNumber(number);
      expect(num).to.equal(true);
    });
  });

  it('isObjectLiteral false on no parameters', () => { 
    const object = isObjectLiteral();
    expect(object).to.equal(false);
  });
  it('isObjectLiteral false on nonObjects', () => { 
    nonObjects.forEach(item=>{
      const object = isObjectLiteral(item);
      expect(object).to.equal(false);
    });
  });
  it('isObjectLiteral true on object with no keys', () => { 
    const object = isObjectLiteral({});
    expect(object).to.equal(true);
  });
  it('isObjectLiteral true on object with keys', () => { 
    const object = isObjectLiteral({x:1});
    expect(object).to.equal(true);
  });

  it('precisionRound', () => { 
    const arrayOfNumbers = [
      1,3,5,2000,2021,103567,
      1.0345823,
      1.304623,
      1.304423,
      1.09,
      1.089,
    ];
    const expectedResults =[
      1,3,5,2000,2021,103567,
      1.0346,
      1.3046,
      1.3044,
      1.09,
      1.089
    ];
    arrayOfNumbers.forEach((num,i)=>{
      expect(precisionRound(num, 4)).to.equal(expectedResults[i]);
    });
  });
  it('precisionRound non-num', () => { 
    nonNumbers.forEach(num=>{
      expect(precisionRound(num, 4)).to.equal(0);
    });
  });
  it('precisionRound no precision', () => { 
    expect(precisionRound(1.03984, 'x')).to.equal(0);
  });

});