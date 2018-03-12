const request = require('request')
const https = require('https')


const MINGNGOC_URL = 'https://www.minhngoc.net.vn/tra-cuu-ket-qua-xo-so.html'

var pool = new https.Agent();
pool.maxSockets = 3;

for(var i = 0; i < 10; i++){
  console.log('start request '+i);
  request({url: MINGNGOC_URL, qs: {
      mien: 0,
      ngay: 3,
      thang: 3,
      nam: 2018
  },
  agent:pool}, (err, res, body) => {
    if(err){
      console.error('error at ' + i, err);
    } else {
      console.log('res at '+ i, res.statusCode);
    }
  })
}
