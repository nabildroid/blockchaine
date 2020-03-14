const htmlWebpackPlugin = require("html-webpack-plugin");

const entry = "./public/main.ts";

module.exports.entry = entry;
module.exports.config = () => ({
    mode: "development",
    entry,
    plugins: [new htmlWebpackPlugin({ template: "./public/template.html" })],
    devServer: {
        disableHostCheck: true,
        historyApiFallback: true,
        publicPath: `http://localhost:8080/`,
        proxy: {
            "*": `http://localhost:8080`
        },
        headers: {
            "Access-Control-Allow-Origin": "*"
        },
        port: 8080
    }
});
