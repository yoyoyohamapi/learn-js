/**
 * 实现DOM LEVEL 2 事件模型
 * @param eventTarget 事件发生对象
 * @param eventType 事件类型
 * @param eventHandler 事件操纵句柄
 */
function listenEvent(eventTarget, eventType, eventHandler) {
    if (eventTarget.addEventListener) {
        // 第三个参数代表默认是自下而上的冒泡, 而非捕获
        eventTarget.addEventListener(eventType, eventHandler, false);
    } else if (eventTarget.attachEvent) {
        eventType = 'on' + eventType;
        eventTarget.attachEvent(eventType, eventHandler);
    } else {
        eventTarget['on' + eventType] = eventHandler;
    }
}


/**
 * 停止监听事件
 * @param eventTarget 事件发生对象
 * @param eventType 事件类型
 * @param eventHandler 事件操纵句柄
 */
function stopEventListening(eventTarget, eventType, eventHandler) {
    if (eventTarget.removeEventListener) {
        eventTarget.removeEventListener(eventType, eventHandler, false);
    } else if (eventTarget.detachEvent) {
        eventType = 'on' + eventType;
        eventTarget.detachEvent(eventType, eventHandler);
    } else {
        eventTarget['on' + eventType] = null;
    }
}

/**
 * 取消事件
 * @param event 事件对象
 */
function cancelEvent(event) {
    if(event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

/**
 * 取消冒泡
 * @param event 事件对象
 */
function cancelPropagation(event) {
    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
}