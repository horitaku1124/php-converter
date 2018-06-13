<?php
//require_once (LIB_PATH.'class/stopwatch.php');

class cache_control_connecter{
	var $using_this = false;
	var $sqli;
	var $use_db_class;
	var $dsn;
	public $lastIsCache = false;
	private $ddl = "create table cache_control (sql_md5 varchar(32), serialized_ary varchar(10000), sql_len int, limit_by int, target_table varchar(100))";
	function cache_control_connecter($db_class_name = Null, $dsn = Null) {
		if($db_class_name) {
			$this->use_db_class = new $db_class_name();
			$this->dsn = $dsn;
		}
	}
	function start($dbname) {
		$sqli = new SqliteJob();
		$sqli->conOpen($dbname);

		$query = "SELECT name FROM sqlite_master WHERE type='table' UNION ALL SELECT name FROM sqlite_temp_master WHERE type='table' ORDER BY name";

		$rst = $sqli->execute($query);
		$table_name = Array();
		while($row = sqlite_fetch_array($rst)) {
			$table_name[] = $row[0];
		}
		if(!in_array("cache_control", $table_name)) {
			$rst = $sqli->execute($this->ddl);
		}

		$this->sqli = $sqli;
		$using_this = true;
	}
	function execute($sql){
		if(!$this->use_db_class->isConnecting()) {
			Stopwatch::push("connection open");
			$this->use_db_class->conOpen($this->dsn);
		}
		return $this->use_db_class->execute($sql);
	}
	function selectOneSQL($sql, $dataEnableUpTo = 0, $target_table = "none") {
		$data = $this->selectSQL($sql, $dataEnableUpTo, $target_table);
		if($data && count($data) == 1) {
			return $data[0];
		} else {
			return Null;
		}
	}
	function selectSQL($sql, $dataEnableUpTo = 0, $target_table = "none") {
		$console = "  cache_sql $dataEnableUpTo ";
		$this->lastIsCache = false;
		if($dataEnableUpTo) {
			$this->lastIsCache = false;
			$sql_md5 = md5($sql);
			$sql_len = strlen($sql);

			$check_sql = "select serialized_ary from cache_control where sql_md5 = '$sql_md5' and sql_len = $sql_len and limit_by >= ".time();

			$result = $this->sqli->execute($check_sql);
			if($rows = sqlite_fetch_array($result, SQLITE_ASSOC)){
				$string = $rows["serialized_ary"];
				$string = str_replace("&#39;", "'", $string);
				$this->lastIsCache = true;

				Stopwatch::push($console."cache used");
				return unserialize($string);
			}
		}
		if(!$this->use_db_class->isConnecting()) {
			Stopwatch::push("connection open");
			$this->use_db_class->conOpen($this->dsn);
		}
		$dataset = $this->use_db_class->selectAllClumn($sql);
		Stopwatch::push($console."sql done");
		if($dataEnableUpTo) {
			$string = serialize($dataset);
			$string = str_replace("'", "&#39;", $string);

			$upto = $dataEnableUpTo + time();

			$reflech_sql = "delete from cache_control where sql_md5 = '$sql_md5' and sql_len = '$sql_len'";
			$this->sqli->execute($reflech_sql);
			$store_sql = "insert into cache_control(sql_md5, serialized_ary, sql_len, limit_by, target_table) values ('$sql_md5', '$string', $sql_len, $upto, '$target_table')";
			$this->sqli->execute($store_sql);

			Stopwatch::push($console."cache stored");
		}
		return $dataset;
	}
	function selectKeysArySQL($sql, $keyName, $dataEnableUpTo = 0, $target_table = "none") {
		$line_records = $this->selectSQL($sql, $dataEnableUpTo, $target_table);
		$return_ary = Array();
		foreach($line_records as $val) {
			$key = $val[$keyName];
			$return_ary[$key] = $val;
		}
		return $return_ary;
	}
	function selectSQLByName($sql, $culmns,  $dataEnableUpTo = 0, $target_table = "none") {
		$console = "cache_sql $dataEnableUpTo ";
		$this->lastIsCache = false;
		if($dataEnableUpTo) {
			$this->lastIsCache = false;
			$sql_md5 = md5($sql);
			$sql_len = strlen($sql);

			$check_sql = "select serialized_ary from cache_control where sql_md5 = '$sql_md5' and sql_len = $sql_len and limit_by >= ".time();

			$result = $this->sqli->execute($check_sql);
			if($rows = sqlite_fetch_array($result, SQLITE_ASSOC)){
				$string = $rows["serialized_ary"];
				$string = str_replace("&#39;", "'", $string);
				$this->lastIsCache = true;

				Stopwatch::push($console."cache used");
				return unserialize($string);
			}
		}
		if(!$this->use_db_class->isConnecting()) {
			Stopwatch::push("connection open");
			$this->use_db_class->conOpen($this->dsn);
		}
		$dataset = $this->use_db_class->selectClumnByName($sql, $culmns);
		Stopwatch::push($console."sql done");
		if($dataEnableUpTo) {
			$string = serialize($dataset);
			$string = str_replace("'", "&#39;", $string);

			$upto = $dataEnableUpTo + time();

			$reflech_sql = "delete from cache_control where sql_md5 = '$sql_md5' and sql_len = '$sql_len'";
			$this->sqli->execute($reflech_sql);
			$store_sql = "insert into cache_control(sql_md5, serialized_ary, sql_len, limit_by, target_table) values ('$sql_md5', '$string', $sql_len, $upto, '$target_table')";
			$this->sqli->execute($store_sql);

			Stopwatch::push($console."cache stored");
		}
		return $dataset;
	}
	function clearCache($target_table) {
		$clear_sql = "delete from cache_control where target_table = '$target_table'";
		$this->sqli->execute($clear_sql);
	}
	function end(){
		$this->sqli->conClose();

		if($this->use_db_class->isConnecting()) {
			$this->use_db_class->conClose();
		}
	}
	function updateExecute($sql){
		if(!$this->use_db_class->isConnecting()) {
			$this->use_db_class->conOpen($this->dsn);
		}
		$res = $this->use_db_class->updateExecute($sql);
		$this->use_db_class->commit();
		return $res;
	}
	function forceConOpen() {
		if(!$this->use_db_class->isConnecting()) {
			$this->use_db_class->conOpen($this->dsn);
		}
	}
	function __destruct() {
		if($using_this) {
			$this->end();
		}
	}
}
?>