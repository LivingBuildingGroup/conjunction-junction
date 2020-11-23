'use strict';

var componentToHex = function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? '0' + hex : hex;
};

var rgbToHex = function rgbToHex(r, g, b) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var hexToRgb = function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var final = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
  if (final) {
    final.luma = 0.2126 * final.r + 0.7152 * final.g + 0.0722 * final.b;
  }
  return final;
};

module.exports = {
  rgbToHex: rgbToHex,
  hexToRgb: hexToRgb
};