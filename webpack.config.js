const { log } = require("console");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");

module.exports = {
    entry: {
        workspaces: srcPath + "/workspaces/index.js",
        worknodes: srcPath + "/worknodes/index.js",
        geodata: srcPath + "/geodata/index.js",
        profile: srcPath + "/profile/index.js",
        map: srcPath + "/map/index.js",
        auth: srcPath + "/auth/index.js",
    },
    output: {
        filename: "[name].[contenthash:20].js",
        path: buildPath,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/workspaces/index.html",
            filename: "workspaces.html",
            chunks: ["workspaces"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/worknodes/index.html",
            filename: "worknodes.html",
            chunks: ["worknodes"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/geodata/index.html",
            filename: "geodata.html",
            chunks: ["geodata"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/profile/index.html",
            filename: "profile.html",
            chunks: ["profile"],
        }),
        new HtmlWebpackPlugin({
            template: "./src/map/index.html",
            filename: "map.html",
            chunks: ["map"],
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
    ],
};
