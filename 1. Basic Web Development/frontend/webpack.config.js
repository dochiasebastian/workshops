const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        main: "./src/main.ts",
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "[name]-bundle.js",
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            { test: /\.tsx?$/, loader: "ts-loader" },
        ],
    },
    plugins: [
        new CopyWebpackPlugin(
            {
                patterns: [
                    { from: './html/' },
                    { from: './styles/' },
                    { from: './icons' },
                ]
            }
        ),
    ],
    mode: "development"
};