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
                asyncronic: true, // Esto es un poco redundante, ya que el plugin trabaja en modo asincronico
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

    // Defino clase base de la cual heredan todos las 
    // subclases (subtipos) de (generic)Link
    function genericLink($element, method, shouldWait){
        this.element = $element;
        this.id = $element.prop('id');
        this.method = method;
        this.next = null;
        this.shouldWait = shouldWait;
    }                

    genericLink.prototype = {
        
        // Chain must be shared across all instances of genericLink
        chain: null,

        moveToNext: function(){
            var next = this.next;
            if(next){
                next.element.trigger('chaining');
            }
        },
        
        executeOnStartChaining: function(){},
        
        // Determina lo que hago cuando activan el encadenamiento
        // El encadenamiento se puede disparar por cualquier evento del dom
        executeFirstLink: function(){
            this.executeOnStartChaining();
            this.moveToNext();
        },
        
        executeBeforeGoingToNext: function(){},
        
        executeIfNotGoingToNext: function(){},
        
        // Determina como me muevo al siguiente eslabon
        onChaining: function(){
            if(this.continueChaining()){
                this.executeBeforeGoingToNext();
                this.moveToNext();
            } else {
                this.executeIfNotGoingToNext();
            }   
        },
        
        toString: function(next){
            return 'link[' + this.id + ']' + (next)? this.next: '';
        }
        
    };
    
    /* Select Link */
    // SelectLink inherits from genericLink
    SelectLink.prototype = Object.create(genericLink.prototype);
    SelectLink.prototype.constructor = SelectLink;
    
    function SelectLink($element, method, shouldWait){
        this.options = [];
        // super(), a la Java
        genericLink.call(this, $element, method, shouldWait);
        this.init();
    }   
    
    SelectLink.prototype.init = function(){
        this.loadOptions();
        
        var link = this;
        // .change
        this.element
            .on('change', function(){
                link.executeFirstLink();
            })
            .on('chaining', function (){
                link.onChaining();
            });
    };
    
    SelectLink.prototype.loadOptions = function (){
        var link = this;
        
        this.element.find('option').each(function(i, e){
           link.options.push({id: $(e).val(), val: $(e).html()});
        }); 
    };
    
    SelectLink.prototype.continueChaining = function(){
        return !this.shouldWait;
    };
    
    SelectLink.prototype.fillSelect = function (options) {
        var select = this.element;

        select.empty();

        $.each(options, function(index, elem) {

            select.append(
                $('<option></option>')
                    .val(elem.id)
                    .html(elem.val) 
                ); 
            });
    };        
    
    SelectLink.prototype.updateOptions = function (previousValues, method) {
        method = method || this.method;

        var newOptions = this.getOptions(previousValues, method);
        this.fillSelect(newOptions);
    };
    
    SelectLink.prototype.getOptionsFromRemoteSource = function (previousValues){
        this.method(previousValues);
    };
    
    SelectLink.prototype.getOptions = function(previousValues, fil){
        fil = fil || function(){ return []; };

        var ids = fil(previousValues);

        return $.grep(this.options, function(e){
            return $.inArray(e.id, ids) != -1;
        });
    };
            
    SelectLink.prototype.getSelectedValue = function () {
        return this.element.val();
    };
    
    SelectLink.prototype.executeBeforeGoingToNext = function(){
        var previousValues = this.chain.getSelectedValues();
        this.updateOptions(previousValues);
    };
        
    SelectLink.prototype.executeIfNotGoingToNext = function(){
        var previousValues = this.chain.getSelectedValues();
        this.getOptionsFromRemoteSource(previousValues);
    };
    
    /* Checkbox Link
    
    function CheckboxLink($element, method, shouldWait){
        
        // super(), a la Java
        genericLink.call(this, $element, method, shouldWait);
        
        // select specific options
        this.options = [];
        this.init();
    }   
    
    // Siguientes dos lineas: Hago que SelectLink herede de genericLink
    CheckboxLink.prototype = Object.create(genericLink.prototype);
    CheckboxLink.prototype.constructor = CheckboxLink;
    
    CheckboxLink.prototype.init = function(){
        var link = this;

        this.element.find('option').each(function(i, e){
           link.options.push({id: $(e).val(), val: $(e).html()});
        });            
        
        this.element
            .on('change', function(){
                link.executeFirstLink();
            })
            .on('chaining', function (){
                link.onChaining();
            });
    };
    */
    
    
    /* Chain model */ 
    
    function Chain() {
        this.length = 0;
        this.splice = function () {};
    }
    
    Chain.prototype = {
        
        getSelectedValues: function (){
            var ret = {}; 

            $.each(this, function(k, link){
               ret[link.id] = link.getSelectedValue();
            });

            return ret;
        },
 
        push: function (){

            var pointOfInsertion = 0, cBeforeAdded, chain = this;

            // Connect all to be inserted links
            for(var i=0, c=arguments.length; i<c; i++){
                arguments[i].next = (i+1 === c)? false: arguments[i];
                arguments[i].chain = chain;
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
            var plug = this;
            var $elements = this.element;
            
            // Traversing the chain of elements
            $elements.each(function(i, elem){            
                var $el = $(elem),
                    id = $el.prop('id'),
                    method = plug.getSourceMethod(id, i),
                    isRemote = plug.isRemote(id);
                    
                var link = null, linkType = $el.prop("tagName").toLowerCase();
                
                // Agregar tipos de links aca 
                switch (linkType){
                    case 'select':
                        link = new SelectLink(
                            $el, 
                            method, 
                            isRemote && plug.settings['remote-methods']['asyncronic']
                        );
                    break;
                }
                    
                plug.chain.push(link);
            });
            
        },
        
        getSourceMethod: function(id, index){
            var method = this.settings.methods[id], onRemoteSuccessMethod = null;
                    
            if(!method){
                onRemoteSuccessMethod = this.settings.methods[id + '-remote'];
                
                if(onRemoteSuccessMethod) {
                    method = this.assembleRemoteMethod(onRemoteSuccessMethod, id);
                } else {
                    // First link options remain the same
                    if(index == 0){
                        method = false;
                    } else {
                        throw this.pluginName + ': Method for link not found';
                    }
                }
            }    
            
            return method;
        },
        
        isRemote: function(id){
            return this.settings.methods[id + '-remote'];
        },
        
        assembleRemoteMethod: function(onRemoteSuccessMethod, id){
            var plug  = this;
    
            return function(previousValues){
                
                var request,
                    link = this;
                
                if(request) request.abort();
                
                request = $.ajax(plug.setupAjax(previousValues, id));
                
                request.done(function( newValues ) {
                    link.updateOptions(newValues, onRemoteSuccessMethod);
                    link.moveToNext();
                });
                
                request.fail(function(jqXHR, textStatus ) {
                    plug.settings['remoteErrorHandler'](textStatus);
                });
                
            };
        },
                
        setupAjax: function(previousValues, id){
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
                data:  (remoteSettings['patternize'])? previousValues: {'previousValues': previousValues, 'get': id},
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