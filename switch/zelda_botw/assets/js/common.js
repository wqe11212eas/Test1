// ポップアップ
function setPopup(url, name, w, h) {
    var newPopup;
    var options = "toolbar=0,menubar=1,status=1,scrollbars=1,resizable=1";
    var x = (screen.availWidth - w) / 2;
    var y = (screen.availHeight - h) / 2;
    newPopup = window.open(url, name, "width=" + w + ",height=" + h + ",left=" + x + ", top=" + y + options);
    newPopup.focus();
    return false;
}


(function() {

    if (Polaris.ua.nwiiu) {
        $('html').addClass('is-ua-wiiu');
    }


    //smoothScroll
    function setSmoothScroll() {
        function SmoothScroll(el) {
            return (this instanceof SmoothScroll) ? this.init(el) : new SmoothScroll(el);
        }
        SmoothScroll.prototype.init = function(el) {
            var self = this;

            self.speed = 600;
            self.easing = 'ioX2';

            self.$el = $(el);

            self.$el.on('click', function() {
                if ($(this).attr('href') !== '#' && $(this).attr('href') !== '#0' && $(this).attr('href') !== '#1' && $(this).attr('href') !== '#2') {
                    self.move(this);
                    return false;
                }
            });
        };
        SmoothScroll.prototype.move = function(e) {
            var self = this;

            var hash = $(e).attr('href');
            var target = (hash === '#top') ? 0 : $(hash).offset().top;

            $('html, body').animate({
                scrollTop: target
            }, self.speed, self.easing);
        };
        SmoothScroll('a[href^="#"]');
    }
    $(function() {
        setSmoothScroll();
    });


    $(function() {
        var win = $(window);
        var gnav = $('.gnav');

        if (gnav.css('position') === 'fixed') {
            // fixedで横スクロール
            Polaris.util.onScroll(function(t, b) {
                gnav.css({
                    'left': -win.scrollLeft()
                });
            });
        }
    });

})();