# hash-resources

Creates hashed version of resources for cache invalidation purposes

Turns
```
<link rel="stylesheet" href="css/styles.css">
<script src="js/main.js"></script>
```
into
```
<link rel="stylesheet" href="css/styles.css?v=c9a7c7ed62">
<script src="js/main.js?v=d1a111ea32"></script>
```
Hash is MD5 of the content.

## Usage
```
npm install hash-resources
```
Default settings (link and script tags with query param appended)
```
hash-resources example/index.html > example/index.after.html
```

Explicit selector of substitutions and create new files with hash embedded
```
hash-resources --selectors="link,script" --name="{path}@{hash}.{extension}" example/index.html > example/index.after.html
```
path, hash and extension are variables from which you can construct a file name


