const mysql = require('../mysql');
const request = require('../request.js');
const url = require("url");
const ENV = process.env.NODE_ENV;

const {
    TELEBOT_TOKEN,
    BUTTON_LIKE,
    BUTTON_UNLIKE,
    LEANCLOUD_APP_ID,
    LEANCLOUD_APP_KEY
} = require('../constans.js');

exports.telebot = async(ctx) => {
    const obj = ctx.request.body;
    console.log('webhook request')
    console.log('body', obj)
    if (obj.callback_query) {
        let movieObj = JSON.parse(obj.callback_query.data);
        if (movieObj.type === 'like') {
            let movieId = movieObj.movieId;
            let _date = new Date();
            let _createdAt = _date.getTime();

            var insertLikeIdString = `INSERT INTO likeList(id,movieId,createdAt,updatedAt) VALUES(null,${movieId},${_createdAt},${_createdAt})`;
            try {
                var insertLikeIdResult = await mysql.query(insertLikeIdString);
                console.log("like success",insertLikeIdString);
            } catch (e) {
                console.log('e', e);
            }

        }

    } else {
        var thirdPartyId = obj.message.from.id;
        var text = obj.message.text;
        var username = obj.message.chat.username;
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
        var lastViewId;
        console.log("queryResultArr",queryResultArr)
        if (queryResultArr.length === 0) {
            //new user
            let signUpString = `INSERT INTO user(id, username,thirdPartyId, nickname, createdAt, lastViewId,thirdPartyType) VALUES (null,"${username}","${thirdPartyId}","${nickname}",${createdAt},1,"tg")`;
            try {
                var signUpRusult = await mysql.query(signUpString);
                console.log("signUpRusult", signUpRusult)

            } catch (e) {
                console.log(e);
                ctx.status = 504;
                ctx.body = e;
                return;
            }
            lastViewId = 1;
        } else {
            //old user
            lastViewId = queryResultArr[0].lastViewId;
            console.log('here',lastViewId)
        }

    }
    console.log("lastViewId",lastViewId)
    try {
        var movieData = await queryMovieData(lastViewId);
    } catch (e) {
        console.log(e)
    }

    reply = `《${movieData.name}》\n豆瓣评分：${movieData.score}\n主演：${movieData.info}`;

    var url = `https://api.telegram.org/bot${TELEBOT_TOKEN}/sendMessage`;
    let result = /movie/.test(text);
    if (result) {
        //根据环境变量设置代理
        const config = {
            url,
            method: "POST",
            body: {
                "chat_id": thirdPartyId,
                "text": reply,
                "reply_markup": {
                    "inline_keyboard": [
                        [{
                                "text": BUTTON_LIKE,
                                "callback_data": JSON.stringify({
                                    "movieId": `${movieData.id}`,
                                    "type": "like"
                                })
                            },
                            {
                                "text": BUTTON_UNLIKE,
                                "callback_data": JSON.stringify({
                                    "movieId": `${movieData.id}`,
                                    "type": "nope"
                                })
                            }
                        ]
                    ]
                }
            },
            json: true
        }
        console.log(ENV);
        if (ENV !== 'production') {
            config.proxy = "http://127.0.0.1:1087"
        }
        try {
            var tgResult = await request(config);
            console.log("tgResult", tgResult);

            var setLastViewId = `UPDATE user SET lastViewId=${lastViewId+1} WHERE username="${username}"`;
            try{
              var setLastViewIdResult = await mysql.query(setLastViewId);

            }catch(e){
              console.log('e',e);
            }

        } catch (e) {
            ctx.status = 500;
            ctx.body = e;
            return;

        }
        ctx.body = tgResult;
    }

}

async function queryMovieData(id) {
    var queryMovieString = `SELECT * FROM movie WHERE id=${id}`;

    try {
        var movieArr = await mysql.query(queryMovieString);

    } catch (e) {
        console.log(e);
        // ctx.status = 504;
        // ctx.body = e;
        return Promise.reject(e);
    }
    var movieData = movieArr[0];
    return movieData;
}
