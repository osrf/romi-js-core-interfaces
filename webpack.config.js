module.exports = {
  entry: './dist/index.js',
  mode: 'production',
  output: {
    path: `${__dirname}/dist`,
    filename: 'romi-js-core-interfaces.js',
    library: 'romi_core',
    libraryTarget: 'umd',
  }
};
