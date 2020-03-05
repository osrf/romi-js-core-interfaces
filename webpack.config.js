module.exports = {
  entry: './lib/index.js',
  mode: 'production',
  output: {
    path: `${__dirname}/bundle`,
    filename: 'romi-js-core-interfaces.js',
    library: 'romi_core',
    libraryTarget: 'umd',
  }
};
