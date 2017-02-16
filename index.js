var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");
var url = require("url");
var crypto = require("crypto");

module.exports = function(argv) {
    var inputHtmlName = argv["_"][0];
    var inputHtmlContent = fs.readFileSync(inputHtmlName);
    var htmlPath = fs.realpathSync(inputHtmlName);
    var htmlBasePath = htmlPath.substr(0, htmlPath.lastIndexOf("/"));
    var dom = cheerio.load(String(inputHtmlContent));

    processResources(dom);
    return new Buffer(dom.html());

    function processResources(dom) {
        var scripts = dom("script");

        scripts.each(function(idx, el) {
            processResource(el, "src");
        });

        var links = dom("link");

        links.each(function(idx, el) {
            processResource(el, "href");
        });
    }

    function processResource(el, attr) {
        var link = dom(el).attr(attr);
        var content = readFile(link);
        var hash = generateHash(content);

        var filePath = path.parse(link);
        var newLink = path.join(filePath.dir, filePath.name + "-" + hash) + filePath.ext;
        var newFile = path.join(htmlBasePath, url.parse(newLink).pathname);
        fs.writeFileSync(newFile, content);

        dom(el).attr(attr, newLink);
    }

    function readFile(link) {
        var src = url.parse(link).pathname;
        var file = path.join(htmlBasePath, src);
        var source = fs.readFileSync(file);
        return source.toString();
    }

    function generateHash(content) {
        return crypto.createHash("md5").update(content).digest("hex").substring(0, 10);
    }

    function isLocal(src) {
        return src && !src.startsWith("//") && !url.parse(src).hostname;
    }
};