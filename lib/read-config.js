var path = require('path')
var assert = require('assert')
var xtend = require('xtend')
var route = require('./route')

var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g')

module.exports = function (config) {
  assert.ok(config, 'config object is required')
  var cfg = xtend(config)

  Object.keys(cfg.collections).forEach(function (key) {
    var col = config.collections[key]
    config.collections[key].parsedRoute = route.parse(col.route)
  })

  return cfg
}

