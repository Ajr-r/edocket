const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/app.jsx'), 
    output: {
        filename: 'app.[contenthash].js',
        path: path.resolve('./public'),
        publicPath: '/',//important for clint side routing

    },
    optimization: {
        minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    
    
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/index.html'),
            inject: true
        }),
        new MiniCssExtractPlugin(),

    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.html$/,
                use: 'html-loader'
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/images/[name][ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'assets/fonts/[name][ext]'
                }
        },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react',
                       ],
                    },
                },
            },
        ]
    }

};