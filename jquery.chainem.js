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
    function Link($select){
        this.id = $select.prop('id');
        this.options = [];
        this.select = $select;
        this.next = null;
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
    
    Chain.prototype.knit = function(){
        for(var i=0, c=this.length; i<c; i++)
            this[i].next = this[i+1];
        
        this[this.length-1].next = false;
    };
    

    Chain.prototype.push = function (){
        var originalMethod = Array.prototype.push,
            args           = Array.prototype.slice.call(arguments),
            chain = this;
        
        
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
                     
        }
    
        return originalMethod.apply(this, args);
    };
    
    Chain.prototype.getChangeBehaviour = function(e, link) {
        alert("changed"); 
        // console.log(this); // this = chain
        // console.log(link);
        this.updateResume(link.id, link.getSelectedValue());
        
//         console.log(this.getSelectedValues(link.id));
//        console.log(this.getSelectedValues());
        
        // this = chain
        // this[0] primer link de la cadena
        if(link.next.select)
            link.next.select.trigger('chaining');
        
    };
    
    Chain.prototype.getChainingBehaviour = function(e, link) {
        alert("ch-behav");
        
        if(link.next.select)
            link.next.select.trigger('chaining');
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
                
                plug.chain.push(new Link($(elem)));
                
                // Set change event
//                $(this).change(function(){
//                    var previousValues;
//                    
//                    // Is there a following combo?
//                    if(typeof nextSelect !== 'undefined'){
//                        // What value should I put in it?
//                        previousValues = plug.getSelectedValues(myId);
//                        nextVal = plug.getNextValue(previousValues, $(nextSelect));
//                        
//                        // Trigger chaining event in next combo!!
//                        $(nextSelect).trigger('chaining', [ nextVal, previousValues ]);
//                    } 
//                    
//                });
                
                // Set chaining event
//                $(this).on('chaining', function(e, val, pv){
//                    plug.fillCombo($(this), val);
//                    pv[myId] = $(this).val(); 
//                    
//                    if(typeof nextSelect !== 'undefined'){
//                        nextVal = plug.getNextValue(pv, $(nextSelect));
//                    
//                        $(nextSelect).trigger('chaining', [ nextVal , pv ]);
//                    }
//                });
                
                
            });
            
            this.chain.knit();
            
            console.log(this.chain);
            
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