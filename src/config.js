module.exports = {
  title: 'choo-static-blog',
  description: 'i guess it is the opposite of static',
  baseurl: '/',
  collections: {
    posts: {
      route: '/posts/:post'
    },
    pages: {
      route: '/:page'
    }
  }
}
