const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");
const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "ext_libs/Cesium";

module.exports = {
    resolve: {
        alias: {
            Assets: path.resolve(__dirname, "src/assets"),
            "@": path.resolve(__dirname, "src"),
        },
    },
    entry: {
        workspaces: srcPath + "/workspaces/index.js",
        worknodes: srcPath + "/worknodes/index.js",
    },
    output: {
        filename: "[name]/[name].[contenthash:20].js",
        path: buildPath,
        clean: true,
        publicPath: "/",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: "asset/resource",
            },
            {
                test: /\.svg$/,
                type: "asset/source",
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/workspaces/workspaces.html",
            filename: "workspaces/index.html",
            chunks: ["workspaces"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/worknodes/worknodes.html",
            filename: "worknodes/index.html",
            chunks: ["worknodes"],
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
        new MiniCssExtractPlugin({
            // filename: "[name]/[name].[contenthash:20].css",
            // chunkFilename: "[id].css",
        }),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify(cesiumBaseUrl),
        }),
    ],
};
