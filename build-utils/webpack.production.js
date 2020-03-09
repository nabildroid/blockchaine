const { entry } = require("./webpack.development");
const htmlWebpackPlugin = require("html-webpack-plugin");

module.exports.config = () => ({
    mode: "production",
    entry,
    plugins: [new htmlWebpackPlugin()]
});
