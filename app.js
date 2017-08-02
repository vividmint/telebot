"use strict";
var http = require("http");
var url = require("url");
var request = require('./request.js');
var ENV = process.env.NODE_ENV;
var token = "345452566:AAFU0_F0sGnIrrUHBqrdr51WdZrtrhQJXwk";
console.log(ENV)
// var a = {ba:1,c:2}
// const {ba} = a;
function start() {
    function onRequest(req, response) {
        var pathname = url.parse(req.url).pathname;

        response.writeHead(200, {
            "Content-Type": "text/plain"
        });
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            var obj = JSON.parse(body);
            var id = obj.message.chat.id;
            var text = obj.message.text;
            var reply = "hi";
            var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${id}&text=${reply}`;
            if (text) {
                const config = {
                    url
                }
                console.log(ENV)
                if(ENV !== 'production'){
                  config.proxy = "http://127.0.0.1:1087"
                }
                request(config).then(function(r) {
                    console.log(r)
                }).catch(function(e) {
                    console.log(e)
                })
            }
        });
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(4545);
}

start();



// ps aux|grep node
// kill 2343
