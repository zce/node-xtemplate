var fs = require('fs')
var path = require('path')

var Promise = require('bluebird')
var iconv = require('iconv-lite')
var XTemplate = require('xtemplate')
var objectAssign = require('object-assign')

var env = process.env.NODE_ENV || 'development'

var fileCache = {}
var instanceCache = {}
var fnCache = {}

var loader = {
  load: function (tpl, callback) {
    var cache = tpl.root.config.cache
    if (cache && fnCache[tpl.name]) return callback(0, fnCache[tpl.name])

    readFile(tpl.name, tpl.root.config, function (err, content) {
      if (err) return callback(err)

      try {
        var compiler = tpl.root.compile(content, tpl.name)
        if (cache) fnCache[tpl.name] = compiler
        callback(null, compiler)
      } catch (e) {
        return callback(e)
      }
    })
  }
}

var defaultOptions = {
  catchError: env !== 'production',
  cache: env === 'production',
  encoding: 'utf-8',
  strict: false,
  loader: loader,
  commands: {}
}

function readFile (name, config, callback) {
  var cached
  if (config.cache && (cached = fileCache[name])) return callback(null, cached)

  fs.readFile(name, function (err, content) {
    if (err) return callback(err)

    content = Buffer.isEncoding(config.encoding)
      ? content.toString(config.encoding)
      : iconv.decode(content, config.encoding)

    if (config.cache) fileCache[name] = content
    callback(null, content)
  })
}

function getInstance (options) {
  var cached
  if (options.cache && (cached = instanceCache[options.name])) return cached
  cached = new XTemplate(objectAssign({}, defaultOptions, options))
  if (options.cache) instanceCache[options.name] = cached
  return cached
}

// main
function render (name, data, options, callback) {
  options = options || {}

  var engine = getInstance(objectAssign({}, options, {
    name: path.normalize(name),
    extname: path.extname(name)
  }))

  if (typeof callback === 'function') {
    return engine.render(data, options, callback)
  }

  return new Promise(function (resolve, reject) {
    engine.render(data, options, function (err, content) {
      if (err) return reject(err)
      resolve(content)
    })
  })
}

/**
 * load xtemplate from file on nodejs
 * @singleton
 */
module.exports = {
  render: render,

  config: function (options) {
    if (!options) return defaultOptions
    objectAssign(defaultOptions, options)
  },

  getCaches: function () {
    return {
      instance: instanceCache,
      file: fileCache,
      fn: fnCache
    }
  },

  getCache: function (name) {
    return {
      instance: instanceCache[name],
      file: fileCache[name],
      fn: fnCache[name]
    }
  },

  clearCache: function (name) {
    delete instanceCache[name]
    delete fileCache[name]
    delete fnCache[name]
  }
}

Object.defineProperty(module.exports, 'XTemplate', {
  get: function () {
    return XTemplate
  }
})
