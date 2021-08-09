! function(ntRedirect) {

    ntRedirect.setContentRoot("/zelda/");
    ntRedirect.setRedirectRule("sp", []);
    var RedirectUrls = [
        ["", "sp/"],
        ["index.html", "sp/index.html"],
        ["movie.html", "sp/movie.html"],
        ["products.html", "sp/products.html"],
        ["world.html", "sp/world.html"],
        ["topics.html", "sp/topics.html"],
        ["dlc.html", "sp/dlc.html"],
        ["background.html", "sp/background.html"]
    ];

    //override
    ntRedirect.getClsByURL = function(path) {
        for (var i = 0; i < RedirectUrls.length; i++) {
            if (RedirectUrls[i][1] == path) {
                return "sp";
            }
        }
        return null;
    };
    ntRedirect.redirect = function() {
        var path = location.pathname;
        path = path.replace(ntRedirect.contentRoot, "");
        path = path.replace('/\/$/', "/index.html");
        var current_cls = this.getClsByURL(path);
        var cls = this.getClsByUA(path);
        if (cls == current_cls) {
            //何もしない
        } else {
            if (cls == "sp") {
                //pc -> sp
                for (var i = 0; i < RedirectUrls.length; i++) {
                    if (RedirectUrls[i][0] == path) {
                        this.doRedirect(this.contentRoot + RedirectUrls[i][1]);
                        break;
                    }
                }
            } else {
                //sp -> pc
                for (var i = 0; i < RedirectUrls.length; i++) {
                    if (RedirectUrls[i][1] == path) {
                        this.doRedirect(this.contentRoot + RedirectUrls[i][0]);
                        break;
                    }
                }
            }
        }
    };
}(ntRedirect);

window.ntRedirect.redirect();