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
            //                            case '0': ret.push('0', '1', '2', '3', '4');
            //                            break;
            case '1': ret.push('4');
                break;
            //                            case '2': ret.push('1');
            //                            break;
            case '3': ret.push('3');
                break;
        }
    } else if(espectaculo == '2'){
        // pelicula
        switch (genero){
            //                            case '0': ret.push('0', '1', '2', '3', '4');
            //                            break;
            case '1': ret.push('2');
                break;
            case '2': ret.push('1');
                break;
            //                            case '3': ret.push('3');
        //                            break;
}
} 

return ret;
}


module("Testing the jQuery Chainem Plugin");

test("Setting second select option", function(){
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
    
    $('#genero').simulate( "change" );
    
    
    equal($('#funcion').val(), '3', "Deberia ser extravagante");
});



                
                
                
