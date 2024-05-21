const path = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const autoprefixer = require("autoprefixer");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const buildPath = path.resolve(__dirname, "dist");
const srcPath = path.resolve(__dirname, "src");
const cesiumSource = "node_modules/cesium/Build/Cesium";
const cesiumBaseUrl = "ext_libs/Cesium";

module.exports = {
    resolve: {
        alias: {
            Icons: path.resolve(__dirname, "src/assets/icons"),
            "@": path.resolve(__dirname, "src"),
        },
    },
    entry: {
        workspaces: srcPath + "/workspaces/index.js",
        worknodes: srcPath + "/worknodes/index.js",
        geodata: srcPath + "/geodata/index.js",
    },
    output: {
        // путь формируем так - папка dist, в ней папка workspaces, в ней index.htm
        filename: "[name]/[name].[contenthash:20].js",
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
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]",
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i, // обработка файлов шрифтов
                type: "asset/resource",
                generator: {
                    filename: "fonts/[name][ext]",
                },
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
        new HtmlWebpackPlugin({
            template: "./src/geodata/geodata.html",
            filename: "geodata/index.html",
            chunks: ["geodata"],
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
            filename: "[name]/[name].[contenthash:20].css",
            chunkFilename: "[id].css",
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
                { from: /^\/workspaces$/, to: "/workspaces/index.html" }, // Для workspaces
                { from: /^\/worknodes$/, to: "/worknodes/index.html" }, // Для worknodes
                { from: /^\/geodata$/, to: "/geodata/index.html" }, // Для geodata
            ],
        },
    },
    devtool: "source-map",
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
};
