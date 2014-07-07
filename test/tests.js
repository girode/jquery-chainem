// Devuelve genero en funcion del espectaculo
//function daGenero(espectaculo){
//    var ret = [];
//    switch(espectaculo){
//        case '0': ret.push('0', '1', '2', '3');
//            break;
//        case '1': ret.push('1', '3');
//            break;
//        case '2': ret.push('1', '2');
//            break;
//    }
//    
//    return ret;
//}

// devuelve funcion en funcion del genero y el espectacilo
function daFuncion(genero, espectaculo){
    var ret = [];
    
    if(espectaculo == '0'){
        switch (genero){
            case '0': ret.push('0', '1', '2', '3', '4');
                break;
            case '1': ret.push('2', '4');
                break;
            case '2': ret.push('1');
                break;
            case '3': ret.push('3');
                break;
        }
    } else if(espectaculo == '1'){
        // obra de teatro
        switch (genero){
            //case '0': ret.push('0', '1', '2', '3', '4');
            //break;
            case '1': ret.push('4');
                break;
            //case '2': ret.push('1');
            //break;
            case '3': ret.push('3');
                break;
        }
    } else if(espectaculo == '2'){
        // pelicula
        switch (genero){
            //case '0': ret.push('0', '1', '2', '3', '4');
            //break;
            case '1': ret.push('2');
                break;
            case '2': ret.push('1');
                break;
            //case '3': ret.push('3');
            //break;
        }
    } 

    return ret;
}


QUnit.module("last mode", {
    setup: function() {
        
        /* Firefox only: Reset on refresh */
        $('#espectaculo').attr('autocomplete', 'off'); 
        $('#genero').attr('autocomplete', 'off'); 
        $('#funcion').attr('autocomplete', 'off');
        
        $('.chain').chainem({ 
            'remote-methods': {
                patternize: false
            },

            'methods': {
               'genero-remote': function(pv){
                    return pv;
               },
               'funcion': function(pv){
                   return daFuncion(pv.genero, pv.espectaculo);
               } 
            }
        });
    }
});


QUnit.test("Local chaining (1 level)", function(assert){
    
    $('#genero')
        .val('2')
        .trigger('change');
    
    assert.equal($('#funcion').val(), '1', "Selecciono el genero Accion (2). La funcion seleccionada debe ser Iron Man 3 (1)");
});

QUnit.asyncTest("Remote chaining (1 level)", function(assert){
    
    // Selecciono Pelicula
    $('#espectaculo')
        .val('2')
        .trigger('change');

    // Selecciono Comedia
    $('#genero').val('1');
    
     setTimeout(function() {
        // Deberia ser La familia de mi novia
        assert.equal($('#funcion').val(), '2', "Selecciono el espectaculo Pelicula (2) y el Genero Comedia (1). La funcion seleccionada debe ser 'La familia de mi novia' (2)");
        QUnit.start();
     }, 150 );
    
});
