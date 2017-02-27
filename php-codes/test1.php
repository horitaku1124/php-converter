<?php
class TestClass1 {
    var $val = 100;

    function add() {
        return $this->val + 97;
    }
    function minus() {
        return $this->val-85;
    }
}
$a =& new TestClass1();
echo $a->val.PHP_EOL;
echo $a->add().PHP_EOL;
echo $a->minus().PHP_EOL;