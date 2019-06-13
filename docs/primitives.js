'use strict';

const convertCcToSpace = {
  params: [
    {
      name: 'word', type: 'string',
    }
  ],
  output: {
    type: 'string',
  },
  typeChecking: [
    'input must be a number or string',
    'if input is a number, returns the value of the number as a string'
  ],
  desc: [
    'converts camelCase to lowercase with spaces'
  ],
  eg: [
    'camelCase', 'camel case',
    'bigBadUgly', 'big bad ugly'
  ],
};