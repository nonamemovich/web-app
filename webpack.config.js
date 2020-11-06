/* eslint-disable */

const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs  = require('fs');
// const config = require('./src/configs/common');
// const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
// const lessToJs = require('less-vars-to-js');
// const themeVariables = lessToJs(fs.readFileSync(path.join(__dirname, './src/redux/styles/ant-theme-vars.less'), 'utf8'))

const NODE_ENV = process.env.NODE_ENV || 'development';
let VERSION;

if (NODE_ENV === 'production') {
  const { version } = require('./package.json');
  const revision = require('child_process')
    .execSync('git rev-parse HEAD')
    .toString()
    .trim();

  VERSION = `${version}#${revision}`;
}
const antStylesScopeOverride = path.resolve(__dirname, 'src/redux/styles/ant-scope-stub.less');

module.exports = {
  context: `${__dirname}/src`,
  resolve: {
    modules: [path.resolve('./src'), 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    // alias: {
    //   '@weblab.technology/ui-auth': '@weblab.technology/ui-auth/dist',
    //   '@weblab.technology/shaman-fakes': '@weblab.technology/shaman-fakes/dist',
    //   '@weblab.technology/presentation-view': '@weblab.technology/presentation-view/dist',
    //   '@weblab.technology/shaman-api': '@weblab.technology/shaman-api/dist',
    //   '@weblab.technology/shaman-ui': '@weblab.technology/shaman-ui/dist',
    //   '@weblab.technology/shaman-chime': '@weblab.technology/shaman-chime/dist',
    // },
    symlinks: false,
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(NODE_ENV),
        VERSION: JSON.stringify(VERSION),
        TOKEN_RENEWAL_INTERVAL: JSON.stringify(process.env.TOKEN_RENEWAL_INTERVAL),
        APP_HOST: JSON.stringify(process.env.APP_HOST),
        APP_PORT: JSON.stringify(process.env.APP_PORT),
        APP_PROTOCOL: JSON.stringify(process.env.APP_PROTOCOL),
        API_HOST: JSON.stringify(process.env.API_HOST),
        API_PROTOCOL: JSON.stringify(process.env.API_PROTOCOL),
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'externalScripts', to: 'externalScripts' },
        { from: '../node_modules/viewerjs/', to: '_/node_modules/viewerjs/'}
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'vendor',
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        options: {
          babelrc: true
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(jpg|png)$/,
        loader: 'file-loader?name=[path][name].[hash].[ext]',
      },
      {
        test: /\.(woff|woff2|eot|ttf|gif)(\?.*$|$)/,
        loader: 'file-loader',
      },
      {
        test: /\.(svg)(\?.*$|$)/,
        loader: 'url-loader',
      },
      {
        test: /favicon.ico$/,
        loader: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          }, {
            loader: 'css-loader', // translates CSS into CommonJS
          }, {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              // modifyVars: themeVariables,
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
};
