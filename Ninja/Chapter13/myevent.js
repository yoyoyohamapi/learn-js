(function (window) {
    var MyEvent = function () {
        var _nextGuid = 1;
        return {
            /**
             * 解绑后释放DOM资源
             * @param elem 解绑的DOM元素
             * @param type 解绑的时间
             */
            tidyUp: function (elem, type) {
                function isEmpty(obj) {
                    for (var prop in obj) {
                        return false;
                    }
                    return true;
                }

                var data = DomCenter.getData(elem);

                // 如果已经不存在处理程序
                if (data.handlers[type].length === 0) {
                    delete  data.handlers[type];

                    if (document.removeEventListener) {
                        elem.removeEventListener(type, data.dispatcher, false);
                    } else if (document.detachEvent) {
                        elem.detachEvent("on" + type, data.dispatcher);
                    }
                }

                // 如果其他类型的处理程序也不存在
                if (isEmpty(data.handlers)) {
                    delete data.handlers;
                    delete data.dispatcher;
                }

                // 如果data也没了
                if (isEmpty(data)) {
                    DomCenter.removeData(elem);
                }

            },

            /**
             * 触发事件
             * @param elem DOM元素
             * @param event 待触发的事件
             */
            triggerEvent: function (elem, event) {
                var elemData =DomCenter.getData(elem),
                    parent = elem.parentNode || elem.ownerDocument;

                // 如果传入的事件是一个字符串,就将其包装为event
                if (typeof event === "string") {
                    event = {type: event, target: elem}
                }

                event = MyEvent.fixEvent(event);

                // 现执行,再冒泡
                if (elemData.dispatcher) {
                    elemData.dispatcher.call(elem, event);
                }

                console.log(event);
                if (parent && !event.isPropagationStopped) {
                    MyEvent.triggerEvent(parent, event);
                }

                // 如果DOM到顶, 且没有阻止事件的默认行为,就触发事件的默认行为
                else if (!parent && !event.isDefaultPrevented()) {
                    var targetData =DomCenter.getData(event.target);

                    // 判断事件发生的dom元素上是否有该事件的默认行为
                    if (event.target[event.type]) {
                        // 暂时禁用事件调度器,防止执行完默认行为再次执行绑定的行为
                        targetData.disabled = true;

                        // 执行默认行为
                        event.target[event.type]();

                        targetData.disabled = false;
                    }

                }
            },

            /**
             * 获得浏览器兼容的事件对象
             * @param event 事件
             * @returns {*}
             */
            fixEvent: function (event) {
                function returnTrue() {
                    return true
                }

                function returnFalse() {
                    return false
                }

                // 判断是否需要修复(IE Model下的event是不具备stopPropagation属性的)
                if (!event || !event.stopPropagation) {
                    var old = event || window.event;

                    event = {};

                    // 克隆现有的属性
                    for (var prop in old) {
                        event[prop] = old[prop];
                    }

                    // ----------- 逐个属性修复
                    if (!event.target) {
                        event.target = event.srcElement || document;
                    }

                    // 对于 mouseover 和 mouseout 事件，该属性引用移入鼠标的元素。
                    event.relatedTarget = event.fromElement === event.target ?
                        event.toElement : event.fromElement;

                    // 防止浏览器默认行为
                    event.preventDefault = function () {
                        event.returnValue = false;
                        event.isDefaultPrevented = returnTrue();
                    };

                    // 默认不阻止浏览器默认xingwei
                    event.isDefaultPrevented = returnFalse;

                    // 防止事件冒泡
                    event.stopPropagation = function () {
                        event.cancelBubble = true;
                        event.isPropagationStopped = returnTrue();
                    };

                    // 默认不阻止事件冒泡
                    event.stopImmediatePropagation = function () {
                        this.isImmediatePropagationStopped = returnTrue();
                        this.stopImmediatePropagation();
                    };

                    event.stopImmediatePropagation = returnFalse();

                    // 修正事件的鼠标位置
                    if (event.clientX != null) {
                        var doc = document.documentElement, body = document.body;

                        event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                            (doc && doc.clientLeft || body && body.clientLeft || 0);

                        event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) -
                            (doc && doc.clientTop || body && body.clientTop || 0);
                    }

                    // 修正键盘按键
                    event.which = event.charCode || event.keyCode;

                    // 修正鼠标点击
                    if (event.button != null) {
                        event.button = (event.button & 1 ? 0 : (event.button & 4 ? 1 : (event.button & 2 ? 2 : 0)));
                    }

                }
                return event;

            },

            /**
             * 为DOM元素绑定相应的事件
             * 运用委托机制绑定事件,而没有直接绑定事件和对应处理程序,
             * 所有处理程序委托给dispatcher进行按序处理
             * @param elem 待绑定DOM元素
             * @param type 事件类型
             * @param fn 操作句柄, 处理函数
             */
            addEvent: function (elem, type, fn) {
                // 获得DOM元素的相应属性
                var data =DomCenter.getData(elem);

                // 如果DOM尚未绑定任何的事件
                if (!data.handlers) data.handlers = {};
                // 如果尚未绑定对应的事件
                if (!data.handlers[type]) {
                    // 注意,有可能某类型的事件相应多个操作
                    data.handlers[type] = [];
                }

                // 如果函数尚未被标记
                if (!fn.guid) fn.guid = _nextGuid++;

                // 对应的操作添加操作句柄
                // 在队尾增加,保证处理程序按照绑定顺序进行执行
                data.handlers[type].push(fn);

                // 创建事件调度器
                if (!data.dispatcher) {
                    data.disabled = false;
                    data.dispatcher = function (event) {
                        // 判断DOM是否可用
                        if (data.disabled) return;
                        // 获得规范化的事件
                        event = MyEvent.fixEvent(event);
                        // 调度器获得该事件所有处理程序, 并按序执行
                        var handlers = data.handlers[event.type];
                        if (handlers) {
                            for (var n = 0; n < handlers.length; n++) {
                                handlers[n].call(elem, event);
                            }
                        }
                    }
                }

                // 是否第一次为该DOM创建了事件绑定, 如果是, 绑定该DOM元素的事件处理程序为调度器
                if (data.handlers[type].length === 1) {
                    if (document.addEventListener) {
                        // 第三个参数设置为false, 启用事件冒泡
                        elem.addEventListener(type, data.dispatcher, false);
                    } else if (document.attachEvent) {
                        // IE8以下的DOM LEVEL 0 事件模型, 默认冒泡
                        elem.attachEvent("on" + type, data.dispatcher);
                    }
                }

            },

            /**
             * 解除绑定
             * @param elem 待解除绑定的dom元素
             * @param type 待解除绑定的事件类型, 如果参数为空, 则解除所有绑定
             * @param fn 待解除绑定的处理程序, 如果为空, 则解除该事件所有绑定到的处理程序
             */
            removeEvent: function (elem, type, fn) {
                var data =DomCenter.getData(elem);

                if (!data.handlers) return;

                // 清除某一事件的绑定
                var removeType = function (t) {
                    data.handlers[t] = [];
                    MyEvent.tidyUp(elem, t);
                };

                // 如果没有主动声明type, 则解绑所有处理程序
                if (!type) {
                    for (var t in data.handlers) removeType(t);
                    return;
                }

                // 否则查找对应type的处理程序
                var handlers = data.handlers[type];
                if (!handlers) return;

                // 如果没有指明解绑的程序, 则解绑对应type的所有
                if (!fn) {
                    removeType(type);
                    return;
                }

                if (fn.guid) {
                    for (var n = 0; n < handlers.length; n++) {
                        if (handlers[n].guid === fn.guid) {
                            handlers.splice(n--, 1);
                        }
                    }
                }

                MyEvent.tidyUp(elem, type);
            }

        }
    }();

    var DomCenter = function () {
        _cache = {};
        _guidCounter = 1;
        // 保存GUID的属性名, DOM元素需要被GUID标识,
        // 为使属性名唯一, 我们用时间戳进行标识
        _expando = "data" + (new Date).getTime();

        return {
            /**
             * 获得DOM元素属性
             * @param elem
             * @returns {*}
             */
           getData: function (elem) {
                var guid = elem[_expando];
                // 如果GUID不存在,创建
                if (!guid) {
                    guid = elem[_expando] = _guidCounter++;
                    // 为DOM元素缓存属性
                    _cache[guid] = {}
                }
                return _cache[guid];
            },

            /**
             * 删除DOM元素属性
             * @param elem
             */
            removeData: function (elem) {
                var guid = elem[_expando];
                if (!guid) return;
                // 清空缓存
                delete _cache[guid];
                try {
                    // 取消标识
                    delete elem[_expando];
                }
                catch (e) {
                    if (elem.removeAttribute) {
                        elem.removeAttribute(_expando);
                    }
                }
            }
        }
    }();
    window.MyEvent = MyEvent;
})(window);



