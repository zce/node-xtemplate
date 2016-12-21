'use strict'
var path = require('path')
var XTemplate = require('xtemplate')
var XTemplateRuntime = require('xtemplate/lib/runtime')
var cache = require('./cache')

var util = XTemplateRuntime.util

// ====================================================== //
// ================= Utilities functions ================ //
// ====================================================== //

function getInstance (options) {
  return new XTemplate({
    name: options.name,
    extname: options.extname,
    loader: {
      cache: {},
      load: function (tpl, callback) {
        console.log(tpl)
      }
    }
  })
}

// ====================================================== //
// =================== Public methods =================== //
// ====================================================== //

function config () {
  XTemplate.config.apply(arguments)
}

function addCommand () {
  XTemplate.addCommand.apply(arguments)
}

function removeCommand () {
  XTemplate.removeCommand.apply(arguments)
}

function render (name, data, options, callback) {
  options = options || {}
  name = path.normalize(name)
  options.name = name
  var engine = getInstance(options)
  return engine.render(data, { commands: options.commands }, callback)
}

module.exports = {
  config: config,
  addCommand: addCommand,
  removeCommand: removeCommand,
  render: render,
  XTemplate: XTemplate
}
