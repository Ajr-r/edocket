const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
        mode: 'development',
    entry: path.resolve(__dirname, '../src/app.jsx'), 
    output: {
        filename: 'app.js',
        path: path.resolve('./dev_build'),
        publicPath: '/',

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
    },
    
    devServer: {//for dev server
        static: {
          directory: path.resolve('./dev_build'), // Replace 'public' with your static files directory
        },
        historyApiFallback: true,
        hot: true,
      },
};