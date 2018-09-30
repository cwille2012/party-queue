const fs = require('fs');
const path = require('path');
const resolve = require('path').resolve;
const nodeExternals = require('webpack-node-externals');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var node_env;
var output;
var devtool;
var csstest;

if (process.env.NODE_ENV == 'dev' || process.env.NODE_ENV == 'development') {
  node_env = 'development';
  output = {
    filename: 'bundle.js',
    publicPath: '/'
  };
  devtool = 'eval-source-map';
  csstest = {
    test: /\.css$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" }
    ]
  };
} else if (process.env.NODE_ENV == 'prod' || process.env.NODE_ENV == 'production') {
  node_env = 'production';
  output = {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].[hash].bundle.js'
  };
  devtool = 'source-map';
  csstest = {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: 'css-loader'
    })
  };
} else {
  //error unknown enviornment
}

const BROWSER = {
  entry: {
    app: resolve(path.join(__dirname, 'src', 'browser', 'app.js'))
  },
  output: output,
  devtool: devtool,
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'buble-loader',
        include: [resolve('.')],
        exclude: [/node_modules/],
        options: {
          objectAssign: 'Object.assign'
        }
      },
      csstest
    ]
  },

  plugins: [
    // new HtmlWebpackPlugin({
    //   template: path.join(__dirname, 'src', 'browser', 'index.html'),
    //   inject: false
    // }),
    new CopyWebpackPlugin([{
      from: './src/browser/public',
      to: './' 
    }]),
    new ExtractTextPlugin('bundle.css'),
    function() {
      this.plugin("done", function(statsData) {
        fs.createReadStream(path.join(__dirname, 'src', 'browser', 'index.html')).pipe(path.join(__dirname, 'build', 'index.html'));
          var stats = statsData.toJson();
          if (!stats.errors.length) {
            if (node_env == 'production') {
              var htmlFileName = 'index.html';
              var cssFileName = 'bundle.css';
              var newJsFilename = stats.assetsByChunkName.app[0];
              var newCssFileName = stats.assetsByChunkName.app[0].replace(/.js/, '.css');
              var html = fs.readFileSync(path.join(__dirname, 'src', 'browser', htmlFileName), "utf8");
              html = html.replace(/<script\s+src=(["'])bundle\.js\1/i, "<script src=$1" + newJsFilename + "$1");
              html = html.replace(/<\/title>/, '</title>\n\t<link rel="stylesheet" href="' + newCssFileName + '">');
              fs.writeFileSync(path.join(__dirname, 'build', htmlFileName), html);
              fs.renameSync(path.join(__dirname, 'build', cssFileName), path.join(__dirname, 'build', newCssFileName));
              fs.renameSync(path.join(__dirname, 'build', String(cssFileName + '.map')), path.join(__dirname, 'build', String(newCssFileName + '.map')));
            }
          }
      });
    }
  ]
};

const SERVER = {
  entry: resolve(path.join(__dirname, 'src', 'server', 'index.js')),
  target: 'node',
  externals: [nodeExternals({
    whitelist: ['jquery']
  })],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'server.js'
  },
  module: {
    rules: [
      { 
        test: /\.(js)$/,
        use: 'babel-loader',
        exclude: [/node_modules/],
      }
    ]
  },
  plugins: [

  ]
};

var EXPORTS = [BROWSER];
if (node_env == 'production') {
  EXPORTS = [BROWSER, SERVER];
}

module.exports = EXPORTS;