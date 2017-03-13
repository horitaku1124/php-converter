<?php
/**
 * 古いくらす
 */
class TestClass1 {
    var $val = 100;
    var $text = "abcdefg";
    var $text2 = "ABC
DEFG";
    var $text3 = "<html><body bgcolor=\"white;\"></html>";
    var $text4 = '<html><body bgcolor=\'white;\'></html>';

    function val() {
        return $this->val;
    }
    function add() {
        // TODO １行コメント
        return $this->val + 97;
    }
    function and1() {
        return (3 & 1) && 2;
    }
    function minus() {
        return $this->val-85;
    }
    function &my() {
        return $this;
    }
    function &my2(&$arr, &$arr2) {
        return count($arr) + count($arr2);
    }
    function text() {
        return $this->text;
    }
    function text2() {
        return $this->text2;
    }
    function text3() {
        return $this->text3;
    }
    function text4() {
        return $this->text4;
    }
}
$a =& new TestClass1();
echo $a->val().PHP_EOL;
echo $a->add().PHP_EOL;
echo $a->minus().PHP_EOL;
echo $a->my().PHP_EOL;
$ar1 = array(1,2);
$ar2 = array(1,2,3);
echo $a->my2($ar1, $ar2).PHP_EOL;
echo $a->text().PHP_EOL;
echo $a->text2().PHP_EOL;
echo $a->text3().PHP_EOL;
echo $a->text4().PHP_EOL;
print_r(split("/", "/usr/local/lib"));
?>
