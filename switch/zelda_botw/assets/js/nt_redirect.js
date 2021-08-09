!(function(window, undefined) {

    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }

    function forEach(array, fn, context) {
        for (var i = 0; i < array.length; i++) {
            var ret = fn.call(context, array[i], i);
            //break;
            if (ret) {
                return ret;
            }
            if (ret === false) {
                return false;
            }
        }
        return null;
    }

    //constructor
    var Redirect = function() {
        this._default();
        this.contentRoot = this.guessContentRoot();
        this._ua = this.queryUserAgent();
        this.targetPath = "";
    };

    /*****************************************************************************************************************
     * ディフォルトルール
     *****************************************************************************************************************/
    Redirect.prototype._default = function() {
        //以下とpathnameがマッチした場合、()内をルートとして扱う
        this.contentRootRules = [
            "(^/wiiu/[^/]+/)",
            "(^/3ds/[^/]+/)",
            "(^/2ds/[^/]+/)",
            "(^/amiibo/[^/]+/)"
        ];
        //リダイレクトするルール
        this.redirectRules = {
            //スマートフォンまたは3dsならspディレクトリへ
            "sp": ["isMobile", "is3DS"]
        };
        //リダイレクト時にも保存するクエリパラメーター
        this.passQueryParams = [
            "utm_(source|medium|term|content|campaign)=[a-zA-Z0-9]+",
            "_ga=[0-9\.]+"
        ];
    };

    //public
    Redirect.prototype.setContentRoot = function(path) {
        this.contentRoot = path;
    };
    Redirect.prototype.setRedirectRule = function(dir, rules) {
        this.redirectRules[dir] = rules;
    };
    Redirect.prototype.addPassQueryParams = function(params) {
        this.passQueryParams = this.passQueryParams.concat(params);
    };
    Redirect.prototype.setTargetPath = function(path) {
        this.targetPath = path;
    };

    //private
    /*****************************************************************************************************************
     * コンテンツルート推測
     *****************************************************************************************************************/
    Redirect.prototype.guessContentRoot = function() {
        var contentRoot;
        for (var i = 0; i <= this.contentRootRules.length; i++) {
            var r = new RegExp(this.contentRootRules[i]);
            var m = r.exec(window.location.pathname);
            if (m) {
                contentRoot = m[1];
                break;
            }
        }
        //rulesに適用できない場合、現在のディレクトリをcontentRootとする 
        // ex)/wiiu/hardware/index.html -> /wiiu/hardware/
        if (!contentRoot) {
            contentRoot = location.pathname.replace(/\/[^\/]+$/, "/");
        }
        return contentRoot;
    };

    /*****************************************************************************************************************
     * ユーザーエージェント判別
     *****************************************************************************************************************/
    Redirect.prototype.queryUserAgent = function() {
        var _ua = window.navigator.userAgent.toLowerCase(),
            _IE, _IEver,
            _Chrome, _ChromeVer,
            _FireFox, _FireFoxVer,
            _Safari, _SafariVer,
            _Opera, _OperaVer,
            _Mac, _iPhone, _iPad, _iPod, _iOSver, _BlackBerry,
            _Android, _AndroidMobile, _AndroidTablet, _AndroidVer,
            _WindowsPhone, _nexus7,
            _new3ds, _3ds, _dsi, _wii, _wiiu, _ps3, _ps4, _psp, _psv, _xbox,
            _bot;
        // ブラウザ
        if (_ua.indexOf("msie") != -1) {
            _IE = true;
            _ua.match(/msie (\d+\.\d)/);
            _IEver = parseFloat(RegExp.$1);
        } else if (_ua.indexOf('trident') != -1) {
            _IE = true;
            _ua.match(/rv:(\d+\.\d)/);
            _IEver = parseFloat(RegExp.$1);
        } else if (_ua.indexOf("chrome") != -1) {
            _Chrome = true;
            _ua.match(/chrome[\/ ]?(\d+\.\d+)/);
            _ChromeVer = parseFloat(RegExp.$1);
        } else if (_ua.indexOf("firefox") != -1) {
            _FireFox = true;
            _ua.match(/firefox[\/ ]?(\d+\.\d+)/);
            _FireFoxVer = parseFloat(RegExp.$1);
        } else if (_ua.indexOf("opera") != -1) {
            _Opera = true;
            _ua.match(/opera[\/ ]?(\d+\.\d+)/);
            _OperaVer = parseFloat(RegExp.$1);
        } else if (_ua.indexOf("safari") != -1) {
            _Safari = true;
            _ua.match(/version[\/ ]?(\d+\.\d+)/);
            _SafariVer = parseFloat(RegExp.$1);
        }

        // モバイル
        if (_ua.indexOf("iphone") != -1) {
            _iPhone = true;
            _ua.match(/iphone os (\d+)_(\d+)/);
            _iOSver = RegExp.$1 * 1 + RegExp.$2 * 0.1;
        } else if (_ua.indexOf("ipad") != -1) {
            _iPad = true;
            _ua.match(/cpu os (\d+)_(\d+)/);
            _iOSver = RegExp.$1 * 1 + RegExp.$2 * 0.1;
        } else if (_ua.indexOf("ipod") != -1) {
            _iPod = true;
            _ua.match(/os (\d+)_(\d+)/);
            _iOSver = RegExp.$1 * 1 + RegExp.$2 * 0.1;
        } else if (_ua.indexOf("android") != -1) {
            _Android = true;
            _ua.match(/android (\d+\.\d)/);
            _AndroidVer = parseFloat(RegExp.$1);
            if (_ua.indexOf('mobile') != -1) {
                _AndroidMobile = true;
            } else {
                _AndroidTablet = true;
            }
        } else if (_ua.indexOf("windows phone") != -1) {
            _WindowsPhone = true;
        } else if (_ua.indexOf('blackberry') !== -1 || _ua.indexOf('bb10') !== -1) {
            _BlackBerry = true;
        }
        if (_ua.indexOf('mac os') != -1) {
            _Mac = true;
        }
        if (_ua.indexOf('nexus 7') != -1) {
            _nexus7 = true;
        }
        // ゲーム機
        if (_ua.indexOf('playstation 3') != -1) {
            _ps3 = true;
        }
        if (_ua.indexOf('playstation 4') != -1) {
            _ps4 = true;
        }
        if (_ua.indexOf('playstation portable') != -1) {
            _psp = true;
        }
        if (_ua.indexOf('playstation vita') != -1) {
            _psv = true;
        }
        if (_ua.indexOf('nintendo') != -1) {
            if (_ua.indexOf('dsi;') != -1) {
                _dsi = true;
            } else if (_ua.indexOf('new 3ds;') != -1) {
                _3ds = true;
                _new3ds = true;
            } else if (_ua.indexOf('3ds;') != -1) {
                _3ds = true;
            } else if (_ua.indexOf('wii;') != -1) {
                _wii = true;
            } else if (_ua.indexOf('wiiu') != -1) {
                _wiiu = true;
            }
        }
        // その他
        if (_ua.indexOf('mac os') != -1) {
            _Mac = true;
        }
        if (_ua.indexOf('nexus 7') != -1) {
            _nexus7 = true;
        }
        // BOT
        if (_ua.indexOf('googlebot') != -1 || _ua.indexOf('yahoo') != -1 || _ua.indexOf('msnbot') != -1) {
            _bot = true;
        }
        var ua = {
            // IE系
            isIE: !!_IE,
            isIE6: (_IEver == 6.0),
            isIE7: (_IEver == 7.0),
            isIE8: (_IEver == 8.0),
            isIE9: (_IEver == 9.0),
            isIE10: (_IEver == 10.0),
            isIE11: (_IEver == 11.0),
            isIEgt6: !!(_IEver > 6),
            isIEgt7: !!(_IEver > 7),
            isIEgt8: !!(_IEver > 8),
            isIEgt9: !!(_IEver > 9),
            isIEgt10: !!(_IEver > 10),
            isIEgt11: !!(_IEver > 11),
            isIElt6: !!(_IE && _IEver < 6),
            isIElt7: !!(_IE && _IEver < 7),
            isIElt8: !!(_IE && _IEver < 8),
            isIElt9: !!(_IE && _IEver < 9),
            isIElt10: !!(_IE && _IEver < 10),
            isIElt11: !!(_IE && _IEver < 11)

                // スマートフォン系
                ,
            isiPhone: !!_iPhone,
            isiPad: !!_iPad,
            isiPod: !!_iPod,
            isiOS: !!(_iPhone || _iPad || _iPod),
            isAndroid: !!_Android,
            isAndroidMobile: !!_AndroidMobile,
            isAndroidTablet: !!_AndroidTablet,
            isWindowsPhone: !!_WindowsPhone,
            isSmartPhone: (!!_iPhone || !!_iPad || !!_iPod || !!_Android || !!_WindowsPhone),
            isMobile: (!!_iPhone || !!_iPod || !!_AndroidMobile || !!_WindowsPhone),
            isTablet: (!!_iPad || !!_AndroidTablet),
            isNexus7: (!!_nexus7),
            isBlackBerry: !!_BlackBerry

                // ゲーム系
                ,
            isPS3: (!!_ps3),
            isPS4: (!!_ps4),
            isPSP: (!!_psp),
            isPSV: (!!_psv),
            is3DS: (!!_3ds || !!_new3ds),
            isNew3DS: (!!_new3ds),
            isDSi: (!!_dsi),
            isWii: (!!_wii),
            isWiiU: (!!_wiiu)

                // ブラウザ種別
                ,
            isSafari: !!_Safari,
            isChrome: !!_Chrome,
            isOpera: !!_Opera,
            isFireFox: !!_FireFox,
            isMac: !!_Mac

                // ブラウザバージョン
                ,
            verIE: _IEver,
            verFireFox: _FireFoxVer,
            verChrome: _ChromeVer,
            verSafari: _SafariVer,
            verOpera: _OperaVer,
            verAndroid: _AndroidVer,
            veriOS: _iOSver

                // その他
                ,
            isBot: !!_bot
        };
        return ua;
    };

    /*****************************************************************************************************************
     * クエリパラメーター
     *****************************************************************************************************************/
    Redirect.prototype.getQueryString = function() {
        var q = [];
        if (location.search) {
            var params = location.search.substr(1).split(/&/);
            forEach(params, function(param, i) {
                forEach(this.passQueryParams, function(regex, j) {
                    var r = new RegExp(regex);
                    if (param.match(r)) {
                        var pp = param.split(/=/);
                        q.push([encodeURIComponent(pp[0]), encodeURIComponent(pp[1])].join("="));
                    }
                }, this);
            }, this);
            q.push("rd");
            if (q.length) {
                return "?" + q.join("&");
            }
        }
        return "";
    };

    Redirect.prototype.doRedirect = function(path) {
        location.href = path + this.getQueryString();
    };
    Redirect.prototype.getRedirectedRoot = function(dir) {
        if (!dir) return this.contentRoot;
        return this.contentRoot + dir + "/";
    };

    /*****************************************************************************************************************
     * リダイレクト処理
     *****************************************************************************************************************/
    Redirect.prototype.getClsByURL = function(path) {
        for (var dir in this.redirectRules) {
            var cond = this.redirectRules[dir];
            var redirected_root = this.getRedirectedRoot(dir);
            if (path.indexOf(redirected_root) != -1) {
                return dir;
            }
        }
        return null;
    };
    Redirect.prototype.getClsByUA = function(path) {
        for (var dir in this.redirectRules) {
            var cond = this.redirectRules[dir];
            var ret = forEach(cond, function(rule) {
                if (isFunction(rule)) {
                    if (rule.call(this)) {
                        return dir;
                    }
                } else if (this._ua[rule]) {
                    return dir;
                }
            }, this);
            if (ret) {
                return ret;
            }
        }
        return null;
    };
    Redirect.prototype.redirect = function() {
        var path = location.pathname;
        var current_cls = this.getClsByURL.call(this, path);
        var cls = this.getClsByUA.call(this, path);
        if (cls == current_cls) {
            //何もしない
        } else {
            var redirect_root = this.getRedirectedRoot(cls);
            var target_path;
            if (this.targetPath) {
                target_path = this.targetPath;
            } else {
                var current_root = this.getRedirectedRoot(current_cls);
                target_path = path.replace(current_root, "");
            }
            this.doRedirect(redirect_root + target_path);
        }
    };

    function ready(fn) {
        if (document.readyState != 'loading') {
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

    //window直下のオブジェクトとしてインスタンスを登録
    window.ntRedirect = new Redirect();

    /*
    ready(function(){
    	window.ntRedirect.redirect();
    });
    */

})(window);