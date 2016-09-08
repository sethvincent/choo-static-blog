var fs = require('fs')
var path = require('path')
var mkdir = require('mkdirp')
var each = require('each-async')
var createHTML = require('create-html')

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

    mkdir(collectionOutput, function () {
      var urlpath = config.baseurl + collection.namespace
      var filepath = path.join(collectionOutput, 'index.html')

      writeFile(urlpath, filepath, function (err) {
        if (err) return callback(err)
        writeItems(collection, collectionOutput, next)
      })
    })
  }, callback)

  function writeItems (collection, outputDir, done) {
    var items = collection.items

    each(items, function (item, i, next) {
      var urlpath = config.baseurl + collection.namespace + '/' + item.filename
      var filepath = path.join(outputDir, item.filename + '.html')
      writeFile(urlpath, filepath, next)
    }, done)
  }

  function writeFile (urlpath, filepath, next) {
    var opts = {
      title: config.title,
      head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
      body: toString(urlpath, config),
      script: config.baseurl + 'bundle.js',
      css: config.baseurl + 'bundle.css'
    }

    var html = createHTML(opts)
    fs.writeFile(filepath, html, next)
  }
}
