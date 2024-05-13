const HtmlWebpackPlugin = require("html-webpack-plugin");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const copyPlugin = require("copy-webpack-plugin");
const path = require("path");

const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");

module.exports = {
    entry: {
        index: srcPath + "/workspaces/index.js",
        auth: srcPath + "/auth/index.js",
    },
    output: {
        filename: "[name].[contenthash:20].js",
        path: buildPath,
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer],
                            },
                        },
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/workspaces/index.html",
            filename: "index.html",
            chunks: ["index"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/auth/index.html",
            filename: "auth.html",
            chunks: ["auth"],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
        }),
        new copyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "assets"),
                    to: buildPath + "/assets",
                },
            ],
        }),
    ],
    devServer: {
        port: 8080,
        hot: true,
        historyApiFallback: {
            rewrites: [
                { from: /^\/auth$/, to: "/auth.html" }, // Перенаправление для auth
                { from: /^\/home$/, to: "/index.html" }, // Для workspaces
            ],
        },
    },
    devtool: "source-map",
};
