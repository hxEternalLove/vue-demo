const http = require('http')
const querystring = require('querystring')

let server = http.createServer((req, res)=>{
  let [url, query] = req.url.split('?')
  let get = querystring.parse(query)

  console.log(url,"\nO(∩_∩)O哈！\n", get)
})

server.listen(8080);