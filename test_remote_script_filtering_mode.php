<?php

    function daGeneroFiltering($espectaculo){
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
    
    function getMes($dia){
    	$ret = array(); 
    	switch($dia){
            case '30':  array_push($ret, '4', '6', '9', '11');
            break;
            case '31':  array_push($ret, '1', '3', '5', '7', '8', '10', '12');
            break;
            // Todos los meses tienen al menos 28 dias... excepto febrero que puede no tenerlo (excp bisiesto) 
            default:
            	array_push($ret, '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'); 
            break;
        }

        return $ret;
    }

    function getAnio($dia, $mes){
    	$devolver_anios_bisiestos = ($dia == '29' && $mes == '2')? true: false;
    	$anios = range(1990, 2015);
    	$ret = array();

    	if($devolver_anios_bisiestos){
    		
    		foreach ($anios as $anio) {
    			if ((($anio % 4) == 0) && ( ($anio % 100 != 0) || (($anio % 400 != 0)) )){
    				$ret[] = strval($anio);
    			}
    		}	
    	} else {
    		$ret = array_map('strval', $anios);
    	}
    	

    	return $ret;
    }



    if(isset($_POST['verb']) && !empty($_POST['verb'])) {
	    $action = $_POST['element'];
	    switch($action) {
	        case 'mes' : $ret  = getMes($_POST['previousValues']['dia']); break;
	        case 'anio' : $ret = getAnio($_POST['previousValues']['dia'], $_POST['previousValues']['mes']); break;
	    }

	    echo json_encode($ret);

    } else {
    	$espectaculo = $_POST['previousValues']['espectaculo'];
    	$genero = daGeneroFiltering($espectaculo);	
    	echo json_encode($genero);
    }

