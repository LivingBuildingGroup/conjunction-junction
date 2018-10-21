/* Standard library of date and time helper functions
 * No project-specific functions
 */

'use strict';
const { isPrimitiveNumber, 
  precisionRound, 
  isObjectLiteral } = require('./basic');

// @@@@@@@@@@@@@@ VALIDATION @@@@@@@@@@@@

const isValidDate = date => {
  return date instanceof Date && isFinite(date);
};

// @@@@@@@@@@@@@ GET DATA FROM TS @@@@@@@@@@@@

const calcDayOfYearFromTimestamp = timestamp => {
  const ts = isValidDate(timestamp) ?
    timestamp :
    isValidDate(convertStringToTimestamp(timestamp)) ?
      convertStringToTimestamp(timestamp) :
      null;
  if(!ts){
    return -1;
  }
  const tsYear = ts.getFullYear();
  const jan1 = new Date(tsYear,0,0,0,0,0); // Dec 31 at midnight = Jan 1 0:00:00
  const daysAfterJan1 = dateDelta(jan1, ts, 'days');
  return daysAfterJan1;
};

const getTheTimezoneOffset = date => {
  // input: optional date parameter; no parameter = current date
  // returns user's current timezone offset from UTC/Zulu time
  const theDate = date instanceof Date ? date : new Date();
  // getCurrentTimezoneOffset reverses the sign, so we flip it back
  const offset = theDate.getTimezoneOffset();
  return -offset;
};

const isDaylightSavings = offset => {
  // input: currentOffset with CORRECT sign, i.e. US will have a negative sign
  // returns true if USER is in daylight savings time, else false
  // all calcs are in MINUTES
  const currentOffset = !isNaN(offset) ? offset : getTheTimezoneOffset();
  const today = new Date();
  const thisYear = today.getFullYear();
  const jan = new Date(thisYear, 0, 1);
  const jul = new Date(thisYear, 6, 1);
  // getTimezoneOffset reverses the sign, so we flip it back
  const janOffset = -jan.getTimezoneOffset();
  const julOffset = -jul.getTimezoneOffset();
  
  const hemisphere = janOffset < julOffset ? 'north' : 'south' ;

  const isDST = 
    janOffset === julOffset ? false : // DST must not be observed
      (hemisphere === 'north' && currentOffset === julOffset) ? true :
        (hemisphere === 'south' && currentOffset === janOffset) ? true :
          false ; // either non-applicable offset passed, or it is not DST
  return isDST;
};

const getDaysOfMonth = month => {
  let monthDays;
  switch (month) {
  case 'Feb':
    monthDays = 28;
    break;
  case 'Apr':
  case 'Jun':
  case 'Sep':
  case 'Nov':
    monthDays = 30;
    break;
  default:
    monthDays = 31;
  } 
  return monthDays;
};

const getNameOfMonth = monthAsNumber => {
  // improve by accepting options (string format, 1 index or 0 index), type checking, etc.
  // leave original as default
  if(monthAsNumber ===  1) return 'Jan';
  if(monthAsNumber ===  2) return 'Feb';
  if(monthAsNumber ===  3) return 'Mar';
  if(monthAsNumber ===  4) return 'Apr';
  if(monthAsNumber ===  5) return 'May';
  if(monthAsNumber ===  6) return 'Jun';
  if(monthAsNumber ===  7) return 'Jul';
  if(monthAsNumber ===  8) return 'Aug';
  if(monthAsNumber ===  9) return 'Sep';
  if(monthAsNumber === 10) return 'Oct';
  if(monthAsNumber === 11) return 'Nov';
  if(monthAsNumber === 12) return 'Dec';
};

// @@@@@@@@@@@@@ STRING HELPERS @@@@@@@@@@@@

const formatOffsetAsString = (offsetMins, useColon=true) => {
  // input: signed integer of minutes of timezone offset
  // US is negative (behind Zulu time)
  // How used?  Helper function to convertTimestampToString()
  if(isNaN(offsetMins)) return '';
  const offsetSign = offsetMins >= 0 ? '+' : '-' ;
  const offsetHours = offsetSign === '-' ? 
    Math.abs(Math.ceil( offsetMins/60)) :
    Math.abs(Math.floor(offsetMins/60)) ;
  const offsetHours0 = leadingZero(offsetHours) ;
  const offsetMinsRemaining = Math.abs(offsetMins%60);
  const offsetMinsRemaining0 = leadingZero(offsetMinsRemaining) ;
  const colon = useColon ? ':' : '' ;
  const offsetFormatted = `${offsetSign}${offsetHours0}${colon}${offsetMinsRemaining0}`;
  return offsetFormatted;
};

const leadingZero = (intOrString, length=2) => {
  // helper function when converting to strings
  // input: integer or string and a length of digits
  // output: string with leading zeros
  let theString =
    typeof intOrString === 'string' ? intOrString :
      !isNaN(intOrString) ? String(intOrString) :
        '' ;
  if(theString.length < length) {
    const delta = length - theString.length;
    let leadingZeros = '';
    for (let i=0; i<delta ; i++) {
      leadingZeros += '0';
    }
    return `${leadingZeros}${theString}`;
  }
  return theString;
};

const removeSpacesFromString = string => {
  if(typeof string !== 'string') return '';
  const trim  = string.trim();
  const dash  = trim.replace(' -','-');
  const plus  = dash.replace(  ' +','+');
  const z     = plus.replace(  ' Z','Z');
  const t     =    z.replace( ' ' ,'T');
  return t;
};

// @@@@@@@@@@ STRING/OBJECT CONVERTERS @@@@@@@@@

const parseTimestampString = string => {
  const stringWithT = string.includes('T') ? string : string.replace(' ', 'T');
  const dateTimeArray = stringWithT.split('T');
  const dateArray = dateTimeArray[0].split('-');
  const dateArrayIntegers = dateArray.map(date=>parseInt(date,10));
  // READ WHAT TYPE OF SUFFIX IS ON THE END: 2 TYPES: MS AND ZONE
  const splitters = ['.', '-', '+', 'Z'];
  const splitEnd = splitters.map(item=>{
    if(typeof dateTimeArray[1] !== 'string') {
      if(item === 'Z') {
        return 'not zulu';
      } else {
        return item;
      }
    } else if( dateTimeArray[1].includes(item)) {
      const split = dateTimeArray[1].split(item);
      if(item === '+' || item === '-') {
        const zoneArr = split[1].split(':');
        const hrs = parseInt(zoneArr[0], 10);
        const hrsAdj = hrs > 24 ? Math.floor(hrs/100) : hrs;
        const hrsRemainder = hrs > 24 ? precisionRound((hrs - hrsAdj * 100)/60,2) : 0 ;
        const mins = zoneArr[1] ? parseInt(zoneArr[1], 10) : 0 ;
        const minsDecimal = hrs > 24 ? hrsRemainder : precisionRound(mins/60, 2);
        return hrsAdj + minsDecimal;
      } else if(item !== 'Z') {
        return parseInt(split[1], 10);
      } else {
        return 'zulu';
      }
    } else {
      if(item === 'Z') {
        return 'not zulu';
      } else {
        return item;
      }
    }
  });
  const timeSplitString = typeof dateTimeArray[1] !== 'string' ?
    [''] :
    dateTimeArray[1].split(':');

  let ms = 0;
  const timeSplit = timeSplitString.map((s,i)=>{
    if(i<=1){ // hours, minutes
      return parseInt(s, 10);
    } else if (i === 2) { // seconds
      const split1 = s.split('+');
      const split2 = 
      split1[0].split('-');
      const seconds = split2[0];
      const secondsSplit = seconds.split('.');
      ms = secondsSplit[1] ? parseInt(secondsSplit[1],10) : 0 ;
      return parseInt(secondsSplit[0],10);
    } else {
      return null;
    }
  });

  const offset = 
    splitEnd[1] !== splitters[1] ? -splitEnd[1] :
      splitEnd[2] !== splitters[2] ?  splitEnd[2] :
        splitEnd[3] === 'zulu'       ?  0 :
          0 ;

  return {
    dateTimeArray,
    dateArray,
    dateArrayIntegers,
    splitEnd,
    splitters,
    timeSplit,
    ms,
    offset,
  };
};

const convertStringToTimestamp = rawString => {
  if(rawString instanceof Date) return rawString;
  // input: string in ISO 8601 format; 
  // if the offset is not included in the string, zulu time is assumed
  // output: Date object in specified ZULU time zone
  if (typeof rawString === 'string') {
    const noSpace = removeSpacesFromString(rawString);
    const {
      dateArrayIntegers,
      timeSplit,
      ms,
      offset
    } = parseTimestampString(noSpace);

    const timestamp = new Date(
      dateArrayIntegers[0],
      dateArrayIntegers[1] - 1, // months are 0-index in date objects
      dateArrayIntegers[2],
      timeSplit[0],
      timeSplit[1],
      timeSplit[2],
      ms
    );

    const milliSecondsPerMinute = 60 * 1000 ;
    const offsetParamMins = offset * 60;
    // get the user's current time zone offset, which was used by default above.
    const offsetCurrent = getTheTimezoneOffset(timestamp);
    // determine how much to correct zulu time
    const offsetDelta = offsetParamMins - offsetCurrent;
    // correct zulu time
    const timestampAdj = new Date(timestamp - (offsetDelta * milliSecondsPerMinute));
    if(isValidDate(timestampAdj)) return timestampAdj;
    return {};
  }
  return {} ;
};

const _convertTimestampToStringInner = (ts, option) => {
  const f = 
    typeof option === 'string' ?
      option :
      !isObjectLiteral(option) ? 
        'print' :
        option.format ?
          option.format : 
          'print' ;
  const o = isObjectLiteral(option) ? option : {} ;
  const dateOptions = Object.assign({},
    {
      weekday: 'long', 
      year:    'numeric', 
      month:   'long', 
      day:     'numeric', 
      hour:    'numeric', 
      minute:  'numeric',
      timeZone,
    },
    o 
  );
  const offset          = getTheTimezoneOffset(ts); // returns signed minutes
  const offsetFormatted = formatOffsetAsString(offset); // pass in signed min, returns signed string
  const offsetFormattedNoColon = formatOffsetAsString(offset, false); // pass in signed minutes, returns signed string
  const timeZone =
    offset === -240 ? 'America/New_York' :
      offset === -300 ? 'America/New_York' :
        'UTC' ;
  const dows       = ['Su','M','Tu','W','Th','F','Sa'];
  const y          = ts.getFullYear();
  const m          = ts.getMonth() + 1; // months are 0-index in date objects, but not in string
  const m0         = leadingZero(m);
  const d          = ts.getDate();
  const dow        = ts.getDay();
  const d0         = leadingZero(d);
  const timeSymbol = 'T';
  const h          = ts.getHours();
  const h0         = leadingZero(h);
  const min        = ts.getMinutes();
  const min0       = leadingZero(min);
  const seconds    = ts.getSeconds();
  const seconds0   = leadingZero(seconds);
  const hour  = 
    h === 0  && min === 0 ? 
      'midnight' :
      h === 12 && min === 0 ? 
        'noon' :
        o.hour === 24 ? 
          h :
          h > 12 ? 
            h - 12 : 
            h ;
  const meridien = 
    typeof hour === 'string' ? // midnight or noon
    '' :
      o.hour === 24 ? 
        '' :
        h >= 12 ? 'PM' : 
          'AM' ;
  if(f === 'date')        return `${y}-${m0}-${d0}`;
  if(f === 'yyyy-mm-dd')  return `${y}-${m0}-${d0}`;
  if(f === 'd t noz')     return `${y}-${m0}-${d0} ${h0}:${min0}:${seconds0}`;
  if(f === 'd t z')       return `${y}-${m0}-${d0} ${h0}:${min0}:${seconds0} ${offsetFormattedNoColon}`;
  if(f === 'numeric')     return `${y}${m0}${d0}${h0}${min0}${seconds0}`;
  if(f === 'time')        return `${h0}:${min0}:${seconds0}`;
  if(f === 'm d')         return `${m}/${d}`;
  if(f === 'm d h')       return `${m}/${d} ${hour}${meridien}`;
  if(f === 'm d h m')     return `${m}/${d} ${hour}:${min}${meridien}`;
  if(f === 'dow m d')     return `${dows[dow]} ${m}/${d}`;
  if(f === 'dow d h')     return `${dows[dow]} ${d} ${hour}${meridien}`;
  if(f === 'dow d h m')   return `${dows[dow]} ${d} ${hour}:${min}${meridien}`;
  if(f === 'dow d h')     return `${dows[dow]} ${d} ${hour}${meridien}`;
  if(f === 'dow h')       return `${dows[dow]} ${hour}${meridien}`;
  if(f === 'full')        return `${y}-${m0}-${d0}${timeSymbol}${h0}:${min0}:${seconds0}${offsetFormatted}`;
  // this is if f === 'print', which is also default
  if (ts instanceof Date) return ts.toLocaleDateString('en',dateOptions);
  return '';
};

const convertTimestampToString = (timestamp, option) => {
  // input: JS Date object (i.e. timestamp) (correctly formatted, i.e. time zone is local, and time is time in local time zone)
  // output: string in TIMESTAMP WITH TIME ZONE format (zone relative to Zulu)
  // sample output: '2017-12-21T16:26:48-05:00'
  // WHY USE?  Be in full control of the string. Don't send timestamps to the database, and let the database decide how to convert. Convert here, and avoid time zone conversion problems.
  // option is optional. 'date' = date, 'time' = time; anything else = full timestamp.
  
  if (isValidDate(timestamp)) {
    return _convertTimestampToStringInner(timestamp, option);
  } else if(typeof timestamp === 'string') {
    const date = convertStringToTimestamp(timestamp);
    if(isValidDate(date)){
      return _convertTimestampToStringInner(date, option);
    } else {
      return '';
    }
  }
  return '' ;
};

const printDate = (date, options) => {
  console.warn('printDate IS DEPRECATED, USE convertTimestampToString');
  const offset = getTheTimezoneOffset();
  const timeZone =
    offset === -240 ? 'America/New_York' :
      offset === -300 ? 'America/New_York' :
        'UTC' ;
  if(isObjectLiteral(options)){
    if(options.hasOwnProperty('format')){
      return createTimestampLabel(date, options);
    }
  }
  const dateOptions = isObjectLiteral(options) ? options :
    {
      weekday: 'long', 
      year:    'numeric', 
      month:   'long', 
      day:     'numeric', 
      hour:    'numeric', 
      minute:  'numeric',
      timeZone,
    };
  // input: timestamp or date; we should be handling all in Zulu time, so assume that.  Not tested with other time.
  // output: string to display timestamp to user; NOT formatting for data handling.
  if (date instanceof Date) {
    return date.toLocaleDateString('en',dateOptions);
  }
  return '';
};

const createTimestampLabel = (ts, option={format: 'm d h'}) => {
  console.warn('createTimestampLabel IS DEPRECATED, USE convertTimestampToString');
  const o = isObjectLiteral(option) ? option : {} ;
  const dows = ['Su','M','Tu','W','Th','F','Sa'];
  if(isValidDate(ts)){
    const year  = ts.getFullYear();
    const month = ts.getMonth() + 1;
    const day   = ts.getDate();
    const dow   = ts.getDay();
    const h     = ts.getHours();
    const min   = ts.getMinutes();
    const hour  = 
      h === 0  && min === 0 ? 
        'midnight' :
        h === 12 && min === 0 ? 
          'noon' :
          o.hour === 24 ? 
            h :
            h > 12 ? 
              h - 12 : 
              h ;
    const meridien = 
      typeof hour === 'string' ? // midnight or noon
      '' :
        o.hour === 24 ? 
          '' :
          h >= 12 ? 'PM' : 
            'AM' ;
    if (o.format === 'm d')        return `${month}/${day}`;
    if (o.format === 'm d h')      return `${month}/${day} ${hour}${meridien}`;
    if (o.format === 'm d h m')    return `${month}/${day} ${hour}:${min}${meridien}`;
    if (o.format === 'dow m d')    return `${dows[dow]} ${month}/${day}`;
    if (o.format === 'dow d h')    return `${dows[dow]} ${day} ${hour}${meridien}`;
    if (o.format === 'dow d h m')  return `${dows[dow]} ${day} ${hour}:${min}${meridien}`;
    if (o.format === 'dow d h')    return `${dows[dow]} ${day} ${hour}${meridien}`;
    if (o.format === 'dow h')      return `${dows[dow]} ${hour}${meridien}`;
    if (o.format === 'yyyy-mm-dd') return `${year}-${leadingZero(month)}${leadingZero(day)}`;
    return '?';
  } else {
    return '??';
  }
};

// @@@@@@@@@@@@@ ZONE CONVERSIONS @@@@@@@@@@@@@

const convertLocalStringTimestampToZuluStringTimestamp = (localStringTimestamp)  => { 
  // this works on: 1) valid timestamps, 2) string in the LOCAL zone with NO time zone
  // if the string HAS a timezone, use convertTimestampToString
  const localTimestamp = isValidDate(localStringTimestamp) ? 
    localStringTimestamp : 
    convertStringToTimestamp(localStringTimestamp);
  if(!isValidDate(localTimestamp)) return '';
  const msLocalTimestamp = localTimestamp.getTime();
  const offset = getTheTimezoneOffset();
  const msOffset = offset * 1000 * 60;
  const msAdjusted = msLocalTimestamp - msOffset;
  const zuluTimestamp = new Date(msAdjusted);
  const zuluTimestampString = convertTimestampToString(zuluTimestamp, 'd t z');
  return zuluTimestampString;
};

const dropZoneFromTimestamp = (timestamp, option = -1) => {
  if(!isValidDate(timestamp)) return {};
  const ms = timestamp.getTime();
  const offset = getTheTimezoneOffset();
  const offsetMs = 1000*60*offset;
  const adjustedMs = ms + (offsetMs * option);
  return new Date(adjustedMs);
};

// @@@@@@@@@@@@@ INTEGER/OBJECT CONVERTERS @@@@@@@@@@@@@

const convertTimestampToIntegers = timestamp => {
  if(!isValidDate(timestamp)) return {};
  const dateTimeObject = {
    year:    timestamp.getFullYear(),
    month:   timestamp.getMonth() + 1, // months 0 index
    date:    timestamp.getDate(),
    hours:   timestamp.getHours(),
    minutes: timestamp.getMinutes(),
    seconds: timestamp.getSeconds(),
    milliseconds: timestamp.getMilliseconds(),
  };
  return dateTimeObject;
};

const convertIntegersToTimestamp = (year, month=0, date=1, hours=12, minutes=0, seconds=0, tzOffset) => {
  // input: integers in local time format
  // calculation: create a date object, inputting values to match the integers, then adjust the date by the offset to compensate for UTC
  // output: Date object reflecting current time zone
  // tzOffset is optional, if not specified, use user's current time zone offset

  // IMPROVE THIS BY VALIDATING ALL DATA FIRST!!!!!
  const milliSecondsPerMinute = 60 * 1000 ;

  const now = new Date();
  const yearSent = now.getFullYear();
  const yearUse = year ? year : yearSent ;

  const timestamp = new Date(
    yearUse,
    month,// months are 0-index in date objects
    date,
    hours,
    minutes,
    seconds
  );

  // if you don't pass in an offset, this calculates the offset based on that date in the user's current time zone (i.e. in eastern US daylight savings: -4, or -5 if not daylight savings)
  const offset = isPrimitiveNumber(tzOffset) ? tzOffset : getTheTimezoneOffset(timestamp);

  const adjustedTimestamp = offset < 0 ?
    new Date(timestamp - (-offset * milliSecondsPerMinute)) : // - is earlier
    new Date(timestamp - (offset * milliSecondsPerMinute)) ; // -- is later
  return adjustedTimestamp;
};

const totalMinsHoursDays = minOrObjInput => {
  // input: option 1) primitive number of minutes, can be a float or integer
  // option 2) object with days, minutes, hours keys, can be float or integer
  // any other option returns undefined
  // if decimal input is received, it is used in calculations
  // but output floors all results
  // see test for input of 10368 as an example
  const mpd = 60 * 24;
  const mph = 60;
  const minutesGT =
    isPrimitiveNumber(minOrObjInput) ? minOrObjInput :
      isObjectLiteral(minOrObjInput) ?
        minOrObjInput.minutes + 
      ( minOrObjInput.hours * mph ) + 
      ( minOrObjInput.days * mpd ) :
        null ;
  if(!isPrimitiveNumber(minutesGT)) return;

  const days      = Math.floor(minutesGT / mpd);
  const hoursGT   = minutesGT % 1440 ;
  const hours     = Math.floor(hoursGT / mph);
  const minutesTot= hoursGT % 60 ;
  const minutes   = Math.floor(minutesTot);
  return {
    minutesGT: Math.floor(minutesGT),
    days,
    hours,
    minutes
  };
};

// @@@@@@@@@@@@@@@@ ARITHMETIC @@@@@@@@@@@@@@@

const dateDelta = (date1st, date2nd, option='minutes') => {
  // input: 2 dates, date1 is assumed to be chronologically 1st
  // output: signed integer of delta between dates; if date1 is first: positive, if date1 is later than date2: negative
  // timestamp objects have embedded time zone, so no tz conversion needed
  const date1 = 
    isValidDate(date1st) ? date1st :  
      typeof date1st === 'string' ? 
        convertStringToTimestamp(date1st) : 
        null ;
  const date2 = 
    isValidDate(date2nd) ? date2nd :  
      typeof date2nd === 'string' ? 
        convertStringToTimestamp(date2nd) : 
        null ;
  if(!isValidDate(date1)) return null;
  if(!isValidDate(date2)) return null;

  // milliseconds per unit of time
  const oneSec=1000;
  const oneMin=1000*60;
  const oneHr =1000*60*60;
  const oneDay=1000*60*60*24;
  const oneMo =1000*60*60*24*30.5; // an approximation only
  const oneYr =1000*60*60*24*365.25; // a very close approximation

  // Convert both dates to milliseconds
  const date1Ms = date1.getTime();
  const date2Ms = date2.getTime();

  // Calculate the difference in milliseconds
  const differenceMs = date2Ms - date1Ms;
  // Convert back to days and return
  const delta = 
    option === 'seconds' ? Math.round(differenceMs/oneSec) :
      option === 'minutes' ? Math.round(differenceMs/oneMin) :
        option === 'hours'   ? Math.round(differenceMs/oneHr ) :
          option === 'days'    ? Math.round(differenceMs/oneDay) :
            option === 'months'  ? Math.round(differenceMs/oneMo ) :
              option === 'years'   ? Math.round(differenceMs/oneYr ) :
                null ;
  return delta; 
};

const addTime = ( timestamp, timeToAdd, option='minutes' ) => {
  // input: 2 dates, date1 is assumed to be chronologically 1st
  // output: signed integer of delta between dates; if date1 is first: positive, if date1 is later than date2: negative
  // timestamp objects have embedded time zone, so no tz conversion needed
  const t = 
    isValidDate(timestamp) ? timestamp : 
      typeof timestamp === 'string' ? 
        convertStringToTimestamp(timestamp) : 
        null ;
  const a = typeof timeToAdd === 'number' ? Math.round(timeToAdd) : 0 ;
  if(!isValidDate(t)) return null;

  // milliseconds per unit of time
  const oneSec=1000;
  const oneMin=1000*60;
  const oneHr =1000*60*60;
  const oneDay=1000*60*60*24;

  // Convert both dates to milliseconds
  const ms = t.getTime();
  // Convert back to days and return
  const msToAdd = 
    option === 'seconds' ? a * oneSec :
      option === 'minutes' ? a * oneMin :
        option === 'hours'   ? a * oneHr  :
          option === 'days'    ? a * oneDay :
            0 ;

  const newMs = ms + msToAdd;
  const newDate = new Date(newMs);
  if(option === 'months'){
    const exMonth = newDate.getMonth();
    const newMonth = timeToAdd + exMonth;
    newDate.setMonth(newMonth);
  } else if(option === 'years') {
    const exYear = newDate.getFullYear();
    const newYear = timeToAdd + exYear;
    newDate.setFullYear(newYear);
  }
  return newDate; 
};

const createTimeframes = option => {
  // improve this to accept a parameter
  /* PURPOSE: identify timeframes to be used for retention policies
   * TRIGGERED: when cleaning schedule runs
   * INPUT: none (other than current time)
   * OUTPUT: timeframes
   */
  const rightNow   = new Date();
  const msPerDay   = 1000 * 60 * 60 * 24;
  const ro = {};
  if(!isObjectLiteral(option)){
    const daysAgo1Ms = rightNow - msPerDay;
    ro.daysAgo1   = new Date(daysAgo1Ms);
    const daysAgo2Ms = rightNow - (2 * msPerDay);
    ro.daysAgo2   = new Date(daysAgo2Ms);
    const daysAgo7Ms = rightNow - (7 * msPerDay);
    ro.daysAgo7   = new Date(daysAgo7Ms);
    const daysAgo14Ms= rightNow - (14 * msPerDay);
    ro.daysAgo14  = new Date(daysAgo14Ms);
    const daysAgo21Ms= rightNow - (21 * msPerDay);
    ro.daysAgo21  = new Date(daysAgo21Ms);
    const daysAgo28Ms= rightNow - (28 * msPerDay);
    ro.daysAgo28  = new Date(daysAgo28Ms);
    const daysAgo30Ms= rightNow - (30 * msPerDay);
    ro.daysAgo30  = new Date(daysAgo30Ms);
  } else {
    const daysAgoMs = rightNow - msPerDay;
    ro[`${option.daysAgo}DaysAgo`] = new Date(daysAgoMs);
  }
  return ro;
};

// @@@@@@@@@@@@@@@@ RANGES @@@@@@@@@@@@@@@

const rangeIsIncluded = (eventStartIn, eventEndIn, rangeStartIn, rangeEndIn) => {
  const eventStart = 
    eventStartIn instanceof Date ? eventStartIn :
      typeof eventStartIn === 'string' ? convertStringToTimestamp(eventStartIn) :
        null;
  const eventEnd = 
    eventEndIn instanceof Date ? eventEndIn :
      typeof eventEndIn === 'string' ? convertStringToTimestamp(eventEndIn) :
        null;
  const rangeStart = 
    rangeStartIn instanceof Date ? rangeStartIn :
      typeof rangeStartIn === 'string' ? convertStringToTimestamp(rangeStartIn) :
        null;
  const rangeEnd = 
    rangeEndIn instanceof Date ? rangeEndIn :
      typeof rangeEndIn === 'string' ? convertStringToTimestamp(rangeEndIn) :
        rangeStart;
  if(
    !(eventStart instanceof Date) ||
    !(eventEnd   instanceof Date) ||
    !(rangeStart instanceof Date) || 
    !(rangeEnd   instanceof Date)
  ) return {
    desc: 'error: at least one date is invalid',
    code: 11,
  };
  if(
    (dateDelta(eventStart, eventEnd)<0) ||
     (dateDelta(rangeStart, rangeEnd)<0)
  ) return {
    desc: 'error: dates are mis-ordered',
    code: 12,
  };

  const deltaStartStart = dateDelta(rangeStart, eventStart);
  const deltaStartEnd   = dateDelta(rangeStart, eventEnd);
  const deltaEndStart   = dateDelta(rangeEnd,   eventStart);
  const deltaEndEnd     = dateDelta(rangeEnd,   eventEnd);

  const startsBeforeStart = deltaStartStart >=0 ? true : false ;
  const endsBeforeStart   = deltaEndStart   >=0 ? true : false ;
  const startsAfterEnd    = deltaStartEnd   < 0 ? true : false ;
  const endsAfterEnd      = deltaEndEnd     < 0 ? true : false ;

  const codes = [              //      |xxx|
    'entirely before',         // 0 xxx
    'spans event',             // 1   x|xxx|x
    'spans start',             // 2   x|x
    'same start ends earlier', // 3    |xx
    'exact match',             // 4    |xxx|
    'same start ends later',   // 5    |xxx|x
    'subset',                  // 6     xxx
    'starts later same end',   // 7      xx|
    'spans end',               // 8      xx|x
    'entirely after',          // 9         xxx
    'error'];                  //10

  const code = 
    startsAfterEnd                             ? 9 : // entirely after
      deltaStartStart === 0 && deltaEndEnd === 0 ? 4 : // same start ends later
        deltaStartStart === 0 && !endsAfterEnd     ? 3 : // same start ends earlier
          deltaStartStart === 0 && endsAfterEnd      ? 5 : // exact match
            deltaEndEnd === 0                          ? 7 : // starts later same end
              startsBeforeStart && endsBeforeStart       ? 0 : // entirely before
                startsBeforeStart && !endsBeforeStart &&
      !startsAfterEnd && !endsAfterEnd         ? 2 : // spans start
                  startsBeforeStart && endsAfterEnd          ? 1 : // spans event
                    !startsBeforeStart && endsAfterEnd         ? 8 : // spans end
                      !startsBeforeStart && !endsAfterEnd        ? 6 : // subset
                        10 ; // error

  const desc = codes[code];
  return { desc, code };
};

// @@@@@@@@@@@@@@@@ DISPLAY @@@@@@@@@@@@@@@


module.exports = {
  isValidDate,
  calcDayOfYearFromTimestamp,
  getTheTimezoneOffset,
  isDaylightSavings,
  getDaysOfMonth,
  getNameOfMonth,
  formatOffsetAsString,
  leadingZero,
  removeSpacesFromString,
  parseTimestampString,
  convertStringToTimestamp,
  convertTimestampToString,
  convertLocalStringTimestampToZuluStringTimestamp,
  dropZoneFromTimestamp,
  convertTimestampToIntegers,
  convertIntegersToTimestamp,
  totalMinsHoursDays,
  dateDelta,
  addTime,
  createTimeframes,
  rangeIsIncluded,
  printDate,
  createTimestampLabel,
};