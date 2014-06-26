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
    function Link($select, method){
        this.id = $select.prop('id');
        this.options = [];
        this.select = $select;
        this.method = method;
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
    
    Chain.prototype.getChangeBehaviour = function(e, link) {
        var next = null;
        
        this.updateResume(link.id, link.getSelectedValue());
        
        next = link.next;
        if(next){
            next.select.trigger('chaining');
        }
    };
    
    Chain.prototype.getChainingBehaviour = function(e, link) {
        // Get seleceted values
        var pv = this.getSelectedValues(link.id), next;
        
        // This method should be the one that determines whether chaining 
        // continues or not
        
        link.updateOptions(pv);
        
        // actualizar el resumen        
        this.updateResume(link.id, link.getSelectedValue());        
        
        // Should chaining continue?
        next = link.next;
        if(next){
            next.select.trigger('chaining');
        }
    };
    
    function createChangeFunction(chain, i) {
        return function(e){
            chain.getChangeBehaviour(e, chain[i]);
        };
    }
    
    function createChainingFunction(chain, i) {
        return function(e){
            chain.getChainingBehaviour(e, chain[i]);
        };
    }
    
    Chain.prototype.push = function (){
        var chain          = this, 
            cBeforeAdded   = this.length;
        
        var newLength = Array.prototype.push.apply(this, arguments);
        
        /* Traverse only relevant parts of the chain */
        for(
            var i = (cBeforeAdded == 0)? 0: cBeforeAdded-1, c=newLength;
            i<c;
            i++
        ){
            this.updateResume(this[i].id, this[i].getSelectedValue());
            this[i].next = ((i+1) != newLength)? this[i+1]: false;
            
            this[i].select
                .change(createChangeFunction(chain, i))
                .on('chaining', createChainingFunction(chain, i));            
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
                var $el = $(elem),
                    id = $el.prop('id'),
                    method = plug.getMethod(id, i);
                    
                plug.chain.push(new Link($el, method));
            });
            
            
        },
        
        getMethod: function(id, index){
            var method = this.settings.methods[id], remoteMethod;
                    
            if(!method){
                method = this.settings.methods[id + '-remote'];
                
                if(method) {
                    remoteMethod = this.getRemoteMethod(method);
                    method = remoteMethod;
                } else {
                    if(index == 0){
                        method = false;
                    } else {
                        throw 'Method for link not found';
                    }
                }
            }    
            
            return method;
        },
        
        getRemoteMethod: function(callback){
            return function(pv){
                return callback(pv);
//                var request = $.ajax({
//                    url: "script.php",
//                    type: "POST",
//                    data: { id : menuId },
//                    dataType: "json"
//                });
//                
//                request.done(function( newValues ) {
//                    callback(newValues);
//                });
//                
//                request.fail(function(jqXHR, textStatus ) {
//                    alert( "Request failed: " + textStatus);
//                });
            }
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