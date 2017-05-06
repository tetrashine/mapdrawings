const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

const TARGET = process.env.npm_lifecycle_event;

const PATHS = {
	app: path.join(__dirname, 'src'),
	build: path.join(__dirname, 'dist')
};

const common = {
	// Entry accepts a path or an object of entries. We'll be using the
	// latter form given it's convenient with more complex configurations.
	resolve: {
        modules: [
            "node_modules",
            path.resolve(PATHS.app)
        ],
		extensions: ['.js', '.jsx']
	},
	entry: {
		app: PATHS.app
	},
	output: {
		path: PATHS.build,
		filename: 'bundle.js'
	},
	module: {
		loaders: [{
			test: /\.jsx?$/,
			loader: 'babel-loader',
			include: PATHS.app,
			exclude: /node_modules/
		}]
	},
	plugins: []
};

// Default configuration
if (TARGET !== 'start') {
	console.log("DEV Configurations");
	module.exports = merge(common, {
	    devServer: {
			contentBase: PATHS.build,

			// Enable history API fallback so HTML5 History API based
			// routing works. This is a good default that will come
			// in handy in more complicated setups.
			historyApiFallback: true,
			hot: true,
			inline: true,
			//progress: true,

			// Display only errors to reduce the amount of output.
			stats: 'errors-only',

			// Parse host and port from env so this is easy to customize.
			//
			// If you use Vagrant or Cloud9, set
			// host: process.env.HOST || '0.0.0.0';
			//
			// 0.0.0.0 is available to all network devices unlike default
			// localhost
			host: process.env.HOST,
			port: process.env.PORT
	    },
	    devtool: 'eval',
	    plugins: [
	    	new webpack.HotModuleReplacementPlugin()
	    ]
  	});
} else {
	console.log("PRD Configurations");
	module.exports = merge(common, {
		plugins: [
			new webpack.DefinePlugin({
	            'process.env': {
	                'NODE_ENV': JSON.stringify('production')
	            }
	        }),
			new webpack.optimize.OccurrenceOrderPlugin(true),
			new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
		]
	});
}
