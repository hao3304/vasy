const path = require("path");
const webpack = require("webpack");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  baseUrl: process.env.NODE_ENV === "production" ? "/vasy/" : "/",
  lintOnSave: true,
  runtimeCompiler: true, // 使用构建版vue
  css: {
    // 配置css模块
    loaderOptions: {
      // 向预处理器 Loader 传递配置选项
      less: {
        // 配置less（其他样式解析用法一致）
        javascriptEnabled: true // 设置为true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery"
      })
    ]
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"));
    //.set('easyui',resolve('src/easyui')) // 我这边是购买 了源代码，直接复制到src目录下使用
    config.entry.app = ["babel-polyfill", resolve("src/main.js")];
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  }
};
