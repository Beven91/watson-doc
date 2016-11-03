(function() {

    function Watson() {
        this.init();
    }

    Watson.prototype.init = function() {
        this.listen("click");
    }

    Watson.prototype.toggleMethod = function(ev, element) {
        var header = element.parentElement;
        var container = element.nextElementSibling;
        if (container) {
            var display = container.style.display;
            if (display == "none") {
                header.className = header.className + " expand ";
            } else {
                header.className = header.className.replace(' expand ', '');
            }
            display = display == "none" ? "" : "none";
            container.style.display = display;
        }
    }

    Watson.prototype.listen = function(name) {
        this.domEvent(document.body, name, this.bind(function(ev) {
            var element = this.bubble((ev.srcElement || ev.target), name);
            if (element) {
                var method = element.getAttribute(name);
                method && this.doCall(this[method], ev, element);
            }
        }));
    }

    Watson.prototype.doCall = function(handler, data) {
        var args = Array.prototype.slice.call(arguments, 1, arguments.length);
        if (this.isFunction(handler)) {
            return handler.apply(this, args);
        }
    }

    Watson.prototype.bind = function(handler) {
        var context = this;
        return function() {
            return handler.apply(context, arguments);
        }
    }

    Watson.prototype.isType = function(obj, type) {
        return Object.prototype.toString.call(obj) == "[object " + type + "]";
    }

    Watson.prototype.isFunction = function(obj) {
        return this.isType(obj, "Function");
    }

    Watson.prototype.bubble = function(element, type) {
        var current = element;
        while (!current.getAttribute(type)) {
            current = current.parentElement;
            if (!current) {
                break;
            }
        }
        return current;
    }

    Watson.prototype.domEvent = function(element, name, handler) {
        if (element.addEventListener) {
            element.addEventListener(name, handler);
        } else if (element.attachEvent) {
            element.attachEvent('on' + name, handler);
        } else {
            element['on' + name] = handler;
        }
    }

    var watson = new Watson();
}());