const path = require("path");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");  // Tối ưu hóa minify
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const glob = require("glob");


const exportJS = {
    entry: {
        form: "./assets/js/src/blocks/form/form.js",
        submit: "./assets/js/src/common/submit.js",
        admin: "./assets/js/src/common/admin.js"
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    output: {
        filename: "[name].min.js",
        path: path.resolve(__dirname, "./assets/js/minify"),
    },
    module: {
        rules: [
            {
                test: /\.js|\.jsx$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-react", "@wordpress/babel-preset-default"],
                    },
                },
            },
            {
                test: /\.css$/, // Xử lý các file .css
                use: ["style-loader", "css-loader"], // Sử dụng style-loader và css-loader
            },
        ],
    },
    mode: 'production',
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            terserOptions: {
                compress: {
                    drop_console: true,  // Loại bỏ console.log và các câu lệnh console khác
                },
            },
            extractComments: false,
        })],
        // splitChunks: {
        //     chunks: 'all',  // Tách các chunks dùng chung thành các file riêng biệt. Thử xem có tu dong chay hay càn enquired
        // },
        // splitChunks: {
        //     chunks: 'all',
        //     name: false,
        //     cacheGroups: {
        //         vendors: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name: 'vendors',
        //             chunks: 'all',
        //             priority: -10,
        //         },
        //         commons: {
        //             name: 'commons',
        //             minChunks: 2,
        //             chunks: 'all',
        //             priority: -20,
        //             reuseExistingChunk: true,
        //         },
        //     }
        // },
        concatenateModules: true, // Hợp nhất các module có thể để giảm kích thước
    },
    externals: {
        jquery: 'jQuery' // Sử dụng jQuery có sẵn trong WordPress
    },
};
const exportCss = {
    optimization: {
        minimizer: [new CssMinimizerPlugin({})],
    },
    entry: {
        form: './assets/css/src/form.css',
        admin: './assets/css/src/admin.css',
        editor: './assets/css/src/editor.css'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name].min.css',
        })
    ],
    output: {
        //filename: '[name].js',
        path: path.resolve('./assets/css/minify')
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: '../../images',
                            publicPath: '../../images', // Đường dẫn công khai đến thư mục hình ảnh từ tệp CSS
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    /*'style-loader',*/
                    'css-loader'
                ]
            }
        ]
    },
    mode:'production'
};
module.exports = [
    exportJS,
    exportCss
]