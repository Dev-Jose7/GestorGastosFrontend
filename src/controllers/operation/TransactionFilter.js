import Transaccion from "./Transaccion.js";

export default class TransactionFilter{
    constructor(){}

    filter(min, max, type, tag, date, database){
        let data = [];
        
        database.forEach((transaction) => {
            let status = true;

            if(min != ""){
                if(transaction.getValue() < min || transaction.getValue() > max){
                    status = false;
                }
            }
        
            if(type != "Tipo"){
                if(transaction.getType() != type){
                    status = false;
                }
            }
            
            if(tag != "Categoría"){
                if(transaction.getCategory() != tag){
                    console.log("Metodo", transaction.getCategory())
                    console.log("Parametro", tag)
                    status = false;
                }
            }
            

            if(date != ""){
                if(transaction.getDate() != date){
                    status = false
                }
            }

            if(status){
                data.push(transaction);
            }

            console.log(data)
        });

        return data;
    }
}