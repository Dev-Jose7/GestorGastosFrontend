import Transaccion from "../operation/Transaccion.js";
import Category from "../tag/Category.js";

export default class User{
    static _userData = [];
    static counterUser = 0;

    constructor(name, email, password){
        this._id = ++User.counterUser;
        this._name = name;
        this._email = email;
        this._password = password;
        this._transactions = new Transaccion();
        this._categories = new Category();
        this.generateCategory();
        User._userData.push(this);
        User.saveDataSession();
    }

    getId(){
        return this._id;
    }

    getName(){
        return this._name;
    }

    getEmail(){
        return this._email;
    }

    getPassword(){
        return this._password;
    }

    getTransactions(){
        return this._transactions;
    }

    getCategories(){
        return this._categories;
    }

    static getUserData(){
        return User._userData;
    }

    setId(id){
        this._id = id;
    }

    setName(name){
        this._name = name;
    }

    setEmail(email){
        this._email = email;
    }

    setPassword(password){
        this._password = password;
    }

    generateCategory(){
        Category.defaultCategories(this.getId());
    }

    static saveDataSession(){
        sessionStorage.setItem("database", JSON.stringify(User._userData));
        console.log(sessionStorage.getItem("database"))
        //Guarda en sessionStorage la base de datos de los usuarios (userData) cuando haya modificaciones en esta (crear, modificar o eliminar un usuario). Esto con el fin de conservar los valores que se hayan almacenado en la base de datos para poder utilizarlos en una nueva página.
    }

    static loadDataSession(){
        let data = JSON.parse(sessionStorage.getItem("database"));
        for (let i = 0; i < data.length; i++) {
            let user = new User(data[i]._name, data[i]._email, data[i]._password);
            user.setId(data[i]._id);
        }
        //Carga en la base de datos (userData) el elemento almacenado en sessionStorage (gestionado por saveDataSession). Esto con el fin de entregar a la base de datos todos los valores que fueron añadidos a la base antes de recargar la pagina, esto permite a la base de datos mantenerse actualizada constantemente
        //Función que reconstruye una instancia después de ser transformada nuevamente a su valor original (JSON.parse). Esto debido a que las instancias se encontraban almacenadas en formato JSON (JSON.stringify)
        //JSON transforma la base de datos en una cadena de caracteres para que sessionStorage pueda almacenarla y al transformarla nuevamente a su valor original (arreglo), los objetos no conservarán sus métodos de clase ya que se pierde la instancia del objeto al momento de la conversion al intentar almacenar la base de datos en sessionStorage
    }

    static validateUser(email, password){
        for (let i = 0; i < User._userData.length; i++) {
            if(User._userData[i]._email == email && User._userData[i]._password == password){
                return User._userData[i];
            }
        }
        return false;
    }

    static printUserData(){
        console.log("Lista de usuarios");
        for (let i = 0; i < User._userData.length; i++) {
            console.log(User._userData[i]);
        }
    }

    getBalance(transacciones, elementoTotal) { //Metodo de clase (Estático)
        if (transacciones.length == 0) {
            elementoTotal.textContent = 0;
        } else {
            let contador = 0; // Reiniciamos el contador
            for (const objeto of transacciones) {
                contador += +objeto._valor;
            }
            elementoTotal.textContent = contador;
        }
    }

}