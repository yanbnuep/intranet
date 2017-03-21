;(function ($) {
    var pluginName = "slideImage",Plugin;
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
        }
    };
    Plugin = (function () {
        function Plugin(element,options) {
            this.element = element;
            this.options = $.extend(true,{},defaults,options);
            this._default = defaults;
            this._name = pluginName;
            this.init();
        }
        return Plugin;
    })();

    Plugin.prototype.init = function () {
        var $element, nextBtn , pagination,prevBtn,_this = this;
        $element = $(this.element);
        this.data = $.data(this);
        $.data()
    };

    return $.fn.slideImages = function (options) {
        return this.each(function () {
            if(!$.data(this,'plugin_'+pluginName)){
                return $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        })
    }
}(jQuery));