var choo = require('choo')

module.exports = function createApp (options) {
  var app = choo()

  app.model(require('./models/site')(options.site))
  app.model(require('./models/data')(options.data))

  var keys = Object.keys(options.collections)
  keys.forEach(function (key) {
    var model = require('./models/collection')(options.collections[key])
    app.model(model)
  })

  app.router(function (route) {
    var routes = [
      route('/', getLayout('', {}, options.layouts))
    ]

    keys.forEach(function (key) {
      var collection = options.collections[key]
      routes.push(route(options.collections[key].route, getLayout(key, collection, options.layouts)))
    })

    return routes
  })

  return app
}

function getLayout (key, collection, layouts) {
  return function (state, prev, send) {
    var keys = Object.keys(state.params)

    // this assumes there's only one param
    var namespace = keys[0]
    
    if (collection.defaultLayout && layouts[collections.default]) {
      return layouts[collection.defaultLayout](state, prev, send)
    } else if (layouts[namespace]) {
      return layouts[namespace](state, prev, send)
    }

    return layouts.default(state, prev, send)
  }
}
