var webpack = require ('webpack');

module.exports = {
    entry: __dirname+'/react/index.js',

    output: {
        path: __dirname+'/public',
        filename: 'bundle.js',
        publicPath: '/'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    },

    stats: {
        colors: true
    },

    devServer: {
        contentBase: 'public'
    },

    // production settings (minify, dedupe)
    plugins: process.env.NODE_ENV === 'production' ? [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ] : []
};
