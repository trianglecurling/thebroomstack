require("dotenv").config();
const path = require("path");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const webpack = require("webpack");
const ReactRefreshTypeScript = require("react-refresh-typescript");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";
module.exports = {
	mode: isDevelopment ? "development" : "production",
	entry: ["webpack-hot-middleware/client?path=/__webpack_hmr", path.join(__dirname, "script", "index.tsx")],
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.[jt]sx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: require.resolve("ts-loader"),
						options: {
							getCustomTransformers: () => ({
								before: isDevelopment ? [ReactRefreshTypeScript()] : [],
							}),
						},
					},
				],
			},
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
			},
		],
	},

	resolve: {
		extensions: [".tsx", ".ts", ".js", ".jsx"],
	},
	output: {
		filename: "main.js",
		path: path.join(__dirname, "..", "..", "..", "..", "public", "js"),
		publicPath: "http://localhost:8000/",
	},
	plugins: [
		new MiniCssExtractPlugin({ filename: "../css/[name].css" }),
		isDevelopment && new webpack.HotModuleReplacementPlugin(),
		isDevelopment && new ReactRefreshWebpackPlugin(),
	].filter(Boolean),
};
