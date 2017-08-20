{
    "chat_id": 399350232,
    "text": "reply",
    "reply_markup": {
        "inline_keyboard": [
            [{
                "text": "like",
                "callback_data": {
                    "movieId": 1,
                    "type": "like"
                }
            }, {
                "text": "nope",
                "callback_data": {
                    "movieId": 2,
                    "type": "nope"
                }
            }]
        ]
    }
}

{
    "update_id": 685755613,
    "message": {
        "message_id": 10,
        "from": {
            "id": 399350232,
            "first_name": "\u5356\u6c14",
            "last_name": "\u7403\u7684",
            "username": "vividmint",
            "language_code": "zh-Hans-GI"
        },
        "chat": {
            "id": 399350232,
            "first_name": "\u5356\u6c14",
            "last_name": "\u7403\u7684",
            "username": "vividmint",
            "type": "private"
        },
        "date": 1501615657,
        "text": "movie"
    }
}

{
    "update_id": 685755723,
    "callback_query": {
        "id": "1715196186662985974",
        "from": {
            "id": 399350232,
            "first_name": "卖气",
            "last_name": "球的",
            "username": "vividmint",
            "language_code": "zh-Hans-CN"
        },
        "message": {
            "message_id": 153,
            "from": {
                "id": 345452566,
                "first_name": "movies",
                "username": "idiotMint_bot"
            },
            "chat": {
                "id": 399350232,
                "first_name": "卖气",
                "last_name": "球的",
                "username": "vividmint",
                "type": "private"
            },
            "date": 1502987405,
            "text": "《爱乐之城》\n豆瓣评分：8\n主演：达米恩·查泽雷/瑞恩·高斯林/艾玛·斯通/约翰·传奇/剧情/爱情/歌舞/2017-02-14(中国大陆)"
        },
        "chat_instance": "-6918145150661799019",
        "data": "{\"movieId\":\"7\",\"type\":\"like\"}"
    }
}



config {
    url: 'https://api.telegram.org/bot345452566:AAFU0_F0sGnIrrUHBqrdr51WdZrtrhQJXwk/sendMessage',
    method: 'POST',
    body: {
        chat_id: 399350232,
        text: '《忠犬八公的故事》\n豆瓣评分：9\n主演：拉斯·霍尔斯道姆/理查·基尔/萨拉·罗默尔/琼·艾伦/剧情/2009-06-13(西雅图电影节)',
        reply_markup: {
            inline_keyboard: [Array]
        }
    },
    json: true
}
