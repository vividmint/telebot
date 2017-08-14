var Koa = require('koa');
var Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const {
    TELEBOT_TOKEN,
    BUTTON_LIKE,
    BUTTON_UNLIKE,
    LEANCLOUD_APP_ID,
    LEANCLOUD_APP_KEY
} = require('./constans.js');
var app = new Koa();
var router = new Router();
app.use(bodyParser());
const webhook = require('./controllers/webhook.js')

router.post('/webHook', webhook.telebot)

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(3000);
console.log('listen at 3000')
