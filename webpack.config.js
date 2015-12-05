module.exports = {
    entry: './wwwScript/main.js',
    output: {
        filename: './wwwRoot/script.js'
    },
    module: {
        loaders: [
            //{ test: /\.json$/, loader: 'json-loader' },
        ]
    },
    resolve: {
        extensions: ['', '.js']
    }
};
