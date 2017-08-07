"use strict";
const AV = require('leancloud-storage');

AV.init({
    appId: "fwNTEgKvtqXmGdin8NH3k6nR-gzGzoHsz",
    appKey: "6zhh6evebN7hiOMazqv6lnbN"
});
var http = require("http");
var url = require("url");
var request = require('./request.js');

const user = AV.User.current();


var ENV = process.env.NODE_ENV;
var token = "345452566:AAFU0_F0sGnIrrUHBqrdr51WdZrtrhQJXwk";
console.log(ENV)

// function getMovieData(params) {
//     var query = new AV.Query('Todo');
//     let objectId;
//     if (params.fromId) {
//         objectId = params.fromId;
//     } else {
//         // objectId = lastViewId;
//     }
//     query.get(objectId).then(function(todo) {
//
//     }, function(error) {
//         // 异常处理
//     });
// }
var buttons = {};
buttons.like = "like";
buttons.unlike = "nope";
var data = {
    userInfo: {},
    idSets: null,
    listArr: null,
    likeArr: [],
    unlikeArr: [],
    movieData: {}
};

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
            var chatId = obj.message.chat.id;
            var text = obj.message.text;
            var uid = obj.message.chat.username;
            var reply = "en";
            toLogin(uid);


            var url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${reply}`;
            let result = /movie/.test(text);
            if (result) {
                const config = {
                    url
                }
                console.log(ENV)
                if (ENV !== 'production') {
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

function toLogin(uid) {
    AV.User.signUpOrlogInWithAuthData({
        'uid': uid,
    }, 'telegram');

}

// ps aux|grep node
// kill 2343
