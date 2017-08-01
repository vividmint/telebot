var http = require("http");
var url = require("url");

function start() {
    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log("url", request.url)
        console.log("Request for " + pathname + " received.");
        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        let body = [];
        request.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            // at this point, `body` has the entire request body stored in it as a string
            console.log('body',body)
        });
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(4545);
    console.log("Server has started.");
}

start();
