var fs = require('fs')
var path = require('path')

var iconv = require('iconv-lite')
var XTemplate = require('xtemplate')
var XTemplateRuntime = require('xtemplate/lib/runtime')

var util = XTemplateRuntime.util

var env = process.env.NODE_ENV || 'development'

var loader = {
  load: function (tpl, callback) {
    getTemplateFunc(tpl.root, tpl.name, tpl.root.config, callback)
    // var template = tpl.root
    // var name = tpl.name
    // var rootConfig = template.config
    // var extname = rootConfig.extname
    // var pathExtName
    // var ind = name.length - extname.length
    // if (ind >= 0 && name.indexOf(extname, ind) === ind) {
    //   pathExtName = extname
    // } else {
    //   pathExtName = path.extname(name)
    //   if (!pathExtName) {
    //     pathExtName = extname
    //     name += pathExtName
    //   }
    // }
    // if (pathExtName !== extname) {
    //   readFile(name, rootConfig, callback)
    // } else {
    //   getTemplateFunc(template, name, rootConfig, callback)
    // }
  }
}

var globalConfig = {
  catchError: env !== 'production',
  cache: env === 'production',
  encoding: 'utf-8',
  loader: loader,
  commands: {},
  XTemplate: XTemplate
}

var fileCache = {}
var instanceCache = {}
var fnCache = {}

function compile (root, tpl, name, callback) {
  var fn
  try {
    fn = root.compile(tpl, name)
  } catch (e) {
    return callback(e)
  }
  callback(null, fn)
}

function getTemplateFunc (root, name, config, callback) {
  var cache = config.cache
  if (cache && fnCache[name]) {
    return callback(0, fnCache[name])
  }
  readFile(name, config, function (error, tpl) {
    if (error) {
      callback(error)
    } else {
      compile(root, tpl, name, function (err, fn) {
        if (err) {
          callback(err)
        } else {
          if (cache) {
            fnCache[name] = fn
          }
          callback(null, fn)
        }
      })
    }
  })
}

function getInstance (config) {
  var cached
  if (config.cache && (cached = instanceCache[config.name])) {
    return cached
  }
  var instance = new globalConfig.XTemplate(config)
  if (config.cache) {
    instanceCache[config.name] = instance
  }
  return instance
}

function render (name, data, options, callback) {
  options = options || {}

  name = path.normalize(name)

  var extname = path.extname(name)

  var engine = getInstance({
    name: name,
    extname: extname,
    loader: getOption(options, 'loader'),
    commands: getOption(options, 'commands'),
    cache: getOption(options, 'cache'),
    strict: getOption(options, 'strict'),
    encoding: getOption(options, 'encoding'),
    catchError: getOption(options, 'catchError')
  })

  return engine.render(data, options, callback)
}

function readFileSync (name) {
  var content, error
  try {
    content = fs.readFileSync(name)
  } catch (e) {
    error = e
  }
  return { content: content, error: error }
}

function readFile (name, config, callback) {
  var cache = config.cache
  var cached
  if (cache && (cached = fileCache[name])) {
    return callback(null, cached)
  }
  var encoding = config.encoding
  var res = readFileSync(name)
  var content = res.content
  var error = res.error
  if (content) {
    content = Buffer.isEncoding(encoding) ? content.toString(encoding) : iconv.decode(content, encoding)
    if (!error && cache) {
      fileCache[name] = content
    }
  }
  callback(error, content)
}

function renderFile (name, options, callback) {
  if (typeof options === 'function') {
    callback = options
    options = {}
  }
  render(name, options, {
    cache: options.cache,
    commands: options.commands,
    encoding: options.settings && options.settings['view encoding']
  }, callback)
}

function getOption (options, name) {
  return options[name] === undefined ? globalConfig[name] : options[name]
}

/**
 * load xtemplate from file on nodejs
 * @singleton
 */
module.exports = {
  render: render,

  renderFile: renderFile,

  config: function (options) {
    if (!options) return globalConfig
    util.merge(globalConfig, options)
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

Object.defineProperties(module.exports, {
  XTemplate: {
    get: function () {
      return globalConfig.XTemplate
    }
  }
})
