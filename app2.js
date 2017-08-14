"use strict";
const AV = require('leancloud-storage');
const http = require("http");
const url = require("url");
const request = require('./request.js');
const {
    TOKEN
} = require('./constans');
const ENV = process.env.NODE_ENV;

AV.init({
    appId: "fwNTEgKvtqXmGdin8NH3k6nR-gzGzoHsz",
    appKey: "6zhh6evebN7hiOMazqv6lnbN"
});
console.log('env', ENV)

var data = {
    userInfo: {},
    movieData: {}
};

function start() {
    function onRequest(req, response) {
        var pathname = url.parse(req.url).pathname;

        response.writeHead(200, {
            "Content-Type": "application/json"
        });
        let body = "";
        req.on('data', (chunk) => {
            body += chunk;
        }).on('end', () => {
          console.log('body',body);
          // return;
            try {
                var obj = JSON.parse(body);
            } catch (e) {
                response.end(JSON.stringify({
                    code: 2017,
                    message: "json解析出错"
                }));
                return;
            }
            var chatId = obj.message.chat.id;
            var text = obj.message.text;
            var uid = obj.message.chat.username;
            var reply = "en";

            toLogin(uid);

        //
        //     var url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${chatId}&text=${reply}`;
        //     let result = /movie/.test(text);
        //     if (result) {
        //         //根据环境变量设置代理
        //         const config = {
        //             url
        //         }
        //         console.log(ENV);
        //         if (ENV !== 'production') {
        //             config.proxy = "http://127.0.0.1:1087"
        //         }
        //         request(config).then(function(r) {
        //             console.log(r)
        //         }).catch(function(e) {
        //             console.log("error", e)
        //         })
        //     }
        });

    }

    http.createServer(onRequest).listen(4545);
}

start();

function toLogin(uid) {
    var currentUser = AV.User.current();
    if (currentUser) {
        // 获取电影信息
        getObjectId();
    } else {
        //currentUser 为空时，可打开用户注册界面…
        AV.User.signUpOrlogInWithAuthData({
            'uid': uid,
        }, 'telegram');
        getObjectId();
    }
}

function getObjectId(params) {
    var query = new AV.Query('MovieData');
    var objectId;
    if (params) {
        objectId = params.fromId;
    } else {
        query.equalTo('priority', 0);
        query.first().then(function(data) {
            // data 就是符合条件的第一个 AV.Object
            console.log("firsrId", data);
            // getMovieData(objectId)
        }, function(e) {
            console.log(e)
        });
    }
}

function getMovieData(objectId) {
    query.get(objectId).then(function(todo) {
        console.log('MovieData', todo)
    }, function(error) {
        // 异常处理
    });
}

function saveLastViewId(id) {
    var _user = AV.Object.createWithoutData('_User', this.data.userInfo.objectId);
    // 修改属性
    _user.set('lastViewId', id);
    // 保存到云端
    _user.save();
}
// ps aux|grep node
// kill 2343
