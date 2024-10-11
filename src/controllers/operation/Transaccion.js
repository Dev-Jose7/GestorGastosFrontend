import TransactionManager from "./TransactionManager.js";
import TransactionFilter from "./TransactionFilter.js";

export default class Transaccion {
    static contadorId = 0;
    static ingresos = [];
    static gastos = [];

    static transactionData = [];

    constructor(user = null, tipo = null, valor = null, descripcion = null, categoria = null, fecha = null) { //Parametros del constructor se asignan nulos esto con el fin de detectar mediante una condicional si se esta instanciando con o sin argumentos
        if (user && tipo && valor && descripcion && categoria && fecha) { //Si se instancia con parametros, creará un objeto el cual es una transaccion (tipo/gasto) y mediante el método que invoca al constructor (createTransaction) almacenara este objeto en el arreglo global de transacciones para así ser organizado en los arreglos del usuario
            this._id = ++Transaccion.contadorId;
            this._user = user;
            this._tipo = tipo;
            this._valor = valor;
            this._descripcion = descripcion;
            this._categoria = categoria;
            this._fecha = fecha;
            Transaccion.transactionData.push(this); //este this se refiere a la instancia que se realizo en createTransaction
            Transaccion.saveDataSession();
        } else { //Si se instancia vacio, creará un objeto en el atributo transactions del usuario el cual almancenará los siguientes arreglos
            this._listTransactions = [];
            this._ingresos = [];
            this._gastos = [];
            this._1manager = new TransactionManager();
            this._2filter = new TransactionFilter();
        }
    }

    static saveDataSession(){
        sessionStorage.setItem("transaction", JSON.stringify(Transaccion.transactionData)) 
        //Guarda en sessionStorage la base de datos de las transacciones (transactionData) cuando haya modificaciones en esta (crear, modificar o eliminar una transacción). Esto con el fin de conservar los valores que se hayan almacenado en la base de datos para poder utilizarlos en una nueva página.
    }

    static loadDataSession(){
        let data = JSON.parse(sessionStorage.getItem("transaction"));
        for (let i = 0; i < data.length; i++) {
            let transaction = new Transaccion(data[i]._user, data[i]._tipo, data[i]._valor, data[i]._descripcion, data[i]._categoria, data[i]._fecha)
            transaction.setId(data[i]._id);
        }
        //Carga en la base de datos (transactionData) el elemento almacenado en sessionStorage (gestionado por saveDataSession). Esto con el fin de entregar a la base de datos todos los valores que fueron añadidos a la esta antes de recargar la pagina, esto permite a la base de datos mantenerse actualizada constantemente
        //Función que reconstruye una instancia después de ser transformada nuevamente a su valor original (JSON.parse). Esto debido a que las instancias se encontraban almacenadas en formato JSON (JSON.stringify)
        //JSON transforma la base de datos en una cadena de caracteres para que sessionStorage pueda almacenarla y al transformarla nuevamente a su valor original (arreglo de objetos), los objetos no conservarán sus métodos de clase ya que se pierde la instancia del objeto al momento de la conversion al intentar almacenar la base de datos en sessionStorage
    }

    getId() {
        return this._id;
    }

    getListTransaction() {
        return this._listTransactions;
    }

    getManager(){
        return this._1manager;
    }

    getFilter(){
        return this._2filter;
    }

    getListIngreso() {
        return this._ingresos;
    }

    getListGasto() {
        return this._gastos;
    }

    setId(id){
        this._id = id;
    }

    setDescripcion(descripcion) {
        this._descripcion = descripcion;
    }

    setValor(valor) {
        this._valor = valor;
    }

    updateListsUser(id) {
        this._listTransactions = Transaccion.transactionData.filter((transaction) => transaction._user == id)
        this._ingresos = this._listTransactions.filter((transaction) => transaction._tipo == "Ingreso");
        this._gastos = this._listTransactions.filter((transaction) => transaction._tipo == "Gasto");
        // console.log("Transacciones usuario: ", this._listTransactions);
        // console.log("Ingresos", this._ingresos);
        // console.log("Gastos", this._gastos);
    }

}