// var request = require('./request.js');
// console.log('start')
// request({
// url:`http://google.com`,
// proxy: {
//   host: '127.0.0.1',
//   port: 1087
// },
// }).then(function(res) {
//       console.log("kkkkkkkk",res);
//   })
//   .catch(function(error) {
//       console.log(error);
//   });
var request = require('request')

request({
  url:"https://api.telegram.org/bot345452566:AAFU0_F0sGnIrrUHBqrdr51WdZrtrhQJXwk/getMe",
  proxy:"http://127.0.0.1:1087"
},function(e,r,b){
  console.log('e',e)
  console.log('b',b)
})
