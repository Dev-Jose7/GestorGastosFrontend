import User from "../../src/controllers/account/User.js";
import Transaccion from "../../src/controllers/operation/Transaccion.js";

export function completeInput(array){
    let counter = 0;
    for (let i = 0; i < array.length; i++) {
        if(array[i].value == ""){
            counter++;
            array[i].style.borderColor = "red";

            setTimeout(() => {
                array[i].style.borderStyle = "solid";
                array[i].style.borderColor = "unset";
            }, 3000);
        }
    }

    if(counter == 0){
        return true;
    } else {
        return false;
    }
}

export function confirmPassword(password, passwordConfirm){
    if(password == passwordConfirm){
        return true;
    } else {
        return false;
    }
}

export function initSession(account){
    if(account){
        sessionStorage.setItem("account", JSON.stringify(account)); //Se almacena el usuario a través de sessionStorage en formato JSON para leerlo más adelante.
        //Guarda la instancia en la API despues de autenticar  al usuario (confirmar si las credenciales indicadas por el cliente corresponden a un usuario almacenado en la base de datos), para ello se debe de crear una especie de variable/atributo (setItem) en la API y darle valor.
        //session y local solo almacena datos en formato de texto (String), para ello se usa el objeto global JSON, el cual sirve para el intercambio de datos entre las partes que necesiten almacenar y/o leer datos (cliente/servidor), JSON es un formato de texto que representa estructuras de datos y objetos de manera que pueden ser fácilmente leídos y entendidos.
        //JSON al ser un formato de texto se vuelve compatible para almacenar colecciones de datos en la APIs sessionStorage y localStorage, y como este formato se encuentra siendo manipulado en el objeto global JSON debemos hacer uso de este para acceder a métodos encargados de convertir los objetos en formato JSON (stringify) y transformarlos a su estado original (parse)
        setTimeout(() => {
            window.location.href = "dashboard.html"
        }, 2000);
        return true;
    } else {
        return false
    }
}

export function endSession(){
    sessionStorage.removeItem("account");

    setTimeout(() => {
        window.location.href = "login.html"
    }, 2000);
}

export function findUser (){
    let account = JSON.parse(sessionStorage.getItem("account"));
    return User.getUserData().find(user => user._id == account._id);
}

export function instanceTest(){
    let admin = new User("José", "jfnr398", "1234");
    let admin1 = new User("Fernando", "fercho398", "4321");

    console.log("Desde instanceTest", Transaccion.getTransactionData())

    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 6500, "Pago nomina", "Salario", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1400, "Alquiler casa", "Arriendo", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2150, "Comision trabajo", "Comisión", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 450, "Factura hogar", "Servicios", "2024-10-08");

    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 6500, "Pago nomina", "Salario", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1400, "Alquiler casa", "Arriendo", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2150, "Comision trabajo", "Comisión", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 450, "Factura hogar", "Servicios", "2024-10-08");

    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 6500, "Pago nomina", "Salario", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 1400, "Alquiler casa", "Arriendo", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Ingreso", 2150, "Comision trabajo", "Comisión", "2024-10-08");
    admin.getTransactions().getManager().createTransaction(admin.getId(), "Gasto", 450, "Factura hogar", "Servicios", "2024-10-08");

    admin.getTransactions().updateListUser(admin.getId());
}