var html = require('choo/html')
var css = require('sheetify')

module.exports = function (state, prev, send) {
  return html`<div>${state.params}</div>`
}
