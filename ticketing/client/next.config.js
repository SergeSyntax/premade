module.exports = {
  // changing attribute in the webpack config
  // with a middleware rather then trying to watch
  // in some automated fashion, instead pull all
  // different files inside of the project
  // directory once every 300 ms.
  // (still not 100% bulletproof solution)
  webpackDevMiddleware: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};
