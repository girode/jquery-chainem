<?php

    function daGenero($espectaculo){
        $ret = array();
        switch($espectaculo){
            case '0':  array_push($ret, '0', '1', '2', '3');
            break;
            case '1':  array_push($ret, '1', '3');
            break;
            case '2':  array_push($ret, '1', '2');
            break;
        }

        return $ret;
    }
    
    function daGeneroChaining($espectaculo){
        $db = array(
            0 => 'NS',
            1 => 'Comedia',
            2 => 'Accion',
            3 => 'Extravagante'
        );
        
        switch($espectaculo){
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
    
    
    $espectaculo = $_POST['previousValues']['espectaculo'];
    
    // echo json_encode(daGenero($espectaculo));
    
    echo json_encode(daGeneroChaining($espectaculo));
    
  
    