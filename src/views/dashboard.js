import User from "../controllers/account/User.js";
import { endSession, findUser, instanceTest } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";

// Cuando el contenido del documento está listo, se cargan los datos de sesión de usuarios, transacciones y categorías y se declarán las variables necesarias.
document.addEventListener("DOMContentLoaded", function() {
    let id = 0;
    let user = {};
    let statusFilter = false;

    let tipo = document.getElementById("tipo");
    let fecha = document.getElementById("fecha");
    let valor = document.getElementById("valor");
    let descripcion = document.getElementById("descripcion");
    let categoria = document.getElementById("categoria");
    let campoIngresos = document.getElementById("campoIngresos");
    let campoGastos = document.getElementById("campoGastos");
    
    let minimoFilter = document.getElementById("minimoFilter");
    let maximoFilter = document.getElementById("maximoFilter");
    let tipoFilter = document.getElementById("tipoFilter");
    let categoriaFilter = document.getElementById("categoriaFilter");
    let fechaFilter = document.getElementById("fechaFilter");
    // // Obtiene la URL actual y el nombre de la página.
    // let url = document.location.href;
    // let page = url.substring(url.lastIndexOf('/') + 1);
    
    // Carga los datos de sesión al cargar el documento.
    User.loadDataSession();
    Transaccion.loadDataSession();
    Category.loadDataSession();
    
    user = findUser(); // Encuentra al usuario actual.
    console.log("Usuario: ", user);
    
    console.log("DB usuarios", User.getUserData());
    console.log("DB transacciones", Transaccion.getTransactionData());

    // Actualiza las listas de transacciones y categorías del usuario.
    user.getTransactions().updateListUser(user.getId());
    user.getCategories().updateListUser(user.getId());
    printTransactions(); // Imprime las transacciones del usuario.
    printCategory(); // Imprime las categorías del usuario.
    calculateBalance(); // Calcula el balance entre ingresos y gastos.

    // Muestra el nombre del usuario en la bienvenida.
    document.getElementById("nombre").textContent = "Bienvenido " + user.getName();

    // Redirige al usuario a la página de cuenta.
    document.getElementById("account").addEventListener("click", function() {
        window.location.href = "account.html";
    });

    // Cierra la sesión y redirige al login.
    document.getElementById("logout").addEventListener("click", function() {
        document.getElementById("nombre").textContent = `Hasta luego, ${user.getName()}`;
        user = null;
        endSession();
    });

    document.getElementById("confirmar").style.display = "none";

    // Añade una nueva transacción cuando se hace clic en el botón de añadir.
    document.getElementById("añadir").addEventListener("click", function() {
        //Si el valor de descripcion es vacío le añade un espacio al value del input para que se pueda crear la transacción
        if(descripcion.value == ""){
            descripcion.value = " ";
        }
        
        //Valida si los siguientes campos se encuentran vacíos, esto con el fin de poder crear transacciones correctamente e indicarle al usuario si le hace falta campos por completar 
        if(tipo.value != "Tipo" && categoria.value != "Categoría" && valor.value != "" && fecha.value != ""){
            user.getTransactions().getManager().createTransaction(user.getId(), tipo.value, +valor.value, descripcion.value, categoria.value, fecha.value);
            user.getTransactions().updateListUser(user.getId());
            printTransactions(); // Actualiza la lista de transacciones.
            calculateBalance(); // Recalcula el balance.
            formatearCampo(); // Limpia el formulario.
            console.log(user);
        } else{
            alert("Ingrese todos los campos faltantes");
        }
    });

    // Evento para modificar o eliminar transacciones al hacer clic en un botón de acción.
    document.querySelector(".transacciones").addEventListener("click", function(e) {
        if (e.target.tagName == "BUTTON") {
            let button = e.target;

            if (button.className == "modificar") {
                console.log("Modificando");
                document.getElementById("confirmar").style.display = "inline";
                document.getElementById("añadir").style.display = "none";
                id = button.closest(".transaccion").dataset.id; // Captura el ID de la transacción.
                editTransaction(button); // Llama a la función para editar la transacción.
            }
        
            if (button.className == "eliminar") {
                console.log("Eliminando");
                id = button.closest(".transaccion").dataset.id;
                user.getTransactions().getManager().deleteTransaction(id, button.closest(".transaccion")); // Elimina la transacción.
                user.getTransactions().updateListUser(user.getId());
                Transaccion.saveDataSession(); // Guarda los cambios en la sesión.
                calculateBalance();
                if (!statusFilter) {
                    printTransactions(); // Imprime las transacciones nuevamente si no hay filtro.
                }
            }
        }
    });

    // Confirma la modificación de una transacción.
    document.getElementById("confirmar").addEventListener("click", function() {
        user.getTransactions().getManager().updateTransaction(id); // Actualiza la transacción.
        user.getTransactions().updateListUser(user.getId());
        Transaccion.saveDataSession(); // Guarda los cambios.
        calculateBalance();
        formatearCampo(); // Limpia el formulario.
        if (statusFilter) {
            resultFilter(); // Aplica el filtro nuevamente si está activado.
        } else if (!statusFilter) {
            printTransactions();
        }
    });

    // Restablece los campos cuando se cancela la modificación.
    document.getElementById("cancelar").addEventListener("click", function() {
        formatearCampo();
    });

    // Aplica el filtro cuando se hace clic en el botón de filtrar.
    document.getElementById("filter").addEventListener("click", function(e) {
        statusFilter = true;
        document.getElementById("tituloSeccion").textContent = "Transacciones filtradas";
        
        // Aplica el filtro de acuerdo a los valores ingresados en los campos de mínimo y máximo.
        if (minimoFilter.value == "" && maximoFilter.value == "" || minimoFilter.value != "" && maximoFilter.value != "") {
            e.preventDefault();
            resultFilter(); // Aplica el filtro.
        }

        // Si no hay valor mínimo, establece el valor mínimo en 0.
        if (minimoFilter.value == "" && maximoFilter.value != "") {
            e.preventDefault();
            minimoFilter.value = 0;
            resultFilter(); // Aplica el filtro.
        }

        // Si se ingresa valor mínimo pero no máximo, se requiere el valor máximo.
        if (minimoFilter.value != "" && maximoFilter.value == "") {
            maximoFilter.required = true;
        }
        
        user.getTransactions().updateListUser(user.getId());
    });

    // Limpia el filtro y restaura la lista de transacciones.
    document.getElementById("cleanFilter").addEventListener("click", function(e) {
        document.getElementById("tituloSeccion").textContent = "Lista de transacciones";
        e.preventDefault();
        user.getTransactions().updateListUser(user.getId());
        printTransactions(); // Imprime todas las transacciones nuevamente.

        // Limpia los campos del filtro.
        minimoFilter.value = "";
        maximoFilter.value = "";
        tipoFilter.value = "Tipo";
        categoriaFilter.value = "Categoría";
        fechaFilter.value = "";
    });

    // Función que calcula el balance total entre ingresos y gastos.
    function calculateBalance() {
        let ingresoTotal = document.getElementById("valorIngreso");
        let gastoTotal = document.getElementById("valorGasto");
    
        user.getBalance(user.getTransactions().getListIngreso(), ingresoTotal);
        user.getBalance(user.getTransactions().getListGasto(), gastoTotal);
    
        document.getElementById("saldo").textContent = Number(ingresoTotal.textContent) - Number(gastoTotal.textContent);
    }

    // Limpia los campos del formulario.
    function formatearCampo() {
        document.getElementById("tipo").selectedIndex = 0;
        valor.value = "";
        descripcion.value = ""; 
        categoria.selectedIndex = 0;
        fecha.value = "";
        document.getElementById("añadir").style.display = "inline";
        document.getElementById("confirmar").style.display = "none";
    }

    // Imprime las transacciones de ingresos y gastos.
    function printTransactions() {
        user.getTransactions().getManager().printTransaction(user.getTransactions().getListIngreso(), campoIngresos);
        user.getTransactions().getManager().printTransaction(user.getTransactions().getListGasto(), campoGastos);
        printDefault(); // Imprime el mensaje por defecto si no hay transacciones.
    }

    // Imprime las categorías disponibles para el usuario.
    function printCategory() {
        user.getCategories().printCategories(categoria); // En sección de añadir.
        user.getCategories().printCategories(document.getElementById("categoriaFilter")); // En sección de filtrar.
    }

    // Imprime un mensaje por defecto si no hay transacciones.
    function printDefault() {
        if (user.getTransactions().getListIngreso().length == 0) {
            campoIngresos.innerHTML = 
                `<legend>Ingresos</legend>
                <p>Sin transacciones</p>`;
        }
    
        if (user.getTransactions().getListGasto().length == 0) {
            campoGastos.innerHTML =  
                `<legend>Gastos</legend>
                <p>Sin transacciones</p>`;
        }
    }

    // Función que establece los valores de una transacción a editar.
    function editTransaction(button) {
        let transactionNode = document.querySelectorAll(".transaccion");
        let transactionList = [...transactionNode];
        transactionList.forEach(transaction => transaction.style.color = "#000");
        button.closest(".transaccion").style.color = "gray"; // Resalta la transacción seleccionada.

        // Establece el valor de los campos del formulario con los datos de la transacción seleccionada.
        if (button.closest(".transaccion").dataset.tipo == "Ingreso") {
            document.getElementById("tipo").selectedIndex = 1;
        } else if (button.closest(".transaccion").dataset.tipo == "Gasto") {
            document.getElementById("tipo").selectedIndex = 2;
        }

        categoria.value = button.closest(".transaccion").querySelector("h3").textContent;
        valor.value = button.closest(".transaccion").querySelector("p").textContent;
        descripcion.value = button.closest(".transaccion").querySelector("h4").textContent;
        fecha.value = button.closest(".transaccion").querySelector("h5").textContent;
    
        document.getElementById("cancelar").addEventListener("click", function () {
            button.closest(".transaccion").style.color = "unset"; // Restaura el color de la transacción.
        });
    }

    // Aplica el filtro sobre las transacciones.
    function resultFilter() {
        let dataFilter = user.getTransactions().getFilter().filter(minimoFilter.value, maximoFilter.value, tipoFilter.value, categoriaFilter.value, fechaFilter.value, user.getTransactions().getListTransaction());

        console.log(user.getTransactions().getListTransaction());

        user.getTransactions().updateListFilter(dataFilter); // Actualiza la lista filtrada de transacciones.
        printTransactions(); // Imprime las transacciones filtradas.
    }
});