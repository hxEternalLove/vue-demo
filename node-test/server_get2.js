const http = require('http')
const url = require('url')
const querystring = require('querystring')

let server = http.createServer((req, res)=>{
  let result = url.parse(req.url, true)

  console.log(result)
})

server.listen(8080);