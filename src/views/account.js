import { endSession, findUser } from "../../assets/js/util.js";
import User from "../controllers/account/User.js";
import Transaccion from "../controllers/operation/Transaccion.js";
import Category from "../controllers/tag/Category.js";

// Cuando el contenido del documento está listo, se cargan los datos de sesión de usuarios, transacciones y categorías.
document.addEventListener("DOMContentLoaded", function() {
    User.loadDataSession();
    Transaccion.loadDataSession();
    Category.loadDataSession();

    let user = findUser(); // Encuentra al usuario actual.
    let categoria = document.getElementById("categoria"); // Select para categorías.
    let categoriesMain = user.getCategories().getCategoriesMain(); // Obtiene categorías principales.
    let name = document.getElementById("name"); // Muestra el nombre del usuario.
    let email = document.getElementById("email"); // Muestra el correo del usuario.
    let password = document.getElementById("password"); // Muestra la contraseña del usuario.
    let showPassword = document.getElementById("showPassword"); // Botón para mostrar u ocultar contraseña.
    let optionIndex = 0;
    let optionSelect = "";
    let textOption = "";
    let statusUpdate = false; // Estado que indica si se está actualizando una categoría.
    
    console.log(user);
    
    // Actualiza las listas de transacciones y categorías del usuario.
    user.getTransactions().updateListUser(user.getId());
    user.getCategories().updateListUser(user.getId());
    user.getCategories().printCategories(categoria); // Imprime las categorías en el select de categorías.

    // Redirige al usuario al dashboard al hacer clic en el botón de dashboard.
    document.getElementById("dashboard").addEventListener("click", function() {
        window.location.href = "dashboard.html";
    });

    // Cierra la sesión y redirige al login.
    document.getElementById("logout").addEventListener("click", function() {
        user = null;
        endSession();
    });

    // Muestra las estadísticas de ingresos y gastos del usuario.
    document.getElementById("cantIngreso").textContent = user.getTransactions().getListIngreso().length;
    document.getElementById("cantGasto").textContent = user.getTransactions().getListGasto().length;
    document.getElementById("totalIngreso").textContent = user.getTransactions().totalIngreso();
    document.getElementById("totalGasto").textContent = user.getTransactions().totalGasto();

    // Muestra los datos del usuario.
    userData();

    // Evento para mostrar u ocultar la contraseña.
    showPassword.addEventListener("click", function(e) {
        if (e.target.textContent == "Ver contraseña") {
            password.textContent = user.getPassword(); // Muestra la contraseña real.
            e.target.textContent = "Ocultar contraseña";
        } else if (e.target.textContent == "Ocultar contraseña") {
            password.textContent = "*******"; // Oculta la contraseña.
            e.target.textContent = "Ver contraseña";
        }
    });

    // Modificar o completar los datos del usuario.
    document.getElementById("updateData").addEventListener("click", function(e) {
        let inputName = document.createElement("input");
        let inputEmail = document.createElement("input");
        let inputPassword = document.createElement("input");

        inputName.setAttribute("type", "text");
        inputEmail.setAttribute("type", "text");
        inputPassword.setAttribute("type", "text");

        if (e.target.textContent == "Modificar") {
            // Convierte los campos de texto en inputs para modificar los datos del usuario.
            inputName.placeholder = name.textContent;
            inputEmail.placeholder = email.textContent;
            inputPassword.placeholder = user.getPassword();

            name.style.display = "none";
            email.style.display = "none";
            password.style.display = "none";
            showPassword.style.display = "none";

            document.getElementById("userName").appendChild(inputName);
            document.getElementById("userEmail").appendChild(inputEmail);
            document.getElementById("userPassword").appendChild(inputPassword);

            e.target.textContent = "Completar";
        } else if (e.target.textContent == "Completar") {
            // Actualiza los datos del usuario si los inputs no están vacíos.
            if (inputName.value != "") user.setName(inputName.value);
            if (inputEmail.value != "") user.setEmail(updateEmail);
            if (inputPassword.value != "") user.setPassword(updatePassword);

            e.target.textContent = "Modificar";

            // Restablece la visualización de los datos.
            name.style.display = "unset";
            email.style.display = "unset";
            password.style.display = "unset";
            showPassword.style.display = "unset";
            document.getElementById("userName").querySelector("input").remove();
            document.getElementById("userEmail").querySelector("input").remove();
            document.getElementById("userPassword").querySelector("input").remove();
        }

        // Muestra los datos del usuario y guarda la sesión.
        userData();
        User.saveDataSession();
    });

    // Añadir o modificar una categoría.
    document.getElementById("categoryButton").addEventListener("click", function(e) {
        inputCategory(e); // Llama a la función que gestiona las categorías.
    });

    // Detecta el cambio de categoría en el select.
    categoria.addEventListener("change", function(e) {
        console.log(e);
        optionIndex = categoria.selectedIndex;
        optionSelect = categoria.options[optionIndex].textContent;

        // Si la categoría seleccionada es predeterminada, desactiva los botones de modificar y eliminar.
        if (categoriesMain.includes(optionSelect)) {
            document.getElementById("updateCategory").disabled = true;
            document.getElementById("deleteCategory").disabled = true;
        } else {
            document.getElementById("updateCategory").disabled = false;
            document.getElementById("deleteCategory").disabled = false;
        }
    });

    // Lógica para modificar la categoría seleccionada.
    document.getElementById("updateCategory").addEventListener("click", function(e) {
        inputCategory(e);
    });

    // Lógica para eliminar una categoría seleccionada.
    document.getElementById("deleteCategory").addEventListener("click", function(e) {
        let textConfirm = document.createElement("p");
        let confirmYes = document.createElement("BUTTON");
        let confirmNo = document.createElement("BUTTON");

        textConfirm.textContent = "¿Está seguro de eliminar esta categoría?";
        confirmYes.textContent = "Sí";
        confirmNo.textContent = "No";

        confirmYes.id = "confirmYes";
        confirmNo.id = "confirmNo";

        // Agrega los botones de confirmación y oculta los botones de modificar y eliminar.
        document.getElementById("showCategory").prepend(textConfirm);
        document.getElementById("showCategory").appendChild(confirmYes);
        document.getElementById("showCategory").appendChild(confirmNo);

        document.getElementById("updateCategory").style.display = "none";
        document.getElementById("deleteCategory").style.display = "none";

        // Lógica para confirmar la eliminación.
        confirmYes.addEventListener("click", function() {
            if (categoriesMain.includes(optionSelect)) {
                user.getCategories().deleteCategoryMain(optionSelect);
            } else {
                user.getCategories().deleteCategory(optionSelect, user.getId());
            }
            setTimeout(() => {
                location.reload();
            }, 1000);
        });

        // Lógica para cancelar la eliminación.
        confirmNo.addEventListener("click", function() {
            menuCategoryData(); // Restaura los botones de categoría.
        });
    });

    // Función para agregar o modificar una categoría.
    function inputCategory(e) {
        let textStatus = document.createElement("p");
        let saveButton = document.createElement("button");
        let cancelButton = document.createElement("button");
        let buttonBox = document.querySelector(".categoria__botones");
        let showCategory = document.getElementById("showCategory");
        let inputCategory = document.getElementById("inputCategory");
        let selectCategory = document.getElementById("categoria");

        if (e.target.textContent == "Añadir" || e.target.textContent == "Modificar") {
            if (e.target.textContent == "Modificar") {
                statusUpdate = true;
                textOption = selectCategory.options[selectCategory.selectedIndex].textContent;
                inputCategory.querySelector("input").value = textOption;
            } else {
                statusUpdate = false;
                inputCategory.querySelector("input").value = "";
            }

            document.getElementById("addCategory").style.display = "none";
            document.querySelector(".categorias__edit").style.display = "none";

            showCategory.style.display = "none";
            inputCategory.style.display = "unset";

            saveButton.textContent = "Guardar";
            cancelButton.textContent = "Cancelar";

            saveButton.className = "guardar";
            cancelButton.className = "cancelar";

            buttonBox.appendChild(saveButton);
            buttonBox.appendChild(cancelButton);
        }

        // Guardar una nueva categoría o modificar una existente.
        if (e.target.textContent == "Guardar") {
            let value = inputCategory.querySelector("input").value;

            if (value != "") {
                let category = value[0].toUpperCase() + value.substring(1); // Formato para el nombre de la categoría.

                let status = user.getCategories().validateCategory(category); // Valida si la categoría ya existe.

                if (!status) {
                    if (statusUpdate) {
                        user.getCategories().updateCategory(optionSelect, category, user.getId()); // Actualiza la categoría.
                        Category.saveDataSession();
                        setTimeout(() => {
                            location.reload(); // Recarga la página para actualizar los datos.
                        }, 1000);
                    } else {
                        user.getCategories().addCategory(category, user.getId()); // Añade una nueva categoría.
                    }

                    user.getCategories().updateListUser(user.getId());
                    user.getCategories().printCategories(categoria);

                    textStatus.textContent = `Categoría: ${category} ha sido añadida`;
                    showCategory.prepend(textStatus);
                    menuUserData();

                } else {
                    textStatus.textContent = "Esta categoría ya se encuentra registrada";
                    inputCategory.prepend(textStatus);
                }
            } else {
                textStatus.textContent = "Completa el campo para añadir una categoría";
                inputCategory.prepend(textStatus);
            }

            // Limpia los mensajes de estado después de unos segundos.
            setTimeout(() => {
                if (inputCategory.querySelector("p")) {
                    inputCategory.querySelector("p").remove();
                }

                if (showCategory.querySelector("p")) {
                    showCategory.querySelector("p").remove();
                }
            }, 2000);
        }

        if (e.target.textContent == "Cancelar") {
            menuUserData(); // Restaura el menú de usuario.
        }
    }

    // Función para restaurar el menú de usuario después de añadir o modificar una categoría.
    function menuUserData() {
        document.getElementById("showCategory").style.display = "unset";
        document.getElementById("inputCategory").style.display = "none";
        document.getElementById("addCategory").style.display = "unset";
        document.querySelector(".categorias__edit").style.display = "unset";
        document.querySelector(".categoria__botones").querySelector(".guardar").remove();
        document.querySelector(".categoria__botones").querySelector(".cancelar").remove();
    }

    // Función para restaurar el menú de categorías después de eliminar una categoría.
    function menuCategoryData() {
        user.getCategories().updateListUser(user.getId());
        document.getElementById("showCategory").querySelector("p").remove();
        document.getElementById("showCategory").querySelector("#confirmYes").remove();
        document.getElementById("showCategory").querySelector("#confirmNo").remove();
        document.getElementById("updateCategory").style.display = "unset";
        document.getElementById("deleteCategory").style.display = "unset";
    }

    // Función para mostrar los datos del usuario en pantalla.
    function userData() {
        document.getElementById("name").textContent = user.getName();
        document.getElementById("email").textContent = user.getEmail();
        document.getElementById("password").textContent = "*******";
    }
});
