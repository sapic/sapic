module.exports = {
  // options...
  devServer: {
    port: 3000,
  },

  chainWebpack (config) {
    // Custom loader for asset json so we can have big json files as assets
    // instead of part of js
    config.module
      .rule('assetjson')
      .test(/-asset\.json$/)
      .set('type', 'javascript/auto')
      .use('file-loader')
      .loader('file-loader')
      .tap(_ => ({
        name: 'json/[name].[hash:8].[ext]',
      }))
      .end()
  },
}
