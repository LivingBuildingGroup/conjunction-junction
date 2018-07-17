/* Standard library of date and time helper functions
 * No project-specific functions
 */

'use strict';

var _require = require('./basic'),
    isPrimitiveNumber = _require.isPrimitiveNumber,
    precisionRound = _require.precisionRound,
    isObjectLiteral = _require.isObjectLiteral;

// @@@@@@@@@@@@@@ VALIDATION @@@@@@@@@@@@

var isValidDate = function isValidDate(date) {
  return date instanceof Date && isFinite(date);
};

// @@@@@@@@@@@@@ GET DATA FROM TS @@@@@@@@@@@@

var calcDayOfYearFromTimestamp = function calcDayOfYearFromTimestamp(timestamp) {
  var tsYear = timestamp.getFullYear();
  var jan1 = new Date(tsYear, 0, 0, 0, 0, 0); // Dec 31 at midnight = Jan 1 0:00:00
  var daysAfterJan1 = dateDelta(jan1, timestamp, 'days');
  return daysAfterJan1;
};

var getTheTimezoneOffset = function getTheTimezoneOffset(date) {
  // input: optional date parameter; no parameter = current date
  // returns user's current timezone offset from UTC/Zulu time
  var theDate = date instanceof Date ? date : new Date();
  // getCurrentTimezoneOffset reverses the sign, so we flip it back
  var offset = theDate.getTimezoneOffset();
  return -offset;
};

var isDaylightSavings = function isDaylightSavings(offset) {
  // input: currentOffset with CORRECT sign, i.e. US will have a negative sign
  // returns true if USER is in daylight savings time, else false
  // all calcs are in MINUTES
  var currentOffset = !isNaN(offset) ? offset : getTheTimezoneOffset();
  var today = new Date();
  var thisYear = today.getFullYear();
  var jan = new Date(thisYear, 0, 1);
  var jul = new Date(thisYear, 6, 1);
  // getTimezoneOffset reverses the sign, so we flip it back
  var janOffset = -jan.getTimezoneOffset();
  var julOffset = -jul.getTimezoneOffset();

  var hemisphere = janOffset < julOffset ? 'north' : 'south';

  var isDST = janOffset === julOffset ? false : // DST must not be observed
  hemisphere === 'north' && currentOffset === julOffset ? true : hemisphere === 'south' && currentOffset === janOffset ? true : false; // either non-applicable offset passed, or it is not DST
  return isDST;
};

var getDaysOfMonth = function getDaysOfMonth(month) {
  var monthDays = void 0;
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

// @@@@@@@@@@@@@ STRING HELPERS @@@@@@@@@@@@

var formatOffsetAsString = function formatOffsetAsString(offsetMins) {
  var useColon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  // input: signed integer of minutes of timezone offset
  // US is negative (behind Zulu time)
  // How used?  Helper function to convertTimestampToString()
  if (isNaN(offsetMins)) return '';
  var offsetSign = offsetMins >= 0 ? '+' : '-';
  var offsetHours = offsetSign === '-' ? Math.abs(Math.ceil(offsetMins / 60)) : Math.abs(Math.floor(offsetMins / 60));
  var offsetHours0 = leadingZero(offsetHours);
  var offsetMinsRemaining = Math.abs(offsetMins % 60);
  var offsetMinsRemaining0 = leadingZero(offsetMinsRemaining);
  var colon = useColon ? ':' : '';
  var offsetFormatted = '' + offsetSign + offsetHours0 + colon + offsetMinsRemaining0;
  return offsetFormatted;
};

var leadingZero = function leadingZero(intOrString) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  // helper function when converting to strings
  // input: integer or string and a length of digits
  // output: string with leading zeros
  var theString = typeof intOrString === 'string' ? intOrString : !isNaN(intOrString) ? String(intOrString) : '';
  if (theString.length < length) {
    var delta = length - theString.length;
    var leadingZeros = '';
    for (var i = 0; i < delta; i++) {
      leadingZeros += '0';
    }
    return '' + leadingZeros + theString;
  }
  return theString;
};

var removeSpacesFromString = function removeSpacesFromString(string) {
  if (typeof string !== 'string') return '';
  var trim = string.trim();
  var dash = trim.replace(' -', '-');
  var plus = dash.replace(' +', '+');
  var z = plus.replace(' Z', 'Z');
  var t = z.replace(' ', 'T');
  return t;
};

// @@@@@@@@@@ STRING/OBJECT CONVERTERS @@@@@@@@@

var parseTimestampString = function parseTimestampString(string) {
  var stringWithT = string.includes('T') ? string : string.replace(' ', 'T');
  var dateTimeArray = stringWithT.split('T');
  var dateArray = dateTimeArray[0].split('-');
  var dateArrayIntegers = dateArray.map(function (date) {
    return parseInt(date, 10);
  });
  // READ WHAT TYPE OF SUFFIX IS ON THE END: 2 TYPES: MS AND ZONE
  var splitters = ['.', '-', '+', 'Z'];
  var splitEnd = splitters.map(function (item) {
    if (typeof dateTimeArray[1] !== 'string') {
      if (item === 'Z') {
        return 'not zulu';
      } else {
        return item;
      }
    } else if (dateTimeArray[1].includes(item)) {
      var split = dateTimeArray[1].split(item);
      if (item === '+' || item === '-') {
        var zoneArr = split[1].split(':');
        var hrs = parseInt(zoneArr[0], 10);
        var hrsAdj = hrs > 24 ? Math.floor(hrs / 100) : hrs;
        var hrsRemainder = hrs > 24 ? precisionRound((hrs - hrsAdj * 100) / 60, 2) : 0;
        var mins = zoneArr[1] ? parseInt(zoneArr[1], 10) : 0;
        var minsDecimal = hrs > 24 ? hrsRemainder : precisionRound(mins / 60, 2);
        return hrsAdj + minsDecimal;
      } else if (item !== 'Z') {
        return parseInt(split[1], 10);
      } else {
        return 'zulu';
      }
    } else {
      if (item === 'Z') {
        return 'not zulu';
      } else {
        return item;
      }
    }
  });
  var timeSplitString = typeof dateTimeArray[1] !== 'string' ? [''] : dateTimeArray[1].split(':');

  var ms = 0;
  var timeSplit = timeSplitString.map(function (s, i) {
    if (i <= 1) {
      // hours, minutes
      return parseInt(s, 10);
    } else if (i === 2) {
      // seconds
      var split1 = s.split('+');
      var split2 = split1[0].split('-');
      var seconds = split2[0];
      var secondsSplit = seconds.split('.');
      ms = secondsSplit[1] ? parseInt(secondsSplit[1], 10) : 0;
      return parseInt(secondsSplit[0], 10);
    } else {
      return null;
    }
  });

  var offset = splitEnd[1] !== splitters[1] ? -splitEnd[1] : splitEnd[2] !== splitters[2] ? splitEnd[2] : splitEnd[3] === 'zulu' ? 0 : 0;

  return {
    dateTimeArray: dateTimeArray,
    dateArray: dateArray,
    dateArrayIntegers: dateArrayIntegers,
    splitEnd: splitEnd,
    splitters: splitters,
    timeSplit: timeSplit,
    ms: ms,
    offset: offset
  };
};

var convertStringToTimestamp = function convertStringToTimestamp(rawString) {
  if (rawString instanceof Date) return rawString;
  // input: string in ISO 8601 format; 
  // if the offset is not included in the string, zulu time is assumed
  // output: Date object in specified ZULU time zone
  if (typeof rawString === 'string') {
    var noSpace = removeSpacesFromString(rawString);

    var _parseTimestampString = parseTimestampString(noSpace),
        dateArrayIntegers = _parseTimestampString.dateArrayIntegers,
        timeSplit = _parseTimestampString.timeSplit,
        ms = _parseTimestampString.ms,
        offset = _parseTimestampString.offset;

    var timestamp = new Date(dateArrayIntegers[0], dateArrayIntegers[1] - 1, // months are 0-index in date objects
    dateArrayIntegers[2], timeSplit[0], timeSplit[1], timeSplit[2], ms);

    var milliSecondsPerMinute = 60 * 1000;
    var offsetParamMins = offset * 60;
    // get the user's current time zone offset, which was used by default above.
    var offsetCurrent = getTheTimezoneOffset(timestamp);
    // determine how much to correct zulu time
    var offsetDelta = offsetParamMins - offsetCurrent;
    // correct zulu time
    var timestampAdj = new Date(timestamp - offsetDelta * milliSecondsPerMinute);
    if (isValidDate(timestampAdj)) return timestampAdj;
    return {};
  }
  return {};
};

var convertTimestampToString = function convertTimestampToString(timestamp, option) {
  // input: JS Date object (i.e. timestamp) (correctly formatted, i.e. time zone is local, and time is time in local time zone)
  // output: string in TIMESTAMP WITH TIME ZONE format (zone relative to Zulu)
  // sample output: '2017-12-21T16:26:48-05:00'
  // WHY USE?  Be in full control of the string. Don't send timestamps to the database, and let the database decide how to convert. Convert here, and avoid time zone conversion problems.
  // option is optional. 'date' = date, 'time' = time; anything else = full timestamp.

  var convertTimestampToStringInner = function convertTimestampToStringInner(timestamp, option) {
    var year = timestamp.getFullYear();
    var month = timestamp.getMonth() + 1; // months are 0-index in date objects, but not in string
    var month0 = leadingZero(month);
    var date = timestamp.getDate();
    var date0 = leadingZero(date);
    var timeSymbol = 'T';
    var hours = timestamp.getHours();
    var hours0 = leadingZero(hours);
    var minutes = timestamp.getMinutes();
    var minutes0 = leadingZero(minutes);
    var seconds = timestamp.getSeconds();
    var seconds0 = leadingZero(seconds);
    var offset = getTheTimezoneOffset(timestamp); // returns signed minutes
    var offsetFormatted = formatOffsetAsString(offset); // pass in signed minutes, returns signed string
    var offsetFormattedNoColon = formatOffsetAsString(offset, false); // pass in signed minutes, returns signed string
    if (option === 'date') return year + '-' + month0 + '-' + date0;
    if (option === 'time') return hours0 + ':' + minutes0 + ':' + seconds0;
    if (option === 'd t noz') return year + '-' + month0 + '-' + date0 + ' ' + hours0 + ':' + minutes0 + ':' + seconds0;
    if (option === 'd t z') return year + '-' + month0 + '-' + date0 + ' ' + hours0 + ':' + minutes0 + ':' + seconds0 + ' ' + offsetFormattedNoColon;
    return year + '-' + month0 + '-' + date0 + timeSymbol + hours0 + ':' + minutes0 + ':' + seconds0 + offsetFormatted;
  };

  if (isValidDate(timestamp)) {
    return convertTimestampToStringInner(timestamp, option);
  } else if (typeof timestamp === 'string') {
    var date = convertStringToTimestamp(timestamp);
    if (isValidDate(date)) {
      return convertTimestampToStringInner(date, option);
    } else {
      return '';
    }
  }
  return '';
};

// @@@@@@@@@@@@@ ZONE CONVERSIONS @@@@@@@@@@@@@

var convertLocalStringTimestampToZuluStringTimestamp = function convertLocalStringTimestampToZuluStringTimestamp(localStringTimestamp) {
  // this works on: 1) valid timestamps, 2) string in the LOCAL zone with NO time zone
  // if the string HAS a timezone, use convertTimestampToString
  var localTimestamp = isValidDate(localStringTimestamp) ? localStringTimestamp : convertStringToTimestamp(localStringTimestamp);
  if (!isValidDate(localTimestamp)) return '';
  var msLocalTimestamp = localTimestamp.getTime();
  var offset = getTheTimezoneOffset();
  var msOffset = offset * 1000 * 60;
  var msAdjusted = msLocalTimestamp - msOffset;
  var zuluTimestamp = new Date(msAdjusted);
  var zuluTimestampString = convertTimestampToString(zuluTimestamp, 'd t z');
  return zuluTimestampString;
};

var dropZoneFromTimestamp = function dropZoneFromTimestamp(timestamp) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : -1;

  if (!isValidDate(timestamp)) return {};
  var ms = timestamp.getTime();
  var offset = getTheTimezoneOffset();
  var offsetMs = 1000 * 60 * offset;
  var adjustedMs = ms + offsetMs * option;
  return new Date(adjustedMs);
};

// @@@@@@@@@@@@@ INTEGER/OBJECT CONVERTERS @@@@@@@@@@@@@

var convertTimestampToIntegers = function convertTimestampToIntegers(timestamp) {
  if (!isValidDate(timestamp)) return {};
  var dateTimeObject = {
    year: timestamp.getFullYear(),
    month: timestamp.getMonth() + 1, // months 0 index
    date: timestamp.getDate(),
    hours: timestamp.getHours(),
    minutes: timestamp.getMinutes(),
    seconds: timestamp.getSeconds(),
    milliseconds: timestamp.getMilliseconds()
  };
  return dateTimeObject;
};

var convertIntegersToTimestamp = function convertIntegersToTimestamp(year) {
  var month = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var date = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;
  var hours = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 12;
  var minutes = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
  var seconds = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
  var tzOffset = arguments[6];

  // input: integers in local time format
  // calculation: create a date object, inputting values to match the integers, then adjust the date by the offset to compensate for UTC
  // output: Date object reflecting current time zone
  // tzOffset is optional, if not specified, use user's current time zone offset

  // IMPROVE THIS BY VALIDATING ALL DATA FIRST!!!!!
  var milliSecondsPerMinute = 60 * 1000;

  var now = new Date();
  var yearSent = now.getFullYear();
  var yearUse = year ? year : yearSent;

  var timestamp = new Date(yearUse, month, // months are 0-index in date objects
  date, hours, minutes, seconds);

  // if you don't pass in an offset, this calculates the offset based on that date in the user's current time zone (i.e. in eastern US daylight savings: -4, or -5 if not daylight savings)
  var offset = isPrimitiveNumber(tzOffset) ? tzOffset : getTheTimezoneOffset(timestamp);

  var adjustedTimestamp = offset < 0 ? new Date(timestamp - -offset * milliSecondsPerMinute) : // - is earlier
  new Date(timestamp - offset * milliSecondsPerMinute); // -- is later
  return adjustedTimestamp;
};

var totalMinsHoursDays = function totalMinsHoursDays(minOrObjInput) {
  // input: option 1) primitive number of minutes, can be a float or integer
  // option 2) object with days, minutes, hours keys, can be float or integer
  // any other option returns undefined
  // if decimal input is received, it is used in calculations
  // but output floors all results
  // see test for input of 10368 as an example
  var mpd = 60 * 24;
  var mph = 60;
  var minutesGT = isPrimitiveNumber(minOrObjInput) ? minOrObjInput : isObjectLiteral(minOrObjInput) ? minOrObjInput.minutes + minOrObjInput.hours * mph + minOrObjInput.days * mpd : null;
  if (!isPrimitiveNumber(minutesGT)) return;

  var days = Math.floor(minutesGT / mpd);
  var hoursGT = minutesGT % 1440;
  var hours = Math.floor(hoursGT / mph);
  var minutesTot = hoursGT % 60;
  var minutes = Math.floor(minutesTot);
  return {
    minutesGT: Math.floor(minutesGT),
    days: days,
    hours: hours,
    minutes: minutes
  };
};

// @@@@@@@@@@@@@@@@ ARITHMETIC @@@@@@@@@@@@@@@

var dateDelta = function dateDelta(date1st, date2nd) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'minutes';

  // input: 2 dates, date1 is assumed to be chronologically 1st
  // output: signed integer of delta between dates; if date1 is first: positive, if date1 is later than date2: negative
  // timestamp objects have embedded time zone, so no tz conversion needed
  var date1 = isValidDate(date1st) ? date1st : typeof date1st === 'string' ? convertStringToTimestamp(date1st) : null;
  var date2 = isValidDate(date2nd) ? date2nd : typeof date2nd === 'string' ? convertStringToTimestamp(date2nd) : null;
  if (!isValidDate(date1)) return null;
  if (!isValidDate(date2)) return null;

  // milliseconds per unit of time
  var oneSec = 1000;
  var oneMin = 1000 * 60;
  var oneHr = 1000 * 60 * 60;
  var oneDay = 1000 * 60 * 60 * 24;
  var oneMo = 1000 * 60 * 60 * 24 * 30.5; // an approximation only
  var oneYr = 1000 * 60 * 60 * 24 * 365.25; // a very close approximation

  // Convert both dates to milliseconds
  var date1Ms = date1.getTime();
  var date2Ms = date2.getTime();

  // Calculate the difference in milliseconds
  var differenceMs = date2Ms - date1Ms;
  // Convert back to days and return
  var delta = option === 'seconds' ? Math.round(differenceMs / oneSec) : option === 'minutes' ? Math.round(differenceMs / oneMin) : option === 'hours' ? Math.round(differenceMs / oneHr) : option === 'days' ? Math.round(differenceMs / oneDay) : option === 'months' ? Math.round(differenceMs / oneMo) : option === 'years' ? Math.round(differenceMs / oneYr) : null;
  return delta;
};

var addTime = function addTime(timestamp, timeToAdd) {
  var option = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'minutes';

  // input: 2 dates, date1 is assumed to be chronologically 1st
  // output: signed integer of delta between dates; if date1 is first: positive, if date1 is later than date2: negative
  // timestamp objects have embedded time zone, so no tz conversion needed
  var t = isValidDate(timestamp) ? timestamp : typeof timestamp === 'string' ? convertStringToTimestamp(timestamp) : null;
  var a = typeof timeToAdd === 'number' ? Math.round(timeToAdd) : 0;
  if (!isValidDate(t)) return null;

  // milliseconds per unit of time
  var oneSec = 1000;
  var oneMin = 1000 * 60;
  var oneHr = 1000 * 60 * 60;
  var oneDay = 1000 * 60 * 60 * 24;

  // Convert both dates to milliseconds
  var ms = t.getTime();
  // Convert back to days and return
  var msToAdd = option === 'seconds' ? a * oneSec : option === 'minutes' ? a * oneMin : option === 'hours' ? a * oneHr : option === 'days' ? a * oneDay : 0;

  var newMs = ms + msToAdd;
  var newDate = new Date(newMs);
  if (option === 'months') {
    var exMonth = newDate.getMonth();
    var newMonth = timeToAdd + exMonth;
    newDate.setMonth(newMonth);
  } else if (option === 'years') {
    var exYear = newDate.getFullYear();
    var newYear = timeToAdd + exYear;
    newDate.setFullYear(newYear);
  }
  return newDate;
};

var createTimeframes = function createTimeframes() {
  // improve this to accept a parameter
  /* PURPOSE: identify timeframes to be used for retention policies
   * TRIGGERED: when cleaning schedule runs
   * INPUT: none (other than current time)
   * OUTPUT: timeframes
   */
  var rightNow = new Date();
  var msPerDay = 1000 * 60 * 60 * 24;
  var daysAgo1Ms = rightNow - msPerDay;
  var daysAgo1 = new Date(daysAgo1Ms);
  var daysAgo2Ms = rightNow - 2 * msPerDay;
  var daysAgo2 = new Date(daysAgo2Ms);
  var daysAgo7Ms = rightNow - 7 * msPerDay;
  var daysAgo7 = new Date(daysAgo7Ms);
  var daysAgo14Ms = rightNow - 14 * msPerDay;
  var daysAgo14 = new Date(daysAgo14Ms);
  var daysAgo21Ms = rightNow - 21 * msPerDay;
  var daysAgo21 = new Date(daysAgo21Ms);
  var daysAgo28Ms = rightNow - 28 * msPerDay;
  var daysAgo28 = new Date(daysAgo28Ms);
  var daysAgo30Ms = rightNow - 30 * msPerDay;
  var daysAgo30 = new Date(daysAgo30Ms);
  return {
    rightNow: rightNow,
    daysAgo1: daysAgo1,
    daysAgo2: daysAgo2,
    daysAgo7: daysAgo7,
    daysAgo14: daysAgo14,
    daysAgo21: daysAgo21,
    daysAgo28: daysAgo28,
    daysAgo30: daysAgo30
  };
};

// @@@@@@@@@@@@@@@@ RANGES @@@@@@@@@@@@@@@

var rangeIsIncluded = function rangeIsIncluded(eventStartIn, eventEndIn, rangeStartIn, rangeEndIn) {
  var eventStart = eventStartIn instanceof Date ? eventStartIn : typeof eventStartIn === 'string' ? convertStringToTimestamp(eventStartIn) : null;
  var eventEnd = eventEndIn instanceof Date ? eventEndIn : typeof eventEndIn === 'string' ? convertStringToTimestamp(eventEndIn) : null;
  var rangeStart = rangeStartIn instanceof Date ? rangeStartIn : typeof rangeStartIn === 'string' ? convertStringToTimestamp(rangeStartIn) : null;
  var rangeEnd = rangeEndIn instanceof Date ? rangeEndIn : typeof rangeEndIn === 'string' ? convertStringToTimestamp(rangeEndIn) : rangeStart;
  if (!(eventStart instanceof Date) || !(eventEnd instanceof Date) || !(rangeStart instanceof Date) || !(rangeEnd instanceof Date)) return {
    desc: 'error: at least one date is invalid',
    code: 11
  };
  if (dateDelta(eventStart, eventEnd) < 0 || dateDelta(rangeStart, rangeEnd) < 0) return {
    desc: 'error: dates are mis-ordered',
    code: 12
  };

  var deltaStartStart = dateDelta(rangeStart, eventStart);
  var deltaStartEnd = dateDelta(rangeStart, eventEnd);
  var deltaEndStart = dateDelta(rangeEnd, eventStart);
  var deltaEndEnd = dateDelta(rangeEnd, eventEnd);

  var startsBeforeStart = deltaStartStart >= 0 ? true : false;
  var endsBeforeStart = deltaEndStart >= 0 ? true : false;
  var startsAfterEnd = deltaStartEnd < 0 ? true : false;
  var endsAfterEnd = deltaEndEnd < 0 ? true : false;

  var codes = [//      |xxx|
  'entirely before', // 0 xxx
  'spans event', // 1   x|xxx|x
  'spans start', // 2   x|x
  'same start ends earlier', // 3    |xx
  'exact match', // 4    |xxx|
  'same start ends later', // 5    |xxx|x
  'subset', // 6     xxx
  'starts later same end', // 7      xx|
  'spans end', // 8      xx|x
  'entirely after', // 9         xxx
  'error']; //10

  var code = startsAfterEnd ? 9 : // entirely after
  deltaStartStart === 0 && deltaEndEnd === 0 ? 4 : // same start ends later
  deltaStartStart === 0 && !endsAfterEnd ? 3 : // same start ends earlier
  deltaStartStart === 0 && endsAfterEnd ? 5 : // exact match
  deltaEndEnd === 0 ? 7 : // starts later same end
  startsBeforeStart && endsBeforeStart ? 0 : // entirely before
  startsBeforeStart && !endsBeforeStart && !startsAfterEnd && !endsAfterEnd ? 2 : // spans start
  startsBeforeStart && endsAfterEnd ? 1 : // spans event
  !startsBeforeStart && endsAfterEnd ? 8 : // spans end
  !startsBeforeStart && !endsAfterEnd ? 6 : // subset
  10; // error

  var desc = codes[code];
  return { desc: desc, code: code };
};

// @@@@@@@@@@@@@@@@ DISPLAY @@@@@@@@@@@@@@@

var printDate = function printDate(date, options) {
  var offset = getTheTimezoneOffset();
  var timeZone = offset === -240 ? 'America/New_York' : offset === -300 ? 'America/New_York' : 'UTC';
  var dateOptions = isObjectLiteral(options) ? options : {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: timeZone
  };
  // input: timestamp or date; we should be handling all in Zulu time, so assume that.  Not tested with other time.
  // output: string to display timestamp to user; NOT formatting for data handling.
  if (date instanceof Date) {
    return date.toLocaleDateString('en', dateOptions);
  }
  return '';
};

var createTimestampLabel = function createTimestampLabel(ts) {
  var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { format: 'm d h' };

  var o = isObjectLiteral(option) ? option : {};
  var dows = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  if (isValidDate(ts)) {
    var month = ts.getMonth() + 1;
    var day = ts.getDate();
    var dow = ts.getDay();
    var h = ts.getHours();
    var min = ts.getMinutes();
    var hour = o.hour === 24 ? h : h > 12 ? h - 12 : h;
    var meridien = o.hour === 24 ? '' : h >= 12 ? 'PM' : 'AM';
    if (o.format === 'm d h') {
      return month + '/' + day + ' ' + hour + meridien;
    } else if (option === 'm d h m') {
      return month + '/' + day + ' ' + hour + ':' + min + meridien;
    } else if (option === 'dow d h') {
      return dows[dow] + ' ' + day + ' ' + hour + meridien;
    } else if (option === 'dow d h m') {
      return dows[dow] + ' ' + day + ' ' + hour + ':' + min + meridien;
    } else {
      return '?';
    }
  } else {
    return '??';
  }
};

module.exports = {
  isValidDate: isValidDate,
  calcDayOfYearFromTimestamp: calcDayOfYearFromTimestamp,
  getTheTimezoneOffset: getTheTimezoneOffset,
  isDaylightSavings: isDaylightSavings,
  getDaysOfMonth: getDaysOfMonth,
  formatOffsetAsString: formatOffsetAsString,
  leadingZero: leadingZero,
  removeSpacesFromString: removeSpacesFromString,
  parseTimestampString: parseTimestampString,
  convertStringToTimestamp: convertStringToTimestamp,
  convertTimestampToString: convertTimestampToString,
  convertLocalStringTimestampToZuluStringTimestamp: convertLocalStringTimestampToZuluStringTimestamp,
  dropZoneFromTimestamp: dropZoneFromTimestamp,
  convertTimestampToIntegers: convertTimestampToIntegers,
  convertIntegersToTimestamp: convertIntegersToTimestamp,
  totalMinsHoursDays: totalMinsHoursDays,
  dateDelta: dateDelta,
  addTime: addTime,
  createTimeframes: createTimeframes,
  rangeIsIncluded: rangeIsIncluded,
  printDate: printDate,
  createTimestampLabel: createTimestampLabel
};