var cheerio = require("cheerio");
var path = require("path");
var fs = require("fs");
var url = require("url");
var crypto = require("crypto");

module.exports = function (argv) {
    var inputHtmlName = argv["_"][0];
    var selectors = [].concat(argv["selector"] || ["link@href", "script@src"]);
    var queryParam = argv["query"] || "";
    var nameTemplate = argv["name"] || queryParam ? "{path}{extension}" : "{path}-{hash}{extension}";
    var inputHtmlContent = fs.readFileSync(inputHtmlName);
    var htmlPath = fs.realpathSync(inputHtmlName);
    var htmlBasePath = htmlPath.substr(0, htmlPath.lastIndexOf("/"));
    var dom = cheerio.load(String(inputHtmlContent));

    processResources(dom);
    return new Buffer(dom.html());

    function processResources(dom) {
        selectors.map(splitSelector).forEach(function (pair) {
            dom(pair[0]).each(function (_, element) {
                processResource(element, pair[1]);
            });
        });
    }

    function splitSelector(selector) {
        var index = selector.lastIndexOf("@");
        var elementName = selector.substring(0, index);
        var attributeName = selector.substring(index + 1);

        return [elementName, attributeName];
    }

    function processResource(el, attr) {
        var link = dom(el).attr(attr);

        if (isLocal(link)) {
            var content = readFile(link);
            var hash = generateHash(content);

            var filePath = path.parse(link);
            var newLink =
                nameTemplate
                    .replace("{path}", path.join(filePath.dir, filePath.name))
                    .replace("{hash}", hash)
                    .replace("{extension}", filePath.ext);

            var newFile = path.join(htmlBasePath, url.parse(newLink).pathname);
            fs.writeFileSync(newFile, content);

            if(queryParam) {
                newLink = appendHashInQueryParam(newLink, hash);
            }
            dom(el).attr(attr, newLink);
        }

    }

    function appendHashInQueryParam(link, hash) {
        var parsedLink = url.parse(link, true);

        if(typeof parsedLink.query[queryParam] !== "undefined") {
            parsedLink.query[queryParam] = [hash].concat(parsedLink.query[queryParam]);
        } else {
            parsedLink.query[queryParam] = hash;
        }
        parsedLink.search = ""; // otherwise query changes may have no effect
        return url.format(parsedLink);
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