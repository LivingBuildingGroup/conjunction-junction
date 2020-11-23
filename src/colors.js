'use strict';

const componentToHex = c => {
  const hex = c.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
};

const rgbToHex = (r, g, b) => {
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
};

const convertRgbToHsl = rgb => {
  const {r,g,b} = rgb;
  // https://css-tricks.com/converting-color-spaces-in-javascript/

  // Make r, g, and b fractions of 1
  const rFraction = r / 255;
  const gFraction = g / 255;
  const bFraction = b / 255;

  // Find greatest and smallest channel values
  let cmin = Math.min(rFraction,gFraction,bFraction),
    cmax = Math.max(rFraction,gFraction,bFraction),
    delta = cmax - cmin,
    h = 0,
    s = 0,
    l = 0;

  // Calculate hue
  // No difference
  if (delta === 0){
    h = 0;
  }
  // Red is max
  else if (cmax === rFraction){
    h = ((gFraction - bFraction) / delta) % 6;
  }
  // Green is max
  else if (cmax === gFraction){
    h = (bFraction - rFraction) / delta + 2;
  }
  // Blue is max
  else {
    h = (rFraction - gFraction) / delta + 4;
  }

  h = Math.round(h * 60);
    
  // Make negative hues positive behind 360°
  if (h < 0){
    h += 360;
  }
	
  // Calculate lightness
  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  const group = 
	l < 0.2 ? { groupName: 'Blacks', groupOrder: 9 } :
	  l > 0.8 ?  { groupName: 'Whites', groupOrder: 1 } :
	    s < 0.25 ? { groupName: 'Grays', groupOrder: 8 } :
	      h < 30 ?   { groupName: 'Reds', groupOrder: 0 } :
	        h < 90 ?   { groupName: 'Yellows', groupOrder: 2 } :
	          h < 150 ?  { groupName: 'Greens', groupOrder: 3 } :
	            h < 210 ?  { groupName: 'Cyans', groupOrder: 4 } :
	              h < 270 ?  { groupName: 'Blues', groupOrder: 5 } :
	                h < 330 ?  { groupName: 'Magentas', groupOrder: 6 } :
	                  { groupName: 'Reds', groupOrder: 7 };

  return Object.assign({},
    group,
    { 
      h,
      s, 
      l
    }
  );
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
	
  const hsl = final ? convertRgbToHsl(final) : {};
  return Object.assign({},
    final,
    hsl
  );
};

module.exports = {
  rgbToHex,
  hexToRgb,
};