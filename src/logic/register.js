import { getUsers, saveUsers } from "./storage.js";

const INITIAL_BALANCE = 10000;

const form = document.querySelector("form");

form.addEventListener("submit", handleRegister);

function handleRegister(event) {

    event.preventDefault();

    const formData = getFormData();

    if (!isValidForm(formData)) {
        alert("Completa todos los campos");
        return;
    }

    const users = getUsers();

    if (userAlreadyExists(users, formData)) {
        alert("El usuario o correo ya existe");
        return;
    }

    const newUser = createUser(formData, users);

    users.push(newUser);

    saveUsers(users);

    localStorage.setItem(
        "currentUser",
        JSON.stringify(newUser)
    );

    alert(`Bienvenido ${newUser.nombre}`);

    window.location.href =
        "../dashboard/Dashboard.html";
}

function getFormData() {

    return {
        nombre: document
            .getElementById("nombre")
            .value
            .trim(),

        apellido: document
            .getElementById("apellido")
            .value
            .trim(),

        usuario: document
            .getElementById("usuario")
            .value
            .trim()
            .toLowerCase(),

        correo: document
            .getElementById("correo")
            .value
            .trim()
            .toLowerCase(),

        password: document
            .getElementById("password")
            .value
            .trim()
    };
}

function isValidForm(formData) {

    return Object.values(formData)
        .every(value => value.length > 0);
}

function userAlreadyExists(users, formData) {

    return users.some(
        user =>
            user.usuario === formData.usuario ||
            user.correo === formData.correo
    );
}

function createUser(formData, users) {

    return {
        id: crypto.randomUUID(),

        nombre: formData.nombre,
        apellido: formData.apellido,
        usuario: formData.usuario,
        correo: formData.correo,
        password: formData.password,

        cvu: generateCVU(users),
        cbu: generateCBU(users),

        saldo: INITIAL_BALANCE,

        movimientos: [
            createInitialMovement()
        ],

        createdAt: new Date().toISOString()
    };
}

function createInitialMovement() {

    return {
        tipo: "Alta de cuenta",
        detalle: "Saldo inicial acreditado",
        monto: INITIAL_BALANCE,
        fecha: new Date().toLocaleString()
    };
}

function generateCVU(users) {

    let cvu;

    do {

        cvu =
            "000" +
            Math.floor(
                1000000000000000000 +
                Math.random() * 9000000000000000000
            );

    } while (
        users.some(user => user.cvu === cvu)
    );

    return cvu;
}

function generateCBU(users) {

    let cbu;

    do {

        cbu = "";

        for (let i = 0; i < 22; i++) {

            cbu += Math.floor(
                Math.random() * 10
            );
        }

    } while (
        users.some(user => user.cbu === cbu)
    );

    return cbu;
}