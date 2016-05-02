module.exports = {
    entry: [
        './main.jsx'
    ],
    output: {
        path: __dirname + '/assets/',
        publicPath: '/assets',
        filename: 'bundle.js'
    },
    resolve :{
        extensions: ['', '.js','.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader!jsx-loader?harmony'
            }
        ]
    }
};