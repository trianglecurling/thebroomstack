var autoprefixer = require("autoprefixer");
var webpack = require("webpack");
var fs = require("fs");
var path = require("path");

var TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin;
//var ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = {
	entry: ["./src/server/app.ts", "./src/server/controller/HomeController.ts"],
	output: {
		path: __dirname + "/build/release/server",
		filename: "app.js"
	},
	resolve: {
		extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
		plugins: [
			new TsConfigPathsPlugin({tsconfig: __dirname + "/src/server/tsconfig.json"})
		]
	},

	target: "node",

	// keep node_module paths out of the bundle
	externals: fs.readdirSync(path.resolve(__dirname, 'node_modules')).concat([
		'react-dom/server', 'react/addons'
	]).reduce(function (ext, mod) {
		ext[mod] = 'commonjs ' + mod;
		return ext;
	}, {}),

	node: {
		__filename: true,
		__dirname: true
	},

	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "awesome-typescript-loader",
				query: {
					configFileName: __dirname + "/src/server/tsconfig.json"
				}
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
				context: __dirname
			}
		}),
		//new webpack.ContextReplacementPlugin(/dispatcher\.ts/, "controller", true, /^.*$/)
	]
};
