var fs = require('fs')
var path = require('path')
var mkdir = require('mkdirp')
var each = require('each-async')
var createHTML = require('create-html')
var route = require('./route')

module.exports = function createFiles (options, callback) {
  var argv = options.argv
  var config = options.config
  var output = options.output
  var toString = options.toString
  var collectionKeys = Object.keys(options.collections)

  each(collectionKeys, function (key, i, next) {
    var collection = options.collections[key]
    collection.namespace = collection.namespace || key
    var collectionOutput = path.join(output, collection.namespace)
    var dirpath = options.ouput + route.stringify(collection.parsedRoute, '')
    var filepath = dirpath + '/index.html'

    writeFile(dirpath, filepath, function (err) {
      if (err) return callback(err)
      writeItems(collection, next)
    })
  }, callback)

  function writeItems (collection, done) {
    var items = collection.items

    each(items, function (item, i, next) {
      var params = {}
      params[collection.namespace] = item.filename
      var dirpath = options.output + route.stringify(collection.parsedRoute, item.filename)
      var filepath = dirpath + '/index.html'

      writeFile(dirpath, filepath, next)
    }, done)
  }

  function writeFile (dirpath, filepath, next) {
    var opts = {
      title: config.title,
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      body: toString(dirpath, config),
      script: config.baseurl + 'bundle.js',
      css: config.baseurl + 'bundle.css'
    }

    mkdir.sync(dirpath)
    var html = createHTML(opts)
    fs.writeFile(filepath, html, next)
  }
}
