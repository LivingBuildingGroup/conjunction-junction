'use strict';

const componentToHex = c => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const rgbToHex = (r, g, b) => {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  const final =  result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
  if(final){
    final.luma = 0.2126 * final.r + 0.7152 * final.g + 0.0722 * final.b;
  }
  return final;
};

module.exports = {
  rgbToHex,
  hexToRgb,
};