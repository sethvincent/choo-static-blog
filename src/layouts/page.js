var html = require('choo/html')
var css = require('sheetify')

module.exports = function postLayout (state, prev, send) {
  var pagename = state.params.page
  var page = state.pages.items.filter(function (p) {
    return p.filename === pagename
  })[0]

  console.log(page)
  return html`<div>
    <h1>${page.data.title}</h1>
    <div>${page.content}</div>
  </div>`
}
