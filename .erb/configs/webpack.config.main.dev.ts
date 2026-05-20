import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import baseConfig from './webpack.config.base';
import webpackPaths from './webpack.paths';
import checkNodeEnv from '../scripts/check-node-env';

if (process.env.NODE_ENV === 'production') {
  checkNodeEnv('development');
}

const configuration: webpack.Configuration = {
  devtool: 'inline-source-map',

  mode: 'development',

  target: 'electron-main',

  entry: path.join(webpackPaths.srcMainPath, 'main.ts'),

  output: {
    path: webpackPaths.dllPath,
    filename: 'main.js',
    library: {
      type: 'commonjs2',
    },
  },

  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
    }),

    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      DEBUG_PROD: false,
      START_MINIMIZED: false,
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true,
    }),
  ],

  node: {
    __dirname: false,
    __filename: false,
  },

  watch: process.env.MAIN_WEBPACK_WATCH === 'true',

  // ESM-only packages break when webpack inlines them as `require()()`.
  externals: {
    electron: 'commonjs2 electron',
    'electron-debug': 'commonjs2 electron-debug',
    'electron-devtools-installer': 'commonjs2 electron-devtools-installer',
  },
};

export default merge(baseConfig, configuration);
