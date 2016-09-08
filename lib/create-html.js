var fs = require('fs')
var path = require('path')
var createHTML = require('create-html')

module.exports = function (options, callback) {
  var argv = options.argv
  var config = options.config
  var output = options.output
  var toString = options.toString
  var filepath = path.join(output, 'index.html')

  var opts = {
    title: config.title,
    head: '<meta name="viewport" content="width=device-width, initial-scale=1">',
    body: toString(config.baseurl, config),
    script: config.baseurl + 'bundle.js',
    css: config.baseurl + 'bundle.css'
  }

  var html = createHTML(opts)
  fs.writeFile(filepath, html, callback)
}
