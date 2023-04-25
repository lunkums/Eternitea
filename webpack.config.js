const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    entry: "./src/main.ts",
    devServer: {
        open: true, // Set to false to prevent the dev server from opening up automatically
        static: "./dist",
    },
    devtool: "eval-source-map",
    module: {
        rules: [
            {
                test: /\.glsl$/, // regex to match files with the .glsl extension
                loader: "webpack-glsl-loader",
            },
            {
                test: /\.ts$/, // regex to match files with the .ts extension
                loader: "ts-loader",
            },
            {
                test: /.s?css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(png|jpg)$/i,
                type: "asset/inline",
            },
        ],
    },
    optimization: {
        minimizer: [new CssMinimizerPlugin()],
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
        }),
        new HtmlWebpackPlugin({
            title: "Eternitea", // Replace this with the name of your app
            filename: "index.html",
            template: "src/index.html",
        }),
    ],
    resolve: {
        extensions: [".ts", ".js"],
    },
};
