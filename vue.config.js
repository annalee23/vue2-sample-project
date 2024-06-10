module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/vue2-sample-project/" : "/",
  productionSourceMap: false,
  transpileDependencies: [
    'vuetify'
  ]
}
