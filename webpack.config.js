var autoprefixer = require("autoprefixer");
var webpack = require("webpack");

var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
//var ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = {
	entry: ["./src/client/app.tsx"],
	output: {
		path: __dirname + "/build/release/client/public",
		publicPath: "http://localhost:8080/",
		filename: "scripts/thebroomstack.js"
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		plugins: [
			new TsConfigPathsPlugin({tsconfig: __dirname + "/src/client/tsconfig.json"})
		]
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loader: "awesome-typescript-loader",
				query: {
					configFileName: __dirname + "/src/client/tsconfig.json"
				}
			},
			{
				test: /\.css$/,
				loader: ["style-loader", "css-loader", "postcss-loader"]
			},
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: "file-loader?name=fonts/[name].[ext]"
			},
			{
				test: /\.json$/,
				loader: "json-loader"
			}
		]
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			options: {
				context: __dirname,
				postcss: [
					autoprefixer({ browsers: ["last 2 versions"] })
				]
			}
		}),
		new webpack.HotModuleReplacementPlugin()
	]
};
