import Transaccion from "./Transaccion.js";

// Clase que gestiona las transacciones.
export default class TransactionManager {

    // Método para crear una nueva transacción.
    createTransaction(user, tipo, valor, descripcion, categoria, fecha) {
        new Transaccion(user, tipo, valor, descripcion, categoria, fecha); // Crea una nueva transacción.
        console.log("Base de datos: ", Transaccion.getTransactionData()); // Muestra las transacciones almacenadas.
    }
    
    // Método para imprimir transacciones a través de páginas en el contenedor indicado.
    printTransaction(container, vector, size){
        container.innerHTML = ""; // Limpia el contenedor.
        let counterTransaction = 0;

        //Después de limpiar el contenedor, se crea la primer página 
        createPage(); //Es necesario crear una primer página antes de iniciar el ciclo, esto para que el contenedor de páginas tenga elementos hijos y así el ciclo tenga que elementos recorrer
        let section = container.children;
        
        if(vector.length != 0){ //Si hay transacciones se procederá con la impresión por página, si no hay transacciones se imprimirá estructuras de transacciones para que el contenedor de páginas tenga un tamaño definido por tamaño de página. Ver en dashboard en función pagination
            for (let page = 0; page < section.length; page++) { //Recorre el contenedor de las paginas (ciclo de páginas)
                for (let i = 0; i < size; i++) { //Hace referencia a la cantidad de veces que debe de imprimir una transacción a una página (ciclo de transacciones por página)
                    let elemento = `
                        <div class="transaccion" data-tipo="${vector[counterTransaction]._tipo}" data-id="${vector[counterTransaction]._id}">
                        ${container.id == "campoTransacciones" ? `<h4>${vector[counterTransaction]._tipo}</h4>` : ""}
                            <h3>${vector[counterTransaction]._categoria}</h3>
                            <p>${vector[counterTransaction]._valor}</p>
                            <h4>${vector[counterTransaction]._descripcion}</h4>
                            <h5>${vector[counterTransaction]._fecha}</h5>
                            <div>
                                <button class="modificar">Modificar</button>
                                <button class="eliminar">Eliminar</button>
                            </div>
                        </div>`;
                    
                    section[page].innerHTML += elemento;
                    counterTransaction++
                    // console.log("counter", counterTransaction)
                    // console.log("vector", vector.length);
    
                    if(counterTransaction == vector.length){ //Si todas las transacciones fueron añadidas procederá a terminar el ciclo principal para que no se creen más páginas
                        break;
                    }
                }
    
                createPage();
            }
        }

        function createPage(){ //Esta función es importante ya que crea y añade paginas al elemento contenedor de estas además es motor del primer ciclo ya que si añade páginas el ciclo podrá ejecutarse una vez más, imprimiendo transacciones en esta nueva página
            if(counterTransaction < vector.length || vector.length == 0){ //Valida si hay transacciones por imprimir para así crear una pagina nueva o si no hay más transacciones, entonces creará una página vacía
                let page = document.createElement("div");
                page.className = "pagina"
                container.appendChild(page);
                console.log("Se crea pagina")
            }
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
