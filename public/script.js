function login() {
    var role = document.getElementById("role").value; //captura el valor del elemento de role

    if (role === "estudiante") {
        window.location.href = "http://localhost:3000/estudiante";
    } else if (role === "administrador") {
        window.location.href = "http://localhost:3000/administrador";
    }
}