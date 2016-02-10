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
    
    $espectaculo = $_POST['previousValues']['espectaculo'];
    
    echo json_encode(daGenero($espectaculo));
    
  
    