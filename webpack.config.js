// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    path: './src/main.js'
  },
  output: {
    path: __dirname+'/build',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: ["style-loader","css-loader","sass-loader"]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  devtool: 'eval-source-map',
  devServer: {
    contentBase: './build',
    inline: true,
    hot: true
  }
};
