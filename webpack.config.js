module.exports = {
  cache: true,
  entry: {
    app: './js/app/main.js'
  },
  output: {
    filename: './js/bundle.js',
  },
  resolve: {
    extensions: ['', '.js']
  }
};
