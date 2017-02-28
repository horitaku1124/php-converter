<?php
class TestClass1 {
    var $val = 100;
    var $text = "abcdefg";

    function add() {
        return $this->val + 97;
    }
    function minus() {
        return $this->val-85;
    }
    function &my() {
        return $this;
    }
    function text() {
        return $this->text;
    }
}
$a =& new TestClass1();
echo $a->val.PHP_EOL;
echo $a->add().PHP_EOL;
echo $a->minus().PHP_EOL;
echo $a->my().PHP_EOL;
echo $a->text().PHP_EOL;