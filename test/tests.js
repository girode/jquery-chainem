// Devuelve genero en funcion del espectaculo
function daGenero(espectaculo){
    var ret = [];
    switch(espectaculo){
        case '0': ret.push('0', '1', '2', '3');
            break;
        case '1': ret.push('1', '3');
            break;
        case '2': ret.push('1', '2');
            break;
    }
    
    return ret;
}

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

QUnit.moduleStart(function(){
    $('.chain').chainem({ 
        methods: {
            'genero': function(pv){
                return daGenero(pv.espectaculo);
            },
            'funcion': function(pv){
                return daFuncion(pv.genero, pv.espectaculo);
            } 
        }
    });
});

QUnit.module("Last mode");

QUnit.test("1 level chaining", function(assert){
    
    $('#genero')
        .val('2')
        .trigger('change');
    
    assert.equal($('#funcion').val(), '1', "Selecciono el genero Accion. La funcion seleccionada debe ser Iron Man 3");
});

QUnit.test("2 level chaining", function(assert){
    
    // Selecciono Pelicula
    $('#espectaculo')
        .val('2')
        .trigger('change');

    // Selecciono Comedia
    $('#genero').val('1');
   
    // Deberia ser La familia de mi novia
    assert.equal($('#funcion').val(), '2', "Selecciono el espectaculo Pelicula y el Genero Comedia. La funcion seleccionada debe ser La familia de mi novia");
});

QUnit.test("Picking non selected (2 levels)", function(assert){
    
    // Selecciono Pelicula
    $('#espectaculo')
        .val('0')
        .trigger('change');

    assert.equal($('#genero').val(), '0', "None selected in any select");
    assert.equal($('#funcion').val(), '0', "None selected in any select");
    
});



                
                
                
