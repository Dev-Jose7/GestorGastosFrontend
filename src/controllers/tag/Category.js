// Clase que gestiona las categorías de transacciones.
export default class Category {
    static _categoriesData = []; // Almacena todas las categorías.

    // Constructor de la clase Category.
    constructor(tag = null, user = null) {
        if (tag && user) { // Si se instancian con un tag y un usuario, se crea una categoría.
            this._tag = tag; // Asigna la etiqueta de la categoría.
            this._user = user; // Asigna el usuario al que pertenece la categoría.
            Category._categoriesData.push(this); // Agrega la categoría a la lista.
            Category.saveDataSession(); // Guarda la categoría en sessionStorage.
        } else {
            this._categoriesMain = Category.defaultCategories(); // Carga categorías predeterminadas.
            this._categoriesUser = []; // Inicializa la lista de categorías del usuario.
        }
    }

    // Método estático para guardar las categorías en sessionStorage.
    static saveDataSession() {
        sessionStorage.setItem("category", JSON.stringify(Category._categoriesData));
        console.log(sessionStorage.getItem("category"));
    }

    // Método estático para cargar las categorías desde sessionStorage.
    static loadDataSession() {
        Category._categoriesData = []; // Reinicia la lista de categorías.
        console.log(sessionStorage.getItem("category"));
        try {
            let tag = JSON.parse(sessionStorage.getItem("category")); // Parsea las categorías almacenadas.
            for (let i = 0; i < tag.length; i++) {
                new Category(tag[i]._tag, tag[i]._user); // Crea instancias de categorías.
            }
        } catch (error) {
            // Manejo del error si las categorías no pueden ser cargadas.
        }
        console.log(sessionStorage.getItem("category"));
    }

    // Métodos para obtener los atributos de la categoría.
    getCategoriesMain() { return this._categoriesMain; }
    getCategoriesUser() { return this._categoriesUser; }
    getTag() { return this._tag; }
    getUserId() { return this._user; }

    // Método estático para devolver las categorías predeterminadas.
    static defaultCategories() {
        return ["Salario", "Arriendo", "Comisión", "Servicios", "Transporte", "Alimentación", "Entretenimiento", "Compras", "Varios"];
    }

    // Método para actualizar la lista de categorías del usuario.
    updateListUser(id) {
        this._categoriesMain.forEach(category => {
            if (!this._categoriesUser.includes(category)) {
                this._categoriesUser.push(category); // Agrega categorías predeterminadas.
            }
        });

        Category._categoriesData.forEach(category => {
            if (category._user == id && !this._categoriesUser.includes(category._tag)) {
                this._categoriesUser.push(category._tag); // Agrega categorías personalizadas.
            }
        });

        console.log(this._categoriesUser);
    }

    // Método para imprimir categorías en un elemento select.
    printCategories(select) {
        select.innerHTML = `<option disabled selected>Categoría</option>`;
        this._categoriesUser.forEach((category) => {
            select.innerHTML += `<option value="${category}">${category}</option>`;
        });
    }

    // Método para validar si una categoría existe.
    validateCategory(newCategory) {
        let status;
        this._categoriesUser.find(category => {
            if (category == newCategory) {
                console.log("Encontrado");
                status = true; // La categoría fue encontrada.
            }
        });
        return status; // Retorna el estado de validación.
    }

    // Método para agregar una nueva categoría.
    addCategory(category, user) {
        new Category(category, user); // Crea una nueva categoría.
    }

    // Método para actualizar una categoría existente.
    updateCategory(tagOld, tagNew, id) {
        console.log(id);
        Category._categoriesData.find(category => {
            if (category._tag == tagOld && category._user == id) {
                category._tag = tagNew; // Actualiza la etiqueta de la categoría.
            }
        });
    }

    // Método para eliminar una categoría.
    deleteCategory(tag, idUser) {
        let index = Category._categoriesData.findIndex(category => {
            return category._tag == tag && category._user == idUser; // Busca el índice de la categoría.
        });

        console.log(index);
        Category._categoriesData.splice(index, 1); // Elimina la categoría del arreglo.
        Category.saveDataSession(); // Guarda los cambios en sessionStorage.
    }

    // Método para eliminar una categoría predeterminada.
    deleteCategoryMain(tag) {
        let index = this._categoriesMain.findIndex(category => category == tag);
        this._categoriesMain.slice(index, 1); // Elimina la categoría de la lista.
    }
}
