import Transaccion from "./Transaccion.js";

export default class TransactionManager{

    constructor(){}

    createTransaction(user, tipo, valor, descripcion, categoria, fecha) {
        new Transaccion(user, tipo, valor, descripcion, categoria, fecha);
        //El método al ser de instancia nos asegura siempre estar dentro de la instancia contenedora (atributo transactions de la instancia User) ya que para acceder a este método de instancia es necesario tener un objeto instanciado de transaccion y el primer objeto que se instancia es el objeto contenedor transactions de la instancia de User
        //Además este método de instancia busca instanciar un nuevo objeto de transacción terminando de asegurar que siempre se cree una nueva transaccion en la instancia contenedora de transacciones de un usuario
        console.log("Base de datos: ", Transaccion.getTransactionData());
    }

    printTransaction(vector, container) {
        container.innerHTML = "";
        if (container.id == "campoIngresos") {
            container.innerHTML = '<legend>Ingresos</legend>';
        } else if (container.id == "campoGastos") {
            container.innerHTML = '<legend>Gastos</legend>';
        }

        for (let objeto of vector) {
            let elemento = `
                <div class="transaccion" data-tipo="${objeto._tipo}" data-id="${objeto._id}">
                    <h3>${objeto._categoria}</h3>
                    <p>${objeto._valor}</p>
                    <h4>${objeto._descripcion}</h4>
                    <h5>${objeto._fecha}</h5>
                    <div>
                        <button class="modificar">Modificar</button>
                        <button class="eliminar">Eliminar</button>
                    </div>
                </div>`
            container.innerHTML += elemento;
        }
    }

    deleteTransaction(id, transaction) {
        transaction.remove();  // Eliminar el elemento correspondiente 
        let indice = Transaccion.getTransactionData().findIndex(transaccion => transaccion._id == id); //Se busca el indice de la transaccion por su id en la base de datos para poder eliminarlo ya que splice funciona  el indice 

        let user = Transaccion.getTransactionData()[indice]._user; //Capturamos el id del usuario de la transaccion a eliminar para actualizar las listas de este

        if (indice !== -1) {
            Transaccion.getTransactionData().splice(indice, 1);  // Eliminar la transacción del arreglo
            console.log("Eliminada")
        }

        console.log(Transaccion.getTransactionData())
    }

    updateTransaction(id) {
        console.log(" Desde updateTransaction ingresos")
        //Se obtiene la transaccion de acuerdo al id capturado en el dashboard al momento de hacer click en algun elemento de la transaccion para poder buscarlo en la base de datos de las transacciones

        let targetTransaction = Transaccion.getTransactionData().find(transaction => transaction._id == id);
        // Actualiza los valores de la transacción existente en el arreglo
        targetTransaction._tipo = tipo.value;
        targetTransaction._valor = +valor.value;
        targetTransaction._descripcion = descripcion.value;
        targetTransaction._categoria = categoria.value;
        
        console.log(Transaccion.getTransactionData())
        // this.calcularBalance();
    }
}