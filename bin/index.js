#! /usr/bin/env node

var fs = require('fs')
var url = require('url')
var path = require('path')
var assert = require('assert')
var apply = require('async.applyeachseries')
var parsePath = require('parse-filepath')
var minimist = require('minimist')
var each = require('each-async')
var extend = require('extend')
var mkdir = require('mkdirp')
var rm = require('rimraf')
var exit = require('exit')

var createApp = require('../index')
var readConfig = require('../lib/read-config')
var readData = require('../lib/read-data')
var readCollection = require('../lib/read-collection')
var readLayouts = require('../lib/read-layouts')
var createHTML = require('../lib/create-html')
var createFiles = require('../lib/create-html-files')

var argv = minimist(process.argv.slice(2), {
  alias: {
    o: 'output',
    h: 'help'
  },
  default: {
    output: 'site',
  }
})

var cwd = process.cwd()
var source = argv._[0] ? path.resolve(argv._[0]) : cwd
var config = readConfig(require(source + '/config'))
config.baseurl = config.baseurl || '/'

readFiles(function (err, results) {
  results.config = config
  var app = createApp(results)

  build({
    argv: argv,
    config: config,
    source: source,
    output: path.resolve(cwd, argv.output),
    collections: results.collections,
    layouts: results.layouts,
    data: results.data,
    toString: function toString (route, state) {
      console.log('route', route)
      return app.toString(route, state)
    },
  })
})

function build (options) {
  var tasks = [
    createOutputDir,
    createHTML,
    createFiles
  ]

  apply(tasks, options, function (err) {
    if (err) return error(err)
  })
}

function readFiles (callback) {
  readLayouts({ dir: path.join(source, 'layouts' )}, function (err, layouts) {
    var collections = {}
    each(Object.keys(config.collections), function (key, i, next) {
      var collection = config.collections[key]
      collection.dir = path.join(source, key)

      readCollection(collection, function (err, result) {
        collections[key] = extend(result, collection)
        collections[key].namespace = collections[key].namespace || key
        next()
      })
    }, function (err) {
      if (err) return callback(err)
      readData({ dir: path.join(source, 'data') }, function (err, data) {
        delete config.collections
        callback(null, { collections: collections, data: data, layouts: layouts })
      })
    })
  })
}

function createOutputDir (options, callback) {
  rm(options.output, function (err) {
    if (err) return callback(err)
    mkdir(options.output, callback)
  })
}
