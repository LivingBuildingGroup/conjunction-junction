'use strict';

const { isPrimitiveNumber } = require('./basic');

const stringifySvg = (input, doc) => {
  const {id, className} = input;
  const index = isPrimitiveNumber(input.index) ? input.index : 0;
  const style = typeof input.style === 'string' ? input.style : '' ; 
  const theSvg = id && doc && doc.getElementById ?
    document.getElementById(id) :
    className && doc && doc.getElementsByClassName ?
      document.getElementsByClassName(className)[index] :
      { outerHTML: '' };
  const raw = theSvg.outerHTML;
  const split = typeof raw === 'string' ?
    raw.split('</defs>') : [];
  const s = `<style>${style}</style></defs>`;
  const withStyle = split.join(s);
  return withStyle;
};

module.exports = {
  stringifySvg
};