const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");

const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "cesiumStatic";

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
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
                type: "asset/inline",
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i, // обработка файлов шрифтов
                type: "asset/resource",
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
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(cesiumSource, "Workers"),
                    to: `${cesiumBaseUrl}/Workers`,
                },
                {
                    from: path.join(cesiumSource, "ThirdParty"),
                    to: `${cesiumBaseUrl}/ThirdParty`,
                },
                {
                    from: path.join(cesiumSource, "Assets"),
                    to: `${cesiumBaseUrl}/Assets`,
                },
                {
                    from: path.join(cesiumSource, "Widgets"),
                    to: `${cesiumBaseUrl}/Widgets`,
                },
            ],
        }),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
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
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /node_modules/,
                    chunks: "all",
                    name: "vendor",
                    enforce: true,
                },
            },
        },
    },
};
