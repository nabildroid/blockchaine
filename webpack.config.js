const WebpackMerge = require("webpack-merge");

const targetConfig = env => {
    const path = `./build-utils/webpack.${env.mode}.js`;
    return require(path).config(env);
};

module.exports = env => {
    return WebpackMerge(
        {
            entry: "./public/main.ts",
            resolve: {
                extensions: [".ts", ".js", ".json"]
            },
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: "ts-loader"
                    }
                ]
            }
        },
        targetConfig(env)
    );
};
