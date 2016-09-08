var html = require('choo/html')
var css = require('sheetify')

module.exports = function defaultLayout (state, prev, send) {
  return html`<div>
    ${JSON.stringify(state)}
  </div>`
}
