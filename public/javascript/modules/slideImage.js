;(function ($) {
    var pluginName = "slideImage", Plugin;
    var defaults = {
        width: 550,
        height: 385,
        start: 1,
        navigation: {
            active: true,
            effect: 'fade'
        },
        pagination: true,
        effect: {
            slide: {
                speed: 500
            },
            fade: {
                speed: 300,
                crossfade: true
            }
        },
        imgsClassSelector: '.slide-images',
        imgsClassName: 'slide-images',
        activeClassSelector: '.cur',
        activeClassName: 'cur'
    };
    Plugin = (function () {
        function Plugin(element, options) {
            this.element = element;
            this.options = $.extend(true, {}, defaults, options);
            this._default = defaults;
            this._name = pluginName;
            this.init();
        }

        return Plugin;
    })();

    Plugin.prototype.init = function () {
        var $element, nextBtn, pagination, prevBtn, _this = this;
        $element = $(this.element);
        this.data = $.data(this);
        $.data(this, "total", $element.children().not(".slide-btn", $element).length);
        $.data(this, "current", this.options.start - 1);
        $.data(this, "animating", false);
        if (typeof TouchEvent !== "undefined") {
            $.data(this, "touch", true);
            this.options.effect.slide.speed = this.options.effect.slide.speed / 2;
        }
        $element.css({
            overflow: "hidden"
        });
        if (this.data.touch) {
            $(".slidesjs-control", $element).on("touchstart", function (e) {
                return _this._touchstart(e);
            });
            $(".slidesjs-control", $element).on("touchmove", function (e) {
                return _this._touchmove(e);
            });
            $(".slidesjs-control", $element).on("touchend", function (e) {
                return _this._touchend(e);
            });
        }
        if (this.options.navigation.active) {
            prevBtn = $("<a>", {
                "class": "slide-btn big left center-v zindexthetop",
                href: "#",
                title: "pre",
                text: "Previous"
            }).appendTo($element);
            nextBtn = $("<a>", {
                "class": "slide-btn big right center-v zindexthetop",
                href: "#",
                title: "next",
                text: "Next"
            }).appendTo($element);
        }
        $(".slide-btn.right").click(function (event) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            _this.stopSlide(true);
            return _this.next(_this.options.navigation.effect);
        });
        $(".slide-btn.left").click(function (event) {
            event.preventDefault ? event.preventDefault() : (event.returnValue = false);
            _this.stopSlide(true);
            return _this.previous(_this.options.navigation.effect);
        });
    };
    Plugin.prototype._touchstart = function (e) {
        var $element,touches;
        $element = $(this.element);
        this.data = $.data(this);
        touches = e.originalEvent.touches[0];

    };
    Plugin.prototype._touchend = function (e) {

    };
    Plugin.prototype._touchmove = function (e) {

    };

    Plugin.prototype.stopSlide = function (clicked) {
        var $element = $(this.element);
        this.data = $.data(this);
        clearInterval(this.data.playInterval);
    };

    Plugin.prototype.next = function (effect) {
        var $element = $(this.element);
        this.data = $.data(this);
        $.data(this, "direction", "next");
        if (effect === "fade") {
            return this._fade();
        } else {
            return this._slide();
        }
    };
    Plugin.prototype.previous = function (effect) {
        var $element = $(this.element);
        this.data = $.data(this);
        $.data(this, "direction", "previous");
        if (effect === "fade") {
            return this._fade();
        } else {
            return this._slide();
        }
    };
    Plugin.prototype._slide = function (number) {
        var $element,currentSlide,direction,next,_this=this;
        $element = $(this.element);
        this.data = $.data(this);
        if(number !== this.data.current + 1){

        }
    };
    Plugin.prototype._fade = function (number) {
        var $element, currentSlide, next, value,curImage,nextImage,
            _this = this;
        $element = $(this.element);

        this.data = $.data(this);
        if(number !== this.data.current + 1){
            currentSlide = this.data.current;
            if(number){
                number = number - 1;
                value = number > currentSlide ? 1: -1;
                next = number;
            }else {
                value = this.data.direction === "next"?1:-1;
                next = currentSlide+value;
            }
            if(next === -1){
                next = this.data.total -1;
            }
            if(next === this.data.total){
                next = 0;
            }
            // this._setActive(next);
            curImage = $(this.options.activeClassSelector);
            curImage.css({display:"none",left:0});
            nextImage = $(this.options.imgsClassSelector)[next];
            if (this.options.effect.fade.crossfade){
                curImage.stop().fadeOut(this.options.effect.fade.speed);
                return $(nextImage).stop().fadeIn(this.options.effect.fade.speed,(function () {
                    curImage.removeClass(_this.options.activeClassName);
                    $(nextImage).addClass(_this.options.activeClassName);
                    $.data(_this,"current",next);
                }))
            }

        }
    };
    return $.fn.slideImages = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        })
    }
}(jQuery));