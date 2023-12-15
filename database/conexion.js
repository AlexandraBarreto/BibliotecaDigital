//llamar la libreria
let mysql = require("mysql");
//crear la conexion
let conexion = mysql.createConnection({
    host: "127.0.0.1",
    database: "biblioteca",
    user: "root",
    password: ""
});
//comprobar la conexion
conexion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log('conexion exitosa');
    }
});

const libros = "select * from libros";
conexion.query(libros,function(error,lista){
    if(error){
        throw error;
    }else{
        console.log(lista);
    }
});
conexion.end();