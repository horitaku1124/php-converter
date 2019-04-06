"use strict";

const assert = require('assert');
const la = require('../js/lexicalAnalyzer.js'),
    pp = require('../js/phpParser.js');

const convertTo7 = (code) => {
  let tokens = la.run(code);
  let codes = pp.run(tokens);
  return codes.map(c => c.value).join("");
};

describe('PHP converter', () => {
  it('change split to explode or preg_split', () => {
    let c7;
    c7 = convertTo7("<?php\n$a = Split('A');");
    assert.equal(c7, "<?php\n$a = explode(\"A\");");

    c7 = convertTo7("<?php\n$a = Split('\\d');");
    assert.equal(c7, "<?php\n$a = preg_split('/\\d/');");
  });
  it('change old array syntax to []', () => {
    let c7;
    c7 = convertTo7("<?php\n$a = Array();");
    assert.equal(c7, "<?php\n$a = [];");
    // c7 = convertTo7("<?php\n$a = array(1,2,3,4,5);");
    // assert.equal(c7, "<?php\n$a = [1,2,3,4,5];");
  });
});