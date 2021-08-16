'use strict';

var _require = require('./basic'),
    isPrimitiveNumber = _require.isPrimitiveNumber;

var stringifySvg = function stringifySvg(input, doc) {
  var id = input.id,
      className = input.className;

  var index = isPrimitiveNumber(input.index) ? input.index : 0;
  var style = typeof input.style === 'string' ? input.style : '';
  var theSvg = id && doc && doc.getElementById ? document.getElementById(id) : className && doc && doc.getElementsByClassName ? document.getElementsByClassName(className)[index] : { outerHTML: '' };
  var raw = theSvg.outerHTML;
  var split = typeof raw === 'string' ? raw.split('</defs>') : [];
  var s = '<style>' + style + '</style></defs>';
  var withStyle = split.join(s);
  return withStyle;
};

module.exports = {
  stringifySvg: stringifySvg
};