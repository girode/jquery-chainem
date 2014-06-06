/* jquery.chainem source v1.0 - 03/06/2014
 * author: grode
 * Based on the original work of jquery-boilerplate
 * https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 **/

;(function($, window, document, undefined) {

    var pluginName = "chainem",
                    defaults = {
                        propertyName: "value"
                    };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            
            console.log(this.element);
            
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).
            console.log("xD");
        },
        yourOtherFunction: function() {
            // some logic
        }
    };

        // A really lightweight plugin wrapper around the constructor,
        // preventing against multiple instantiations
    $.fn[ pluginName ] = function(options) {
        this.each(function() {
            console.log(this);
            
//            if (!$.data(this, "plugin_" + pluginName)) {
//                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
//            }
        });

        
        return this;
    };

})(jQuery, window, document);