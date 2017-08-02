"use strict";
var http = require("http");
var url = require("url");

var token = "345452566:AAFU0_F0sGnIrrUHBqrdr51WdZrtrhQJXwk";

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
            console.log('body', body);
            var obj = body.message;
            console.log(obj)
            // var id = body.message.chat.id;
            // var text = body.message.text;
            // var result = /hi/.test(text);
            // var reply = "你好，全世界最可爱的宝宝";
            // if (result) {
            //     request({
            //         url: `https://api.telegram.org/bot
            //     ${token}/sendMessage?chat_id=${id}&text=${reply}`
            //     })
            // }
        });
        response.write("Hello World");
        response.end();
    }

    http.createServer(onRequest).listen(4545);
    console.log("Server has started.");
}

start();

function request(params) {
    let url = params.url;
    let method;
    if (!params.method) {
        method = 'GET';
    } else {
        method = params.method;
    }
    var obj = {
        method: params.method,
        mode: 'cors'
    };
    if (method == 'POST' || method == 'DELETE') {
        obj.body = JSON.stringify(params.body);
    }
    if (false) {
        return fetch(url, obj).then(function(response) {
            //console.log(response);
            if (response.status >= 200 && response.status < 300) {
                return response.json();
            } else {
                return response.json();
            }
        }, function(err) {
            console.log(err);
            return Promise.reject(err);
        });
    } else {
        return new Promise(function(resolve, reject) {
            // console.log(url);
            var httpRequest = new XMLHttpRequest();
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        try {
                            // console.log(httpRequest.response);
                            var data = JSON.parse(httpRequest.response);
                            resolve(data);
                        } catch (e) {
                            reject('json解析错误');
                        }

                    } else {
                        var e = JSON.parse(httpRequest.response);
                        console.log(e);
                        reject(e);
                    }
                }

            };
            httpRequest.open(method, url, true);
            if (method === 'GET') {
                httpRequest.send(null);
            } else if (method === 'POST' || method === 'DELETE' || method === 'PUT') {
                httpRequest.setRequestHeader('Content-Type', 'application/json');
                httpRequest.send(obj.body);
            }

        });
    }
}

// ps aux|grep node
// kill 2343
