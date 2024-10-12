import Ingreso from "../controllers/operation/Ingreso.js";
import Gasto from "../controllers/operation/Gasto.js";
import User from "../controllers/account/User.js";
import { endSession, findUser, instanceTransaction } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";

let id = 0;
let type = "";
let user = {};
let statusFilter = false;

let url = document.location.href;
let page = url.substring(url.lastIndexOf('/') + 1);
let tipo = document.getElementById("tipo");
let fecha = document.getElementById("fecha")
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

User.loadDataSession();
Transaccion.loadDataSession();

if(page == "dashboard.html"){
    user = findUser();
    
    console.log("Usuario: ", user)

    console.log("DB usuarios", User.getUserData())
    console.log("DB transacciones", Transaccion.getTransactionData())
    
    
    document.addEventListener("DOMContentLoaded", function(){
        user.getTransactions().updateListsUser(user.getId());
        user.getCategories().printCategoriesByUser(categoria); //En seccion añadir
        user.getCategories().printCategoriesByUser(document.getElementById("categoriaFilter")); //En seccion filtrar
        calculateBalance();
        printSection();
    });

    document.getElementById("nombre").textContent = "Bienvenido " + user.getName();

    document.getElementById("logout").addEventListener("click", function(){
        document.getElementById("nombre").textContent = `Hasta luego, ${user.getName()}`
        user = null;
        endSession();
    })

    document.getElementById("confirmar").style.display = "none";

    document.getElementById("añadir").addEventListener("click", function(){
        user.getTransactions().getManager().createTransaction(user.getId(), tipo.value, +valor.value, descripcion.value, categoria.value, fecha.value);
        user.getTransactions().updateListsUser(user.getId());
        formatearCampo();
        calculateBalance();
        printSection();
        console.log(user);
    });


    document.querySelector(".transacciones").addEventListener("click", function(e) {

        if(e.target.tagName == "BUTTON"){
            let button = e.target;

            if(button.className == "modificar") {
                console.log("Modificando");
                document.getElementById("confirmar").style.display = "inline";
                document.getElementById("añadir").style.display = "none";
                id = button.closest(".transaccion").dataset.id;
                editTransaction(button);
            }
        
            if(button.className == "eliminar") {
                console.log("Eliminando");
                id = button.closest(".transaccion").dataset.id;
                user.getTransactions().getManager().deleteTransaction(id, button.closest(".transaccion"));
                user.getTransactions().updateListsUser(user.getId());
                Transaccion.saveDataSession();
                calculateBalance();
                if(!statusFilter){
                    printSection();
                }
            }
            
        }
    });

    document.getElementById("confirmar").addEventListener("click", function(){
        user.getTransactions().getManager().updateTransaction(id);
        user.getTransactions().updateListsUser(user.getId());
        Transaccion.saveDataSession();
        calculateBalance();
        formatearCampo();
        if(statusFilter){
            resultFilter();
        } else if (!statusFilter){
            printSection();
        }
    });

    document.getElementById("cancelar").addEventListener("click", function(){
        formatearCampo();
    });

    document.getElementById("filter").addEventListener("click", function(e){
        statusFilter = true
        document.getElementById("tituloSeccion").textContent = "Transacciones filtradas";
        
        if(minimoFilter.value == "" && maximoFilter.value == "" || minimoFilter.value != "" && maximoFilter.value != ""){ //Si no hay valores en estos campos desactiva la función del boton submit para que no recargue la pagina y se realice un filtro, o si ya se encuentran valores en dichos campos igualmente desactiva para no recargar la página y poder filtrar
            e.preventDefault();
            resultFilter();
        }

        if(minimoFilter.value == "" && maximoFilter.value != ""){ //Si no hay valores en el campo minimo se da a entender de que el usuario quiere ajustar el invervalo desde el valor mas bajo (cero) hasta el valor que se indicó en máximo y así poder completar el intervalo.
            e.preventDefault();
            minimoFilter.value = 0;
            resultFilter();
        }

        if(minimoFilter.value != "" && maximoFilter.value == ""){ //Si no hay valores en el campo máximo no se podra iniciar con el filtro ya que si se ha indicado un valor en el campo minimo es obligatorio indicar un limite para completar el invervalo.
            maximoFilter.required = true;
        }
        
        user.getTransactions().updateListsUser(user.getId());
    });

    document.getElementById("cleanFilter").addEventListener("click", function(e){
        document.getElementById("tituloSeccion").textContent = "Lista de transacciones";

        e.preventDefault();

        user.getTransactions().updateListsUser(user.getId());
        printSection();

        minimoFilter.value = "";
        maximoFilter.value = "";
        tipoFilter.value = "Tipo";
        categoriaFilter.value = "Categoría";
        fechaFilter.value = "";
    });

    function calculateBalance() {
        let ingresoTotal = document.getElementById("valorIngreso");
        let gastoTotal = document.getElementById("valorGasto");
    
        user.getBalance(user.getTransactions().getListIngreso(), ingresoTotal);
        user.getBalance(user.getTransactions().getListGasto(), gastoTotal);
    
        document.getElementById("saldo").textContent = Number(ingresoTotal.textContent) - Number(gastoTotal.textContent);
    }

    function formatearCampo(){
        document.getElementById("tipo").selectedIndex = 0
        valor.value = "";
        descripcion.value = ""; 
        categoria.selectedIndex = 0;
        fecha.value = "";
        document.getElementById("añadir").style.display = "inline";
        document.getElementById("confirmar").style.display = "none";
    }
    
    function printSection(){
        user.getTransactions().getManager().printTransaction(user.getTransactions().getListIngreso(), campoIngresos);
        user.getTransactions().getManager().printTransaction(user.getTransactions().getListGasto(), campoGastos);
        printDefault();
    }
    
    function printDefault(){
        if(user.getTransactions().getListIngreso().length == 0){
            campoIngresos.innerHTML = `
                <legend>Ingresos</legend>
                <p>Sin transacciones</p>`;
        }
    
        if(user.getTransactions().getListGasto().length == 0){
                campoGastos.innerHTML =  `
                <legend>Gastos</legend>
                <p>Sin transacciones</p>`;
        }
    }
    
    function editTransaction(button) {
        let transactionNode = document.querySelectorAll(".transaccion");
        let transactionList = [...transactionNode];
        transactionList.forEach(transaction => transaction.style.color = "#000");
        button.closest(".transaccion").style.color = "gray";
    
    
        if (button.closest(".transaccion").dataset.tipo == "Ingreso") {
            document.getElementById("tipo").selectedIndex = 1;
        } else if (button.closest(".transaccion").dataset.tipo == "Gasto") {
            document.getElementById("tipo").selectedIndex = 2;
        }

        categoria.value = button.closest(".transaccion").querySelector("h3").textContent;
        valor.value = button.closest(".transaccion").querySelector("p").textContent;
        descripcion.value = button.closest(".transaccion").querySelector("h4").textContent;
        fecha.value = button.closest(".transaccion").querySelector("h5").textContent
    
        document.getElementById("cancelar").addEventListener("click", function () {
            button.closest(".transaccion").style.color = "unset";
        });
    }

    function resultFilter(){
        let dataFilter = user.getTransactions().getFilter().filter(minimoFilter.value, maximoFilter.value, tipoFilter.value, categoriaFilter.value, fechaFilter.value, user.getTransactions().getListTransaction());

        console.log(user.getTransactions().getListTransaction())

        user.getTransactions().updateListFilter(dataFilter);
        printSection();
    }
}