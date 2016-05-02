seajs.config({
    base: './modules',
    alias: {
        "base-printer": 'base-printer.js',
        "hello-printer" : 'hello-printer.js',
        "world-printer" : 'world-printer.js',
    },
    preload: [
        "preload"
    ]
});


// 加载入口文件
seajs.use('./main.js');
