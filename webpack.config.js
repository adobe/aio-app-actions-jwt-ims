const path = require('path');

module.exports = {
      entry: './src/auth.js',
      output: {
        path: path.join(__dirname, 'dist'),
        libraryTarget: 'commonjs2'
      },
      mode: 'production',
      target: 'node',
      optimization: {
        // error on minification for azure/blob endpoint (`Expected signal to be an instanceof AbortSignal`)=> fix this
        minimize: false
      },
      // the following lines are used to require es6 module, e.g.node-fetch which is used by azure sdk
      resolve: {
        extensions: ['.js'],
        mainFields: ['main']
      },
      stats: {
        warningsFilter: "Module not found: Error: Can't resolve 'encoding'"
      }
    }
  