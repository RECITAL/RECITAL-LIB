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

// 警告提示组件
!(function (window, document) {
    var framework = window.framework;

    framework.alert = {
        _elem: null,
        callback: null,
        getElem: function () {
            var self = this;

            if (self._elem) {
                return self._elem;
            }

            var elem = document.createElement('div');
            elem.className = 'framework-alert framework-backdrop';

            var dialog = document.createElement('div');
            dialog.className = 'framework-dialog';

            var body = document.createElement('div');
            body.className = 'framework-dialog-body';

            var content = document.createElement('p');
            content.className = 'framework-dialog-content';

            var footer = document.createElement('div');
            footer.className = 'framework-dialog-footer';

            var btnOK = document.createElement('button');
            btnOK.className = 'framework-dialog-button clickable';
            btnOK.innerText = '确定';

            body.appendChild(content);
            dialog.appendChild(body);

            footer.appendChild(btnOK);
            dialog.appendChild(footer);

            elem.appendChild(dialog);
            document.body.appendChild(elem);

            self._elem = elem;

            return elem;
        },
        show: function (text, callback) {
            if (!text) {
                return;
            }

            var self = this;

            var elem = self.getElem();
            elem.style.display = '';
            elem.style.opacity = 0;

            var content = elem.querySelector('.framework-dialog-content');
            content.innerHTML = text;

            var btnOK = elem.querySelector('.framework-dialog-button');
            btnOK.addEventListener('click', self.hide.bind(self), false);

            self.callback = callback;

            window.requestAnimationFrame(function () {
                elem.style.opacity = 1;
            });

            document.addEventListener('touchmove', preventDefault, false);
        },
        hide: function (delay) {
            var self = this;

            if (delay > 0) {
                setTimeout(hide, +delay);
            }
            else {
                window.requestAnimationFrame(hide);
            }

            function hide() {
                var elem = self.getElem();
                elem.style.display = 'none';
                elem.style.opacity = 0;

                var btnOK = elem.querySelector('.framework-dialog-button');
                btnOK.removeEventListener('click', self.hide);

                if (typeof self.callback === 'function') {
                    self.callback();
                    self.callback = null;
                }

                document.removeEventListener('touchmove', preventDefault, false);
            }
        }
    };

    function preventDefault(e) {
        e.preventDefault();
    }

})(window, document);

function isArray(input) {
    return Object.prototype.toString.call(input) === '[object Array]';
}

function isDate(input) {
    return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
}