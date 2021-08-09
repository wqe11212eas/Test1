(function() {

    // 背景動画のID。指定しない場合はmp4を再生する。
    var bgYoutubeID = false; //'__MOVIE_ID__';

    // IE用Youtube ID 指定しない場合は通常のmp4を再生。
    var ieBgYoutubeID = 'AWaRktAUAgE'; //false;

    // IE用背景動画 画質
    var ieBgYoutubeVq = 'medium'; //'large';'small';

    var useIeYoutube = Polaris.ua.ie && ieBgYoutubeID;


    $(function() {

        var loader = new Loader();

        var manager = new MediaManager();

        var youtube = new Youtube();


        // 動画再生フラグ
        var useVideo = !Polaris.ua.tablet && !Polaris.ua.mobile && !Polaris.ua.nwiiu;

        // BGM
        var bgm = new Sound('assets/sound/bgm.mp3', {
            loop: false,
            volume: 50
        });

        // イントロ動画
        var introMovie = null;

        // 背景動画
        var backMovie = null;

        manager.addMedia(bgm);
        //manager.addMedia(ytPlayer);
        loader.addMedia(bgm);


        if (useVideo) {

            introMovie = new Movie('https://www.nintendo.co.jp/zelda/assets/movie/introduction.mp4', {
                container: '#introduction .video_wrap div',
                center: {
                    x: 0.5,
                    y: 0.5
                },
                volume: 80,
                loop: false
            });

            if (bgYoutubeID) {
                backMovie = youtube.create(bgYoutubeID, {
                    container: '#top .video_wrap div',
                    center: {
                        x: 0.5,
                        y: 0.5
                    },
                    loop: 1,
                    volume: 50,
                    controls: 0,
                    vq: 'hd720'
                });
            } else {
                if (useIeYoutube) {
                    backMovie = youtube.create(ieBgYoutubeID, {
                        container: '#top .video_wrap div',
                        center: {
                            x: 0.5,
                            y: 0.5
                        },
                        loop: 1,
                        volume: 50,
                        controls: 0,
                        vq: ieBgYoutubeVq
                    });
                } else {
                    backMovie = new Movie('https://www.nintendo.co.jp/zelda/assets/movie/top.mp4', {
                        container: '#top .video_wrap div',
                        center: {
                            x: 0.5,
                            y: 0.5
                        },
                        loop: true,
                        volume: 50
                    });
                }
            }

            manager.addMedia(introMovie);
            manager.addMedia(backMovie);
            loader.addMedia(introMovie);

            if (!bgYoutubeID && !useIeYoutube) {
                backMovie.skipLoad();
            }

        } else {
            $('html').addClass('no-video');
        }


        // 再生開始基準時刻
        var startHour = 4;

        // 背景動画開始秒数の計算
        var date = new Date();
        var time = ((date.getHours() + (24 - startHour)) % 24) * 60 + date.getMinutes();



        /************************************************************************************************************************
         * 音量ON/OFFエリアのクラス切り替え
         ************************************************************************************************************************/

        function setSoudClass(index) {
            //$('#h_sound').attr('class', '').addClass('pattern'+Polaris.util.zeroPad(index, 2));
        }


        /************************************************************************************************************************
         * ローディング開始
         ************************************************************************************************************************/

        function loadStart() {

            var def1 = new jQuery.Deferred();
            var def2 = new jQuery.Deferred();

            var bg = $('.loading_bg img');
            var img = $('.loading_img img');

            // 点滅周期
            var cycle = 3500;

            // 点滅
            var frameID = Polaris.util.onFrame(function(ct, dt, pt) {

                var opacity = (1 - Math.cos(pt / cycle * 2 * Math.PI)) / 2;

                bg.css({
                    opacity: opacity
                });
                img.css({
                    opacity: opacity
                });
            });


            loader.start(function(p) {
                $('.loading_bar').css({
                    width: p * 100 + '%'
                });

            }).then(function() {
                // 点滅停止
                Polaris.util.offFrame(frameID);

                // プログレスバー、オレンジの紋様、背景の光をフェードアウト
                $('.loading_bar').stop(true).transit({
                    opacity: 0
                }, 600, 'oX2');
                $('.loading_img').stop(true).transit({
                    opacity: 0
                }, 800, 'ioX2');
                $('.loading_bg img').stop(true).transit({
                    opacity: 0
                }, 800, 'iX2');

                // 青の紋様フェードイン
                $('.loaded_img').stop(true).transit({
                    opacity: 1
                }, 800, 'oX2', function() {

                    // 青の紋様の光、背景の光をフェードイン
                    $('.loaded_img img').stop(true).transit({
                        opacity: 1
                    }, 1000, 'ioX2');
                    $('.loading_bg img').stop(true).transit({
                        opacity: 1
                    }, 1000, 'ioX2');
                });

                setTimeout(def1.resolve, 2000);
            });

            setTimeout(function() {
                def2.resolve();
            }, 3000);

            return jQuery.when(def1, def2);
        }


        /************************************************************************************************************************
         * ローディング終了
         ************************************************************************************************************************/

        function loadEnd() {

            var def = new jQuery.Deferred();

            // 背景のフェードアウト
            $('.loading_bg').stop(true).transit({
                opacity: 0
            }, 1000, 'ioX2');

            // 音量注意テキストのフェードアウト
            $('.loading_attention').stop(true).transit({
                opacity: 0
            }, 1000, 'ioX2');

            // ローディング画像のフェードアウト
            $('.loaded_img').stop(true).transit({
                opacity: 0
            }, 1000, 'ioX2');

            setTimeout(def.resolve, 1500);

            return def.promise();
        }



        /************************************************************************************************************************
         * イントロ表示
         ************************************************************************************************************************/

        function showIntro() {

            var def = new jQuery.Deferred();

            // BGM再生開始
            if (useVideo) {
                bgm.play();
            }

            // ローディングのフェードアウト
            $('#loading').delay(1000).transit({
                opacity: 0
            }, 4500, 'oX2', function() {
                $(this).remove();
            });

            // イントロムービー再生開始
            if (introMovie) {
                introMovie.play();
            }

            // フッターのフェードイン
            $('.top_footer, .gnav').delay(1000).transit({
                opacity: 1
            }, 1200, 'iX2');

            setSoudClass(1);

            // 待機後、次へ
            if (useVideo) {
                setTimeout(def.resolve, 10000);
            } else {
                setTimeout(def.resolve, 4500);
            }

            return def.promise();
        }


        /************************************************************************************************************************
         * タイトルロゴアニメーションパラメータ
         ************************************************************************************************************************/

        var thumbParams = {
            "top_logo": {
                container: '.top_logo',
                className: 'top_logo_',
                keyframes: 70,
                framerate: 15
            },
        };


        /************************************************************************************************************************
         * タイトルロゴアニメーション
         ************************************************************************************************************************/

        var Thumbnail = (function() {

            var Thumbnail = function(param) {
                this.param = param;
                this.frameID = null;
                this.loaded = false;
                this.playing = false;
                this.container = $(param.container);
                this.sec = [];

                for (var i = 0; i < Math.ceil(param.keyframes / 70); i++) {
                    this.sec[i] = document.createElement('div');
                    this.sec[i].setAttribute('id', this.param.className + 'sec' + Polaris.util.zeroPad(i + 1, 2));
                    this.container.append(this.sec[i]);
                }
            };

            Thumbnail.prototype.frame = function(index) {
                var s = Math.floor(index / 70);
                this.sec[s].className = this.param.className + Polaris.util.zeroPad(index, 3);

                for (var i = 0; i < this.sec.length; i++) {
                    // console.log('top_logo_0' + (this.param.keyframes - 1));
                    if (this.sec[i].className !== 'top_logo_0' + (this.param.keyframes - 1)) {
                        if (i === s) {
                            this.sec[i].style.display = 'block';
                        } else {
                            this.sec[i].style.display = 'none';
                        }
                    } else {
                        Polaris.util.offFrame(this.frameID);
                        this.playing = false;
                    }
                }
            };

            Thumbnail.prototype.play = function() {
                if (!this.playing) {
                    this.playing = true;

                    var that = this;
                    var time = 0;
                    var step = 1000 / this.param.framerate;
                    var size = this.param.keyframes;

                    this.frameID = Polaris.util.onFrame(function(ct, dt, pt) {
                        time += Math.min(dt, step);
                        that.frame(Math.floor(time / step) % size);
                    });
                }
            };

            Thumbnail.prototype.pause = function() {
                Polaris.util.offFrame(this.frameID);
                this.playing = false;
            };

            Thumbnail.prototype.head = function() {
                this.frame(0);
            };

            Thumbnail.prototype.end = function() {
                Polaris.util.offFrame(this.frameID);
                this.playing = false;
            };

            return Thumbnail;
        })();


        /************************************************************************************************************************
         * タイトルアニメーション表示
         ************************************************************************************************************************/

        function showTitleAnime() {

            var def = new jQuery.Deferred();

            if (useVideo) {
                var thumbnail = new Thumbnail(thumbParams['top_logo']);
                thumbnail.head();

                setTimeout(function() {
                    thumbnail.play();
                }, 1800);
            }

            // ロゴのフェードイン
            $('.top_logo').delay(600).transit({
                opacity: 1
            }, 1200, 'iX2', function() {
                def.resolve();
            });

            return def.promise();
        }


        /************************************************************************************************************************
         * タイトル以外の要素表示
         ************************************************************************************************************************/

        function showTitle() {

            var def = new jQuery.Deferred();

            if (useVideo) {
                var _delay = 4500;
            } else {
                var _delay = 1200;
            }


            // ムービーボタンのフェードイン
            $('.top_info_date').delay(_delay).transit({
                opacity: 1
            }, 1200, 'iX2');

            // フッターのフェードイン
            $(' .logo_wiiu, .logo_switch').delay(_delay + 600).transit({
                opacity: 1
            }, 1200, 'iX2');

            // 待機後、次へ
            setTimeout(def.resolve, _delay + 6300);


            // 背景表示準備
            if (useVideo) {
                backMovie.seek(time);
                backMovie.pause();
            } else {
                var bg = $('<div class="bg"></div>');
                var hour = (new Date()).getHours();
                var src = 'sp/assets/img/top/top_bg_' + Polaris.util.zeroPad(hour, 2) + '00.jpg';

                bg.css({
                    backgroundImage: 'url(' + src + ')'
                });
                $('#top .video_wrap div').append(bg);
            }

            return def.promise();
        }


        /************************************************************************************************************************
         * ループ動画表示
         ************************************************************************************************************************/

        function showLoop() {

            var def = new jQuery.Deferred();

            // 背景動画再生開始
            if (useVideo) {
                backMovie.seek(time);
                backMovie.play();
            } else {
                startBgTimer();
            }

            // 背景動画フェードイン
            $('#top .video_wrap').transit({
                opacity: 1
            }, 5000, 'iX2', function() {

                $('#introduction').remove();

                setSoudClass(2);

                def.resolve();
            });

            return def.promise();
        }

        // 背景切り替え
        function startBgTimer() {
            var hour = (new Date()).getHours();
            var timer = null;

            function nextImg() {
                clearTimeout(timer);

                var img = new Image();
                var src = 'sp/assets/img/top/top_bg_' + Polaris.util.zeroPad(hour, 2) + '00.jpg';
                var next = $('<div class="bg"></div>').css({
                    opacity: 0,
                    backgroundImage: 'url(' + src + ')'
                });
                var prev = $('#top .video_wrap .bg');

                hour = (hour + 1) % 24;

                img.onload = function() {

                    $('#top .video_wrap > div').append(next);

                    next.delay(20).transit({
                        opacity: 1
                    }, 3000, 'iX2', function() {
                        prev.remove();
                    });
                };
                img.src = src;

                // 30秒ごとに次の画像
                timer = setTimeout(nextImg, 30 * 1000);
            }

            // 最初の画像切り替え
            nextImg();
        }


        /************************************************************************************************************************
         * 操作放置時の処理
         ************************************************************************************************************************/

        function startLeaveTimer() {

            if (useVideo) {
                var timer = null;
                var items = $('#h_sound, .logo_wiiu, .logo_switch, .top_footer, .gnav, .top_info_date');
                var shown = true;

                function hide() {
                    shown = false;
                    items.stop(true).transit({
                        opacity: 0
                    }, 1200, 'iX2');
                }

                function show() {
                    shown = true;
                    items.stop(true).transit({
                        opacity: 1
                    }, 1200, 'iX2');
                }

                function event() {
                    clearTimeout(timer);
                    if (!shown) show();
                    timer = setTimeout(hide, 10000);
                }

                $('#wrapper').on('mousemove', event);

                event();
            }
        }



        /************************************************************************************************************************
         * 進行管理
         ************************************************************************************************************************/

        loadStart().then(function() {
            return loadEnd();

        }).then(function() {
            return showIntro();

        }).then(function() {
            return showTitleAnime();

        }).then(function() {
            return showTitle();

        }).then(function() {
            return showLoop();

        }).then(function() {
            return startLeaveTimer();

        });


    });

})();