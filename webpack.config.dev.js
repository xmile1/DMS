import webpack from 'webpack';
import path from 'path';

export default {
  debug: true,
  devtool: 'inline-source-map',
  noInfo: false,
  entry: [
    'eventsource-polyfill', // necessary for hot reloading with IE
        // note that it reloads the page if hot module reloading fails.
    'webpack-hot-middleware/client?reload=true',

    path.resolve(__dirname, 'client/index')
  ],
  target: 'web',
  output: {
    path: `${__dirname}/dist`,
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'client/src')
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/,
        include: path.join(__dirname, 'client'),
        loaders: ['babel'] },
      { test: /(\.css)$/,
        loader: 'style!css?modules',
        include: [/flexboxgrid/, path.join(__dirname, 'client/src/style')] },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.(woff|woff2)$/, loader: 'url?prefix=font/&limit=5000' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  }
};
