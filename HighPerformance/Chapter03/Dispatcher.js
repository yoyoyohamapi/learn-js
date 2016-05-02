(function(document){
    MyEvent = {};

    var DomHelper = (function() {
        var cache = {};J<F10>
        var guidCounter = 1;
        var expando = "data" + (new Date).getTime()/* 产生唯一属性 */;

        return {
            /**
             * 我们通过一个中央缓存保存DOM信息：如该DOM的事件分配器等
             * 之所以不直接使用dom.data保存，是为了防止属性污染
             * 现在，通过data[expando]指向中央缓存
             */
            getData: function(elem) {
                var guid = elem[expando];
                // 如果尚未被赋值，则代表该DOM信息尚未被缓存
                if(!guid) {
                    guid = elem[expando] = guidCounter++;
                    // 缓存该DOM
                    cache[guid] = {};
                }
                return cache[guid];
            },
            removeData: function() {
                var guid = elem[expando];
                if(!guid)
                    return;
                try {
                    delete elem[expando];
                } catch (e) {
                    if(elem.removeAttribute) {
                        elem.removeAttribute(expando);
                    }
                }
            };
        }
    })();

    (function() {

        var nextGuid = 1;

        MyEvent.addEvent = function(elem, type, fn) {
            var data = DomHelper.getData(elem);

            // 如果没有为DOM创建任何事件句柄
            if(!data.handlers)
                data.handlers = {};

            // 如果某个事件的操作句柄不存在
            if(!data.handlers[type])
                data.handlers[type] = [];

            // 为操作句柄创建唯一标识，方便之后的事件解绑
            if(!fn.guid)
                fn.guid = nextGuid++;

            // 以队列保存操作句柄，相应事件时，依次呼出事件
            data.handlers[type].push(fn);

            if(!data.dispatcher) {
                // 在初始化事件分派器之前，暂时标注事件不可响应
                data.disabled = false;
                data.dispatcher = function(event) {
                    if(data.disabled) return;
                    event = MyEvent.fixEvent(event);

                    var handlers = data.handlers[event.type];

                    if(handlers) {
                        for(var n=0,length = handlers.length; n<length; n++) {
                            handlers[n].call(elem, event);
                        }
                    }
                };
            }

            // 如果此时刚开始注册完一个事件监听，则为该元素创建事件监听
            if(data.handlers[type].length == 1) {
                if(document.addEventListener) {
                    elem.addEventListener(type, data.dispatcher, false);
                } else if(document.attachEvent) {
                    elem.attachEvent("on"+type, data.dispatcher);
                }
            }
        };

        // 事件解绑之后的清理工作
        function _tidyUp(elem, type) {

            function isEmpty(object) {
                for (var prop in object) {
                    return false;
                }
                return true;
            }

            var data = getData(elem);

            // 如果对应类型的的事件绑定已经为空
            if(data.handlers[type].length === 0) {
                delete data.handlers[type];

                if(document.removeEventListener) {
                    elem.removeEventListener(type, data.dispatcher, false);
                } else if (document.detachEvent) {
                    elem.detachEvent("on"+type,data.dispatcher);
                }
            }

            // 如果此时不存在任何类型的绑定
            if(isEmpty(data.handlers)) {
                delete data.handler;
                delete data.dispatcher;
            }

            // 甚至连缓存的属性也不存在的话，清空该DOM所持有的中央缓存
            if(isEmpty(data)) {
                DomHelper.removeData(elem);
            }
        }

        MyEvent.removeEvent = function(elem, type, fn) {
            var data = DomHelper.getData(elem);

            // 如果该DOM未绑定任何事件
            if(!data.handlers)
                return;

            /**
             * 删除某个事件类型的绑定
             */
            var removeType = function(t) {
                data.handlers[t] = [];
                // 解绑后，清空残余垃圾
                _tidyUp(elem, t);
            };

            // 如果没有指定解绑的类型，则解绑全部
            if(!type) {
                for(var t in data.handlers)
                    removeType(t);
                return;
            }

            var handlers = data.handlers[type];

            if(!handlers)
                return;

            // 如果没有指定解绑的句柄，则解绑该事件类型的所有回调句柄
            if(!fn) {
                removeType(type);
                return;
            }

            // 遍历找到对应的操作句柄，删除之
            if(fn.guid) {
                for(var n=0,length=handlers.length; n<handlers.length;i++) {
                    if(handlers[n].guid === fn.guid) {
                        handlers.splice(n--,1);
                    }
                }
            }
            // 工作完成后，清理战场
            _tidyUp(elem, type);
        };

        /**
         * 修复事件对象为浏览器兼容的事件对象
         */
        MyEvent.fixEvent = function(event) {
            function returnTrue {
                return true;
            }

            function returnFalse {
                return false;
            }

            /*
             * 如果事件对象不存在时，需要将事件绑定到全局事件
             * 如果事件不兼容W3C时，修复事件
             */
            if(!event || !event.stopPropagation) {
                var old = event || window.event;

                event = {};

                // 克隆现有事件对象到新的事件对象
                for( var prop in old ) {
                    event[prop] = old[prop];
                }

                // 修复事件发生的DOM
                if(!event.target) {
                    event.target = event.srcElement || document;
                }

                // 是否还有相关的DOM
                event.relatedTarget = event.fromElement === event.target ?
                    event.toElement : event.fromElement;

                    event.prevDefault = function() {
                        event.returnValue = false;
                        event.isDefaultPrevented = returnTrue;
                    }

                    // 默认不阻止默认行为
                    event.isDefaultPrenvent = returnFalse;

                    event.stopPropagation = function() {
                        event.cancleBubble = true;
                        event.isPropagationStopped = returnTrue;
                    }

                    // 默认不阻止冒泡
                    event.isPropagationStopped = returnFalse;

                    event.stopImmediatePropagation = function() {
                        this.isImmediatePropagationStopped = returnTrue;
                        this.stopPropagation();
                    }

                    event.isImmediatePropagationStopped = returnFalse;

                    // 修复鼠标移动
                    if(event.clientX != null) {
                        // 局部变量缓存DOM，提升性能
                        var doc = document.docuementElement, body = document.body;

                        event.pageX = event.clientX +
                            (doc && doc.scrollLeft || body && body. scrollLeft || 0) -
                                (doc && doc.clentTop || body && body.clientTop || 0);

                                event.pageY = event.clientY +
                                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                                        (doc && doc.scrollTop || body && body.clientTop || 0);
                    }

                    // 修复键盘操作
                    event.which = event.charCode || event.keyCode;

                    // 修复鼠标按键
                    // 0 == left; 1 == middle; 2 == right
                    if(event.button != null) {
                        event.button = (event.button & 1 ? 0: (event.button & 4?:1:(event.button & 2?2:0) ));

                    }
            }
            return event;
        }

        /**
         * 触发DOM元素上的一个事件
         * @param elem DOM
         * @param event mixed
         */
        MyEvent.triggerEvent(elem,event) {
            var elemData = DomHelper.getData(elem);
            var parent = elem.parentNode || elem.ownerDocument;

            if(typeof event === "string") {
                event = {type:event, target:elem}
            }

            event = fixEvent(event);

            if(elemData.dispatcher) {
                elemData.dispathcer.call(elem, event);
            }

            // 如果需要冒泡
            if(parent && !event.isPropagationStopped()) {
                triggertEvent(parent, event);
            }

            // 如果没有阻止默认行为
            else if(!parent && !event.isDefaultPrevented()) {
                var targetData = DomHelper.getData(event.target);

                if(event.target[event.type]) {
                    // 暂时隔离调度器对该DOM的事件处理
                    targetData.disabled = true;
                    // 执行该默认行为
                    event.target[event.type]();
                    targetData.disabled = false;
                }
            }
        };

        /**
         * 判断浏览器对事件冒泡的兼容状况
         * @param eventName string 事件类型名
         * @return boolean
         */
        function isEventSupported(eventName) {
            var element = document.createElement();
            var isSupported;

            eventName = 'on' + eventName;

            // 通过检测元素是否具有一个属性表示该事件，来判断是否支持该事件
            isSupported = (eventName in element);

            if(!isSupported) {
                // 如果上述检测失败，再判断假如赋给其一个‘ontype’属性
                // 能否成功绑定到一个函数
                elemen.setAttribute(eventName, 'return;');
                isSupported = typeof element[eventName] == 'function';
            }

            element = null;

            return isSupported;
        };

        // 借道click或keypress对submit进行冒泡，
        // 否则在一些老版本IE上，我们的addEvent绑定的submit事件无法冒泡
        (function(){

            var isSubmitEventSupported = MyEvent.isEventSupported("submit");

            // 只有在表单内，才有考虑submit的价值
            function _isInForm(elem) {
                var parent = elem.parentNode;
                while(parent) {
                    if(parent.nodeName.toLowerCase() === 'form') {
                        return true;
                    }
                    parent = parent.parentNode;
                }
                return false;
            }

            // 借道click触发submit
            function _triggerSubmitOnClick(e) {
                var type = e.target.type;
                if((type === 'submit' || type === 'image') &&
                   _isInForm(e.target)) {
                    return triggerEvent(this, 'submit');
                }
            }

            // 借道回车键按下触发submit
            function _triggerSubmitOnKey(e) {
                var type = e.target.type;
                if( (type === 'text' || type === 'password') &&
                   _isInForm(e.target) && e.keyCode === 13) {
                    return triggerEvent(this, "submit");
                }
            }

            MyEvent.addSubmit = function(elem, fn) {
                 MyEvent.addEvent(elem, "submit", fn);

                 // 如果已经支持了submit
                 if(isSubmitEventSupported)
                     return;

                 // 如果待绑定DOM不是表单，且尚未绑定sumbi事件
                 if(elem.nodeName.toLowerCase() !== 'form' &&
                    DomHelper.getData(elem).handlers.submit.length === 1) {
                    MyEvent.addEvent(elem, 'click', _triggerSubmitOnClick); // 借道click
                    MyEvent.addEvent(elem, 'keypress', _triggerSubmitOnKey);// 借道回车
                 }
            };

            MyEvent.removeSubmit = function(elem, fn) {
                MyEvent.removeEvent(elem, 'submit', fn);

                if(isSubmitEventSupported)
                    return;

                var data = DomHelper.getData(elem);

                // 判断是否需要删除借道处理程序
                if(elem.nodeName.toLowerCase() !== 'form' &&
                   !data || !data.handlers || !data.handlers.submit ) {
                    MyEvent.removeEvent(elem, 'click', _triggerSubmitOnClick);
                    MyEvent.removeEvent(elem, 'keypress', _triggerSubmitOnKey);
                }
            }
        })();

        // 冒泡change事件
        (function(){

            MyEvent.addChange = function(elem, fn) {
                MyEvent.addEvent(elem, "change", fn);

                if(isEventSupported('change'))
                    return;

                var data = DomHelper.getData(elem);
                var addEvent = MyEvent.addEvent;
                if(data.handlers.change.length === 1) {
                     addEvent(elem, 'focusout', _triggerChangeIfValueChanged);
                     addEvent(elem, 'click', _triggerChangeOnClick);
                     addEvent(elem, 'keydown', _triggerChangeOnKeyDown);
                     addEvent(elem, 'beforeactivate', _triggerChangeOnBefore);
                }
            };

            MyEvent.removeChange = function(elem, fn) {
                MyEvent.removeEvent(elem, 'change', fn);
                if(isEventSupported('change'))
                    return;

                var data = DomHelper.getData(elem);

                var removeEvent = MyEvent.removeEvent;
                if(!data || !data.handlers || !data.handlers.change) {
                     removeEvent(elem, 'focusout', _triggerChangeIfValueChanged);
                     removeEvent(elem, 'click', _triggerChangeOnClick);
                     removeEvent(elem, 'keydown', _triggerChangeOnKeyDown);
                     removeEvent(elem, 'beforeactivate', _triggerChangeOnBefore);
                }
            };

            function _triggerChangeOnClick(e) {
                 var type = e.target.type;
                 if( type === 'radio' || type==='checkbox' ||
                    e.target.nodeName.toLowerCase() === 'select') {
                    return _triggerChangeIfValueChanged.call(this, e);
                 }
            };

            // beforeactive的事件借道处理程序，为将要到来的focusout事件保存元素的值
            // 聚焦前?
            function _triggerChangeOnBefore(e) {
                DomHelper.getData(e.target)._change_data = _getVal(e.target);
            };

            function _triggerChangeOnKeyDown(e) {
                var type  = e.target.type;
                var key = e.keyNode;
                if(key === 13 && e.target.nodeName.toLowerCase() !== 'textarea' ||
                   key === 32 && (type==='checkbox' || type==='radio' || type==='select-multiple') {
                    return _triggerChangeIfValueChanged.call(this, e);
                }
            }

            function _getVal(elem) {
                 var type = elem.type;
                 var val = elem.value;

                 if(type==='radio' || type==='checkbox') {
                      val = elem.checked;
                 } else if (type === 'select-multiple') {
                     val = '';
                     if(elem.selectedIndex > -1) {
                         for(var i=0,length = elem.options.length;i<length;i++) {
                             var += '-'+elem.options[i].selected;
                         }
                     }
                 } else if(elem.nodeName.toLowerCase() === 'select') {
                      val = elem.selectedIndex;
                 }

                 return val;
            };

            function _triggerChangeIfValueChanged(e) {
                 var elem = e.target;
                 var data = DomHelper.getData(elem)._change_data;
                 var val = _getVal(elem);

                 var formElems = /textarea|input|select/i;

                 if(!formElems.test(elem.nodeName) || elem.readOnly) {
                      return;
                 }

                 // 如果不是可能引起变化的原因发生，则不应当变化
                 if(e.type !=== 'focusout' || elem.type !== 'radio') {
                     DomHelper.getData(elem)._change_data = val;
                 }

                 if(data === undefined || val === data) {
                      return;
                 }

                 // 仅在值发生变化的时候才触发变化事件
                 if(data != null || val) {
                     return MyEvent.triggerEvent(elem, 'change');
                 }
            }
        });
    })();

    return MyEvent;

})(document);
