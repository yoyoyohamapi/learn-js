(function (window) {
    var Dommer = function () {
        var closeTags = /^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i;
        return {
            /**
             * 将闭合标签转换为非闭合标签
             * @param html
             * @returns {void|string|XML}
             */
            convert: function (html) {
                return html.replace(/(<(\w+)[^>]*)\/>/, function (all, front, tag) {
                    console.log('all is:', all);
                    console.log('front is:', front);
                    console.log('tag is:', tag);
                    return closeTags.test(tag) ? all : front + "></" + tag + ">";
                });
            },
            getNodes: function (htmlString, doc, fragment) {
                // 需要被包裹的标签
                var map = {
                    "<td" : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    "<th" : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
                    "<tr" : [2, "<table><thead>", "</thead></table>"],
                    "<option" : [1, "<select multiple='multiple'>", "</select>"],
                    "<optgroup" : [1, "<select mutiple='multiple'>", "</select>"],
                    "<legend" : [1, "<fieldset>", "</field>"],
                    "<thead": [1, "<table>", "</table>"],
                    "<tbody": [1, "<table>", "</table>"],
                    "<tfoot": [1, "<table>", "</table>"],
                    "<colgroup": [1, "<table>", "</table>"],
                    "<caption": [1, "<table>", "</table>"],
                    "<col": [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
                    "<link": [3, "<div></div><div>", "</div>"]
                };

                var tagName = htmlString.match(/<\w+/),
                    mapEntry = tagName?map[tagName[0]]: null;

                // 如果没匹配,则不需要包装
                if(!mapEntry) mapEntry = [0, "",""];

                // 在根节点或者指定节点注入DOM
                var div = (doc || document).createElement("div");

                // 包裹
                div.innerHTML = mapEntry[1] + htmlString + mapEntry[2];

                while(mapEntry[0]--) div = div.lastChild;

                if(fragment) {
                    while (div.firstChild) {
                        fragment.appendChild(div.firstChild);
                    }
                }
                return div.childNodes;
            }
        }

    }();
    window.Dommer = Dommer;
})(window);