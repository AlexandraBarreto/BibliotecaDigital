//importar libreria
const express = require("express");


// objetos para llamar metodos express
const app = express();

let mysql = require("mysql");
//crear la conexion
let conexion = mysql.createConnection({
    host: "127.0.0.1",
    database: "biblioteca",
    user: "root",
    password: ""
});

//indicar el motor de vista a utilizar
app.set("view engine", "ejs");

//codifica todo lo que viene de un html de una pagina
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// En el lado del servidor (Node.js y Express)
app.get('/estudiante', function (req, res) {
    res.render('estudiante'); // Renderiza la plantilla estudiante.ejs
});

app.get('/administrador', function (req, res) {
    res.render('administrador'); // Renderiza la plantilla administrador.ejs
});

//agregando libros 
app.post("/agregar", function (req, res) {
    const datos = req.body; // se guardan todos los datos que se ingresen en la pagina web, en la const datos
    console.log(datos);
    let cod = datos.cod;
    let tit = datos.tit;
    let aut = datos.aut;
    let cant = datos.cant;

    // se envian los datos registrados
    let registrar = "INSERT INTO libros (codigo, titulo, autor, cantidad) VALUES ('" + cod + "', '" + tit + "', '" + aut + "', '" + cant + "')" +
        "ON DUPLICATE KEY UPDATE cantidad = cantidad + 1";


    if (cod)
        // se envian los datos
        conexion.query(registrar, [cod, tit, aut, cant], function (error) {
            if (error) {
                throw error;
            } else {
                console.log("Datos almacenados correctamente");
            }
        });

});

//prestar libros 
app.post("/prestar", function (req, res) {
    const datos = req.body; // se guardan todos los datos que se ingresen en la pagina web, en la const datos
    console.log(datos);
    let cod = datos.cod;
    let fechaE = datos.fechaE;
    var verLibros = "SELECT * FROM libros";
    conexion.query(verLibros, function (error, resultados) {

        if (error) {
            throw error;
        } else {
            console.log("** LIBROS DISPONIBLES **");
            console.log(resultados);
        }
    });
   

    var consultarCodigo = "SELECT codigo, cantidad FROM libros WHERE codigo = ?";
    conexion.query(consultarCodigo, [cod], function (error, resultados) {

        if (error) {
            console.error('Error al verificar el código del libro:', error);
            conexion.end();
            return;
        }

        if (resultados.length === 0) {
            console.log('El código del libro no existe.');
            conexion.end();
            return;
        }

        const cantidadDisponible = resultados[0].cantidad;

        // Verificar que haya más de una unidad disponible
        if (cantidadDisponible < 1) {
            console.log('No hay unidades disponibles para el libro con código:', cod);
            conexion.end();
            return;
        }
        // verificando que no haya prestado alguna unidad del ejemplar
        const verificarPrestamoQuery = 'SELECT codigo FROM librosprestados WHERE codigo = ?';
        conexion.query(verificarPrestamoQuery, [cod], (error, prestamoResults) => {
            if (error) {
                console.error('Error al verificar el préstamo del libro:', error);
                conexion.end();
                return;
            }

            if (prestamoResults.length > 0) {
                console.log('El libro con código', cod, 'ya ha sido prestado.');
                conexion.end();
                return;
            }

            // Si pasa todas las verificaciones, realizar el préstamo
            if (cantidadDisponible > 0) {
                var cantActual = cantidadDisponible - 1;
                var actualizarRegistro = "UPDATE libros SET cantidad = ? WHERE codigo = ?";
                conexion.query(actualizarRegistro, [cantActual, cod], function (error, res) {
                    if (error) {
                        throw error;
                    } else {
                        console.log("Se ha actualizado el stock");

                    }
                });
                // tomamos los campos titulo y autor para ponerlos en la tabla "librosPrestados"
                var seleccion = "SELECT titulo, autor FROM libros WHERE codigo = ?";
                conexion.query(seleccion, [cod], function (error, res) {
                    if (error) {
                        throw error;
                    }

                    var tit = res[0].titulo;
                    var aut = res[0].autor;


                    let fechaD;
                    let fecha = new Date(fechaE);

                    if (fecha.getMonth() !== 11) {
                        fecha.setMonth(fecha.getMonth() + 1);
                    } else {
                        fecha.setFullYear(fecha.getFullYear() + 1);
                        fecha.setMonth(0);  // Establecer el mes a enero (0) si es diciembre
                    }

                    fechaD = fecha.getFullYear() + "/" + (fecha.getMonth() + 1) + "/" + fecha.getDate();
                    let prestar = "INSERT INTO librosprestados (codigo, titulo, autor, fechaE, fechaD) VALUES ('" + cod + "', '" + tit + "', '" + aut + "', '" + fechaE + "','" + fechaD + "')"
                    conexion.query(prestar, function (error) {
                        if (error) {
                            throw error;
                        }

                        else {
                            console.log("Prestamo realizado exitosamente");
                            console.log("**LIBROS PRESTADOS**");
                            var verLibrosP = "SELECT * FROM librosprestados";
                            conexion.query(verLibrosP, function (error, resultados) {
                                if (error) {
                                    throw error;
                                } else {
                                    console.log(resultados);
                                }
                            });
                        }
                    });

                });

            }
           
        });
    });


});







//buscar libro
app.post("/buscar", function (req, res) {
    const datos = req.body; // se guardan todos los datos que se ingresen en la pagina web, en la const datos

    let busc = datos.busc;

    // se envian los datos registrados
    let buscar = "SELECT * FROM libros WHERE codigo = ?";
    conexion.query(buscar, [busc], function (error, consulta) {
        if (error) {
            throw error;
        } else {
            if (consulta.length > 0) {
                console.log("**Descripcion del libro**");
                console.log(consulta);

            } else {
                console.log("**El código del libro NO EXISTE**");

            }
        }
    });

});


    //configuramos el puerto para el servidor local
    app.listen(3000, function () {
        console.log("el servidor es: http://localhost:3000");
    });



    //rutas de archivos estaticos
    app.use(express.static("public"));

//conexion.end();