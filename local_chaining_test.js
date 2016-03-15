function daFuncionParaChaining(genero, espectaculo){

    var ret = {
        '0': 'NS', 
        '1': 'Iron Man 3', 
        '2': 'La familia de mi novia', 
        '3': 'Stravaganza', 
        '4': 'Les Luthiers' 
    };
            
    if(espectaculo == '0'){
        
        switch (genero){
            // Null es el caso en que el combo de genero 
            // queda vacio porque los combos anteriores 
            // quedan vacios
            case null:
                ret = {};
            break;
            case '1': 
                delete ret['0'];
                delete ret['1'];
                delete ret['3'];
            break;
            case '2': 
                delete ret['0'];
                delete ret['2'];
                delete ret['3'];
                delete ret['4'];
            break;
            case '3':
                delete ret['0'];
                delete ret['1'];
                delete ret['2'];
                delete ret['4'];
            break;
        }
    } else if(espectaculo == '1'){
        // obra de teatro
        switch (genero){
            case '0':
                alert("todo en 0!");
                ret = {};
            break;
            case '1': 
                delete ret['0'];
                delete ret['1'];
                delete ret['2'];
                delete ret['3'];
            break;
            case '3':
                delete ret['0'];
                delete ret['1'];
                delete ret['2'];
                delete ret['4'];
            break;
        }
    } else if(espectaculo == '2'){
        // pelicula
        switch (genero){
            case '1': 
                delete ret['0'];
                delete ret['1'];
                delete ret['3'];
                delete ret['4'];
            break;
            case '2':
                delete ret['0'];
                delete ret['2'];
                delete ret['3'];
                delete ret['4'];
            break;
        }
    } 
    
    return ret;
}