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
    console.log('=====================================')
    console.log('webhook request', obj)
    var _obj = (JSON.stringify(obj, null, 2));
    var messageObj, _movieObj;
    if (obj.callback_query) {
        //button消息
        messageObj = obj.callback_query;
    } else {
        //用户发movie
        messageObj = obj;
    }

    var thirdPartyId = messageObj.message.chat.id;
    var text = messageObj.message.text;
    var username = messageObj.message.chat.username;
    var nickname = messageObj.message.chat.first_name + messageObj.message.chat.last_name;
    var date = new Date();
    var createdAt = date.getTime();
    var reply, lastViewId;

    try {
        var queryResultArr = await queryUser(thirdPartyId);
    } catch (e) {
        console.log('e', e);
        ctx.status = 500;
        ctx.body = e;
        return;
    }

    if (queryResultArr.length === 0) {
        //new user
        signUp({
            thirdPartyId,
            username,
            nickname,
            createdAt
        });
        lastViewId = 1;

    } else {
        //old user
        lastViewId = queryResultArr[0].lastViewId;
    }
    if (obj.callback_query) {
        let movieObj = JSON.parse(obj.callback_query.data);
        _movieObj = movieObj;
        if (movieObj.type === 'like') {
            //喜欢电影
            postLike(_movieObj, thirdPartyId);
        }

    } else {

        //用户发movie
    }
    try {
        var movieData = await queryMovieData(lastViewId);
    } catch (e) {
        console.log("e", e);
        ctx.status = 500;
        ctx.body = e;
        return;
    }

    reply = `《${movieData.name}》\n豆瓣评分：${movieData.score}\n主演：${movieData.info}`;


    var url = `https://api.telegram.org/bot${TELEBOT_TOKEN}/sendPhoto`;
    let result = /movie|🙋/.test(text);
    let getList = /❤️/.test(text);
    if (getList) {
        var likeListArr = await queryLikeList(thirdPartyId);
        console.log("likeListArr",likeListArr)
        if (likeListArr.length === 0) {
            reply = "暂时没有喜欢的电影~";
        } else {
            let likeMovieArr = [];
            for (let i = 0; i < likeListArr.length; ++i) {
                try {
                    var likeMovieData = await queryMovieData(likeListArr[i].movieId);
                    likeMovieArr.push(likeMovieData);
                    console.log("likeMovieArr", likeMovieArr);
                } catch (e) {
                    console.log('e', e);
                }

            }
            for(let i=0;i<likeMovieArr.length;++i){
              reply = `《${likeMovieArr[i].name}》\n豆瓣评分：${likeMovieArr[i].score}\n主演：${likeMovieArr[i].info}`;
            }
            console.log("reply",reply)
        }
    }
    if (result || _movieObj) {
        //根据环境变量设置代理
        const config = {
            url,
            method: "POST",
            body: {
                "chat_id": thirdPartyId,
                "photo": movieData.picUrl,
                "caption": reply,
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
                    ],
                    "keyboard": [
                        [{
                            "text": "🙋"
                        }, {
                            "text": "❤️"
                        }]
                    ]
                }
            },
            json: true
        }
        console.log("config", config);
        console.log(ENV);
        if (ENV !== 'production') {
            config.proxy = "http://127.0.0.1:1087"
        }
        try {
            var tgResult = await request(config);

            setLastViewId({
                lastViewId,
                username
            })

        } catch (e) {
            console.log("e", e);
            ctx.status = 500;
            ctx.body = e;
            return;

        }
        console.log('last ok')
        ctx.body = 'ok';
    } else {
        console.log("other")
        ctx.body = "other";
    }

}
async function queryUser(thirdPartyId) {
    let queryUserString = `SELECT * FROM user WHERE thirdPartyId="${thirdPartyId}" and thirdPartyType="tg"`;

    try {
        var queryResultArr = await mysql.query(queryUserString);
    } catch (e) {
        console.log(e);
        return Promise.reject(e);
    }
    return queryResultArr;
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

async function queryLikeList(id) {
    var queryListString = `SELECT * FROM likeList WHERE uid=${id}`;
    try {
        var likeListArr = await mysql.query(queryListString);
        return likeListArr;

    } catch (e) {
        console.log('e', e);
        return Promise.reject(e);
    }

}

async function setLastViewId(params) {
    var setLastViewIdString = `UPDATE user SET lastViewId=${params.lastViewId+1} WHERE username="${params.username}"`;
    try {
        var setLastViewIdArr = await mysql.query(setLastViewIdString);
        console.log("set ok")

    } catch (e) {
        console.log('e', e);
        return Promise.reject(e);
    }
}

async function postLike(obj, thirdPartyId) {
    let movieId = obj.movieId;
    let date = new Date();
    let createdAt = date.getTime();

    var insertLikeIdString = `INSERT INTO likeList(id,thirdPartyId,movieId,createdAt,updatedAt) VALUES(null,${thirdPartyId},${movieId},${createdAt},${createdAt})`;
    try {
        var insertLikeIdResult = await mysql.query(insertLikeIdString);
    } catch (e) {
        console.log('e', e);
        return Promise.reject(e);
    }
}

async function signUp(params) {
    let signUpString = `INSERT INTO user(id, username,thirdPartyId, nickname, createdAt, lastViewId,thirdPartyType) VALUES (null,"${params.username}","${params.thirdPartyId}","${params.nickname}",${params.createdAt},1,"tg")`;
    try {
        var signUpRusult = await mysql.query(signUpString);

    } catch (e) {
        console.log('e', e);
        return Promise.reject(e);
    }
}
