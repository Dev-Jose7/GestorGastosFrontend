// Clase que gestiona los filtros de las transacciones.
export default class TransactionFilter {
    constructor() {}

    // Método que filtra las transacciones según los criterios especificados.
    filter(min, max, type, tag, date, database) {
        let data = [];
        
        // Itera sobre cada transacción en la base de datos.
        database.forEach((transaction) => {
            let status = true;

            if (min != "") {
                if (transaction.getValue() < min || transaction.getValue() > max) {
                    status = false; // Verifica los valores mínimos y máximos.
                }
            }
        
            if (type != "Tipo") {
                if (transaction.getType() != type) {
                    status = false; // Filtra por tipo de transacción.
                }
            }
            
            if (tag != "Categoría") {
                if (transaction.getCategory() != tag) {
                    status = false; // Filtra por categoría.
                }
            }
            
            if (date != "") {
                if (transaction.getDate() != date) {
                    status = false; // Filtra por fecha.
                }
            }

            if (status) {
                data.push(transaction); // Agrega la transacción al resultado si pasa todas las verificaciones.
            }
        });

        return data; // Retorna el arreglo de transacciones filtradas.
    }
}
