// next.config.js
module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/screens/signup',
        permanent: true,
      },
    ]
  },
}
