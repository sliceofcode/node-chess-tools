const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
    entry: {
        'index': './src/index.ts',
        'chesscom-games': './src/chesscom-games.ts'
    },

    target: 'node',

    module: {
        rules: [
            {test: /\.tsx?$/, use: 'ts-loader'}
        ]
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },

    // Ignore all modules in the node_modules folder
    externals: [nodeExternals()],

    output: {
        libraryTarget: 'commonjs',
        path: path.join(__dirname, 'dist/'),
        filename: '[name].js'
    },

    // Enable sourcemaps for debugging webpack's output
    devtool: "source-map",

};