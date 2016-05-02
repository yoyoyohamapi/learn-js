(function(window,undefined){
    var $ = (function() {
        return {
            loadScript: function(src, callback) {
                var script = document.createElement('script');
                script.type = 'text/javascript';
                // IE
                if(script.readyState) {
                    script.onreadystatechange = function() {
                        if(script.readyState == 'loaded' || script.readyState == 'complete') {
                            script.onreadystatechange = null;
                            if(typeof(callback) == 'function')
                                callback();
                        }
                    }
                } else {
                    // 其他浏览器
                    script.onload = function() {
                        if(typeof(callback)== 'function')
                            callback();
                    }
                }

                script.src = src;
                document.getElementsByTagName('head')[0].appendChild(script);
            },
            xhrLoadScript: function(src,callback) {
                var xhr = new XMLHttpRequest();
                xhr.open('get', src, true);
                xhr.openreadystatechange = function() {
                    if(readyState === 4) {
                        if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                            var script = document.createElement("script");
                            script.type = 'text/javascript';
                            script.text = xhr.responseText;
                            document.body.appendChild(script);
                        }
                    }
                }
                xhr.send(null);
            }
        };
    })();
    window.$ = $;
})(window);
