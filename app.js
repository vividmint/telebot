var Koa = require('koa');
var Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
var app = new Koa();
var router = new Router();
app.use(bodyParser());
const webhook = require('./controllers/webhook.js')

router.post('/webHook', webhook.telebot)

app
    .use(router.routes())
    .use(router.allowedMethods());


app.listen(4545);
console.log('listen at 4545')
