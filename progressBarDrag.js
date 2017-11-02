/**
 * [ProgressBarDrag 进度条拖拽]
 * @param {[type]} bar  [需要改变长度的进度条]
 * @param {[type]} line [已经有长度的进度条]
 * @param {[type]} btn  [需要移动的按钮]
 */
function ProgressBarDrag(bar, line, btn) {
    this.bar = bar || null;
    this.line = line || null;
    this.btn = btn || null;
    this.totalW = this.line.clientWidth - this.btn.clientWidth / 2 || 0;
    this.params = {
        currentX: 0,
        isDrag: false,
        width: 0,
        left: 0
    }
}
ProgressBarDrag.prototype = {
    constructor: ProgressBarDrag,
    getcss: function(el, style) {
        return window.getComputedStyle ? window.getComputedStyle(el, null)[style] : el.currentStyle[style];
    },
    getEvent: function(e) {
        return e || window.event;
    },
    addEventListener: function(el, type, handler) {
        if (!el) {
          return;
        }
        if (el.addEventListener) {
            el.addEventListener(type, handler, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + type, handler);
        } else {
            el["on" + type] = handler;
        }
    },
    /**
     * [getDistance 获取进度条的位置]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    getDistance: function(e) {
        if (this.params.isDrag) {
            var nowX = e.clientX,
                deltaX = nowX - this.params.currentX,
                endW = this.params.width + deltaX,
                endX = this.params.left + deltaX;
            if (endW >= this.totalW) {
                endW = this.totalW;
            }
            if (endW <= this.btn.clientWidth / 2) {
                endW = this.btn.clientWidth / 2;
            }
            if (endX <= 0) {
                endX = 0;
            }
            if (endX >= this.totalW) {
                endX = this.totalW;
            }
            this.bar.style.width = endW + "px";
            this.btn.style.left = endX + "px";
        }
    },
    drag: function() {
        var _this = this;

        function move(e) {
            e = _this.getEvent(e);
            var target = e.target || e.srcElement;
            if (target === _this.btn) {
                _this.getDistance(e);
            }
            // 拖拽时如果遇到出现禁止拖拽的情况，需要阻止默认事件
            if (e.preventDefault) {
                e.preventDefault();
            }
            return false;
        }
        // 实现进度条的拖拽
        this.addEventListener(this.btn, "mousedown", function(e) {
            _this.params.width = parseFloat(_this.getcss(_this.bar, "width")) || 0;
            _this.params.left = parseFloat(_this.getcss(_this.btn, "left")) || 0;
            _this.params.currentX = e.clientX;
            _this.params.isDrag = true;
        });
        this.addEventListener(document, "mousemove", move);
        this.addEventListener(document, "mouseup", function() {
            _this.params.isDrag = false;
        });
        // 点击进度条快进
        this.addEventListener(this.line, "click", function(e) {
            _this.params.isDrag = true;
            _this.getDistance(e);
            _this.params.isDrag = false;
        });
    }
}
