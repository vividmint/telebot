const mysql = require('../mysql');
const request = require('../request.js');
const url = require("url");
const ENV = process.env.NODE_ENV;



const {
    TELEBOT_TOKEN
} = require('../constans.js');

exports.telebot = async (ctx) => {
    const obj = ctx.request.body;
    var thirdPartyId = obj.message.from.id;
    var text = obj.message.text;
    var uid = obj.message.chat.username;
    var nickname = obj.message.chat.first_name + obj.message.chat.last_name;
    var date = new Date();
    var createdAt = date.getTime();
    var reply;

    let queryUserString = `SELECT * FROM user WHERE thirdPartyId="${thirdPartyId}" and thirdPartyType="tg"`;

    try {
        var queryResultArr = await mysql.query(queryUserString);
    } catch (e) {
        console.log(e);
        ctx.status = 504;
        ctx.body = e;
        return;
    }
    if (queryResultArr.length === 0) {
      //new user
        let signUpString = `INSERT INTO user(id, uid,thirdPartyId, nickname, createdAt, lastViewId,thirdPartyType) VALUES (null,"${uid}","${thirdPartyId}","${nickname}",${createdAt},1,"tg")`;
        try {
            var signUpRusult = await mysql.query(signUpString);
            console.log("signUpRusult", signUpRusult)

        } catch (e) {
            console.log(e);
            ctx.status = 504;
            ctx.body = e;
            return;
        }
        var queryMovieString = `SELECT * FROM movie WHERE id=1`;
        try {
            var movieArr = await mysql.query(queryMovieString);
            console.log("movieArr", movieArr);

        } catch (e) {
            console.log(e);
            ctx.status = 504;
            ctx.body = e;
            return;
        }
        var movieData = movieArr[0];

        reply = `${movieData.name}\n豆瓣评分：${movieData.score}\n主演：${movieData.info}`;
        console.log('reply',reply);


    } else {
      //old user
      reply = '你是个old man'
    }
    var url = `https://api.telegram.org/bot${TELEBOT_TOKEN}/sendMessage?chat_id=${thirdPartyId}&text=${encodeURIComponent(reply)}`;
    console.log('url',url)
    let result = /movie/.test(text);
    if (result) {
        //根据环境变量设置代理
        const config = {
            url
        }
        console.log(ENV);
        if (ENV !== 'production') {
            config.proxy = "http://127.0.0.1:1087"
        }
        try {
            var tgResult = await request(config);

        } catch (e) {
            ctx.status = 500;
            ctx.body = e;
            return;

        }
        ctx.body = tgResult;
    }

}
