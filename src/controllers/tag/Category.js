export default class Category{
    static _categoriesData = [];

    constructor(tag = null, user = null){
        if(tag, user){
            this._tag = tag;
            this._user = user;
            Category._categoriesData.push(this);
            Category.saveDataSession();
        } else {
            this._categoriesUser = Category.defaultCategories();
        }
    }

    static saveDataSession(){
        sessionStorage.setItem("category", JSON.stringify(Category._categoriesData));
        console.log(sessionStorage.getItem("category"))
    }

    static loadDataSession(){
        Category._categoriesData = [];
        console.log(sessionStorage.getItem("category"))
        try {
            let tag = JSON.parse(sessionStorage.getItem("category"));
            for (let i = 0; i < tag.length; i++) {
                new Category(tag[i]._tag, tag[i]._user);
            }
        } catch (error) {
            
        }
        
        console.log(sessionStorage.getItem("category"))
    }

    getCategoriesUser(){
        return this._categoriesUser;
    }

    getTag(){
        return this._tag;
    }

    getUserId(){
        return this._user;
    }

    static defaultCategories(){
        let categoriesMain;
        return categoriesMain = ["Salario", "Arriendo", "Comisión", "Servicios", "Transporte", "Alimentación", "Entretenimiento", "Compras", "Varios"];
    }

    updateListUser(id){ //Actualiza la lista de categorias de usuario con categorias personalidas si estas existen en su momento
        
        Category._categoriesData.forEach(category => {
            if(category._user == id){
                this._categoriesUser.push(category._tag);
            }
        });

        console.log(this._categoriesUser);
    }

    printCategories(select){
        select.innerHTML = `<option disabled selected>Categoría</option>`
        this._categoriesUser.forEach((category) => {
            select.innerHTML += `<option value="${category}">${category}</option>`
        });
    }

    validateCategory(newCategory){
        let status;
        this._categoriesUser.find(category => {
            if(category == newCategory){
                console.log("Encontrado")
                status = true
            }
        });
        return status;
    }

    addCategory(category, user){
        new Category(category, user);
    }

    updateCategory(tagOld, tagNew, id){
        console.log(id);
        Category._categoriesData.find(category => {
            if(category._tag == tagOld && category._user == id){
                category._tag = tagNew;
            }
        });
    }

    deleteCategory(index){
        Category._categoriesData.splice(index, 1);
    }
}