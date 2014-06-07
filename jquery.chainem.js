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
            
            var $elements = this.element;
            
            // Traversing the chain of elements
            this.element.each(function(i){
                
                var proximoCombo;
                
                // Set change event
                $(this).change(function(e){
                    var sel = $(this).val();
                    
                    if(sel == 0){
                        proximoCombo = $elements.get(i+1);
                    
                        if(typeof proximoCombo !== 'undefined')
                           $(proximoCombo).trigger('chaining', [ 0 ]);
                    }
                       
                });
                
                $(this).on('chaining', function(e, val){
                    $(this).val(val);
                    
                    proximoCombo = $elements.get(i+1);
                    if(typeof proximoCombo !== 'undefined')
                        $(proximoCombo).trigger('chaining', [ 0 ]);
                });
                
                
            });
            
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.settings
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.settings).
        },
        yourOtherFunction: function() {
            // some logic
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ pluginName ] = function(options) {
        
        var $primero = this.first();
        
        if (!$.data($primero, "plugin_" + pluginName)) {
            // Inicializo plugin con el objeto completo
            $.data($primero, "plugin_" + pluginName, new Plugin(this, options));
        }
        
        return this; // Returns jquery object representing combos
    };

})(jQuery, window, document);