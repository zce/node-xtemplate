'use strict'
var storage = {}

module.exports = {
  get: function (key) {
    return storage[key]
  },
  set: function (key, value) {
    storage[key] = value
  },
  remove: function (key) {
    storage[key] && delete storage[key]
  },
  clear: function () {
    for (var key in storage) {
      delete storage[key]
    }
  }
}
