<?php

    function daGeneroChaining($espectaculo){
        $db = array(
            0 => 'NS',
            1 => 'Comedia',
            2 => 'Accion',
            3 => 'Extravagante'
        );
        
        switch($espectaculo){
            case '0': 
                $db = array();
            break;
            case '1':
                unset($db[0]);
                unset($db[2]);
            break;
            case '2':
                unset($db[0]);
                unset($db[3]);
            break;
        }

        return $db;
    }
    

    if(isset($_POST['previousValues'])){
    	// $param = $_POST['get']; -> Me dice a que funcion llamar
    	$value = $_POST['previousValues']['espectaculo'];
    } else {
    	$value = $_POST['espectaculo'];
    }

    $genero = daGeneroChaining($value);
    
    echo json_encode($genero);
    
    