import User from "../controllers/account/User.js";
import { completeInput, initSession, instanceTest } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";

// Carga los datos de usuario y transacciones almacenados en la sesión.
User.loadDataSession();
Transaccion.loadDataSession();

const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputs = document.querySelectorAll("input[id]"); // Selecciona todos los inputs del formulario.
const statusLogin = document.getElementById("statusLogin");

// Imprime todos los usuarios registrados en la consola.
User.printUserData();

// Evento que ocurre al hacer clic en el botón de enviar (submit).
document.querySelector("input[type = 'submit']").addEventListener("click", function(e) {
    e.preventDefault(); // Evita la recarga de la página.

    let status = completeInput(inputs); // Valida si todos los campos están completos.

    if (status) {
        let account = User.validateUser(inputEmail.value, inputPassword.value); // Valida si el usuario existe.
        console.log(account);
        let session = initSession(account); // Inicia la sesión si el usuario es válido.

        if (session) {
            statusLogin.textContent = "Acceso autorizado"; // Mensaje de éxito.
        } else {
            statusLogin.textContent = "Credenciales incorrectas"; // Mensaje de error.
        }
    } else {
        statusLogin.textContent = "Complete los campos faltantes"; // Mensaje de advertencia.
    }

    // Limpia el mensaje de estado después de 3 segundos.
    setTimeout(() => {
        statusLogin.textContent = "";
    }, 3000);
});
