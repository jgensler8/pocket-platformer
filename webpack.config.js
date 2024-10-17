const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
            {
                test: /\.(svg|png)$/, // Handle SVG files
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'images/icons/[name].[ext]',  // Output location for SVGs
                    },
                },
            },
        ]
    },
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
        devMiddleware: {
            writeToDisk: true,
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Path to your existing index.html
            filename: 'index.html', // Output HTML file name
        }),
        new MiniCssExtractPlugin(),
    ],
};