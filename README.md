## PHP4/5 to PHP7

[![Build Status](https://dev.azure.com/newwoory/PHP-Converter/_apis/build/status/horitaku1124.php-converter?branchName=master)](https://dev.azure.com/newwoory/PHP-Converter/_build/latest?definitionId=3&branchName=master)

```
node convert.js foo.php ; => dist/foo.php
```

Batch Job
```
find ./php_project -name "*.php" | xargs -IFILE node convert.js FILE
```

