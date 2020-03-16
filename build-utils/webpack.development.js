const htmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const entry = "./public/main.ts";

module.exports.entry = entry;
module.exports.config = () => ({
    mode: "development",
    entry,
    module:{
        rules:[
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            }
        ]
    },
    plugins: [new htmlWebpackPlugin({
        meta: {viewport: 'width=device-width, initial-scale=1'}
    }),
        new MiniCssExtractPlugin()
    ]
});
