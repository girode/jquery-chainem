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
                patternize: true,                        
                url: 'http://localhost/jquery-chainem/test_remote_script.php',
//                url: 'http://chainem.localhost/test_remote_script.php',
                pattern: 'get'
            },
            'link-config': {
                select: {
                    selectMode: "filtering",
                    oneStep: true
                }
            }
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
    function genericLink($element, updatingMethod){
        this.element = $element;
        this.id = $element.prop('id');
        this.updatingMethod = updatingMethod;
        this.next = null;
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
        
        // Need special support for first link? Override this method
        executeOnStartChaining: function(){},
        
        onFirstLink: function(){
            this.executeOnStartChaining();
            this.moveToNext();
        },
        
        executeBeforeGoingToNext: function(){},
        
        executeIfNotGoingToNext: function(){},
        
        shouldPreventNextStep: function(){},
        
        // Determina como me muevo al siguiente eslabon
        onChaining: function(){
            if(this.executeBeforeGoingToNext()) {
                this.moveToNext();
            } else {
                this.executeIfNotGoingToNext();
            }
        },
        
        toString: function(){
            return 'link[' + this.id + ']';
        }
        
    };
    
    /* Select Link */
    // SelectLink inherits from genericLink
    SelectLink.prototype = Object.create(genericLink.prototype);
    SelectLink.prototype.constructor = SelectLink;
    
    function SelectLink($element, updatingMethod, settings){
        this.options = [];
        this.settings = settings || {};
        
        // super(), a la Java
        genericLink.call(this, $element, updatingMethod);
        this.init();
    }   
    
    /* Add/Override methods to SelectLink prototype (which is genericLink) */
    SelectLink.prototype.init = function(){
        this.loadOptions();
        
        var link = this;
        // .change
        this.element
            .on('change', function(){
                link.onFirstLink();
            })
            .on('chaining', function (){
                link.onChaining();
            })
            .on('chainem.clear', function(){
               link.onClear();
            });
    };
    
    SelectLink.prototype.chainClear = function (){
        var next = this.next;
        
        if(next) {
           next.element.trigger('chainem.clear');
        }
    };
    
    SelectLink.prototype.clearSelect = function (){
        this.element.empty();
    };
    
    SelectLink.prototype.onClear = function (){
        this.clearSelect();
        this.chainClear();
    };
    
    SelectLink.prototype.loadOptions = function (){
        var link = this;
        
        this.element.find('option').each(function(i, e){
           link.options.push({id: $(e).val(), val: $(e).html()});
        }); 
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
    
    SelectLink.prototype.getSelectedValue = function () {
        return this.element.val();
    };
     
    SelectLink.prototype.updateOptions = function (newValues) {
        this.fillSelect(this.getOptions(newValues));
    };

    function getOptionsForFiltering(newValues) {
        return $.grep(this.options, function(e){
            return $.inArray(e.id, newValues) !== -1;
        });
    };
    
    function getOptionsForChaining(newValues) {
        return $.map(newValues, function(elem, key) {
            return {id: key, val: elem}; 
        });
    };
    
    /*
    SelectLink.prototype.shouldPreventNextStep = function () {
        var isRemote  = this.updatingMethod.isRemote,
            isOneStep = this.settings['oneStep'];
    
        return !isRemote && !isOneStep;
    };
    */
   
    function shouldPreventNextStepForFiltering() {
        var isRemote  = this.updatingMethod.isRemote;
        return !isRemote;
    }
    
    function shouldPreventNextStepForChaining() {
        var isRemote  = this.updatingMethod.isRemote,
             isOneStep = this.settings['oneStep'];

         return !isRemote && !isOneStep;
    }
    
    SelectLink.prototype.executeBeforeGoingToNext = function(){
        var previousValues = this.chain.getSelectedValues(),
                  isRemote = this.updatingMethod.isRemote;
        
        var newValues = this.updatingMethod(previousValues);

        if(!isRemote)
            this.updateOptions(newValues);            
        
        return this.shouldPreventNextStep();
    };
    
    SelectLink.prototype.executeIfNotGoingToNext = function(){
        var next = this.next;
        if(next) next.element.trigger('chainem.clear');
    };
    
    SelectLink.configure = function (settings) {
        if(settings['selectMode'] === "filtering"){
            SelectLink.prototype.getOptions = getOptionsForFiltering;      
            SelectLink.prototype.shouldPreventNextStep = shouldPreventNextStepForFiltering;
        } else {
            SelectLink.prototype.getOptions = getOptionsForChaining;
            SelectLink.prototype.shouldPreventNextStep = shouldPreventNextStepForChaining;
        }
    };
    
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
                ret += this[i].toString(false) + ((this[i].next)? '->': '');
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
        
        linkTypes: {
            'select': SelectLink
        },
        
        registerLinkType: function(linkType, contructorName){
            // Requires to check if this already exists
            this.linkTypes[linkType] = contructorName;
        },
        
        createLink: function(linkType, $el, updatingMethod) {
            return new this.linkTypes[linkType](
                    $el,
                    updatingMethod,
                    this.settings['link-config'][linkType]
            );
        },
        
        configLinks: function () {
            var plug = this;
            
            $.each(plug.settings['link-config'], function(linkType, linkTypeConf){
                var constructorName  = plug.linkTypes[linkType];
                constructorName.configure(linkTypeConf);
            });
        },
        
        init: function() {
            var plug      = this,
                $elements = this.element,
                link      = null,
                linkType  = "";
            
            // Build prototype according to config
            this.configLinks();
            
            // Traversing the chain of elements
            $elements.each(function(i, elem){            
                var $el              = $(elem),
                    id               = $el.prop('id'),
                    updatingMethod   = (i === 0)? function(){ return []; } : plug.getSourceMethod(id);

                updatingMethod.isRemote = (i === 0)? false : plug.isRemote(id);
                
                linkType = $el.prop("tagName").toLowerCase();
                
                link = plug.createLink(linkType, $el, updatingMethod);
                
                plug.chain.push(link);
            });
            
        },
        
        getSourceMethod: function(id){
            var returnMethod = null;
            
            // is methods defined?
            if(this.settings.methods){
                var method = this.settings.methods[id];
            
                if(!method){
                    method = this.assembleRemoteMethod(id);
                    if(!method)
                        throw this.pluginName + ': Method for link not found';
                } 

                returnMethod = method;
            } else {
                returnMethod = this.assembleRemoteMethod(id);
            }
            
            return returnMethod;
        },
        
        isRemote: function(id){
            // Remote == not local method
            return this.settings.methods && !this.settings.methods[id];
        },
        
        assembleRemoteMethod: function(id){
            var plug  = this;
    
            return function(previousValues){
                
                var request,
                    link = this;
                
                if(request) request.abort();
                
                request = $.ajax(plug.setupAjax(previousValues, id));
                
                request.done(function( newValues ) {
                    link.updateOptions(newValues);
                    if(link.shouldPreventNextStep())
                        link.moveToNext();
                    else 
                        link.executeIfNotGoingToNext();
                });
                
                request.fail(function(jqXHR, textStatus ) {
                    plug.settings['remoteErrorHandler'](textStatus);
                });

                // No new Values to be added from this call
                return false;
                
            };
        },
                
        toCamelCase: function(str){
            return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
        },        
                
        setupAjax: function(previousValues, id){
            var url = '',
                remoteSettings = this.settings['remote-methods'];         
                    
            url += remoteSettings['url'];
            /*
            url += (remoteSettings['patternize'])? 
                        '/' + remoteSettings['pattern'] + id.charAt(0).toUpperCase() + id.slice(1) 
                        : 
                        '';
            */
            url += '/' + remoteSettings['pattern'] + toCamelCase(id);
                    
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