export default class Category{
    static _categoriesMain = [];
    _categoriesUser = [];

    constructor(){
        this.defaultCategories();
        this.categoriesByUser();
    }

    defaultCategories(){
        Category._categoriesMain.push("Salario");
        Category._categoriesMain.push("Arriendo");
        Category._categoriesMain.push("Ingreso");
        Category._categoriesMain.push("Servicios");
        Category._categoriesMain.push("Transporte");
        Category._categoriesMain.push("Alimentación");
        Category._categoriesMain.push("Entretenimiento");
        Category._categoriesMain.push("Compras");
        Category._categoriesMain.push("Varios");
    }

    categoriesByUser(){
        Category._categoriesMain.forEach(category => this._categoriesUser.push(category));
    }

    printCategoriesByUser(select){
        select.innerHTML = `<option disabled selected>Categoría</option>`
        this._categoriesUser.forEach((category) => {
            select.innerHTML += `<option value="${category}">${category}</option>`
        });
    }

    validateCategory(newCategory){
        this._categoriesUser.find((category) => {
            if(category == newCategory){
                return true;
            }
            return false;
        });
    }

    addCategory(category){
        this._categoriesUser.push(category);
    }

    deleteCategory(targetCategory){
        let index = this._categoriesUser.findIndex(category => category == targetCategory.textContent);
        if (indice != -1) {
            this._categoriesUser.splice(index, 1);
        }
        targetCategory.remove();
    }
}