const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const extractWebpackPlugin = require('extract-text-webpack-plugin')
// const cleanWebpackPlugin = require('clean-webpack-plugin')

const isDev = (process.env.NODE_ENV === 'development'); 
const config = {
  target: 'web',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(jpg|png|jpeg|svg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: '[name]-slp.[ext]',
            }
          }
        ]
      }
    ]
  },
  plugins: [
    // new cleanWebpackPlugin(['dist']),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: isDev ? '"development"' : '"production"',
      }
    }),
    new VueLoaderPlugin(),
    new htmlWebpackPlugin(),
  ],
  mode: 'none',
}

if (isDev) {
  // config.mode = "development"
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: [
      'vue-style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          sourceMap: true
        }
      },
      'stylus-loader'
    ]
  })
  config.devtool = '#cheap-module-eval-source-map';
  config.devServer = {
    port: '9000',
    host: '0.0.0.0',
    overlay: {
      errors: true,
    },
    hot: true,
  };
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  );
} else {
  // config.mode = "production"
  config.entry = {
    app: path.join(__dirname, 'src/index.js'),
    vendor: ['vue']
  }
  config.output.filename = "[name].[chunkhash:8].js"
  config.module.rules.push({
    test: /\.styl(us)?$/,
    use: extractWebpackPlugin.extract({
      fallback: "vue-style-loader",
      use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        'stylus-loader'
      ]
    })
  })
  config.plugins.push(
    new extractWebpackPlugin('styles.[chunkhash:8].css'),
  )
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          chunks: 'initial',
          minChunks: 2, maxInitialRequests: 5,
          minSize: 0
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    },
    runtimeChunk: true
  }
}
module.exports = config