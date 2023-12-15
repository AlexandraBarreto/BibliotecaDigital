<?php 
$inc = include("conexion.php");
if ($inc) {
	$consulta = "SELECT * FROM libros";
	$resultado = mysqli_query($conex,$consulta);
	if ($resultado) {
		while ($row = $resultado->fetch_array()) {
	    $codigo = $row['codigo'];
	    $titulo = $row['titulo'];
	    $autor = $row['autor'];
	    $cantidad = $row['cantidad'];
	    ?>
        <div>
        	
        	<div>
        		<p>
        			<b>codigo: </b> <?php $codigo ?><br>
        		    <b>titulo: </b> <?php $titulo ?><br>
        		    <b>autor: </b> <?php $autor ?><br>
                    <b>cantidad: </b> <?php $cantidad ?><br>
        		</p>
        	</div>
        </div> 
	    <?php
	    }
	}
}
?>