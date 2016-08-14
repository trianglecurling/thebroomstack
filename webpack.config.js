var autoprefixer = require('autoprefixer');

module.exports = {
	entry: "./src/client/app.ts",
	output: {
		path: "./build/release/client/public/scripts",
		publicPath: "http://localhost:8080/scripts/",
		filename: "thebroomstack.js"
	},
	resolve: {
		extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
	},
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				query: { tsconfig: "./src/client/tsconfig.json" }
			},
			{
				test:   /\.css$/,
				loader: ["style-loader", "css-loader", "postcss-loader"]
			},
			{
				test: /\.scss$/,
				loaders: ["style-loader", "css-loader", "postcss-loader", "sass-loader"]
			}
		]
	},
	postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};
