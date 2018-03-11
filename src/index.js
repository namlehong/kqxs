// content of index.js
const http = require('http')
const app = require('express')()
const port = 3000
const request = require('request')
const cheerio = require('cheerio')

const MINGNGOC_URL = 'https://www.minhngoc.net.vn/tra-cuu-ket-qua-xo-so.html'

const REGION_TO_ID = {
  all: 0,
  south: 1,
  north: 2,
  center: 3
}

function southCenterResultExtract($){
  return $('.bkqmiennam table.rightcl').map((i, el) => {
    return {
      company: $(el).find('td').eq(0).text().replace(/[\n\t\r]/g,""),
      code: $(el).find('td').eq(1).text().replace(/[\n\t\r]/g,""),
      result: $(el).find('td div').map((i2, el2) => $(el2).text().replace(/[\n\t\r]/g,"")).get()
    };
  }).get();
}

function northResultExtract($){
  return $('.bkqtinhmienbac').map((i, el) => {
    return {
      company: 'Hà Nội',
      code: '',
      result: $(el).find('tr').slice(1).find('td div').map((i2, el2) => $(el2).text().replace(/[\n\t\r]/g,"")).get().reverse()
    };
  }).get();
}

function resultHandler(body, req, res){
  try{
    let $ = cheerio.load(body);

    let result = [].concat(southCenterResultExtract($), northResultExtract($));

    result.forEach(i => Object.assign(i, {date: req.params.year+'-'+req.params.month+'-'+req.params.day}));
  }catch(e){
    console.log(e, body);
    let result = [];
  }

  // console.log('result', $('.bkqmiennam').html());
  res.send(JSON.stringify(result));
}

app.get('/:region(all|north|center|south)/:year(\\d{4})-:month(\\d{2})-:day(\\d{2})', (req, res) => {
  console.log(req.url, req.params)
  let r = request({
    url: MINGNGOC_URL,
    qs: {
      mien: REGION_TO_ID[req.params.region],
      ngay: req.params.day,
      thang: req.params.month,
      nam: req.params.year
    }
  }, (error, response, body) => {
    if(error){
      console.log('request error', error);
      res.send(JSON.stringify([]));
      return;
    }

    console.log('response.statusCode', response.statusCode);

    if (response.statusCode == 200){
      resultHandler(body, req, res);
    } else {
      res.send(JSON.stringify([]));
    }

  });
  // res.end('Hello Node.js Server!')
});

app.listen(port, () => console.log('Example app listening on port 3000!'))
