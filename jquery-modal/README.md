## 基于Jquery的模态框设计
-----------

### 设计思路

在创建模态框之前, 我们先创建如下组件:

#### dragger

拖拽器, 主要服务于DOM元素的拖拽移动, 当鼠标按下时, 开始一次拖拽, 当鼠标松开时,结束这次拖拽:

1. 利用事件监听机制实现DOM元素可拖拽
2. 支持配置项:
    - region {Jquery DOM} 可拖拽区域
    - onStart {Function} 拖拽开始的回调
    - onMove {Function} 拖拽过程中的回调
    - onDrop {Function} 拖拽结束的回调

#### aligner

定位器, 封装了常用的定位操作, 默认实现垂直居中, 公开的API皆在水平位置移动元素:

1. 支持DOM元素居中
2. 支持DOM元素居左
3. 支持DOM元素居右
4. 支持配置:
    - onChange {Function} 位置变动的回调

#### dimmer

遮罩器, 遮罩层将分为__全页面遮罩__和__当前DOM遮罩__,主要完成如下任务:

1. 为DOM产生一个遮罩层
2. 显示/隐藏一个遮罩层
3. 判断DOM是否已经具有遮罩层
4. 支持如下配置项:
    - isPage {Boolean} 默认true 是否产生的全局遮罩层
    - closable {Boolean} 默认true 是否支持单击遮罩自动关闭该遮罩
    
#### modal

模态框组件, 他将利用到上述三个组件, 使得该模态框支持拖拽定位, 并且辅以遮罩层使得模态框在页面的位置更加突出
模态框的主要功能如下:

1. 使页面定义的某个DOM成为一个模态框
2. 显示/隐藏模态框
3. 拖拽模态框
4. 定位模态框
5. 支持如下配置项:
    - dragRegion {Jquery DOM} 设置拖拽区域
    - onShow {Function} 开始显示模态框的回调
    - onShowed {Function} 结束显示模态框的回调
    - onHide {Function} 开始隐藏模态框的回调
    - onHidden {Function} 结束隐藏模态框的回调
    - onStart {Function} 开始拖拽模态框的回调
    - onMove {Function} 拖拽模态框过程中的回调
    - onDrop {Function} 结束拖拽时的回调
    
在实际场景中, 页面可能存在多个模态框, 多模态框将会表现出如下两种不同的行为:
1. 存在一个基模态框, 其余产生的模态框附着于其上
2. 各个模态框无关, 新模态框打开前,老模态框将会关闭

为了实现该业务场景, 我在配置项中新增了
    - multiple {Boolean} 默认false 如果为true,该模态框将成为场景一的基模态框,否则服务于场景二

-------------

### 组件设计模式
 
由于该作业要求基于Jquery, 所以各个组件我都是扩展了jquery的:

```javascript
$.fn
```

来做出jquery插件. 如下所示:

```javascript
$.fn.modal = function(){};
// ...

```

同时,我也权衡了以下两种API调用方式:

1. 方法式调用

```javascript
// 显示模态框
$("dom").modal().show();
```

2. 语义传达

```javascript
$("dom").modal('show');
```

最终,我选择第二个方式来规范API调用,不仅是因为语义话更加友好,而且能将插件方法包裹在一个对象中:

```javascript
var methods = {

    init: function (options) {
        // 支持链式调用
        return $(this).each(function (index, elem) {
            
        });
    },
    isHidden: function () {
        // ..
    },
    show: function () {
        // ..
    },
    hide: function () {
       // ..
    },
    toggle: function () {
        // ..
    }
    
    // .......
};

$.fn.modal = function (method) {
    if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(this, 0));
    } else if (!method || typeof method === 'object') {
        return methods.init.call(this, method);
    } else {
        console.log(method);
        $.error("wrong method");
    }
}

```
---------
