'use strict';

const exampleFunction = {
  // list each parameter accepted
  params: [
    {
      name: 'word', type: 'string', default: 'some value' // skip "default value" if there is no default
    },
    {
      name: 'options', type: 'object', default: { foo: 'none', bar: 0, biz: 'baz' }
    }
  ],
  // list what is output
  output: {
    type: 'object', // always do this
    example: { // only do this for objects, just list the top-level keys
      key1: 'string',
      key2: 'number',
      key3: 'array of strings',
      key4: 'array of objects'
    }
  },
  typeChecking: [ // many functions in c-j check types at the start of function
    // just include a general summary of what sort of type checking is done
    'input must be a number or string',
    'if input is a number, returns the value of the number as a string',
    // let the user know what happens if typechecking fails, if applicable
    'returns undefined if typechecking fails'
  ],
  desc: [ // just a general description of what the function does, in few words, plain english
    'converts camelCase to lowercase with spaces'
  ],
  eg: [ // just give a few examples.  Very complex functions might require numerous examples
    {input: 'camelCase',  output: 'camel case' },
    {input: 'bigBadUgly', output: 'big bad ugly' },
  ],
};

// THIS IS A REAL EXAMPLE FOR THIS FUNCTION
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