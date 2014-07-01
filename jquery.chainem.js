/* jquery.chainem source v1.0 - 03/06/2014
 * author: grode
 * Based on the original work of jquery-boilerplate
 * https://github.com/jquery-boilerplate/jquery-boilerplate/blob/master/src/jquery.boilerplate.js
 **/

;(function($, window, document, undefined) {

    var pluginName = "chainem",
                    defaults = {
                        remoteErrorHandler: function(errMsg){
                            console.log("External Request failed: " + errMsg);
                        },
                        'remote-methods': {
                            asyncronic: true,
                            patternize: true,                        
                            url: 'http://localhost/answer_script.php',
                            pattern: 'get'
                        },        
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
    function Link($select, method, shouldWait){
        this.id = $select.prop('id');
        this.options = [];
        this.select = $select;
        this.method = method;
        this.shouldWait = shouldWait; 
        this.next = null;
        this.init();
    }   
    
    Link.prototype = {
        init: function(){
            var link = this;
        
            this.select.find('option').each(function(i, e){
               link.options.push({id: $(e).val(), val: $(e).html()});
            });            
        },
        
        continueChaining: function(){
            return !this.shouldWait;
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
                
        updateOptions: function (pv, method) {
            method = method || this.method;
    
            var newOptions = this.getOptions(pv, method);
            this.fillSelect(newOptions);
        },
                
        getOptionsFromRemoteSource: function (pv){
            this.method(pv);
        },
        
        getOptions: function(previousValues, fil){
            fil = fil || function(){ return []; };

            var ids = fil(previousValues);
            
            return $.grep(this.options, function(e){
                return $.inArray(e.id, ids) != -1;
            });
        },
                
        getSelectedValue: function () {
            return this.select.val();
        },
        
        
        toString: function(){
            return 'link[' + this.id + ']'; // ->['+ this.next +'] 
        }
            
    };
    
    
    // Chain
    
    function Chain() {
        this.resume = {};
        this.length = 0;
        this.splice = function () {};
    }
    
    Chain.prototype.updateResume = function (link){
        var id    = link.id, 
            value = link.getSelectedValue();
            
        this.resume[id] = value;
    },
    
    /* if endId, build a loop to get selected values up to  this point */
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

    Chain.prototype.getChangeBehaviour = function(link) {
        var chain = this;
        
        return function(e){
            var next = null;

            chain.updateResume(link);

            next = link.next;
            if(next){
                next.select.trigger('chaining');
            }
        };
    };
    
    Chain.prototype.getChainingBehaviour = function(link) {
        var chain = this;
        
        return function(e) {
            // Get seleceted values
            var pv = chain.getSelectedValues(link.id), next;

            if(link.continueChaining()){
                link.updateOptions(pv);
                chain.updateResume(link);

                next = link.next;
                if(next){
                    next.select.trigger('chaining');
                }             
            } else {
                link.getOptionsFromRemoteSource(pv);
            }
        };
    };
    
    /* TODO: Fix this method to solve multiple calling bug */
    Chain.prototype.push = function (){
        var cBeforeAdded = this.length;
        
        console.log('cBeforeAdded: '+ cBeforeAdded);
        
        var newLength = Array.prototype.push.apply(this, arguments);
        
        /* Traverse only relevant parts of the chain */
        for(
            var i = (cBeforeAdded == 0)? 0: cBeforeAdded-1, c=newLength, a = console.log('i: ' + i, 'c: ' + c);
            i<c;
            i++
        ){
            
            this.updateResume(this[i]);
            this[i].next = ((i+1) != newLength)? this[i+1]: false;

            this[i].select
                .change(this.getChangeBehaviour(this[i]))
                .on('chaining', this.getChainingBehaviour(this[i]));
                

        }
        
    };
    
    Chain.prototype.toString = function(){
        var i = 0, ret = '';
        while(this[i]){
            ret += this[i].toString() + ((this[i].next)? '->': '');
            i++;
        }
        return ret;
    };
    
    /* Main Plugin object
     *
     **/

    function Plugin(element, options) {
        this.chain = new Chain();
        this.element = element;
        this.settings = $.extend(true, {}, defaults, options);
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
                    method = plug.getMethod(id, i),
                    isRemote = plug.isRemote(id);
                    
                plug.chain.push(new Link($el, method, isRemote && plug.settings['remote-methods']['asyncronic']));
            });
            
            console.log(plug.chain);
            
        },
        
        getMethod: function(id, index){
            var method = this.settings.methods[id], remoteMethod = null;
                    
            if(!method){
                remoteMethod = this.settings.methods[id + '-remote'];
                
                if(remoteMethod) {
                    method = this.getRemoteMethod(remoteMethod, id);
                } else {
                    if(index == 0){
                        method = false;
                    } else {
                        throw 'Method for link not found';
                    }
                }
            }    
            
            return method? method: remoteMethod;
        },
        
        isRemote: function(id){
            var cond = this.settings.methods[id + '-remote'];
            return (cond)? true: false;
        },
        
        getRemoteMethod: function(rm, id){
            var plug  = this,
                chain = this.chain;
    
            return function(pv){
                
                var request,
                    link = this;
                
                if(request) request.abort();
                
                request = $.ajax(plug.setupAjax(pv, id));
                
                request.done(function( newValues ) {
                    var next;
                    link.updateOptions(newValues, rm);
                    chain.updateResume(link);

                    next = link.next;
                    if(next){
                        next.select.trigger('chaining');
                    }

                });
                
                request.fail(function(jqXHR, textStatus ) {
                    plug.settings['remoteErrorHandler'](textStatus);
                });
                
            };
        },
                
        setupAjax: function(pv, id){
            var url = '',
                remoteSettings = this.settings['remote-methods'];         
                    
            url += remoteSettings['url'];
            url += (remoteSettings['patternize'])? 
                        '/' + remoteSettings['pattern'] + id.charAt(0).toUpperCase() + id.slice(1) 
                        : 
                        '';
    
            return {
                url: url,
                async: remoteSettings['asyncronic'],
                type: "POST",
                data:  (remoteSettings['patternize'])? pv: {'pv': pv, 'get': id},
                dataType: "json"
            };
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