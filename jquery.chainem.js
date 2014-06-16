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

    /*
     * Custom objects
     *
     **/     
          
    function Link($select){
        this.id = $select.prop('id');
        this.options = [];
        link = this;
        
        $select.find('option').each(function(i, e){
           link.options.push({id: $(e).val(), val: $(e).html()});
        });      
        
        this.getOptions = function(fil, previousValues){
            fil = fil || function(previousValues){ return []; };

            var ids = fil(previousValues);
            
            return $.grep(this.options, function(e){
                return $.inArray(e.id, ids) != -1;
            });
        };
    
        
    }      
          
    /* Main Plugin object
     *
     **/

    function Plugin(element, options) {
        this.chain = {};
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }


    Plugin.prototype = {
        init: function() {
            
            var plug = this;
            var $elements = this.element;
            
            // Traversing the chain of elements
            $elements.each(function(i, elem){
                
                plug.chain[$(elem).prop('id')] = (new Link($(elem)));
                
                var nextSelect = $elements.get(i+1);
                 
                // Set change event
                $(this).change(function(e){
                    // var sel  = $(this).val(),
                    var myId = $(this).prop('id'),
                        nextVal, previousValues;
                    
                    // Is there a following combo?
                    if(typeof nextSelect !== 'undefined'){
                        // What value should I put in it?
                        previousValues = plug.getSelectedValues(myId);
                        nextVal = plug.getNextValue(previousValues, $(nextSelect));
                        
                        // Trigger chaining event in next combo!!
                        $(nextSelect).trigger('chaining', [ nextVal, previousValues ]);
                    } 
                    
                });
                
                // Set chaining event
                $(this).on('chaining', function(e, val, pv){
                    plug.fillCombo($(this), val);
                    
                    var id = $(this).prop('id'); 
                    
                    nextVal = plug.getNextValue(pv, $(nextSelect));
                    pv[id] = $(this).val(); 
                    
                    if(typeof nextSelect !== 'undefined')
                        $(nextSelect).trigger('chaining', [ 0 , pv ]);
                });
                
                
            });
            
            
        },
        
        getSelectedValues: function(lastId) {
            var myarr = {};
            
            this.element.each(function(){
               var id   = $(this).prop('id');
               var sel  = $(this).val();
               
               myarr[id] = sel;
                         
               if(id == lastId) return false;
            });
            
            return myarr;
        },
        
        getNextValue: function(previousValues, $nextSelect){
            var nextId = $nextSelect.prop('id');            
            
            return this.chain[nextId].getOptions(this.settings.methods[nextId], previousValues); 
            
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