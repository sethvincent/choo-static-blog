var fs = require('fs')
var path = require('path')
var assert = require('assert')
var browserify = require('browserify')

module.exports = function buildJS (app, options, callback) {
  var argv = options.argv
  var state = options.state
  var outputDir = options.output
  var indexpath = path.join(output, 'index.js')

  var js = `
  var wj = require('../index')
  var app = wj(${JSON.stringify(state)})
  app.start('#choo-root')
  `

  fs.writeFile(indexpath, js, function (err) {
    if (err) return callback(err)
    browserify(indexpath, { paths: [path.join(__dirname, '..', 'node_modules')] })
      .plugin(require('css-extract'), { out: path.join(outputDir, 'bundle.css') })
      .bundle(function (err, src) {
        if (err) return callback(err)
        var bundlepath = path.join(outputDir, 'bundle.js')
        fs.writeFile(bundlepath, src, function (err) {
          if (err) return callback(err)
          fs.unlink(indexpath, callback)
        })
      })
  })
}
