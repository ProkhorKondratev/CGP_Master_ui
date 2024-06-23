const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
    mode: "development",
    devServer: {
        static: "./dist",
        compress: true,
        port: 3100,
    },
    devtool: "inline-source-map", // Для более легкой отладки
});
