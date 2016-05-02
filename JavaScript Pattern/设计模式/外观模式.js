// 外观模式: 整合复杂逻辑,暴露单一接口(外观)

var myevent = {
    // 我们整合防止默认行为和停止冒泡到同一外观
  stop: function(){
      if(typeof e.preventDefault === 'function') {
          e.preventDefault();
      }
      if(typeof e.stopPropagation === 'function') {
          e.stopPropagation();
      }
      if(typeof e.returnValue === 'boolean') {
          e.returnValue = false;
      }
      if(typeof e.cancelBubble === 'boolean') {
          e.cancelBubble = true;
      }
  }
};

