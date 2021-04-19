const path = require('path')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require("webpack");
const dotenv = require('dotenv');
dotenv.config()

module.exports = function(env, argv) {
    console.log(process.env.NODE_ENV)
    return {
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

        name: 'client',
        entry: {
            main: ["@babel/polyfill", './src/index.tsx']
        },

        output: {
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: '[name].js'
        },

        target: 'web',

        // devtool: process.env.NODE_ENV === 'production' ? false : 'eval',

        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },

        optimization: process.env.NODE_ENV === 'production' ? {
            splitChunks: {
                chunks: "all"
            }
        } : {
            splitChunks: {
                chunks: "all"
            },
            minimizer: [
                new UglifyJsPlugin(),
                new OptimizeCSSAssetsPlugin({})
            ]
        },

        devServer: {
            contentBase: path.resolve(__dirname, 'dist'),
            port: 4020,
            historyApiFallback: {disableDotRule: true,},
            open: true,
            proxy: {
                "/api": {
                    target: "http://localhost:5000",
                    pathRewrite: {'^/api' : ''}
                }
            }
        },

        plugins: [
            new HtmlWebPackPlugin({
                template: "./public/index.html",
                favicon: "./public/favicon.ico",
                minify: {
                    collapseWhitespace: true
                }
            }),
            new webpack.DefinePlugin({
                'process.env.REACT_APP_API_PEXELS': JSON.stringify(`${process.env.REACT_APP_API_PEXELS}`),
                'process.env.REACT_APP_BACK_END': JSON.stringify(`${process.env.REACT_APP_BACK_END}`)
            }),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],

        module: {
            rules: [
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'html-loader',
                            options: { minimize: process.env.NODE_ENV === 'production' ? false : true }
                        }
                    ]
                },
                {
                    test: /\.jpg$/,
                    use: [{loader: 'url-loader'}]
                },
                {
                    test: /\.css$/,
                    use: [
                        process.env.NODE_ENV === 'production' ? {} : {
                            loader: MiniCssExtractPlugin.loader,
                        }, 'css-loader'
                    ]
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-logical-assignment-operators',
                                '@babel/plugin-proposal-optional-chaining'
                            ]
                        }
                    }
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-logical-assignment-operators',
                                '@babel/plugin-proposal-optional-chaining'
                            ]
                        }
                    }
                },
                {
                    test: /\.tsx$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                '@babel/preset-env',
                                '@babel/preset-typescript',
                                '@babel/preset-react'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-logical-assignment-operators',
                                '@babel/plugin-proposal-optional-chaining'
                            ]
                        }
                    }
                }
            ]
        }
    }
}