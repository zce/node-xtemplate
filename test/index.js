var path = require('path')
var xTemplate = require('../')

var viewname = path.resolve(__dirname, 'demo.xtpl')

console.time('outer')
xTemplate.render(viewname, { message: 'hello world' }, function (err, result) {
  console.log(result)
  // => `<p>hello world</p>`

  console.time('inner')
  xTemplate.render(viewname, { message: 'hello world' }, function (err, result) {
    console.log(result)
    // => `<p>hello world</p>`
    console.timeEnd('inner')
  })
  console.timeEnd('outer')

  console.time('promise')
  xTemplate
    .render(viewname, { message: 'hello world' })
    .then(function (result) {
      console.log(result)
      console.timeEnd('promise')
    })
    .catch(function (error) {
      console.log(error)
      console.timeEnd('promise')
    })
})
