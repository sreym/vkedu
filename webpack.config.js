var path = require("path");
module.exports = {
  entry: "./app/main.ts",
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/build/',
    filename: "app.js"
  },
  resolve: {
    extensions: ['', '.js', '.ts']
  },
  module: {
    loaders: [{
      test: /\.ts/,
      loaders: ['ts-loader'],
      exclude: /node_modules/
    }]
  }
};