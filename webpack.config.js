require('dotenv').config();

const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

// client-side bundler
module.exports = {
    mode: 'development',
    entry: {
        jsBundle: path.resolve(__dirname, 'universal-app/client/client.jsx'),
        cssBundle: glob.sync(path.resolve(__dirname, 'universal-app/client/Components/**/**/*.css'))
    },
    output: {
        path: path.resolve(__dirname, 'universal-app/bundles'),
        filename: "[name].js"
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json', '.css']
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.css$/,
                exclude: /node_modules/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: { importLoaders: 1 }
                        },
                        {
                            loader: 'postcss-loader',
                            options: { plugins: [autoprefixer()] }
                        }
                    ]
                })
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                APP_URL: JSON.stringify(process.env.APP_URL),
                MONGO_URI: JSON.stringify(process.env.MONGO_URI),
                PORT: JSON.stringify(process.env.PORT),
                JWT_SECRET: JSON.stringify(process.env.JWT_SECRET),
                TWITTER_CONSUMER_KEY: JSON.stringify(process.env.TWITTER_CONSUMER_KEY),
                TWITTER_CONSUMER_SECRET: JSON.stringify(process.env.TWITTER_CONSUMER_SECRET)
            }
        }),
        new ExtractTextPlugin({
            filename: "[name].css"
        })
    ]
};