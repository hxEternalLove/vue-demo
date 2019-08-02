const http = require('http')

const querystring = require('querystring')

let server = http.createServer((req, res)=>{
  let arr = [];
  req.on('data',(buffer)=>{
    arr.push(buffer)
    console.log(buffer,buffer.toString());
  })

  req.on('end',()=>{
    let buffer = Buffer.concat(arr);
    let post = querystring.parse(buffer.toString())    
    console.log(post)
  })
})

server.listen(8080);