const fs = require('fs')

// fs.writeFile(path, data, callback)
// fs.readFile(path, callback)
// fs.writeSync同步

// fs.writeFile('./a.txt', 'asadasada', err=>{
//   if (err) {
//     console.log('失败了', err)
//   } else {
//     console.log('成功')
//   }
// })

fs.readFile('./a.txt', (err, data)=>{
  if (err) {
    console.log('错了',err)
  } else {
    console.log('成功', data.toString())
  }
})