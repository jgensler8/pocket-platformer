const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: 'styles/[name].[ext]',  // Output location for SVGs
                    },
                },
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
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html', // Path to your existing index.html
            filename: 'index.html', // Output HTML file name
        }),
    ],
};