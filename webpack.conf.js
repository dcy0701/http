const webpack = require('webpack')

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    output: {
        filename: 'index.js',
        library: 'vue-http',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            'axios': 'axios/dist/axios.min.js',
            'vue$': 'vue/dist/vue.runtime.esm.js'
        }
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [['@babel/preset-env', {
                        modules: false,
                        useBuiltIns: 'entry',
                        targets: {
                            browsers: ['> 0.2%']
                        }
                    }]],
                    plugins: [
                        '@babel/plugin-proposal-export-default-from'
                    ]
                }
            }
        }]
    },
    node: {
        process: false
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    ]
}