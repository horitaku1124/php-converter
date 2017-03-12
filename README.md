## PHP4/5 to PHP7

```
node convert.js foo.php ; => dist/foo.php
```

Batch Job
```
find ./php_project -name "*.php" | xargs -IFILE node convert.js FILE
```

