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
          
    // Link       
    // Constructor      
    function Link($select, methods){
        this.id = $select.prop('id');
        this.options = [];
        this.select = $select;
        this.getNext = null;
        this.method = methods[this.id];
        this.init();
    }   
    
    Link.prototype = {
        init: function(){
            link = this;
        
            this.select.find('option').each(function(i, e){
               link.options.push({id: $(e).val(), val: $(e).html()});
            });            
        },
        
        getOptions: function(fil, previousValues){
            fil = fil || function(){ return []; };

            var ids = fil(previousValues);
            
            return $.grep(this.options, function(e){
                return $.inArray(e.id, ids) != -1;
            });
        },
                
        getSelectedValue: function () {
            return this.select.val();
        },
                
        fillSelect: function (options) {
            var select = this.select;
                    
            select.empty();

            $.each(options, function(index, elem) {
                
                select.append(
                    $('<option></option>')
                        .val(elem.id)
                        .html(elem.val) 
                    ); 
                });
        },        
                
        updateOptions: function (pv) {
            var newOptions = this.getOptions(this.method, pv);
            this.fillSelect(newOptions);
        }
            
    };
    
    
    // Chain
    
    function Chain() {
        this.resume = {};
        this.length = 0;
        this.splice = function () {};
    }
    
    Chain.prototype.updateResume = function (id, value){
        this.resume[id] = value;
    },
    
    // if endId, build a loop to get selected values up to
    // this point 
    Chain.prototype.getSelectedValues = function (endId){
        var ret = this.resume; 
        
        if(typeof endId !== "undefined"){
            ret = {};
            
            // value = link
            $.each(this, function(key, value){
                
               var id   = value.select.prop('id'),
                   sel  = value.select.val();
               
               ret[id] = sel;
                         
               if(id == endId) return false;
            });
        }

        return ret;
    };
    
    Chain.prototype.push = function (){
        var originalMethod = Array.prototype.push,
            args           = Array.prototype.slice.call(arguments),
            chain          = this,
            currentLength  = this.length;
        
        
        for(var i=0, c=args.length; i<c; i++){
              
            var a = args[i]; // a = link
            
            chain.updateResume(a.id, a.getSelectedValue());
            
            a.select
                .change(function(e){
                    chain.getChangeBehaviour(e, a);   
                })
                .on('chaining', function(e){
                    chain.getChainingBehaviour(e, a);
                });
                     
            a.getNext = function(){
                return chain[currentLength+1];
            };  
                     
        }
    
        return originalMethod.apply(this, args);
    };
    
    Chain.prototype.getChangeBehaviour = function(e, link) {
        var next;
        
        this.updateResume(link.id, link.getSelectedValue());

        next = link.getNext();
        if(next){
            console.log(next);
            next.select.trigger('chaining');
        }
    };
    
    Chain.prototype.getChainingBehaviour = function(e, link) {
        // Get seleceted values
        var pv = this.getSelectedValues(link.id), next;
        
        link.updateOptions(pv);
        
        // actualizar el resumen        
        this.updateResume(link.id, link.getSelectedValue());        
                
        // ir al siguiente combo
        next = link.getNext();
        if(next){
            console.log(next);
            next.select.trigger('chaining');
        }
    };
    
    
    /* Main Plugin object
     *
     **/

    function Plugin(element, options) {
        this.chain = new Chain();
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
                plug.chain.push(new Link($(elem), plug.settings.methods));
            });
      
            console.log(this.chain);
//            this.chain.knit();
            
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