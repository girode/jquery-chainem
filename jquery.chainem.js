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
                            url: 'http://localhost/jquery-chainem/test_remote_script.php',
                            pattern: 'get'
                        },        
                        /*
                         * combination: Selects a combination of all combos
                         * last: Help to filter and select the last combo
                         * 
                         **/
                        selectMode: "last" 
                    };


    // Crockford Inheritance 
    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {}
            F.prototype = o;
            return new F();
        };
    }                    


    function genericLink($element, method, shouldWait){
        this.element = $element;
        this.id = $element.prop('id');
        this.method = method;
        this.next = null;
        this.shouldWait = shouldWait;
    }                


    genericLink.prototype = {
        moveToNext: function(){
            var next = this.next;
            if(next){
                next.element.trigger('chaining');
            }
        },
        
        executeOnStartChaining: function(){
//            chain.updateResume(this);
        },
        
        // Determina lo que hago cuando activan el encadenamiento
        // El encadenamiento se puede disparar por cualquier evento del dom
        executeFirstLink: function(chain, e){
            this.executeOnStartChaining();
            this.moveToNext();
        },
        
        
        executeBeforeGoingToNext: function(){
//            var pv = chain.getSelectedValues(this.id);
//                this.updateOptions(pv);
//                chain.updateResume(this);
        },
        
        executeIfNotGoingToNext: function () {
//            this.getOptionsFromRemoteSource(pv);
        },
        
        // Determina como me muevo al siguiente eslabon
        onChaining: function(){
            if(this.continueChaining()){
                this.executeBeforeGoingToNext();
                this.moveToNext();
            } else {
                this.executeIfNotGoingToNext();
            }   
        }
    };
    
    function SelectLink($element, method, shouldWait){
        
        // Es necesario?
        genericLink.call(this, $element, method, shouldWait);
        
        // select specific options
        this.options = [];
//        this.initSelect();
    }   
    
    SelectLink.prototype = Object.create(genericLink.prototype);
    SelectLink.prototype.constructor = SelectLink;
    
//    
//    Link.prototype = {
//        initSelect: function(){
//            var link = this;
//        
//            this.element.find('option').each(function(i, e){
//               link.options.push({id: $(e).val(), val: $(e).html()});
//            });            
//        },
//        
//        continueChaining: function(){
//            return !this.shouldWait;
//        },
//        
//        fillSelect: function (options) {
//            var select = this.element;
//                    
//            select.empty();
//
//            $.each(options, function(index, elem) {
//                
//                select.append(
//                    $('<option></option>')
//                        .val(elem.id)
//                        .html(elem.val) 
//                    ); 
//                });
//        },        
//                
//        updateOptions: function (pv, method) {
//            method = method || this.method;
//    
//            var newOptions = this.getOptions(pv, method);
//            this.fillSelect(newOptions);
//        },
//                
//        getOptionsFromRemoteSource: function (pv){
//            this.method(pv);
//        },
//        
//        getOptions: function(previousValues, fil){
//            fil = fil || function(){ return []; };
//
//            var ids = fil(previousValues);
//            
//            return $.grep(this.options, function(e){
//                return $.inArray(e.id, ids) != -1;
//            });
//        },
//                
//        getSelectedValue: function () {
//            return this.element.val();
//        },
//        
//        toString: function(){
//            return 'link[' + this.id + ']'; // ->['+ this.next +'] 
//        }            
//    };

    SelectLink.prototype.toString = function(){
        return 'link[' + this.id + ']'; // ->['+ this.next +'] 
    };            
    
    
    /* Chain model */ 
    
    function Chain() {
        this.resume = {};
        this.length = 0;
        this.splice = function () {};
    }
    
    Chain.prototype = {
        /* if endId, build a loop to get selected values up to  this point */
//        getValues: function (elementToBeQueried){
//            var ret = {}, id, sel; 
//
//            // value = link
//            $.each(this, function(key, link){
//
//               id   = link.element.prop('id');
//               sel  = (elementToBeQueried === 'value')? 
//                        link.element.val(): 
//                        link.element.attr(elementToBeQueried);
//
//               ret[id] = sel;
//            });
//
//            return ret;
//        },
//                
//        getFiringBehaviour: function(link) {
//            return function(e){
//                link.executeFirst(this, e);
//            };
//        },
//                
//        getChainingBehaviour: function(link) {
//            return function(e) {
//               link.moveToNext(this, e);
//            };
//        },
                
        push: function (){

            var pointOfInsertion = 0, cBeforeAdded;

            // Connect all to be inserted links
            for(var i=0, c=arguments.length; i<c; i++){
                arguments[i].next = (i+1 === c)? false: arguments[i];

//                arguments[i].element
//                    .change(this.getChangeBehaviour(arguments[i]))
//                    .on('chaining', this.getChainingBehaviour(arguments[i]));

            }

            cBeforeAdded = this.length;

            // Insert them 
            Array.prototype.push.apply(this, arguments);

            pointOfInsertion = (cBeforeAdded === 0)? 0: cBeforeAdded-1;

            // Connect previous last link to the first newly inserted link
            this[pointOfInsertion].next = this[pointOfInsertion+1];

        },
        
        toString: function(){
            var i = 0, ret = '';
            while(this[i]){
                ret += this[i].toString() + ((this[i].next)? '->': '');
                i++;
            }
            return ret;
        }

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
//            var plug = this;
//            var $elements = this.element;
            
            // Traversing the chain of elements
//            $elements.each(function(i, elem){            
//                var $el = $(elem),
//                    id = $el.prop('id'),
//                    method = plug.getMethod(id, i),
//                    isRemote = plug.isRemote(id);
//                    
//                plug.chain.push(new Link($el, method, isRemote && plug.settings['remote-methods']['asyncronic']));
//            });
            
            var l;
            
            this.element.each(function(i, elem){
                l = new SelectLink($(elem), function(){}, false);
                console.log(l);
            });
            
            
            
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
                        next.element.trigger('chaining');
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