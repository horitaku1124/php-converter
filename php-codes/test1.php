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

    function add() {
        // TODO １行コメント
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
echo $a->val.PHP_EOL;
echo $a->add().PHP_EOL;
echo $a->minus().PHP_EOL;
echo $a->my().PHP_EOL;
echo $a->text().PHP_EOL;
echo $a->text2().PHP_EOL;
echo $a->text3().PHP_EOL;
echo $a->text4().PHP_EOL;
?>
