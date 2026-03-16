const path = require("path");
const fs = require("fs");

const banner = fs.readFileSync("./scripts/banner.js", "utf-8");

module.exports = {
  mode: "development",
  devtool: false,
  entry: "./src/index.js",
  experiments: {
    outputModule: false,
  },
  output: {
    filename: "warehouse-helper.user.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: "last 2 Chrome versions",
                  modules: "commonjs", // ← додай це
                },
              ],
            ],
          },
        },
      },
    ],
  },
  plugins: [
    new (require("webpack").BannerPlugin)({
      banner,
      raw: true,
    }),
  ],
};
