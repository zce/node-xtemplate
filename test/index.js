var path = require('path')
var assert = require('assert')
var xTemplate = require('../')

describe('Basic', function() {
  it('should return `<p>hello world</p>` when the message is `hello world`', function() {
    xTemplate.render(path.resolve(__dirname, 'demo.xtpl'), {
      message: 'hello world'
    }, function (err, result) {
      // callback
      assert.equal('<p>hello world</p>', result)
    })
  })
})
