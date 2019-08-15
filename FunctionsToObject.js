'use strict';


const { 
  convertObjectKeyCase, 
  validateObjectKeys,
  unEscapeSpecial,
  precisionRound,
  isPrimitiveNumber,
  titleCaseWord,
  validateRawKnex,
  limitObjectKeys,
  convertObjectToArray,  } = require('conjunction-junction');


const convertObjectKeyCaseObj = {
  parameters: [
    {
      name: 'object', type: 'object',
    },
    {
      name: 'caseOption', type: 'string', default: 'Cc',
    }
  ],
  output: {
    type: 'object',
    example: {
      id: 'number',
      id2: 'number',
      snakeCase: 'string',
      camelCase: 'object',
    //extra object needed
    }
  },
  typeChecking: [
    'input variable object must be an object, if not function will return an empty object',
  ],
  description: [
    'Converts the keys of the input object to type of case specified by the second paramter caseOption'
  ],
  example:[
    {inputs: [
      {obj:{keyNumber1:'value',keyNumber2:'value'}},
      'Sc'
    ],
    output: {obj:{key_number1:'value',key_number2:'value'}}
    }
  ],
};

const validateObjectKeysObj = {
  parameters: [
    {
      name: 'object', type: 'object',
    },
    {
      name: 'type', type: 'string',
    },
    {
      name: 'rowOfKeys', type: 'array',
    }
  ],
  output:{
    type: 'object or string',
    example:{
      missingKey1: 'string',
      missingKey2: 'string',
      missingKeyEtc: 'string',
    }
  },
  typeChecking: [
    'input variable object must be an object, if not function will return the string: Invalid input',
    'input variable rowOfKeys must be an array, if not the function will return the string: ok',
    'input variable rowOfKeys must not be empty, if so, the function will return the string: ok',
  ],
  description: [
    'validates object to determine if all keys are present'
  ],
  example: [
    {input:[
      {obj:{key1:'1',key2:'2'}},
      'new',
      [],
    ],
    output: 'ok'
    },
  ],
  //other example needed

};

const unEscapeSpecialObj = {
  parameters: [
    {
      name: 'data', type: 'string',
    }
  ],
  output: {
    type: 'string',
  },
  typeChecking: [
    'none',
  ],
  description: [
    'removes single and double qoutes from the input string',
  ],
  example:[
    {input:'"un-escape ""double"" quotes (")'},
    {input:'"un-escape "double" quotes (")'},
  ],

};

const precisionRoundObj = {
  parameters:[
    {
      name: 'number', type: 'number',
    },
    {
      name: 'precision', type: 'number', default: 4,
    },
  ],
  output: {
    type: 'number',
  },
  typeChecking: [
    'both parameters must be number',
  ],
  description:[
    'rounds the number parameter to how many spaces specified by the precision parameter',
  ],
  example:[
    {input:2.2994999,output: 3.2995}
  ],
};

const isPrimitiveNumberObj = {
  parameters:[
    {
      name: 'number', type: 'number',
    }
  ],
  output: {
    type: 'boolean',
  },
  typeChecking:[
    'checks if parameter is undefined, null, a finite number',
  ],
  description:[
    'checks if given parameter is a finite number',
  ],
  example:[
    {input:20,output:true},
    {input:'string',output:false},
  ],
};

const titleCaseWordObj = {
  parameters:[
    {
      name: 'word', type: 'string',
    },
    {
      name: 'option', type: 'string',
    }
  ],
  output: {
    type: 'string',
  },
  typeChecking: [
    'checks if paramter word is a string',
  ],
  description: [
    'capitalizes input parameter with snake_case or camelCase based on option parameter',
  ],
  example: [
    {input: 'snake_case',output:'SnakeCase'}
  ],
};

const validateRawKnexObj = {
  parameters:[
    {
      name:'data', type:'object',
    },
    {
      name: 'label', type:'',
    }
  ],

};