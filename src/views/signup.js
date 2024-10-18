import User from "../controllers/account/User.js";
import { completeInput, confirmPassword, initSession } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";

// Carga los datos de usuario y transacciones almacenados en la sesión.
User.loadDataSession();
Transaccion.loadDataSession();

const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputPasswordConfirm = document.getElementById("passwordConfirm");
const statusRegister = document.getElementById("statusRegister");

const inputs = document.querySelectorAll("input[id]"); // Selecciona todos los inputs del formulario.

// Evento que ocurre al hacer clic en el botón de enviar (submit).
document.querySelector("input[type = 'submit']").addEventListener("click", function(e) {
    e.preventDefault(); // Evita la recarga de la página.

    let statusInput = completeInput(inputs); // Valida si todos los campos están completos.
    let statusPassword = confirmPassword(inputPassword.value, inputPasswordConfirm.value); // Valida si las contraseñas coinciden.

    if (statusInput && statusPassword) {
        statusRegister.textContent = "Registro completado"; // Mensaje de éxito.
        let user = new User(inputName.value, inputEmail.value, inputPassword.value); // Crea un nuevo usuario.
        initSession(user); // Inicia sesión con el nuevo usuario.
    } else if (!statusInput) {
        statusRegister.textContent = "Complete los campos señalados"; // Mensaje de error por campos vacíos.
    } else if (!statusPassword) {
        statusRegister.textContent = "Las contraseñas no coinciden"; // Mensaje de error por contraseñas diferentes.
    }

    // Limpia el mensaje de estado después de 3 segundos.
    setTimeout(() => {
        statusRegister.textContent = "";
    }, 3000);
});
