const webpack = require('webpack')

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-eval-source-map',
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
                    ],
                    env: {
                        development: {
                            plugins: [
                                ['istanbul', {
                                    'exclude': ['tests']
                                }]
                            ]
                        }
                    }
                }
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development')
            }
        })
    ]
}