(function(global, factory) {

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(global, jQuery);

    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], function(jQuery) {
            return factory(global, jQuery);
        });
    } else {
        global['Polaris'] = factory(global, global.jQuery);
    }

})((this || 0).self || global, function(global, $) {

    var _ua = {},
        _css = {},
        _html = {},
        _util = {},
        _event = {},
        _device = {},
        _easing = {},
        _htmlClasses = global.document ? document.documentElement.className.split(' ') : [];


    /*****************************************************************************************************************
     * 乱数生成器
     *****************************************************************************************************************/

    var Random = (function() {

        var Rand = function(seed) {
            this.seeds = [123456789, 362436069, 521288629, 88675123];

            if (typeof seed !== 'number') {
                seed = +new Date();
            }

            this.seeds[2] ^= seed;
            this.seeds[2] ^= this.seeds[2] >> 21;
            this.seeds[2] ^= this.seeds[2] << 35;
            this.seeds[2] ^= this.seeds[2] >> 4;
            this.seeds[2] *= 268582165;
            this.get();
            this.get();
        };

        Rand.prototype.get = function(min, max) {
            var t = (this.seeds[0] ^ (this.seeds[0] << 11));
            this.seeds[0] = this.seeds[1];
            this.seeds[1] = this.seeds[2];
            this.seeds[2] = this.seeds[3];

            var r = (this.seeds[3] = (this.seeds[3] ^ (this.seeds[3] >> 19)) ^ (t ^ (t >> 8)));

            if (arguments.length >= 2) {
                return min + r % (max - min + 1);
            } else {
                return r;
            }
        };

        return Rand;
    })();



    /*****************************************************************************************************************
     * ユーザーエージェント判別
     *****************************************************************************************************************/

    if (global.navigator) {
        var _userAgent = global.navigator.userAgent.toLowerCase(),
            _IE, _IEver,
            _Edge, _EdgeVer,
            _Chrome, _ChromeVer,
            _FireFox, _FireFoxVer,
            _Safari, _SafariVer,
            _Opera, _OperaVer,
            _Mac, _iPhone, _iPad, _iPod, _iOSver, _BlackBerry,
            _Android, _AndroidMobile, _AndroidTablet, _AndroidVer,
            _WindowsPhone, _nexus7,
            _3ds, _dsi, _wii, _wiiu, _ps3, _ps4, _psp, _psv, _xbox,
            _bot;

        // ブラウザ
        if (_userAgent.indexOf("msie") != -1) {
            _IE = true;
            _userAgent.match(/msie (\d+\.\d)/);
            _IEver = parseFloat(RegExp.$1);

        } else if (_userAgent.indexOf('trident') != -1) {
            _IE = true;
            _userAgent.match(/rv:(\d+\.\d)/);
            _IEver = parseFloat(RegExp.$1);

        } else if (_userAgent.indexOf('edge/') != -1) {
            _Edge = true;
            _userAgent.match(/edge[\/ ]?(\d+\.\d)/);
            _EdgeVer = parseFloat(RegExp.$1);

        } else if (_userAgent.indexOf("chrome") != -1) {
            _Chrome = true;
            _userAgent.match(/chrome[\/ ]?(\d+\.\d+)/);
            _ChromeVer = parseFloat(RegExp.$1);

        } else if (_userAgent.indexOf("firefox") != -1) {
            _FireFox = true;
            _userAgent.match(/firefox[\/ ]?(\d+\.\d+)/);
            _FireFoxVer = parseFloat(RegExp.$1);

        } else if (_userAgent.indexOf("opera") != -1) {
            _Opera = true;
            _userAgent.match(/opera[\/ ]?(\d+\.\d+)/);
            _OperaVer = parseFloat(RegExp.$1);

        } else if (_userAgent.indexOf("safari") != -1) {
            _Safari = true;
            _userAgent.match(/version[\/ ]?(\d+\.\d+)/);
            _SafariVer = parseFloat(RegExp.$1);
        }

        if (_userAgent.indexOf("iphone") != -1) {
            _iPhone = true;
            _userAgent.match(/iphone os (\d+)_(\d+)/);
            _iOSver = RegExp.$1 * 1 + RegExp.$2 * 0.1;

        } else if (_userAgent.indexOf("ipad") != -1) {
            _iPad = true;
            _userAgent.match(/cpu os (\d+)_(\d+)/);
            _iOSver = RegExp.$1 * 1 + RegExp.$2 * 0.1;

        } else if (_userAgent.indexOf("ipod") != -1) {
            _iPod = true;
            _userAgent.match(/os (\d+)_(\d+)/);
            _iOSver = RegExp.$1 * 1 + RegExp.$2 * 0.1;

        } else if (_userAgent.indexOf("android") != -1) {
            _Android = true;
            _userAgent.match(/android (\d+\.\d)/);
            _AndroidVer = parseFloat(RegExp.$1);

            if (_userAgent.indexOf('mobile') != -1) {
                _AndroidMobile = true;
            } else {
                _AndroidTablet = true;
            }
        } else if (_userAgent.indexOf("windows phone") != -1) {
            _WindowsPhone = true;

        } else if (_userAgent.indexOf('blackberry') !== -1 || _userAgent.indexOf('bb10') !== -1) {
            _BlackBerry = true;
        }

        if (_userAgent.indexOf('mac os') != -1) {
            _Mac = true;
        }
        if (_userAgent.indexOf('nexus 7') != -1) {
            _nexus7 = true;
        }

        if (_userAgent.indexOf('playstation 3') != -1) {
            _ps3 = true;
        }
        if (_userAgent.indexOf('playstation 4') != -1) {
            _ps4 = true;
        }
        if (_userAgent.indexOf('playstation portable') != -1) {
            _psp = true;
        }
        if (_userAgent.indexOf('playstation vita') != -1) {
            _psv = true;
        }
        if (_userAgent.indexOf('nintendo') != -1) {
            if (_userAgent.indexOf('dsi;') != -1) {
                _dsi = true;
            } else if (_userAgent.indexOf('3ds') != -1) {
                _3ds = true;
            } else if (_userAgent.indexOf('wii;') != -1) {
                _wii = true;
            } else if (_userAgent.indexOf('wiiu') != -1) {
                _wiiu = true;
            }
        }

        if (_userAgent.indexOf('mac os') != -1) {
            _Mac = true;
        }
        if (_userAgent.indexOf('nexus 7') != -1) {
            _nexus7 = true;
        }

        if (_userAgent.indexOf('googlebot') != -1 || _userAgent.indexOf('yahoo') != -1 || _userAgent.indexOf('msnbot') != -1) {
            _bot = true;
        }

        _ua = {
            // IE
            ie: _IE,
            ie6: (_IEver == 6.0),
            ie7: (_IEver == 7.0),
            ie8: (_IEver == 8.0),
            ie9: (_IEver == 9.0),
            ie10: (_IEver == 10.0),
            ie11: (_IEver == 11.0),
            iegt6: !!(_IEver > 6),
            iegt7: !!(_IEver > 7),
            iegt8: !!(_IEver > 8),
            iegt9: !!(_IEver > 9),
            iegt10: !!(_IEver > 10),
            iegt11: !!(_IEver > 11),
            ielt6: !!(_IE && _IEver < 6),
            ielt7: !!(_IE && _IEver < 7),
            ielt8: !!(_IE && _IEver < 8),
            ielt9: !!(_IE && _IEver < 9),
            ielt10: !!(_IE && _IEver < 10),
            ielt11: !!(_IE && _IEver < 11)

                // Edge
                ,
            edge: !!_Edge

                // IE以外
                ,
            chrome: !!_Chrome,
            firefox: !!_FireFox,
            opera: !!_Opera,
            safari: !!_Safari

                // スマートフォン系
                ,
            iphone: !!_iPhone,
            ipad: !!_iPad,
            ipod: !!_iPod,
            ios: !!(_iPhone || _iPad || _iPod),
            android: !!_Android,
            androidmobile: !!_AndroidMobile,
            androidtablet: !!_AndroidTablet,
            windowsphone: !!_WindowsPhone,
            smartdevice: (!!_iPhone || !!_iPad || !!_iPod || !!_Android || !!_WindowsPhone || !!_BlackBerry),
            mobile: (!!_iPhone || !!_iPod || !!_AndroidMobile || !!_WindowsPhone),
            tablet: (!!_iPad || !!_AndroidTablet),
            nexus7: (!!_nexus7),
            blackberry: !!_BlackBerry

                // ゲーム機
                ,
            ps3: (!!_ps3),
            ps4: (!!_ps4),
            psp: (!!_psp),
            psv: (!!_psv),
            n3ds: (!!_3ds),
            ndsi: (!!_dsi),
            nwii: (!!_wii),
            nwiiu: (!!_wiiu)

                ,
            bot: !!_bot

                ,
            version: {
                ie: _IEver,
                edge: _EdgeVer,
                firefox: _FireFoxVer,
                chrome: _ChromeVer,
                safari: _SafariVer,
                opera: _OperaVer,
                android: _AndroidVer,
                ios: _iOSver
            }
        };
    }


    /*****************************************************************************************************************
     * ユーティリティ
     *****************************************************************************************************************/

    _util = (function() {

        // 外部用乱数生成器
        var _o_rand = null;

        // 内部用乱数生成器
        var _i_rand = new Random();

        // ユニーク文字列ストック
        var _ustock = {};

        // 画面幅
        var _winW = 0;

        // 画面高
        var _winH = 0;

        // リサイズリスナー関数
        var _resizeListeners = null;

        // スクロールリスナー関数
        var _scrollListeners = null;

        // ホイールリスナー関数
        var _wheelListeners = null;

        // フレームリスナー関数
        var _frameListeners = null;


        var isObject = function(arg) {
            return (Object.prototype.toString.call(arg) === '[object Object]');
        };

        var isArray = function(arg) {
            return (Object.prototype.toString.call(arg) === '[object Array]');
        };

        var isFunction = function(arg) {
            return (Object.prototype.toString.call(arg) === '[object Function]');
        };

        var isNumber = function(arg) {
            return (Object.prototype.toString.call(arg) === '[object Number]');
        };

        var isBoolean = function(arg) {
            return (Object.prototype.toString.call(arg) === '[object Boolean]');
        };

        var isString = function(arg) {
            return (Object.prototype.toString.call(arg) === '[object String]');
        };

        var isNull = function(arg) {
            return (arg === null);
        };

        var srand = function(seed) {
            _o_rand = new Random(seed);
        };

        var rand = function(min, max) {
            if (_o_rand === null) {
                _o_rand = new Random();
            }
            return _o_rand.get(min, max);
        };

        var unique = function(len) {
            var str = '';
            var stack = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

            if (len && !isNaN(len)) {
                len = parseInt(len);
            } else {
                len = 10;
            }
            for (var i = 0; i < len; i++) {
                str += stack.charAt(_i_rand.get(0, stack.length - 1));
            }
            if (str in _ustock) {
                return uniqueString(len + 1);
            } else {
                _ustock[str] = 1;
                return str;
            }
        };

        var zeroPad = function(number, digit) {
            if (isNumber(number)) {
                var len = (number + '').length;
                if (len < digit)
                    for (var i = 0; i < digit - len; i++) number = '0' + number;
                return number + '';
            } else {
                return number + '';
            }
        };

        var clamp = function(number, min, max) {
            if (min === undefined) min = 0;
            if (max === undefined) max = 1;
            return Math.min(max, Math.max(min, number));
        };

        var extend = function(target, object) {
            if (isObject(target) && isObject(object)) {
                for (var key in object) {
                    if (object.hasOwnProperty(key)) {
                        if (isObject(object[key])) {
                            target[key] = extend({}, object[key]);
                        } else {
                            target[key] = object[key];
                        }
                    }
                }
                target.__proto__ = object.__proto__;

                return target;
            } else {
                return target;
            }
        };

        var trim = function(str) {
            if (isString(str)) {
                return unescape(escape(str).replace(/^(%u3000|%20|%09)+|(%u3000|%20|%09)+$/g, ""));
            }
        };

        var hyphen2camel = function(str) {
            if (isString(str)) {
                var blocks = str.split('-');

                for (var i = 0; i < blocks.length; i++) {
                    blocks[i] = blocks[i].charAt(0).toUpperCase() + blocks[i].slice(1);
                }

                return blocks.join('');
            }
            return str;
        };

        var camel2hyphen = function(str) {
            if (isString(str)) {
                return str.split(/(?=[A-Z])/).join('-').toLowerCase();
            }
            return str;
        };

        var hex2rgb = function(arg) {
            var hexCode = [0, 0, 0];

            if (isString(arg)) {
                if (arg.match(/#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/)) {
                    hexCode[0] = RegExp.$1;
                    hexCode[1] = RegExp.$2;
                    hexCode[2] = RegExp.$3;
                } else if (arg.match(/#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/)) {
                    hexCode[0] = RegExp.$1 + '' + RegExp.$1;
                    hexCode[1] = RegExp.$2 + '' + RegExp.$2;
                    hexCode[2] = RegExp.$3 + '' + RegExp.$3;
                }
            }

            var rgb = [0, 0, 0];

            for (var i = 0; i < 3; i++) {
                rgb[i] = parseInt(hexCode[i], 16);
            }
            return rgb;
        };

        var rgb2hex = function(arg) {
            if (isArray(arg)) {
                var R = arg[0].toString(16);
                var G = arg[1].toString(16);
                var B = arg[2].toString(16);
            } else {
                var R = arguments[0].toString(16);
                var G = arguments[1].toString(16);
                var B = arguments[2].toString(16);
            }
            if (R.length == 1) R = '0' + R;
            if (G.length == 1) G = '0' + G;
            if (B.length == 1) B = '0' + B;
            return '#' + R + G + B;
        };

        var parseURI = function(arg) {
            var p = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'];
            var r = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
            var m = r.exec(arg || location.href);
            var u = {}
            var i = p.length;

            while (i--) {
                u[p[i]] = m[i] || '';
            }
            return u;
        };

        var parseParam = function(arg) {
            var param = {};

            if (!arg) {
                arg = location.search;
            }
            if (arg && arg.indexOf('?') !== -1) {
                arg = arg.split('?')[1];
            } else {
                arg = false;
            }
            if (arg) {
                var _f = arg.replace('&amp;', '&').split('&');

                for (var i = 0; i < _f.length; i++) {
                    if (_f[i].indexOf('=') != -1) {
                        var _p = _f[i].split('=');
                        param[_p[0]] = _p[1];
                    } else {
                        param[_f[i]] = '';
                    }
                }
            }
            return param;
        };

        var shuffle = function(arr, overwrite) {
            if (arr && isArray(arr)) {
                if (overwrite || overwrite === undefined) {
                    for (var i = 0; i < arr.length; i++) {
                        var j = util.rand(0, arr.length);
                        var t = arr[i];
                        arr[i] = arr[j];
                        arr[j] = t;
                    }
                } else {
                    var index = [];

                    for (var i = 0; i < arr.length; i++) {
                        index[i] = i;
                    }
                    for (var i = 0; i < index.length; i++) {
                        var j = util.rand(0, index.length);
                        var t = index[i];
                        index[i] = index[j];
                        index[j] = t;
                    }
                    for (var i = 0; i < index.length; i++) {
                        index[i] = arr[index[i]];
                    }
                    return index;
                }
            }
        };

        var nl2br = function(str) {
            if (str && isString(str)) {
                str = str.replace(/[\n]/g, '<br />');
            }
            return str;
        };

        var sanitize = function(str, nl2br) {
            if (str && isString(str)) {
                str = str.replace(/</igm, "&lt;").replace(/>/igm, "&gt;");

                if (nl2br) {
                    str = str.replace(/[\n]/g, '<br />');
                }
            }
            return str;
        };

        var mbSubstr = function(str, length, suffix) {
            if (isString(str)) {
                if (suffix === undefined) suffix = '...';

                for (var i = 0, l = 0; i < str.length; i++) {
                    l += str.charCodeAt(i) <= 255 ? 1 : 2;

                    if (l > length) {
                        return str.substr(0, l) + suffix;
                    }
                }
            }
            return str;
        };

        var visibleAreaRate = function(offsetTop, height, scrollTop, scrollBottom) {
            var rate = (Math.min(scrollBottom, offsetTop + height) - Math.max(scrollTop, offsetTop)) / height;

            return rate > 0 ? rate : 0;
        };

        var search = function(key, data) {
            var keys = key.split('.')

            var _search = function(keys, data) {
                var ckey = keys.shift();

                if (_util.isObject(data)) {
                    if (ckey in data) {
                        if (keys.length == 0) {
                            return data[ckey];
                        } else {
                            return _search(keys, data[ckey]);
                        }
                    } else {
                        return undefined;
                    }
                } else if (_util.isArray(data)) {
                    if (isNaN(ckey)) {
                        return undefined;
                    } else {
                        ckey = parseInt(ckey);

                        if (keys.length == 0) {
                            return data[ckey];
                        } else {
                            return _search(keys, data[ckey]);
                        }
                    }
                } else {
                    return undefined;
                }
            };
            return _search(keys, data);
        };

        var getWindowSize = function() {
            var w = 0;
            var h = 0;

            if (isNumber(global.innerWidth)) {
                w = Math.min(global.innerWidth, global.document.documentElement.clientWidth);
                h = global.innerHeight;
            } else {
                w = global.document.documentElement.clientWidth;
                h = global.document.documentElement.clientHeight;
            }
            return {
                w: w,
                h: h
            };
        };

        var onResize = function(listener, thisObject) {
            var id = unique(10);

            if (isFunction(listener)) {
                var _this = thisObject !== undefined ? thisObject : global;

                if (_resizeListeners === null) {
                    _resizeListeners = {};

                    var size = getWindowSize();

                    _winW = size.w;
                    _winH = size.h;

                    var handler = function() {
                        var size = getWindowSize();
                        _winW = size.w;
                        _winH = size.h;

                        for (var _id in _resizeListeners) {
                            _resizeListeners[_id].callable.call(_resizeListeners[_id].thisObject, _winW, _winH);
                        }
                    };

                    if (global.addEventListener) {
                        global.addEventListener('resize', handler, false);
                        global.addEventListener('orientationchange', function() {
                            setTimeout(handler, 1000);
                        }, false);
                    } else {
                        global.attachEvent('onresize', handler);
                    }
                }
                _resizeListeners[id] = {
                    callable: listener,
                    thisObject: _this
                };

                listener.call(_this, _winW, _winH);
            }
            return id;
        };

        var offResize = function(id) {
            if (_resizeListeners !== null && isString(id) && id in _resizeListeners) {
                delete _resizeListeners[id];
            }
        };

        var onScroll = function(listener, thisObject) {
            var id = unique(10);

            if (isFunction(listener)) {
                var _this = thisObject !== undefined ? thisObject : global;

                if (_scrollListeners === null) {
                    _scrollListeners = {};

                    var handler = function() {
                        var size = getWindowSize();
                        var t = global.document.body.scrollTop || global.document.documentElement.scrollTop;
                        var l = global.document.body.scrollLeft || global.document.documentElement.scrollLeft;
                        var b = t + size.h;
                        var r = l + size.w;

                        for (var _id in _scrollListeners) {
                            _scrollListeners[_id].callable.call(_scrollListeners[_id].thisObject, t, b, l, r);
                        }
                    };

                    if (window.addEventListener) {
                        global.addEventListener('resize', handler, false);
                        global.addEventListener('scroll', handler, false);
                    } else {
                        global.attachEvent('onresize', handler);
                        global.attachEvent('onscroll', handler);
                    }
                    if (_device.hasTouch && _ua.ios) {
                        global.addEventListener('touchmove', handler, false);
                    }
                }
                _scrollListeners[id] = {
                    callable: listener,
                    thisObject: _this
                };

                if (global.document.body) {
                    var t = global.document.body.scrollTop || global.document.documentElement.scrollTop;
                    var l = global.document.body.scrollLeft || global.document.documentElement.scrollLeft;
                    var b = t + _winH;
                    var r = l + _winW;
                    listener.call(_this, t, b, l, r);
                }
            }
            return id;
        };

        var offScroll = function(id) {
            if (_scrollListeners !== null && isString(id) && id in _scrollListeners) {
                delete _scrollListeners[id];
            }
        };

        var onWheel = function(element, listener, thisObject) {
            var id = unique(10);

            if (isFunction(listener)) {
                var _this = thisObject !== undefined ? thisObject : global;

                var wheelEvent = {
                    type: '',
                    wheelDeltaX: 0,
                    wheelDeltaY: 0,
                    returnValue: true,
                    originalEvent: null,

                    preventDefault: function() {
                        this.returnValue = false;
                    }
                };

                if (_wheelListeners === null) {
                    _wheelListeners = {};
                }

                _wheelListeners[id] = {
                    target: element,
                    callable: listener,
                    thisObject: _this,
                    off: null
                };

                if (element.addEventListener) {

                    if (_device.hasTouch) {
                        var timer = null;
                        var dx, dy, sx, sy;

                        var tick = function(e) {
                            dx *= 0.9;
                            dy *= 0.9;

                            wheelEvent.returnValue = true;
                            wheelEvent.type = 'touchend';
                            wheelEvent.wheelDeltaX = dx;
                            wheelEvent.wheelDeltaY = dy;

                            for (var _id in _wheelListeners) {
                                if (element === _wheelListeners[id].target) {
                                    _wheelListeners[id].callable.call(thisObject, wheelEvent);
                                }
                            }

                            if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
                                timer = setTimeout(tick, 10);
                            }
                        };

                        var touchstart = function(e) {
                            clearTimeout(timer);
                            sx = e.touches[0].clientX;
                            sy = e.touches[0].clientY;
                        };

                        var touchmove = function(e) {
                            dx = e.touches[0].clientX - sx;
                            dy = e.touches[0].clientY - sy;
                            sx = e.touches[0].clientX;
                            sy = e.touches[0].clientY;

                            wheelEvent.returnValue = true;
                            wheelEvent.type = 'touchmove';
                            wheelEvent.wheelDeltaX = dx;
                            wheelEvent.wheelDeltaY = dy;
                            wheelEvent.originalEvent = e;

                            for (var _id in _wheelListeners) {
                                if (element === _wheelListeners[id].target) {
                                    _wheelListeners[id].callable.call(thisObject, wheelEvent);
                                }
                            }

                            if (wheelEvent.returnValue === false) {
                                e.preventDefault();
                            }
                        };

                        _wheelListeners[id].off = function() {
                            element.removeEventListener('touchstart', touchstart);
                            element.removeEventListener('touchmove', touchmove);
                            element.removeEventListener('touchend', tick);
                            element.removeEventListener('touchcancel', tick);
                        };

                        element.addEventListener('touchstart', touchstart, false);
                        element.addEventListener('touchmove', touchmove, false);
                        element.addEventListener('touchend', tick, false);
                        element.addEventListener('touchcancel', tick, false);
                    } else {

                        var mousewheel = function(e) {
                            var dx = e.wheelDeltaX ? e.wheelDeltaX : 0;
                            var dy = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;

                            if (dy % 40 == 0) {
                                dy *= 0.8;
                            } else {
                                dy *= 0.15;
                            }
                            if (dx % 40 == 0) {
                                dx *= 0.8;
                            } else {
                                dx *= 0.15;
                            }

                            wheelEvent.returnValue = true;
                            wheelEvent.type = 'mousewheel';
                            wheelEvent.wheelDeltaX = dx;
                            wheelEvent.wheelDeltaY = dy;
                            wheelEvent.originalEvent = e;

                            for (var _id in _wheelListeners) {
                                if (element === _wheelListeners[id].target) {
                                    _wheelListeners[id].callable.call(thisObject, wheelEvent);
                                }
                            }

                            if (wheelEvent.returnValue === false) {
                                e.preventDefault();
                            }
                        };

                        var MozMousePixelScroll = function(e) {
                            var dx = 0;
                            var dy = 0;

                            if (e.axis === e.VERTICAL_AXIS) {
                                dy = -e.detail * 0.6;
                            } else if (e.axis === e.HORIZONTAL_AXIS) {
                                dx = -e.detail * 0.6;
                            }

                            wheelEvent.returnValue = true;
                            wheelEvent.type = 'mousewheel';
                            wheelEvent.wheelDeltaX = dx;
                            wheelEvent.wheelDeltaY = dy;
                            wheelEvent.originalEvent = e;

                            for (var _id in _wheelListeners) {
                                if (element === _wheelListeners[id].target) {
                                    _wheelListeners[id].callable.call(thisObject, wheelEvent);
                                }
                            }

                            if (wheelEvent.returnValue === false) {
                                e.preventDefault();
                            }
                        };

                        _wheelListeners[id].off = function() {
                            element.removeEventListener('mousewheel', mousewheel);
                            element.removeEventListener('MozMousePixelScroll', MozMousePixelScroll);
                        };

                        element.addEventListener('mousewheel', mousewheel, false);
                        element.addEventListener('MozMousePixelScroll', MozMousePixelScroll, false);
                    }
                } else {
                    var onmousewheel = function(e) {
                        wheelEvent.returnValue = true;
                        wheelEvent.type = 'mousewheel';
                        wheelEvent.wheelDeltaX = 0;
                        wheelEvent.wheelDeltaY = e.wheelDelta * 1.5;
                        wheelEvent.originalEvent = window.event;

                        for (var _id in _wheelListeners) {
                            if (element === _wheelListeners[id].target) {
                                _wheelListeners[id].callable.call(thisObject, wheelEvent);
                            }
                        }

                        if (wheelEvent.returnValue === false) {
                            return false;
                        }
                    };

                    _wheelListeners[id].off = function() {
                        element.detachEvent('onmousewheel', onmousewheel)
                    };

                    element.attachEvent('onmousewheel', onmousewheel);
                }
            }
            return id;
        };

        var offWheel = function(id) {
            if (_wheelListeners !== null && isString(id) && id in _wheelListeners) {
                _wheelListeners[id].off();
                delete _wheelListeners[id];
            }
        };

        var onFrame = function(listener, thisObject) {
            var id = unique(10);

            if (isFunction(listener)) {
                var _this = thisObject !== undefined ? thisObject : global;

                if (_frameListeners === null) {
                    _frameListeners = {};

                    var rf = global.requestAnimationFrame || global.webkitRequestAnimationFrame || global.msRequestAnimationFrame || global.mozRequestAnimationFrame || global.setTimeout;
                    var cf = global.cancelAnimationFrame || global.webkitCancelAnimationFrame || global.msCancelAnimationFrame || global.mozCancelAnimationFrame || global.clearTimeout;
                    var timer = null;
                    var interval = 1000 / 60;

                    var tick = function() {
                        var ct = +new Date();
                        var dt;
                        var pt;
                        var cnt = 0;

                        for (var _id in _frameListeners) {
                            dt = ct - _frameListeners[_id].t1;
                            pt = ct - _frameListeners[_id].t0;

                            _frameListeners[_id].t1 = ct;

                            if (_frameListeners[_id].callable.call(_frameListeners[_id].thisObject, ct, dt, pt) === false) {
                                delete _frameListeners[_id];
                            }
                        }

                        for (var _id in _frameListeners) {
                            cnt++;
                        }

                        if (cnt === 0) {
                            cf(timer);
                            _frameListeners = null;
                        } else {
                            timer = rf(tick, interval);
                        }
                    };
                    timer = rf(tick, interval);
                }
                _frameListeners[id] = {
                    t0: +new Date(),
                    t1: +new Date(),
                    callable: listener,
                    thisObject: _this
                };
            }
            return id;
        };

        var offFrame = function(id) {
            if (_frameListeners !== null && isString(id) && id in _frameListeners) {
                delete _frameListeners[id];
            }
        };


        return {
            // 型判別
            isObject: isObject,
            isArray: isArray,
            isFunction: isFunction,
            isNumber: isNumber,
            isBoolean: isBoolean,
            isString: isString,
            isNull: isNull

                // 乱数初期化
                ,
            srand: srand

                // 乱数取得
                ,
            rand: rand

                // ゼロパディング
                ,
            zeroPad: zeroPad

                // 前後空白除去
                ,
            trim: trim

                // 丸め
                ,
            clamp: clamp

                //
                ,
            extend: extend

                // ハイフン記法をキャメルケースに変換
                ,
            hyphen2camel: hyphen2camel

                // キャメルケースをハイフン記法に変換
                ,
            camel2hyphen: camel2hyphen

                // ユニーク文字列取得
                ,
            unique: unique

                // 16進カラーコードを数値配列に変換
                ,
            hex2rgb: hex2rgb

                // 数値配列を16進カラーコードに変換
                ,
            rgb2hex: rgb2hex

                // URL分解
                ,
            parseURI: parseURI

                // クエリ分解
                ,
            parseParam: parseParam

                // 配列シャッフル
                ,
            shuffle: shuffle

                // 改行変換
                ,
            nl2br: nl2br

                // サニタイジング
                ,
            sanitize: sanitize

                // マルチバイトサブストリング
                ,
            mbSubstr: mbSubstr

                // 要素の表示比率
                ,
            visibleAreaRate: visibleAreaRate

                // キー探索
                ,
            search: search

                ,
            onResize: onResize

                ,
            offResize: offResize

                ,
            onScroll: onScroll

                ,
            offScroll: offScroll

                ,
            onWheel: onWheel

                ,
            offWheel: offWheel

                ,
            onFrame: onFrame

                ,
            offFrame: offFrame
        };
    })();


    /*****************************************************************************************************************
     * CSS機能判別
     *****************************************************************************************************************/

    if (global.document) {
        _css = (function() {
            var style = document.createElement('div').style;
            var vendor = '';
            var prefix = '';

            var hasRGBA = false;
            var hasZoom = ('zoom' in style);
            var hasOpacity = ('opacity' in style);
            var hasBoxShadow = ('box-shadow' in style || 'boxShadow' in style);
            var hasBorderRadius = ('border-radius' in style || 'borderRadius' in style);
            var hasBackgroundSize = ('background-size' in style || 'backgroundSize' in style);
            var hasTransition = false;
            var hasAnimation = false;
            var transitionEnd = false;
            var hasFilter = false;
            var hasMediaQuery = false;
            var hasPositionFixed = false;

            var transform = {
                'translate': '1px, 1px',
                'translate3d': '1px, 1px, 1px',
                'translateX': '1px',
                'translateY': '1px',
                'translateZ': '1px',
                'scale': '0, 0',
                'scale3d': '0, 0, 0',
                'scaleX': '1',
                'scaleY': '1',
                'scaleZ': '1',
                'rotate': '1deg',
                'rotate3d': '1, 1, 1, 1deg',
                'rotateX': '1deg',
                'rotateY': '1deg',
                'rotateZ': '1deg',
                'skew': '1deg, 1deg',
                'skewX': '1deg',
                'skewY': '1deg',
                'matrix': '1, 0, 0, 1, 1, 1',
                'matrix3d': '1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1',
                'perspective': '100px'
            };

            prefix = (function() {
                var _vendors = ['o', 'ms', 'moz', 'Moz', 'webkit', ''];

                vendor = '';

                for (var i = 1; i < _vendors.length; i++) {
                    if (_vendors[i] + 'Transform' in style) {
                        if (_vendors[i] !== '') {
                            vendor = _vendors[i].toLowerCase();
                            return '-' + vendor + '-';
                        } else {
                            vendor = '';
                            return '';
                        }
                    }
                }
                return '';
            })();

            hasTransition = (function() {
                var prefixT = ['oT', 'msT', 'mozT', 'MozT', 'webkitT', 't'];

                for (var i = 0; i < prefixT.length; i++) {
                    var property = prefixT[i] + 'ransition';

                    if (property in style) {
                        style[property] = '';
                        style[property] = 'left 1ms linear 1ms';

                        if (style[property] != '') {
                            if (property.indexOf('webkit') == 0) {
                                transitionEnd = 'webkitTransitionEnd';
                            } else {
                                transitionEnd = 'transitionend';
                            }
                            return true;
                        }
                    }
                }
                return false;
            })();

            hasAnimation = (function() {
                var prefixA = ['oA', 'msA', 'mozA', 'MozA', 'webkitA', 'a'];

                for (var i = 0; i < prefixA.length; i++) {
                    var property = prefixA[i] + 'nimation';

                    if (property in style) {
                        style[property] = '';
                        style[property] = 'check 1ms ease 0ms infinite';

                        if (style[property] != '') {
                            return true;
                        }
                    }
                }
                return false;
            })();

            hasFilter = (function() {
                var prefixF = ['oF', 'msF', 'mozF', 'MozF', 'webkitF', 'f'];

                for (var i = 0; i < prefixF.length; i++) {
                    var property = prefixF[i] + 'ilter';

                    if (property in style) {
                        style[property] = '';
                        style[property] = 'blur(10px)';

                        if (style[property] != '') {
                            if (_ua.ie) {
                                return (typeof global.history.pushState === 'function');
                            } else {
                                return true;
                            }

                        }
                    }
                }
                return false;
            })();

            hasMediaQuery = (function() {
                if (_util.isFunction(global.matchMedia)) {
                    try {
                        return !!global.matchMedia('all').matches;
                    } catch (ex) {
                        return (_ua.firefox && global.parent != global);
                    }
                } else if (_util.isFunction(global.msMatchMedia)) {
                    return !!global.msMatchMedia('all').matches;
                } else {
                    var dummyDiv = document.createElement('div');
                    var checkDiv = document.createElement('div');
                    var dummyCSS = '<style>@media all and (min-width: 0px) {#mqdummyelement{position:absolute;}}</style>';
                    var head = document.getElementsByTagName('head')[0];

                    dummyDiv.innerHTML = dummyCSS;
                    head.appendChild(dummyDiv)

                    checkDiv.setAttribute('id', 'mqdummyelement');
                    dummyDiv.appendChild(checkDiv);

                    var _has = (window.getComputedStyle ? getComputedStyle(checkDiv, null) : checkDiv.currentStyle)['position'] == 'absolute';
                    head.removeChild(dummyDiv);

                    return _has;
                }
            })();

            // hasPositionFixed = (function() {
            // 	var wrap  = document.createElement('div');
            // 	var check = document.createElement('div');
            // 	var head  = document.getElementsByTagName('head')[0];
            // 	var rect  = null;
            // 	var value = false;

            // 	wrap.style.cssText = 'position:absolute; top:-9999px; left:-9999px; height:1000px; overflow:scroll;';
            // 	check.style.cssText = 'position:relative; top:0; height:1000px;';

            // 	wrap.appendChild(check);
            // 	head.appendChild(wrap);

            // 	wrap.scrollTop = 100;

            // 	rect = check.getBoundingClientRect();

            // 	value = (rect.top === 0);

            // 	console.log(value);

            // 	head.removeChild(wrap);

            // 	return value;
            // })();

            if ('transform' in style || prefix + 'transform' in style) {
                for (var property in transform) {
                    var val = property + '(' + transform[property] + ')';

                    style[prefix + 'transform'] = '';
                    style[prefix + 'transform'] = val;

                    if (style[prefix + 'transform'] !== '') {
                        transform[property] = true;
                    } else {
                        transform[property] = false;
                    }
                }
            } else {
                for (var property in transform) {
                    transform[property] = false;
                }
            }

            return {
                // ブラウザベンダーの文字列
                vendor: vendor

                    // CSSプレフィックスの文字列
                    ,
                prefix: prefix

                    ,
                hasZoom: hasZoom

                    ,
                hasOpacity: hasOpacity

                    ,
                hasBoxShadow: hasBoxShadow

                    ,
                hasBorderRadius: hasBorderRadius

                    ,
                hasBackgroundSize: hasBackgroundSize

                    ,
                hasTransition: hasTransition

                    ,
                hasAnimation: hasAnimation

                    ,
                hasFilter: hasFilter

                    ,
                hasMediaQuery: hasMediaQuery

                    //,hasPositionFixed : hasPositionFixed

                    ,
                transform: transform

                    ,
                transitionEnd: transitionEnd
            };
        })();
    }


    /*****************************************************************************************************************
     * HTML5機能判別
     *****************************************************************************************************************/

    if (global.document) {
        _html = (function() {
            var hasFlash = false;

            try {
                hasFlash = !!(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
            } catch (e) {
                hasFlash = (navigator.mimeTypes["application/x-shockwave-flash"] != undefined);
            }

            return {
                // Flashが使用可能かどうか
                hasFlash: hasFlash

                    // canvasが使用可能かどうか
                    ,
                hasCanvas: !!global.document.createElement('canvas').getContext

                    // videoタグが使用可能かどうか
                    ,
                hasVideo: !!global.document.createElement('video').canPlayType

                    // audioタグが使用可能かどうか
                    ,
                hasAudio: !!global.document.createElement('audio').canPlayType

                    // SVGが使用可能かどうか
                    ,
                hasSvg: !!(global.document.createElementNS && global.document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGRect)

                    // WebGLが使用可能かどうか
                    ,
                hasWebgl: !!global.WebGLRenderingContext && !!document.createElement('canvas').getContext('experimental-webgl')

                    // GPSが使用可能かどうか
                    ,
                hasGeolocation: ('geolocation' in global.navigator)

                    // WebSocketが使用可能かどうか
                    ,
                hasWebsocket: ('WebSocket' in global || 'MozWebSocket' in global)

                    // WebWorkerが使用可能かどうか
                    ,
                hasWebworkers: ('Worker' in window)

                    // LocalStorageが使用可能かどうか
                    ,
                hasLocalStorage: ('localStorage' in global)

                    // SessionStorageが使用可能かどうか
                    ,
                hasSessionStorage: ('sessionStorage' in global)

                    ,
                hasFormdata: ('FormData' in global)

                    // ドラッグ&ドロップAPIが使用可能かどうか
                    ,
                hasDragndrop: ('ondrop' in global.document.createElement('div'))

                    // WebAudioAPIが使用可能かどうか
                    ,
                hasWebaudio: ('AudioContext' in global || 'webkitAudioContext' in global)
            };
        })();
    }


    /*****************************************************************************************************************
     * イベント判別
     *****************************************************************************************************************/

    if (global.document) {
        _event = {
            // orientationchangeイベント(画面の向きの変更)を持つ
            hasOrientationchange: ('onorientationchange' in global)

                // hashchangeイベント(URLハッシュの変化)を持つ
                ,
            hasHashchange: ('onhashchange' in global)

                // pushStateイベントを持つ
                ,
            hasStatechange: (typeof global.history.pushState === 'function' && 'onpopstate' in global)

                // devicemotionイベント(加速度センサ)を持つ
                ,
            hasDevicemotion: ('ondevicemotion' in global)

                // propertychangeイベント(HTMLタグの属性変更)を持つ
                ,
            hasPropertychange: ('onpropertychange' in global.document.documentElement)
        };
    }


    /*****************************************************************************************************************
     * デイバイス固有機能判別
     *****************************************************************************************************************/

    if (global.document) {
        _device = {
            // タッチイベントが発生するかどうか
            hasTouch: ('TouchEvent' in global && _ua.smartdevice)

                // 加速度センサが使用可能かどうか
                ,
            hasMotion: ('ondevicemotion' in global)

                // 向きセンサが使用可能かどうか
                ,
            hasOrientation: (typeof global.orientation !== 'undefined')

                // 端末のdevicepixelratio
                ,
            pixelRatio: (global.devicePixelRatio ? global.devicePixelRatio : 1)
        };
    }


    /*****************************************************************************************************************
     * イージング
     *****************************************************************************************************************/

    var __cubicBezierParams = {
        linear: null,
        swing: [0.250, 0.100, 0.250, 1.000],
        iX2: [0.55, 0.085, 0.68, 0.53],
        oX2: [0.25, 0.460, 0.45, 0.94],
        ioX2: [0.455, 0.03, 0.515, 0.955],
        iX3: [0.550, 0.055, 0.675, 0.190],
        oX3: [0.215, 0.610, 0.355, 1.000],
        ioX3: [0.645, 0.045, 0.355, 1.000],
        iX4: [0.895, 0.030, 0.685, 0.220],
        oX4: [0.165, 0.840, 0.440, 1.000],
        ioX4: [0.770, 0.000, 0.175, 1.000],
        iX5: [0.755, 0.050, 0.855, 0.060],
        oX5: [0.230, 1.000, 0.320, 1.000],
        ioX5: [0.860, 0.000, 0.070, 1.000],
        iSin: [0.470, 0.000, 0.745, 0.715],
        oSin: [0.390, 0.575, 0.565, 1.000],
        ioSin: [0.445, 0.050, 0.550, 0.950],
        iExp: [0.950, 0.050, 0.795, 0.035],
        oExp: [0.190, 1.000, 0.220, 1.000],
        ioExp: [1.000, 0.000, 0.000, 1.000],
        iCirc: [0.600, 0.040, 0.980, 0.335],
        oCirc: [0.075, 0.820, 0.165, 1.000],
        ioCirc: [0.785, 0.135, 0.150, 0.860],
        iBack: [0.600, -0.280, 0.735, 0.045],
        oBack: [0.175, 0.885, 0.320, 1.275],
        ioBack: [0.680, -0.550, 0.265, 1.550]
    };

    _easing = {

        iX2: function(x) {
            return x * x;
        },
        oX2: function(x) {
            return -x * (x - 2);
        },
        ioX2: function(x) {
            return (x < 0.5 ? 2 * x * x : 1 - 2 * (--x) * x);
        },
        oiX2: function(x) {
                return (x < 0.5 ? -2 * x * (x - 1) : 1 + 2 * x * (x - 1));
            }

            ,
        iX3: function(x) {
            return x * x * x;
        },
        oX3: function(x) {
            return 1 + (--x) * x * x;
        },
        ioX3: function(x) {
                return (x < 0.5 ? 4 * x * x * x : 1 + 4 * (--x) * x * x);
            }

            ,
        iX4: function(x) {
            return x * x * x * x;
        },
        oX4: function(x) {
            return 1 - (--x) * x * x * x;
        },
        ioX4: function(x) {
                return (x < 0.5 ? 8 * x * x * x * x : 1 - 8 * (--x) * x * x * x);
            }

            ,
        iX5: function(x) {
            return x * x * x * x * x;
        },
        oX5: function(x) {
            return 1 + (--x) * x * x * x * x;
        },
        ioX5: function(x) {
                return (x < 0.5 ? 16 * x * x * x * x * x : 1 + 16 * (--x) * x * x * x * x);
            }

            ,
        iExp: function(x) {
            return Math.exp(10 * (x - 1));
        },
        oExp: function(x) {
            return 1 - Math.exp(-10 * x);
        },
        ioExp: function(x) {
                return (x < 0.5 ? 0.5 * Math.exp(10 * (x * 2 - 1)) : 1 - 0.5 * Math.exp(-10 * (x - 0.5) * 2));
            }

            ,
        iSin: function(x) {
            return 1 - Math.cos(x * Math.PI / 2);
        },
        oSin: function(x) {
            return Math.sin(x * Math.PI / 2);
        },
        ioSin: function(x) {
                return 0.5 - 0.5 * Math.cos(x * Math.PI);
            }

            ,
        iBack: function(x) {
            var s = 1.8;
            return x * x * ((s + 1) * x - s);
        },
        oBack: function(x) {
            var s = 1.8;
            return 1 + (x - 1) * (x - 1) * ((s + 1) * (x - 1) + s);
        },
        ioBack: function(x) {}

            ,
        iCirc: function(x, t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        },
        oCirc: function(x, t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        },
        ioCirc: function(x, t, b, c, d) {
                if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
                return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
            }

            ,
        elastic: function(x) {
            return _easing.elastic(x, 3, 0.1, 0.4);
        },
        elastic2: function(x) {
            return _easing.elastic(x, 2, 0.1, 0.4);
        },
        elastic3: function(x) {
            return _easing.elastic(x, 3, 0.1, 0.4);
        },
        elastic4: function(x) {
            return _easing.elastic(x, 4, 0.1, 0.4);
        },
        elastic5: function(x) {
            return _easing.elastic(x, 5, 0.1, 0.4);
        },
        elastic6: function(x) {
                return _easing.elastic(x, 6, 0.1, 0.4);
            }

            ,
        bounce: function(x) {
            return _easing._bounce(x, 4, 5);
        },
        bounce2: function(x) {
            return _easing._bounce(x, 2, 2);
        },
        bounce3: function(x) {
            return _easing._bounce(x, 3, 4);
        },
        bounce4: function(x) {
            return _easing._bounce(x, 4, 5);
        },
        bounce5: function(x) {
            return _easing._bounce(x, 5, 7);
        },
        bounce6: function(x) {
                return _easing._bounce(x, 6, 9);
            }

            ,
        _bounce: function(x, n, s) {
                var a = [1];
                var p = 2 / n / n;
                for (var i = 1; i < n; i++) a[a.length] = 1 - p * i * (i + 1) / 2;
                a[a.length] = -n * p / 2;

                for (var i = 0; i < a.length; i++) {
                    if (x > a[i]) {
                        if (i == a.length - 1) {
                            return x * x / (n * p / 2) / (n * p / 2);
                        } else {
                            return s * (x - a[i]) * (x - a[i - 1]) + 1;
                        }
                    }
                }
            }

            ,
        _elastic: function(x, c, a, s) {
                if (x < a) {
                    return Math.exp(10 * (x / a - 1));
                } else {
                    return 1 + s * Math.exp((a - x) * 5) * Math.sin(360 * c * (x - a) / (1 - a) * Math.PI / 180);
                }
            }

            ,
        bezier: function(name) {
            if (name in __cubicBezierParams) {
                var easing = __cubicBezierParams[name];

                if (easing != null) {
                    return 'cubic-bezier(' + easing[0] + ', ' + easing[1] + ', ' + easing[2] + ', ' + easing[3] + ')';
                } else {
                    return 'linear';
                }
            } else {
                return 'linear';
            }
        }
    };

    // jQueryイージング拡張
    if ($) {
        $.extend($.easing, _easing);
    }


    /*****************************************************************************************************************
     * Cookie
     *****************************************************************************************************************/

    var _cookie = {

        read: function(key, defaultValue) {
            if (!!document.cookie) {
                var sp = document.cookie.split(';');

                for (var i = 0; i < sp.length; i++) {
                    var pair = sp[i].split('=');

                    if (_util.trim(pair[0]) === key) {
                        var obj = JSON.parse(decodeURIComponent(_util.trim(pair[1])));

                        return obj._v;
                    }
                }
            }
            return defaultValue;
        },

        write: function(key, val, options) {
            var path = _util.isObject(options) && options.path ? '; path=' + options.path : '';
            var domain = _util.isObject(options) && options.domain ? '; domain=' + options.domain : '';
            var secure = _util.isObject(options) && options.secure ? '; secure' : '';
            var expires = _util.isObject(options) && options.expires ? options.expires : '';

            if (expires !== '') {
                var date;

                if (_util.isNumber(expires)) {
                    date = new Date();
                    date.setTime(date.getTime() + expires * 1000);

                } else if (expires.toUTCString) {
                    date = expires;

                } else if (_util.isString(expires)) {
                    var msec = 0;

                    if (expires.match(/^([0-9]+)second(s)?$/)) {
                        msec = (RegExp.$1 - 0) * 1000;
                    } else if (expires.match(/^([0-9]+)minute(s)?$/)) {
                        msec = (RegExp.$1 - 0) * 60 * 1000;
                    } else if (expires.match(/^([0-9]+)hour(s)?$/)) {
                        msec = (RegExp.$1 - 0) * 60 * 60 * 1000;
                    } else if (expires.match(/^([0-9]+)day(s)?$/)) {
                        msec = (RegExp.$1 - 0) * 24 * 60 * 60 * 1000;
                    } else if (expires.match(/^([0-9]+)week(s)?/)) {
                        msec = (RegExp.$1 - 0) * 7 * 24 * 60 * 60 * 1000;
                    } else if (expires.match(/^([0-9]+)month(s)?$/)) {
                        msec = (RegExp.$1 - 0) * 30 * 24 * 60 * 60 * 1000;
                    } else if (expires.match(/^([0-9]+)year(s)?$/)) {
                        msec = (RegExp.$1 - 0) * 365 * 24 * 60 * 60 * 1000;
                    }
                    if (msec > 0) {
                        date = new Date();
                        date.setTime(date.getTime() + msec);
                    }
                }
                if (date) expires = '; expires=' + date.toUTCString();
            }

            document.cookie = key + '=' + encodeURIComponent(JSON.stringify({
                _v: val
            })) + path + domain + secure + expires;
        }
    };


    /*****************************************************************************************************************
     * IE8以下にHTML5タグを認識させる
     *****************************************************************************************************************/

    if (global.document) {
        var tags = ['header', 'footer', 'nav', 'section', 'article', 'aside', 'main'];

        for (var i = 0; i < tags.length; i++) {
            document.createElement(tags[i]);
        }
    }


    /*****************************************************************************************************************
     * HTMLタグにクラス付与
     *****************************************************************************************************************/

    if (global.document) {
        var uaPlaceholder = false;
        var cssPlaceholder = false;
        var htmlPlaceholder = false;
        var eventPlaceholder = false;
        var devicePlaceholder = false;

        // no-jsの除去
        for (var i = 0; i < _htmlClasses.length;) {
            switch (_htmlClasses[i]) {
                case '':
                    _htmlClasses.splice(i, 1);
                    break;
                case 'no-js':
                    _htmlClasses.splice(i, 1);
                    break;
                case 'ua-placeholder':
                    uaPlaceholder = true;
                    _htmlClasses.splice(i, 1);
                    break;
                case 'css-placeholder':
                    cssPlaceholder = true;
                    _htmlClasses.splice(i, 1);
                    break;
                case 'html-placeholder':
                    htmlPlaceholder = true;
                    _htmlClasses.splice(i, 1);
                    break;
                case 'event-placeholder':
                    eventPlaceholder = true;
                    _htmlClasses.splice(i, 1);
                    break;
                case 'device-placeholder':
                    devicePlaceholder = true;
                    _htmlClasses.splice(i, 1);
                    break;
                default:
                    i++;
            }
        }

        // ユーザーエージェント
        if (uaPlaceholder) {
            for (var key in _ua) {
                if (_ua[key] && _util.isBoolean(_ua[key])) {
                    _htmlClasses.push('ua-' + key);
                }
            }
        }

        // CSS機能判定
        if (cssPlaceholder) {
            for (var key in _css) {
                if (key.indexOf('has') === 0) {
                    if (_css[key]) {
                        _htmlClasses.push(_util.camel2hyphen(key));
                    } else {
                        _htmlClasses.push(_util.camel2hyphen(key.replace(/^has/, 'no')));
                    }

                } else if (key === 'transform') {
                    // transform判定
                    for (var key2 in _css[key]) {
                        if (_css[key][key2]) {
                            _htmlClasses.push('has-' + key + '-' + key2);
                        } else {
                            _htmlClasses.push('no-' + key + '-' + key2);
                        }
                    }
                }
            }
        }

        // HTML機能判定
        if (htmlPlaceholder) {
            for (var key in _html) {
                if (key.indexOf('has') === 0) {
                    if (_html[key]) {
                        _htmlClasses.push(_util.camel2hyphen(key));
                    } else {
                        _htmlClasses.push(_util.camel2hyphen(key.replace(/^has/, 'no')));
                    }
                }
            }
        }

        // イベント機能判定
        if (eventPlaceholder) {
            for (var key in _event) {
                if (key.indexOf('has') === 0) {
                    if (_event[key]) {
                        _htmlClasses.push(_util.camel2hyphen(key));
                    } else {
                        _htmlClasses.push(_util.camel2hyphen(key.replace(/^has/, 'no')));
                    }
                }
            }
        }

        // デバイス機能判定
        if (devicePlaceholder) {
            for (var key in _device) {
                if (key.indexOf('has') === 0) {
                    if (_device[key]) {
                        _htmlClasses.push(_util.camel2hyphen(key));
                    } else {
                        _htmlClasses.push(_util.camel2hyphen(key.replace(/^has/, 'no')));
                    }
                }
            }
        }

        // クラス属性の反映
        if (_htmlClasses.length === 0) {
            document.documentElement.removeAttribute('class');
        } else {
            document.documentElement.className = _htmlClasses.join(' ');
        }
    }

    // jQuery拡張
    if ($) {

        jQuery.fn.extend({

            translate: function(dx, dy) {
                if (dx === undefined) dx = 0;
                if (dy === undefined) dy = 0;

                return this.each(function() {
                    if (_css.hasTransition) {
                        this.style['transform'] = this.style[_css.prefix + 'transform'] = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
                    } else {
                        this.style.marginLeft = dx + 'px';
                        this.style.marginTop = dy + 'px';
                    }
                });
            },

            scale: function(s) {
                return this.each(function() {
                    if (_css.hasTransition) {
                        this.style['transform'] = this.style[_css.prefix + 'transform'] = 'scale(' + s + ')';
                    }
                });
            },

            clearStyle: function() {
                return this.each(function() {
                    this.setAttribute('style', '');
                    this.removeAttribute('style');
                });
            },

            transition: function(prop, duration, easing, delay) {
                if (_css.hasTransition) {
                    if (prop) {
                        if (!duration) duration = 0;
                        if (!easing) easing = 'linear';
                        if (!delay) delay = 0;
                        if (prop == 'filter') prop = _css.prefix + prop;
                        if (prop == 'transform') prop = _css.prefix + prop;

                        this.css('transition', prop + ' ' + duration + 'ms ' + _easing.bezier(easing) + ' ' + delay + 'ms');
                        this.css(_css.prefix + 'transition', prop + ' ' + duration + 'ms ' + _easing.bezier(easing) + ' ' + delay + 'ms');
                    } else {
                        this.css('transition', 'none');
                        this.css(_css.prefix + 'transition', 'none');
                    }
                }
                return this;
            },

            transit: function(property, duration, easing, callback) {
                if (_css.hasTransition) {
                    if (typeof property == 'object') {
                        duration = (duration ? duration + 'ms' : '0ms');
                        easing = (easing ? _easing.bezier(easing) : 'linear');

                        var transition = [];
                        var targetProp = {};

                        for (var key in property) {
                            var cssKey = key;

                            if (key == 'transform') {
                                targetProp[key] = property[key];
                                cssKey = _css.prefix + key;
                                targetProp[_css.prefix + key] = property[key];
                            } else if (key == 'filter') {
                                cssKey = _css.prefix + key;
                                targetProp[_css.prefix + key] = property[key];
                            } else {
                                cssKey = _util.camel2hyphen(key);

                                if (typeof property[key] == 'string' || cssKey === 'opacity' || cssKey === 'zoom' || cssKey === 'z-index' || cssKey === 'font-weight' || cssKey === 'line-height') {
                                    targetProp[key] = property[key];
                                } else {
                                    targetProp[key] = property[key] + 'px';
                                }
                            }
                            transition[transition.length] = [cssKey, duration, easing].join(' ');
                        }
                        transition = transition.join(',');

                        this.queue(function() {
                            function listener(e) {
                                if (e.target === this) {
                                    if (typeof callback === 'function') callback.call(this, e);
                                    this.removeEventListener(_css.transitionEnd, listener);
                                    $(this).dequeue();
                                }
                            }
                            this.addEventListener(_css.transitionEnd, listener, false);

                            $(this).css('transition', transition).css(_css.prefix + 'transition', transition).css(targetProp); //.dequeue();
                        });
                    } else {
                        this.css('transition', 'none').css(_css.prefix + 'transition', 'none').dequeue();
                    }
                } else {
                    this.animate(property, duration, easing, callback);
                }
                return this;
            }
        });
    }

    return {
        ua: _ua,
        css: _css,
        html: _html,
        util: _util,
        event: _event,
        device: _device,
        cookie: _cookie,
        easing: _easing
    };
});