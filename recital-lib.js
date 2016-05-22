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

// input计算已输入字数
!(function (window, $, undefined) {
    if (!($ && $.fn)) {
        return;
    }

    var defaults = {
        maxLength: 120,
        local: false,
    };

    var InputWithCounter = function (container, options) {
        var self = this;

        self.$ = $(container);
        self.$parent = self.$.parent().addClass('input-with-counter');
        self.$counter = $('<span class="input-counter"></span>').appendTo(self.$parent);

        self.options = $.extend(true, {}, defaults, options);

        self.childrenLength = self.$.children().length;

        self.prevIndex = self.options.initialIndex;
        self.currIndex = self.options.initialIndex;

        self.init();

        return self;
    };

    InputWithCounter.getStrLocalLength = getStrLocalLength;

    InputWithCounter.prototype = {
        init: function () {
            var self = this;

            self.$counter.css({
                bottom: self.$parent.css('paddingBottom'),
                right: self.$parent.css('paddingRight'),
            });

            self.calcCounter();
            self.calcMaxLength();

            self._bindChange();
        },
        _bindChange: function () {
            var self = this;
            var timer;

            self.$.on('keydown, keyup', function (evt) {
                if (timer) {
                    clearTimeout(timer);
                }

                timer = setTimeout(function () {
                    self.calcCounter();
                    self.calcMaxLength();
                }, 300);
            });
        },
        calcCounter: function () {
            var self = this;
            var length;

            if (self.options.local) {
                length = getStrLocalLength(self.$.val());
                length = Math.ceil(length / 2);
            }
            else {
                length = self.$.val().length;
            }

            self.$counter.text(length + '/' + self.options.maxLength);
        },
        calcMaxLength: function () {
            var self = this;
            var maxLength = self.options.maxLength;
            var value = self.$.val();

            if (self.options.local) {
                var localLength = getStrLocalLength(value);

                maxLength = maxLength * 2 - Math.min(localLength - value.length, maxLength);

                self.$.attr('maxlength', maxLength);
            }
            else if (parseInt(self.$.attr('maxlength')) !== maxLength) {
                self.$.attr('maxlength', maxLength);
            }

            if (value.length > maxLength) {
                self.$.val(value.slice(0, maxLength));
                self.calcCounter();
            }
        },
    };

    function getStrLocalLength(str) {
        if (!str) {
            return 0;
        }

        var length = 0;

        for (var i = 0, n = str.length; i < n; i++) {
            if (/^[\u4e00-\u9fa5]+$/.test(str.charAt(i))) {
                length += 2;
            }
            else {
                length++;
            }
        }

        return length;
    }

    $.fn.inputWithCounter = function (options) {
        var firstInstance;

        this.each(function () {
            var inst = new InputWithCounter(this, options);

            if (!firstInstance) {
                firstInstance = inst;
            }
        });

        return firstInstance;
    };

    $.fn.inputWithCounter.defaults = defaults;
})(window, window.$);

// component: img loader
!(function (window, $, undefined) {
    if (!($ && $.fn)) {
        return;
    }

    var lastestSrc;
    var timer;

    function clearTimer() {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }

    var defaults = {
        SERVER_URL: '',
        afterAdaptive: undefined
    };

    var ImgLoader = function (container, options) {
        var self = this;

        self.$ = $(container);

        self.options = $.extend(true, {}, defaults, options);

        self.init();

        return self;
    };

    ImgLoader.prototype = {
        init: function () {
            var self = this;

            self.lastestSrc = null;

            self.$.addClass('img-container');

            if (typeof self.$.attr('avatar') !== 'undefined') {
                self.$.addClass('img-avatar');
                self.avatar = true;
            }

            if (typeof self.$.attr('adaptive') !== 'undefined') {
                self.$.addClass('img-adaptive');
                self.adaptive = true;
            }

            if (self.$.attr('img-src')) {
                self.src = $.trim(self.$.attr('img-src'));
                self.load();
            }

            if ($.fn.imgZoomable) {
                self.$.on('click', 'img,.img', function () {
                    $(this).imgZoomable();
                });
            }
        },

        isSrcChanged: function () {
            return this.lastestSrc !== this.src;
        },

        load: function () {
            var self = this;
            var src = self.src;

            clearTimer();

            if (!src) {
                // 5秒后显示图片加载失败
                timer = setTimeout(function () {
                    self.$.removeClass('img-loading img-loaded').addClass('img-error');
                }, 5000);
                return;
            }

            if (typeof src === 'string' && src[0] === '/') {
                src = self.options.SERVER_URL + src;
            }

            self.$.html('').removeClass('img-loaded img-error').addClass('img-loading');

            var $img = $('<div />').addClass('img').css('opacity', 0).appendTo(self.$);

            var img = document.createElement('img');
            img.src = src;
            img.onload = onLoad;
            img.onerror = onError;

            function clear() {
                $img = null;
                img = null;
            }

            function onError() {
                if (self.isSrcChanged()) {
                    self.$.removeClass('img-loading');
                    self.$.addClass('img-error');
                    $img.remove();
                }

                clear();
            }

            function onLoad() {
                if (self.isSrcChanged()) {
                    self.$.removeClass('img-loading');
                    self.$.addClass('img-loaded');

                    if (self.adaptive) {
                        var oldSize, newSize;

                        oldSize = {
                            w: self.$.width(),
                            h: self.$.height()
                        };

                        self.$.append(img);
                        $img.remove();

                        newSize = {
                            w: self.$.width(),
                            h: self.$.height()
                        };

                        if ($.isFunction(self.options.afterAdaptive)) {
                            self.options.afterAdaptive(newSize, oldSize);
                        }
                    }
                    else {
                        $img.css({'background-image': 'url(' + src + ')', opacity: 1});
                    }
                    self.lastestSrc = self.src;
                }

                clear();
            }
        }
    };

    $.fn.imgLoader = function (options) {
        var firstInstance;

        this.each(function () {
            var inst = new ImgLoader(this, options);

            if (!firstInstance) {
                firstInstance = inst;
            }
        });

        return firstInstance;
    };

    $.fn.imgLoader.defaults = defaults;
}(window, window.$));

// component: tab switchs
!(function (window, $, undefined) {
    if (!($ && $.fn)) {
        return;
    }

    var defaults = {
        headerSelector: '.tab-switchs-header',
        contentSelector: '.tab-switchs-content',
        positionClass: 'tab-switchs-position',
        initialIndex: location.hash.match(/tab\d/) ? parseInt(location.hash.match(/tab(\d)/)[1]) : 0,
        duration: 500,
        onChange: undefined,
        afterInit: undefined,
    };

    var TabSwitchs = function (container, options) {
        var self = this;

        self.$ = $(container);
        self.options = $.extend(true, {}, defaults, options);

        self.$header = self.$.find(self.options.headerSelector);
        self.$position = $('<div >').addClass(self.options.positionClass).insertAfter(self.$header);
        self.$content = self.$.find(self.options.contentSelector);

        self.tabsLength = self.$header.children().length;

        self.prevIndex = self.options.initialIndex;
        self.currIndex = self.options.initialIndex;

        self.init = function (options) {
            self.$header.children().addClass('clickable');
            self.$header.on('click', 'button', function (evt) {
                var index = $(this).parent().index();
                self.switchTo(index);

                if (history.replaceState) {
                    history.replaceState(null, window.title, location.href.split('#')[0] + '#tab' + index);
                }
            });

            self.$position.width(100 / self.tabsLength + '%');

            self.$content.width(self.tabsLength * 100 + '%');
            self.$content.children().width(100 / self.tabsLength + '%');

            self.updateHeader();
            self.updatePosition();
            self.updateContent();

            if ($.isFunction(self.options.afterInit)) {
                self.options.afterInit.call(self);
            }
        };

        self.switchTo = function (index) {
            if (index === self.currIndex) {
                return;
            }

            self.prevIndex = self.currIndex;
            self.currIndex = index;

            self.updateHeader(self.options.duration);
            self.updatePosition(self.options.duration);
            self.updateContent(self.options.duration);

            if ($.isFunction(self.options.onChange)) {
                self.options.onChange.call(self, self.currIndex);
            }
        };

        self.updateHeader = function () {
            var $children = self.$header.children();

            $children.eq(self.prevIndex).removeClass('active');
            $children.eq(self.currIndex).addClass('active');
        };

        self.updatePosition = function (duration) {
            var translate = {marginLeft: 100 * self.currIndex / self.tabsLength + '%'};

            self.$position.transition(duration).css(translate);
        };

        self.updateContent = function (duration) {
            self.$content.transition(duration).css({
                marginLeft: -100 * self.currIndex + '%'
            });

            self.$content.children().transition(duration).each(function (i) {
                var $this = $(this);

                if (i === self.currIndex) {
                    $this.css({opacity: 1});
                    $this.children().css('display', '');
                }
                else if (duration > 0) {
                    $this.css({opacity: 0}).transitionEnd(function () {
                        if ($this.css('opacity') === '0') {
                            $this.children().css('display', 'none');
                        }
                    });
                }
                else {
                    $this.css({opacity: 0});
                }
            });
        };

        self.init();

        return self;
    };

    $.fn.tabSwitchs = function (options) {
        var firstInstance;

        this.each(function () {
            var inst = new TabSwitchs(this, options);

            if (!firstInstance) {
                firstInstance = inst;
            }
        });

        return firstInstance;
    };

    $.fn.tabSwitchs.defaults = defaults;
})(window, window.$);

// loading 组件
!(function (window, document) {
    var framework = window.framework;

    framework.loading = {
        _elem: null,
        getElem: function () {
            var self = this;

            if (self._elem) {
                return self._elem;
            }

            var elem = document.createElement('div');
            elem.className = 'framework-loading framework-backdrop';

            var spinning = document.createElement('div');
            spinning.className = 'framework-spinning';

            elem.appendChild(spinning);
            document.body.appendChild(elem);

            self._elem = elem;

            return elem;
        },
        show: function () {
            var self = this;

            var elem = self.getElem();
            elem.style.display = '';
            elem.style.opacity = 0;

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

                document.removeEventListener('touchmove', preventDefault, false);
            }
        }
    };

    function preventDefault(e) {
        e.preventDefault();
    }

})(window, document);