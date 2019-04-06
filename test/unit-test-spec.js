"use strict";

const assert = require('assert');
const la = require('../js/lexicalAnalyzer.js'),
    pp = require('../js/phpParser.js');

const convertTo7 = (code) => {
  let tokens = la.run(code);
  let codes = pp.run(tokens);
  return codes.map(c => c.value).join("");
};

describe('PHP4 code', () => {
  it('will be translated to PHP7 code', () => {
    let c7 = convertTo7("<?php\n$a = Split('A');");
    console.log(c7);
    assert.equal(c7, "<?php\n$a = explode(\"A\");");
  });
});