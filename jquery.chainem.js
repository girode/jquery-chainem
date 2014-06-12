/* jquery.chainem source v1.0 - 03/06/2014
 * author: grode
 * Based on the original work of jquery-boilerplate
 * https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 **/

;(function($, window, document, undefined) {

    var pluginName = "chainem",
                    defaults = {
                        propertyName: "value",
                        /*
                         * combination: Selects a combination of all combos
                         * last: Help to filter and select the last combo
                         * 
                         **/
                        selectMode: "last" 
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
            var plug = this;
            
            // Traversing the chain of elements
            this.element.each(function(i){
                
                var proximoCombo;
                 
                // Set change event
                $(this).change(function(e){
                    var sel  = $(this).val();
                    var myId = $(this).prop('id');
                    var nextVal, previousValues;
                    
                    proximoCombo = $elements.get(i+1);
                    
                    // Is there a following combo?
                    if(typeof proximoCombo !== 'undefined'){
                        // What value should I put in it?
                        if(sel == 0){
                            nextVal = [{id: 0, val: 'NS'}];
                        } else {
                            previousValues = plug.getSelectedValues(myId);
                            nextVal = plug.getNextValue(previousValues, myId);
                        }
                    
                        // Go to next combo!!
                        $(proximoCombo).trigger('chaining', [ nextVal ]);
                    } 
                    
                });
                
                $(this).on('chaining', function(e, val){
                    plug.fillCombo($(this), val);
                    
                    proximoCombo = $elements.get(i+1);
                    if(typeof proximoCombo !== 'undefined')
                        $(proximoCombo).trigger('chaining', [ 0 ]);
                });
                
                
            });
            
        },
        
        getSelectedValues: function(lastId) {
            var myarr = {};
            
            this.element.each(function(){
               var id   = $(this).prop('id');
               var sel  = $(this).val();
               
               myarr[id] = {'sel': sel};
                         
               if(id == lastId) return false;
            });
            
            return myarr;
        },
        
        getNextValue: function(previousValues, myId){
            // Make ajax call using previousValues
            
            return this.settings.methods[myId](previousValues);
        },
        
        /*
         * fillCombo: Deletes all select options y and adds new options to select
         * arguments: 
         * - $combo: jQuery object representing select to be repopulated
         * - comboOptions: An array of objects with form:
         *   [{id: 1, val: 'val1'}, {id: 2, val: 'val2'}, {id: 3, val: 'val3'}]
         * 
         **/
        
        fillCombo: function($combo, comboOptions){
            $combo.empty();
            
            $.each(comboOptions, function(index, elem) {
                
                $combo.append(
                    $('<option></option>')
                        .val(elem.id)
                        .html(elem.val) 
                    ); 
             });
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