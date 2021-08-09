(function() {

    // 動画再生フラグ
    var useVideo = !Polaris.ua.tablet && !Polaris.ua.mobile && !Polaris.ua.nwiiu;

    // Youtube優先使用フラグ
    var useYoutube = Polaris.ua.ie || Polaris.ua.edge;

    var loader = new Loader();

    var youtube = new Youtube();

    var soundController = new SoundController();


    $(function() {

        var movies = [];
        var current = -1;
        var animated = false;
        var onmouse = false;

        // BGM
        //var bgm = null;

        // 背景動画
        var movieParams = [{
            vid: '',
            src: 'https://www.nintendo.co.jp/zelda/assets/movie/weather.mp4',
            el: '#movie_page .video_wrap > div',
            next: 0
        }];

        // Youtube
        var ytPlayer = youtube.create('', {
            container: '#modal .ytplayer',
            volume: 80,
            controls: 1,
            vq: 'hd720'
        });

        // 背景スライドパラメータ
        var backSlideParams = [{
            src: Polaris.util.sequence(1, 10).map(function(i) {
                return 'assets/img/movie/weather_bg_' + Polaris.util.zeroPad(i, 2) + '.jpg';
            }),
            container: '#movie_page .video_wrap > div',
            className: 'slide guard',
            duration: 2000,
            interval: 3 * 1000
        }];


        if (useVideo) {

            // BGM読み込み
            /*
            bgm = new Sound('assets/sound/movie.mp3', {
            	loop : true,
            	volume : 50
            });
            */

            //soundController.addMedia(bgm);
            soundController.addMedia(ytPlayer);

            // ムービーオブジェクト配列作成
            movies = movieParams.map(function(param) {

                var movie = null;

                if (useYoutube && param.vid) {
                    movie = youtube.create(param.vid, {
                        container: param.el,
                        center: {
                            x: 0.5,
                            y: 0.5
                        },
                        volume: 0,
                        controls: 0,
                        vq: 'hd720'
                    });
                    loader.addMedia(movie);
                } else {
                    movie = new Movie(param.src, {
                        container: param.el,
                        center: {
                            x: 0.5,
                            y: 0.5
                        },
                        volume: 0
                    });
                    movie.skipLoad();
                }

                // 終了1000msec前に次の動画へ
                movie.beforeEnd(1000, function() {
                    changeMovie(param.next);
                });

                // 終了処理
                movie.onEnded(function() {
                    movie.seek(0);
                });

                soundController.addMedia(movie);

                return movie;
            });
        } else {
            movies = backSlideParams.map(function(param) {
                var slide = new Slide(param.src, param);

                // フルサイズフィッティング
                Polaris.util.onResize(function(w, h) {
                    var elW = slide.el.width();
                    var elH = slide.el.height();

                    var imgW = elW;
                    var imgH = elW * 720 / 1280;

                    if (imgH < elH) {
                        imgH = elH;
                        imgW = elH / 720 * 1280;
                    }

                    var offsetX = (elW - imgW) / 2;
                    var offsetY = (elH - imgH) / 2;

                    slide.images.forEach(function(img) {
                        img.css({
                            width: imgW,
                            height: imgH,
                            top: offsetY,
                            left: offsetX
                        });
                    });
                });

                slide.seek(0);
                slide.pause();

                return slide;
            });

            $('html').addClass('no-video');
        }

        function changeCursor(index) {
            $('.thumb_list_01 li').removeClass('current').eq(index).addClass('current');
            $('.thumb_list_02 li').removeClass('current').eq(index).addClass('current');
        }

        function changeMovie(index, head) {
            if (animated || index === current) return false;

            changeCursor(index);

            var titles = $('.movie_title li');

            // 自動遷移の場合、先頭から再生
            if (head) movies[index].seek(0);

            // 次のムービーの再生開始
            movies[index].play();

            if (current !== -1) {
                animated = true;

                movies[index].el.stop(true).transit({
                    opacity: 1
                }, 1, 'linear');

                // 再生中のムービーをフェードアウト
                movies[current].el.css({
                    zIndex: 1
                }).stop(true).transit({
                    opacity: 0
                }, 1000, 'oX2', function() {
                    movies[current].el.css({
                        zIndex: ''
                    });
                    movies[current].pause();

                    // 次のタイトルをフェードイン
                    titles.eq(index).stop().css({
                        display: 'block'
                    }).animate({
                        opacity: 1
                    }, 1000, 'iX2');

                    // 念のため
                    movies[index].play();

                    current = index;
                    animated = false;
                });

                // 再生中のタイトルをフェードアウト
                titles.eq(current).stop().animate({
                    opacity: 0
                }, 800, 'oX2', function() {
                    $(this).clearStyle();
                });
            } else {
                current = index;

                movies[index].el.transit({
                    opacity: 1
                }, 1200, 'iX2', function() {
                    titles.eq(index).css({
                        display: 'block'
                    }).delay(1000).animate({
                        opacity: 1
                    }, 1000, 'iX2');
                });
            }
            return true;
        }

        $('.play_movie').on('click', function(e) {
            e.preventDefault();

            var index = parseInt(this.href.split('#')[1]);

            if (changeMovie(index)) {}
        });


        //loader.addMedia(bgm);

        loader.start().then(function() {
            if (useVideo) {
                //bgm.play();

                // youtube動画の頭出し
                if (useYoutube) {
                    movies[0].play();
                    movies[0].pause();
                }
            }

            setTimeout(function() {
                $('.thumb_list_02').transit({
                    opacity: 1
                }, 1000, 'iX2');
            }, 1000);

            changeMovie(0);
        });


        var modal = $('#modal');

        function openModal(vid) {
            //if (bgm) bgm.fadePause(500);
            if (vid) ytPlayer.loadVideoById(vid);

            modal.stop(true).removeClass('none').css({
                opacity: 0
            });

            modal.delay(20).transit({
                opacity: 1
            }, 800, 'iX2', function() {
                if (movies) movies[current].pause();
                ytPlayer.play();
            });

            $('html').addClass('open_modal');
        }

        function closeModal() {
            //if (bgm) bgm.fadeStart(1000);
            if (movies) movies[current].play();

            modal.stop(true).transit({
                opacity: 0
            }, 600, 'oX2', function() {
                ytPlayer.pause();
                ytPlayer.seek(0);
                modal.addClass('none').clearStyle();
            });
            $('html').removeClass('open_modal');
        }

        // YoutubePV再生
        $('.play_pv').on('click', function(e) {
            e.preventDefault();

            if (this.href.match(/\/embed\/(.+)/)) {
                openModal(RegExp.$1);
            }
        });

        // モーダル閉
        $('.modal_btn_close, .modal_bg').on('click', function(e) {
            e.preventDefault();
            changeCursor(current);
            closeModal();
        });
    });

})();