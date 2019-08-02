const multer = require('multer')
const http = require('http')
// request, response  
let server = http.createServer((req, res)=>{

  console.log(req.url)
  res.write('abc');
  res.end();
})

server.listen(8080);