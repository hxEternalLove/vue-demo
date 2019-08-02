const multer = require('multer')
const http = require('http')
const fs = require('fs')
// request, response  
let server = http.createServer((req, res)=>{

  console.log(req.url)
  fs.readFile(`www/${req.url}`, (err, buffer)=>{
    if (err) {
      res.writeHeader(404)
      res.write('Not Found')
      res.end()
    } else {
      res.writeHeader(200)
      res.write(buffer)
      res.end()
    }
  })
})

server.listen(8080);