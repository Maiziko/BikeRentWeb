module.exports = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/screens/signin',
        permanent: true,
      },
    ]
  },
  images: {
    domains: ['firebasestorage.googleapis.com', 'ui-avatars.com'],
  },
};
