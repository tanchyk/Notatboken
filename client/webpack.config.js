const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: "all"
        }
    }

    if(!isDev) {
        config.minimizer = [
            new OptimizeCssAssetPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const fileName = ext => {
    if(isDev) {
        return `[name].${ext}`;
    } else {
        return `[name].[hash].${ext}`;
    }
}

const plugins = () => {
    const base = [
        new HTMLWebpackPlugin({
            template: "../public/index.html",
            minify: {
                collapseWhitespace: !isDev
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: fileName('css')
        })
    ];

    if(!isDev) {
        base.push(new BundleAnalyzerPlugin())
    }

    return base;
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: "development",

    entry: {
        main: ['@babel/polyfill', './index.tsx']
    },

    output: {
        filename: fileName('js'),
        path: path.resolve(__dirname, 'dist')
    },

    optimization: optimization(),

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 4200,
        hot: isDev
    },
    devtool: isDev ? 'source-map' : 'eval',

    plugins: plugins(),

    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {}
                    }, 'css-loader'
                ]
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
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
                            '@babel/plugin-proposal-class-properties'
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
                            '@babel/plugin-proposal-class-properties'
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
                            '@babel/plugin-proposal-class-properties'
                        ]
                    }
                }
            }
        ]
    }
}