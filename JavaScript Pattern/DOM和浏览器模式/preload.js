var preload;

// 思路还是来源于图像灯塔

// IE嗅探
if (/*@cc_on!@*/false) {
    preload = function (file) {
        new Image().src = file;
    }
} else {
    preload = function (file) {
        var obj = document.createElement('object'),
            body = document.body;
        obj.width = 0;
        obj.height = 0;
        obj.data = file;
        body.appendChild(obj);
    }
}

// 测试
preload('my_web_worker.js');