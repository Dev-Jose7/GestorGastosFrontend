import Transaccion from "./Transaccion.js";

// Clase que gestiona las transacciones.
export default class TransactionManager {

    // Método para crear una nueva transacción.
    createTransaction(user, tipo, valor, descripcion, categoria, fecha) {
        new Transaccion(user, tipo, valor, descripcion, categoria, fecha); // Crea una nueva transacción.
        console.log("Base de datos: ", Transaccion.getTransactionData()); // Muestra las transacciones almacenadas.
    }

    // Método para imprimir transacciones en el contenedor indicado.
    printTransaction(vector, container) {
        container.innerHTML = ""; // Limpia el contenedor.
        if (container.id == "campoIngresos") {
            container.innerHTML = '<legend>Ingresos</legend>';
        } else if (container.id == "campoGastos") {
            container.innerHTML = '<legend>Gastos</legend>';
        }

        // Agrega cada transacción al contenedor.
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
                </div>`;
            container.innerHTML += elemento;
        }
    }

    // Método para eliminar una transacción.
    deleteTransaction(id, transaction) {
        transaction.remove(); // Elimina el elemento del DOM.
        let indice = Transaccion.getTransactionData().findIndex(transaccion => transaccion._id == id); // Busca el índice de la transacción.

        if (indice !== -1) {
            Transaccion.getTransactionData().splice(indice, 1); // Elimina la transacción del arreglo.
            console.log("Eliminada");
        }

        console.log(Transaccion.getTransactionData());
    }

    // Método para actualizar una transacción existente.
    updateTransaction(id) {
        console.log(" Desde updateTransaction ingresos");
        let targetTransaction = Transaccion.getTransactionData().find(transaction => transaction._id == id);
        // Actualiza los valores de la transacción existente en el arreglo.
        targetTransaction._tipo = tipo.value;
        targetTransaction._valor = +valor.value;
        targetTransaction._descripcion = descripcion.value;
        targetTransaction._categoria = categoria.value;
        
        console.log(Transaccion.getTransactionData());
    }
}
