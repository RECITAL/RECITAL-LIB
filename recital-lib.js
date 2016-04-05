//获取URL中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return null;
}

//IOS || Android 拦截请求,js与源生平台通信
function loadURL(url) {
    var iFrame = document.createElement("iFrame");
    iFrame.setAttribute("src", url);
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
};

//日期格式化
Date.prototype.Format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季 
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

// 为可点击元素添加"activated"样式,配合css使用
!(function (window, document) {

    var ACTIVATED_CLASS = 'activated';
    var ACTIVATED_SELECTOR = '.clickable';

    document.addEventListener('touchstart', activateElements, false);
    document.addEventListener('touchmove', deactivateElements, false);
    document.addEventListener('touchend', deactivateElements, false);

    function activateElements(evt) {
        var cur = evt.target;

        if (!cur.nodeType) {
            return;
        }

        for (; cur !== this; cur = cur.parentNode || this) {
            if (cur.nodeType === 1 && cur.disabled !== true) {
                var elems = this.querySelectorAll(ACTIVATED_SELECTOR);

                for (var i = 0, n = elems.length; i < n; i++) {
                    if (elems[i] === cur) {
                        elems[i].classList.add(ACTIVATED_CLASS);
                        break;
                    }
                }
            }
        }
    }

    function deactivateElements(evt) {
        var cur = evt.target;

        if (!cur.nodeType) {
            return;
        }

        for (; cur !== this; cur = cur.parentNode || this) {
            if (cur.nodeType === 1 && cur.disabled !== true) {
                cur.classList.remove(ACTIVATED_CLASS);
            }
        }
    }

})(window, document);