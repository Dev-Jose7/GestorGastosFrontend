import User from "../controllers/account/User.js";
import { completeInput, confirmPassword, initSession } from "../../assets/js/util.js";
import Transaccion from "../controllers/operation/Transaccion.js";

User.loadDataSession();
Transaccion.loadDataSession();

const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputPasswordConfirm = document.getElementById("passwordConfirm");
const statusRegister = document.getElementById("statusRegister");

const inputs = document.querySelectorAll("input[id]");

document.querySelector("input[type = 'submit']").addEventListener("click", function(e){
    e.preventDefault();
    let statusInput = completeInput(inputs);
    let statusPassword = confirmPassword(inputPassword.value, inputPasswordConfirm.value);

    if(statusInput && statusPassword){
        statusRegister.textContent = "Registro completado" 
        let user = new User(inputName.value, inputEmail.value, inputPassword.value);
        initSession(user)
    } else if(!statusInput){
        statusRegister.textContent = "Complete los campos señalados"
    } else if(!statusPassword){
        statusRegister.textContent = "Las contraseñas no coinciden"
    }

    setTimeout(() => {
        statusRegister.textContent = ""
    }, 3000);
});