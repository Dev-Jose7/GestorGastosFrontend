import { endSession, findUser } from "../../assets/js/util.js";
import User from "../controllers/account/User.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";

document.addEventListener("DOMContentLoaded", function(){
    User.loadDataSession()
    Transaccion.loadDataSession();
    Category.loadDataSession();

    let user = findUser();
    let categoria = document.getElementById("categoria");
    let optionIndex = 0;
    let textOption = "";
    let statusUpdate = false;
    console.log(user);
    
    user.getTransactions().updateListUser(user.getId());
    // if(user.getCategories().getCategoriesUser().length > 9){
    //     Category.loadDataSession();
    // }
    user.getCategories().updateListUser(user.getId());
    user.getCategories().printCategories(categoria); //En seccion añadir

    document.getElementById("dashboard").addEventListener("click", function(){
        window.location.href = "dashboard.html"
    });

    document.getElementById("logout").addEventListener("click", function(){
        user = null;
        endSession();
    })
    
    document.getElementById("cantIngreso").textContent = user.getTransactions().getListIngreso().length
    document.getElementById("cantGasto").textContent = user.getTransactions().getListGasto().length;
    document.getElementById("totalIngreso").textContent = user.getTransactions().totalIngreso();
    document.getElementById("totalGasto").textContent = user.getTransactions().totalGasto();

    userData();

    document.getElementById("showPassword").addEventListener("click", function(e){

        if(e.target.textContent == "Mostrar contraseña"){
            document.getElementById("password").textContent = user.getPassword();
            e.target.textContent = "Ocultar contraseña"
        } else if(e.target.textContent == "Ocultar contraseña"){
            document.getElementById("password").textContent = "*******";;
            e.target.textContent = "Mostrar contraseña"
        }
    });

    document.getElementById("updateData").addEventListener("click", function(e){
        if(e.target.textContent == "Modificar"){
            document.getElementById("dataUser").style.display = "none";
            document.getElementById("updateForm").style.display = "unset";

            e.target.textContent = "Guardar"
        } else if(e.target.textContent == "Guardar"){
            let updateName = document.getElementById("updateName").value;
            let updateEmail = document.getElementById("updateEmail").value;
            let updatePassword = document.getElementById("updatePassword").value;

            if(updateName != ""){
                user.setName(updateName);
            }

            if(updateEmail != ""){
                user.setEmail(updateEmail);
            }

            if(updatePassword != ""){
                user.setPassword(updatePassword); 
            }
            
            e.target.textContent = "Modificar";

            document.getElementById("dataUser").style.display = "unset";
            document.getElementById("updateForm").style.display = "none";
        }

        userData();
        User.saveDataSession();
    }); 

    document.getElementById("categoryButton").addEventListener("click", function(e){
        inputCategory(e);
    });

    categoria.addEventListener("change", function(){
        optionIndex = categoria.selectedIndex - 1;
        console.log(optionIndex);
        document.getElementById("updateCategory").disabled = false;
        document.getElementById("deleteCategory").disabled = false;
    });

    // categoria.addEventListener("click", function(){
    //     if(Category._categoriesData != ""){
            
    //     }
    //     Category.loadDataSession();
    //     user.getCategories().updateListUser(user.getId());
    // });

    document.getElementById("updateCategory").addEventListener("click", function(e){
        inputCategory(e);
    });

    document.getElementById("deleteCategory").addEventListener("click", function(e){
        let textConfirm = document.createElement("p")
        let confirmYes = document.createElement("BUTTON")
        let confirmNo = document.createElement("BUTTON")

        textConfirm.textContent = "¿Esta seguro de eliminar esta categoría?"
        confirmYes.textContent = "Si"
        confirmNo.textContent = "No"

        confirmYes.id = "confirmYes";
        confirmNo.id = "confirmNo";

        document.getElementById("showCategory").prepend(textConfirm);
        document.getElementById("showCategory").appendChild(confirmYes);
        document.getElementById("showCategory").appendChild(confirmNo);

        document.getElementById("updateCategory").style.display = "none";
        document.getElementById("deleteCategory").style.display = "none";

        confirmYes.addEventListener("click", function(){
            user.getCategories().deleteCategory(optionIndex);
            user.getCategories().printCategories(categoria);
            Category.saveDataSession();

            menuCategoryData();
        })

        confirmNo.addEventListener("click", function(){
            menuCategoryData();
        });
    });

    function inputCategory(e){
        let textStatus = document.createElement("p")
        let saveButton = document.createElement("button");
        let cancelButton = document.createElement("button");
        let buttonBox = document.querySelector(".categoria__botones");
        let showCategory = document.getElementById("showCategory");
        let inputCategory = document.getElementById("inputCategory");
        let selectCategory = document.getElementById("categoria")

        if(e.target.textContent == "Añadir" || e.target.textContent == "Modificar"){
            if(e.target.textContent == "Modificar"){
                statusUpdate = true;
                textOption = selectCategory.options[selectCategory.selectedIndex].textContent;
                inputCategory.querySelector("input").value = textOption;
            } else {
                statusUpdate = false;
                inputCategory.querySelector("input").value = "";
            }

            document.getElementById("addCategory").style.display = "none";
            document.querySelector(".categorias__edit").style.display = "none";

            showCategory.style.display = "none"
            inputCategory.style.display = "unset";

            saveButton.textContent = "Guardar";
            cancelButton.textContent = "Cancelar";

            saveButton.className = "guardar"
            cancelButton.className = "cancelar"

            buttonBox.appendChild(saveButton)
            buttonBox.appendChild(cancelButton)
        } 
        
        if(e.target.textContent == "Guardar"){
            let value = inputCategory.querySelector("input").value;
            
            if(value != ""){
                let category = value[0].toUpperCase() + value.substring(1);

                let status = user.getCategories().validateCategory(category);

                if(!status){
                    if(statusUpdate){ //Actualizar categorias ya existentes
                        user.getCategories().updateCategory(textOption, category, user.getId()); // Actualiza las categorias creadas por el usuario 
                        Category.saveDataSession(); //Guarda la categoria
                    }else { //Crear categorias nuevas
                        user.getCategories().addCategory(category, user.getId());
                    }
                    
                    
                    user.getCategories().updateListUser(user.getId());
                    user.getCategories().printCategories(categoria);

                    textStatus.textContent = `Categoria: ${category} ha sido añadida`
                    showCategory.prepend(textStatus);
                    menuUserData();

                } else {
                    textStatus.textContent = "Esta categoria ya se encuentra registrada"
                    inputCategory.prepend(textStatus);
                }
            } else {
                textStatus.textContent = "Completa el campo para añadir una categoria"
                inputCategory.prepend(textStatus);
            }

            setTimeout(() => {
                if(inputCategory.querySelector("p")){
                    inputCategory.querySelector("p").remove();
                } 
                
                if(showCategory.querySelector("p")){
                    showCategory.querySelector("p").remove()
                }
            }, 2000);
        }
        

        if(e.target.textContent == "Cancelar"){
            menuUserData();
        }
    }

    function menuUserData(){
        document.getElementById("showCategory").style.display = "unset"
        document.getElementById("inputCategory").style.display = "none";
        document.getElementById("addCategory").style.display = "unset" //Boton Añadir
        document.querySelector(".categorias__edit").style.display = "unset";
        document.querySelector(".categoria__botones").querySelector(".guardar").remove();
        document.querySelector(".categoria__botones").querySelector(".cancelar").remove();
    }

    function menuCategoryData(){
        user.getCategories().updateListUser(user.getId());
        document.getElementById("showCategory").querySelector("p").remove();
        document.getElementById("showCategory").querySelector("#confirmYes").remove();
        document.getElementById("showCategory").querySelector("#confirmNo").remove();
        document.getElementById("updateCategory").style.display = "unset";
        document.getElementById("deleteCategory").style.display = "unset";
    }

    function userData(){
        document.getElementById("name").textContent = user.getName();
        document.getElementById("email").textContent = user.getEmail();
        document.getElementById("password").textContent = "*******";
    }
});