(function($, jQuery) {

    var GLOBAL_HEADER_TEMPLATE = '<div class="ncommon-ghdr-header-logo"><a href="/"></a></div>';

    var USER_AGENT_HTML_CLS = {
        "n3ds": "is-ncommon-ghdr-ua-3ds",
        "windowsPC": "is-ncommon-ghdr-ua-win",
        "macPC": "is-ncommon-ghdr-ua-mac",
        "mb": "is-ncommon-ghdr-ua-mobile",
        "oldIE": "is-ncommon-ghdr-legacy-ie"
    };

    //jQuery互換レイヤー IE8+
    function ready(fn) {
        if (document.readyState == 'complete') {
            fn();
        } else if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', fn);
        } else {
            document.attachEvent('onreadystatechange', function() {
                if (document.readyState != 'loading')
                    fn();
            });
        }
    }

    function qs(selector) {
        return document.querySelector(selector);
    }

    function qsa(selector) {
        return document.querySelectorAll(selector);
    }

    function isNodeList(nodes) {
        if (nodes instanceof NodeList) return true;
        var stringRepr = Object.prototype.toString.call(nodes);
        return typeof nodes === 'object' &&
            /^\[object (HTMLCollection|NodeList|Object)\]$/.test(stringRepr) && nodes.length;
    }

    function firstElement(el) {
        return isNodeList(el) ? el[0] : el;
    }

    function createNodeListFunc(func) {
        return function(el) {
            var args = Array.prototype.slice.call(arguments);
            if (isNodeList(el)) {
                for (var i = 0; i < el.length; i++) {
                    args[0] = el[i];
                    func.apply(this, args);
                }
            } else {
                func.apply(this, args);
            }
        };
    }

    function createNodeFirstFunc(func) {
        return function(el) {
            var args = Array.prototype.slice.call(arguments);
            if (isNodeList(el)) {
                args[0] = el[0];
                return func.apply(this, args);
            } else {
                return func.apply(this, args);
            }
        };
    }
    var addEventListener = createNodeListFunc(function(el, eventName, handler) {
        if (el.addEventListener) {
            el.addEventListener(eventName, handler);
        } else {
            el.attachEvent('on' + eventName, function() {
                handler.call(el);
            });
        }
    });
    var hasClass = createNodeFirstFunc(function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
    });
    var addClass = createNodeListFunc(function(el, className) {
        if (hasClass(el, className)) return;
        if (el.classList)
            el.classList.add(className);
        else
            el.className += ' ' + className;
    });
    var removeClass = createNodeListFunc(function(el, className) {
        if (el.classList)
            el.classList.remove(className);
        else
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });

    var setStyle = createNodeListFunc(function(el, styles) {
        for (var k in styles) {
            var key = k.replace(/\-\w/, function(x) {
                return x[1].toUpperCase();
            });
            el.style[key] = styles[k];
        }
    });

    var removeNode = createNodeListFunc(function(el) {
        el.parentNode.removeChild(el);
    });

    var getStyle = createNodeFirstFunc(function(el, ruleName) {
        //https://github.com/jonathantneal/Polyfills-for-IE8/blob/master/getComputedStyle.js
        if (window.getComputedStyle) return window.getComputedStyle(el)[ruleName];

        function getPixelSize(element, style, property, fontSize) {
            var sizeWithSuffix = style[property],
                size = parseFloat(sizeWithSuffix),
                suffix = sizeWithSuffix.split(/\d/)[0],
                rootSize;
            fontSize = fontSize != null ? fontSize : /%|em/.test(suffix) && element.parentElement ? getPixelSize(element.parentElement, element.parentElement.currentStyle, 'fontSize', null) : 16;
            rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;
            return (suffix == 'em') ? size * fontSize : (suffix == 'in') ? size * 96 : (suffix == 'pt') ? size * 96 / 72 : (suffix == '%') ? size / 100 * rootSize : size;
        }

        function setShortStyleProperty(style, property) {
            var
                borderSuffix = property == 'border' ? 'Width' : '',
                t = property + 'Top' + borderSuffix,
                r = property + 'Right' + borderSuffix,
                b = property + 'Bottom' + borderSuffix,
                l = property + 'Left' + borderSuffix;

            style[property] = (style[t] == style[r] == style[b] == style[l] ? [style[t]] :
                style[t] == style[b] && style[l] == style[r] ? [style[t], style[r]] :
                style[l] == style[r] ? [style[t], style[r], style[b]] :
                [style[t], style[r], style[b], style[l]]).join(' ');
        }

        function CSSStyleDeclaration(element) {
            var
                currentStyle = element.currentStyle,
                style = this,
                fontSize = getPixelSize(element, currentStyle, 'fontSize', null);

            for (var property in currentStyle) {
                if (/width|height|margin.|padding.|border.+W/.test(property) && style[property] !== 'auto') {
                    style[property] = getPixelSize(element, currentStyle, property, fontSize) + 'px';
                } else if (property === 'styleFloat') {
                    style['float'] = currentStyle[property];
                } else {
                    style[property] = currentStyle[property];
                }
            }

            setShortStyleProperty(style, 'margin');
            setShortStyleProperty(style, 'padding');
            setShortStyleProperty(style, 'border');

            style.fontSize = fontSize + 'px';

            return style;
        }

        CSSStyleDeclaration.prototype = {
            constructor: CSSStyleDeclaration,
            getPropertyPriority: function() {},
            getPropertyValue: function(prop) {
                return this[prop] || '';
            },
            item: function() {},
            removeProperty: function() {},
            setProperty: function() {},
            getPropertyCSSValue: function() {}
        };

        function _getComputedStyle(element) {
            return new CSSStyleDeclaration(element);
        }
        return _getComputedStyle(el)[ruleName];
    });

    //templating
    function createGlobalHeader(el) {
        if (!el) return;
        var ac = el.querySelector('.ncommon-ghdr-header-account');
        ac.insertAdjacentHTML('beforebegin', GLOBAL_HEADER_TEMPLATE);
    }

    var hasTouch, isWinOrMac;
    ! function(ua) {
        hasTouch = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;
        isWinOrMac = ua.match(/Windows (?:NT|95|98)/i) ||
            ua.match(/(?:PPC|Intel) Mac OS X/);
    }(window.navigator.userAgent);

    //user agent
    function detectUserAgent() {
        var html = qs("html");
        var ua = window.navigator.userAgent;
        if (ua.match(/Nintendo 3DS/i)) {
            //new 3ds
            addClass(html, USER_AGENT_HTML_CLS["n3ds"]);
        } else if (isWinOrMac || !hasTouch) {
            //isPC
            if (window.navigator.userAgent.match(/(Windows|Win32|Trident)/i)) {
                addClass(html, USER_AGENT_HTML_CLS["windowsPC"]);
                if (window.navigator.userAgent.toLowerCase().indexOf('msie') != -1) {
                    if (window.navigator.appVersion.toLowerCase().indexOf("msie 9.") != -1) {
                        addClass(html, USER_AGENT_HTML_CLS["oldIE"]);
                    } else if (window.navigator.appVersion.toLowerCase().indexOf("msie 8.") != -1) {
                        addClass(html, USER_AGENT_HTML_CLS["oldIE"]);
                    } else if (window.navigator.appVersion.toLowerCase().indexOf("msie 7.") != -1) {
                        addClass(html, USER_AGENT_HTML_CLS["oldIE"]);
                    } else if (window.navigator.appVersion.toLowerCase().indexOf("msie 6.") != -1) {
                        addClass(html, USER_AGENT_HTML_CLS["oldIE"]);
                    }
                }
            } else if (window.navigator.userAgent.match(/(Mac_|Mac OS|Macintosh)/i)) {
                addClass(html, USER_AGENT_HTML_CLS["macPC"]);
            }
        } else {
            //isMobile or tablet
            addClass(html, USER_AGENT_HTML_CLS["mb"]);
        }
    }

    ready(function() {
        detectUserAgent();
        createGlobalHeader(qs('#ncommon-ghdr-header'));
    });
})(undefined, undefined);

/*! modernizr 3.1.0 (Custom Build) | MIT *
 * http://modernizr.com/download/?-touchevents !*/
! function(e, n, t) {
    function o(e, n) {
        return typeof e === n
    }

    function s() {
        var e, n, t, s, a, i, r;
        for (var l in c)
            if (c.hasOwnProperty(l)) {
                if (e = [], n = c[l], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length))
                    for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
                for (s = o(n.fn, "function") ? n.fn() : n.fn, a = 0; a < e.length; a++) i = e[a], r = i.split("."), 1 === r.length ? Modernizr[r[0]] = s : (!Modernizr[r[0]] || Modernizr[r[0]] instanceof Boolean || (Modernizr[r[0]] = new Boolean(Modernizr[r[0]])), Modernizr[r[0]][r[1]] = s), f.push((s ? "" : "no-") + r.join("-"))
            }
    }

    function a(e) {
        var n = u.className,
            t = Modernizr._config.classPrefix || "";
        if (p && (n = n.baseVal), Modernizr._config.enableJSClass) {
            var o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
            n = n.replace(o, "$1" + t + "js$2")
        }
        Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), p ? u.className.baseVal = n : u.className = n)
    }

    function i() {
        return "function" != typeof n.createElement ? n.createElement(arguments[0]) : p ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
    }

    function r() {
        var e = n.body;
        return e || (e = i(p ? "svg" : "body"), e.fake = !0), e
    }

    function l(e, t, o, s) {
        var a, l, f, c, d = "modernizr",
            p = i("div"),
            h = r();
        if (parseInt(o, 10))
            for (; o--;) f = i("div"), f.id = s ? s[o] : d + (o + 1), p.appendChild(f);
        return a = i("style"), a.type = "text/css", a.id = "s" + d, (h.fake ? h : p).appendChild(a), h.appendChild(p), a.styleSheet ? a.styleSheet.cssText = e : a.appendChild(n.createTextNode(e)), p.id = d, h.fake && (h.style.background = "", h.style.overflow = "hidden", c = u.style.overflow, u.style.overflow = "hidden", u.appendChild(h)), l = t(p, e), h.fake ? (h.parentNode.removeChild(h), u.style.overflow = c, u.offsetHeight) : p.parentNode.removeChild(p), !!l
    }
    var f = [],
        c = [],
        d = {
            _version: "3.1.0",
            _config: {
                classPrefix: "",
                enableClasses: !0,
                enableJSClass: !0,
                usePrefixes: !0
            },
            _q: [],
            on: function(e, n) {
                var t = this;
                setTimeout(function() {
                    n(t[e])
                }, 0)
            },
            addTest: function(e, n, t) {
                c.push({
                    name: e,
                    fn: n,
                    options: t
                })
            },
            addAsyncTest: function(e) {
                c.push({
                    name: null,
                    fn: e
                })
            }
        },
        Modernizr = function() {};
    Modernizr.prototype = d, Modernizr = new Modernizr;
    var u = n.documentElement,
        p = "svg" === u.nodeName.toLowerCase(),
        h = d._config.usePrefixes ? " -webkit- -moz- -o- -ms- ".split(" ") : [];
    d._prefixes = h;
    var m = d.testStyles = l;
    Modernizr.addTest("touchevents", function() {
        var t;
        if ("ontouchstart" in e || e.DocumentTouch && n instanceof DocumentTouch) t = !0;
        else {
            var o = ["@media (", h.join("touch-enabled),("), "heartz", ")", "{#modernizr{top:9px;position:absolute}}"].join("");
            m(o, function(e) {
                t = 9 === e.offsetTop
            })
        }
        return t
    }), s(), a(f), delete d.addTest, delete d.addAsyncTest;
    for (var v = 0; v < Modernizr._q.length; v++) Modernizr._q[v]();
    e.Modernizr = Modernizr
}(window, document);