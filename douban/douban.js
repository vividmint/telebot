var axios = require('axios');
const mysql = require('../mysql')

let times = 0;
let num = 0,
    count = 10,
    start = num * count;
let detailUrl;
var flag = true;
var fromId = null;

async function produceData(params) {
    //获取数据
    var data = params.data;
    var name, score, picUrl, detail;
    var arr = [];
    for (let i = 0; i < data.length; ++i) {
        var obj = {};
        obj.name = data[i].name;
        obj.score = data[i].score;
        obj.info = data[i].info;
        obj.picUrl = data[i].picUrl;
        arr.push(obj);
    }

    var valueArr = arr.map(item => (`(null, "${item.name}", "${item.score}", "${item.info}", "${item.picUrl}")`))

    var t = `INSERT INTO movie(id, name, score, info, picUrl) VALUES ${valueArr.join(',')}`;

    try {
        var movie = await mysql.query(t);
        params.success();

    } catch (e) {
        console.log("e", e)
        return;
    }

    // console.log("objects",objects)

}



function getData(params) {
    function cb(data) {
        // console.log(data);
        var name, score, picUrl;
        var arr = [];
        let dataArr = data.subject_collection_items;
        for (var i = 0; i < dataArr.length; ++i) {
            let obj = {};
            obj.messageId = dataArr[i].id;
            obj.name = dataArr[i].title;
            obj.score = dataArr[i].rating.value;
            obj.info = dataArr[i].info;
            var re = /h\/200\//;
            obj.picUrl = dataArr[i].cover.url.replace(re, 'h/800/');
            arr.push(obj);
            // detailUrl = `https://m.douban.com/movie/subject/${dataArr[i].id}/`
        }
        start += arr.length;
        times++;
        params.success(arr);
        console.log("start",start)
    }
    axios.get(`https://m.douban.com/rexxar/api/v2/subject_collection/filter_movie_score_hot/items?os=ios&for_mobile=1&callback=cb&start=${start}&count=${count}`)
        .then(function(res) {
            var toData = eval(res.data);
        })
        .catch(function(error) {
            console.log(error);
        });
}

function init() {
    // if (times <= 5) {
        if (flag) {
            getData({
                success: function(data) {
                    if (data.length === 0) {
                        flag = false;
                        console.log('end')
                        return;
                    }
                    produceData({
                        data,
                        success: function(data) {
                            // console.log(data)
                            init();
                        }
                    });
                },
                err: function(e) {
                    console.log(e)
                }
            })
        }
    // }

}
init();
