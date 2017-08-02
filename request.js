var axios = require('axios');

function request(params) {
    let url = params.url;
    let method;
    if (!params.method) {
        method = 'GET';
    } else {
        method = params.method;
    }
    var obj = {
        method: params.method,
        mode: 'cors'
    };
    axios.get(url)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
}
exports.request = request;
