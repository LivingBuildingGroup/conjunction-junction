'use strict';

const { precisionRound } = require('./basic');

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
	  l < 20 && s < 30 ? { groupName: 'Blacks', groupOrder: 10 } :
	    l < 20 && s < 50 ? { groupName: 'Browns', groupOrder: 9 } :
	      h > 290 && s < 20 && l > 40 && l < 90 ?  { groupName: 'Lavendars', groupOrder: 5.5 } :
	        h > 235 && s < 30 && s > 15 && l > 40 && l < 90 ?  { groupName: 'Lavendars', groupOrder: 5.5 } :
	          h > 30 && h < 60 && s > 15 ? { groupName: 'Yellows', groupOrder: 2 } :
	            h > 300 && s < 25 ? { groupName: 'Grays', groupOrder: 8 } :
	              l > 80 ?  { groupName: 'Whites', groupOrder: 1 } :
	                s < 5 ? { groupName: 'Grays', groupOrder: 8 } :
	                  h < 35 && s < 50 ? { groupName: 'Browns', groupOrder: 9 } :
	                    s < 25 ? { groupName: 'Grays', groupOrder: 8 } :
	                      h < 30 ?   { groupName: 'Reds', groupOrder: 7 } :
	                        h < 60 ?   { groupName: 'Yellows', groupOrder: 2 } :
	                          h < 150 ?  { groupName: 'Greens', groupOrder: 3 } :
	                            h < 210 ?  { groupName: 'Cyans', groupOrder: 4 } :
	                              h < 240 && s < 50 ?  { groupName: 'Magentas', groupOrder: 6 } :
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
    final.luma = precisionRound(0.2126 * final.r + 0.7152 * final.g + 0.0722 * final.b, 2);
  }
	
  const hsl = final ? convertRgbToHsl(final) : {};
  return Object.assign({},
    final,
    hsl
  );
};

const createColorsFullObject = colors => {
  const colorsFull = {
    allSorted: [],
    arraysByGroup: {},
    groups: {},
  };
  for(let color in colors){
    const rgb = hexToRgb(colors[color].slice(1,7));
    if(rgb){
      if(!Array.isArray(colorsFull.arraysByGroup[rgb.groupName])){
        colorsFull.arraysByGroup[rgb.groupName] = [];
      }
      if(!colorsFull.groups[rgb.groupName]){
        colorsFull.groups[rgb.groupName] = rgb.groupOrder;
      }
      const rgbString = `rgb(${rgb.r},${rgb.g},${rgb.b})`;
      colorsFull.arraysByGroup[rgb.groupName].push(Object.assign({},
        rgb,
        {
          hex: colors[color],
          rgbString,
          variableName: color,
        }
      ));
    }
  }
  
  for(let group in colorsFull.arraysByGroup){
    colorsFull.arraysByGroup[group].sort((a,b)=>{
      if(a.luma < b.luma){
        return 1;
      }
      if(a.luma > b.luma){
        return -1;
      }
      return 0;
    });
  }
  
  const allGroupsSorted = [];
  for(let groupName in colorsFull.groups){
    allGroupsSorted.push({
      groupName, 
      groupOrder: colorsFull.groups[groupName]
    });
  }
  allGroupsSorted.sort((a,b)=>{
    if(a.groupOrder > b.groupOrder){
      return 1;
    }
    if(a.groupOrder < b.groupOrder){
      return -1;
    }
    return 0;
  });
  
  allGroupsSorted.forEach(group=>{
    const groupName = group.groupName;
    colorsFull.allSorted.push(...colorsFull.arraysByGroup[groupName]);
  });

  return colorsFull;
};

module.exports = {
  rgbToHex,
  hexToRgb,
  createColorsFullObject,
};