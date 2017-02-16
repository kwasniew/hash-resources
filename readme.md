# hash-resources

Creates hashed version of resources for cache invalidation purposes

Turns
```
<link rel="stylesheet" href="css/styles.css">
<script src="js/main.js"></script>
```
into
```
<link rel="stylesheet" href="css/styles-c9a7c7ed62.css">
<script src="js/main-d1a111ea32.js"></script>
```
Hash is MD5 of the content.

## Usage
```
npm install hash-resources
```
Default settings (link and script tags with -hash appended to file name)
```
hash-resources example/index.html > example/index.after.html
```

Explicit config matching default settings
```
hash-resources --selector=link@href --selector=script@src --name="{path}-{hash}{extension}" example/index.html > example/index.after.html
```
Path, hash and extension are variables from which you can construct a file name.
Extension already contains a dot (.)

Hash in query param
```
hash-resources --query=v example/index.html > example/index.after.html
```



