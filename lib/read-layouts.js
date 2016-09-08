var path = require('path')
var assert = require('assert')
var bulk = require('bulk-require')

module.exports = function readLayouts (options, callback) {
  callback(null, bulk(options.dir, '**/*.js'))
}
