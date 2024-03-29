'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('./basic'),
    precisionRound = _require.precisionRound;

var componentToHex = function componentToHex(c) {
  var hex = c ? c.toString(16) : 0;
  return ('' + hex).length === 1 ? '0' + hex : hex;
};

var rgbToHex = function rgbToHex() {
  var r = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var g = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var b = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

var convertRgbToHsl = function convertRgbToHsl(rgb) {
  var r = rgb.r,
      g = rgb.g,
      b = rgb.b;
  // https://css-tricks.com/converting-color-spaces-in-javascript/

  // Make r, g, and b fractions of 1

  var rFraction = r / 255;
  var gFraction = g / 255;
  var bFraction = b / 255;

  // Find greatest and smallest channel values
  var cmin = Math.min(rFraction, gFraction, bFraction),
      cmax = Math.max(rFraction, gFraction, bFraction),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;

  // Calculate hue
  // No difference
  if (delta === 0) {
    h = 0;
  }
  // Red is max
  else if (cmax === rFraction) {
      h = (gFraction - bFraction) / delta % 6;
    }
    // Green is max
    else if (cmax === gFraction) {
        h = (bFraction - rFraction) / delta + 2;
      }
      // Blue is max
      else {
          h = (rFraction - gFraction) / delta + 4;
        }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) {
    h += 360;
  }

  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  var group = l < 20 && s < 30 ? { groupName: 'Blacks', groupOrder: 10 } : l < 20 && s < 50 ? { groupName: 'Browns', groupOrder: 9 } : h > 290 && s < 20 && l > 40 && l < 90 ? { groupName: 'Lavendars', groupOrder: 5.5 } : h > 235 && s < 30 && s > 15 && l > 40 && l < 90 ? { groupName: 'Lavendars', groupOrder: 5.5 } : h > 30 && h < 60 && s > 15 ? { groupName: 'Yellows', groupOrder: 2 } : h > 300 && s < 25 ? { groupName: 'Grays', groupOrder: 8 } : l > 80 ? { groupName: 'Whites', groupOrder: 1 } : s < 5 ? { groupName: 'Grays', groupOrder: 8 } : h < 35 && s < 50 ? { groupName: 'Browns', groupOrder: 9 } : s < 25 ? { groupName: 'Grays', groupOrder: 8 } : h < 30 ? { groupName: 'Reds', groupOrder: 7 } : h < 60 ? { groupName: 'Yellows', groupOrder: 2 } : h < 150 ? { groupName: 'Greens', groupOrder: 3 } : h < 210 ? { groupName: 'Cyans', groupOrder: 4 } : h < 240 && s < 50 ? { groupName: 'Magentas', groupOrder: 6 } : h < 270 ? { groupName: 'Blues', groupOrder: 5 } : h < 330 ? { groupName: 'Magentas', groupOrder: 6 } : { groupName: 'Reds', groupOrder: 7 };

  return Object.assign({}, group, {
    h: h,
    s: s,
    l: l
  });
};

var hexToRgb = function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var rgb = result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
  if (rgb) {
    rgb.luma = precisionRound(0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b, 2);
  }

  var hsl = rgb ? convertRgbToHsl(rgb) : {};
  /* final API {
    rgb,
    r, g, b,
    h, s, l,
    groupName,
    groupOrder
  } */
  return Object.assign({}, rgb, hsl, {
    rgb: rgb.r + ',' + rgb.g + ',' + rgb.b
  });
};

var createColorsFullObject = function createColorsFullObject(colors) {
  var colorsFull = {
    allSorted: [],
    arraysByGroup: {},
    groups: {}
  };
  for (var color in colors) {
    var rgb = typeof colors[color] === 'string' ? hexToRgb(colors[color].slice(1, 7)) : null;
    if (rgb) {
      if (!Array.isArray(colorsFull.arraysByGroup[rgb.groupName])) {
        colorsFull.arraysByGroup[rgb.groupName] = [];
      }
      if (!colorsFull.groups[rgb.groupName]) {
        colorsFull.groups[rgb.groupName] = rgb.groupOrder;
      }
      var rgbString = rgb.rgb;
      colorsFull.arraysByGroup[rgb.groupName].push(Object.assign({}, rgb, {
        hex: colors[color],
        rgbString: rgbString,
        variableName: color
      }));
    }
  }

  for (var group in colorsFull.arraysByGroup) {
    colorsFull.arraysByGroup[group].sort(function (a, b) {
      if (a.luma < b.luma) {
        return 1;
      }
      if (a.luma > b.luma) {
        return -1;
      }
      return 0;
    });
  }

  var allGroupsSorted = [];
  for (var groupName in colorsFull.groups) {
    allGroupsSorted.push({
      groupName: groupName,
      groupOrder: colorsFull.groups[groupName]
    });
  }
  allGroupsSorted.sort(function (a, b) {
    if (a.groupOrder > b.groupOrder) {
      return 1;
    }
    if (a.groupOrder < b.groupOrder) {
      return -1;
    }
    return 0;
  });

  allGroupsSorted.forEach(function (group) {
    var _colorsFull$allSorted;

    var groupName = group.groupName;
    (_colorsFull$allSorted = colorsFull.allSorted).push.apply(_colorsFull$allSorted, _toConsumableArray(colorsFull.arraysByGroup[groupName]));
  });

  return colorsFull;
};

module.exports = {
  rgbToHex: rgbToHex,
  hexToRgb: hexToRgb,
  createColorsFullObject: createColorsFullObject
};