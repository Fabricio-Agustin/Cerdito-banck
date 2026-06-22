import { getUsers, saveUsers } from "./storage.js";

const form = document.querySelector("form");

const MAX_ATTEMPTS = 5;

form.addEventListener("submit", handleLogin);

function handleLogin(event) {

    event.preventDefault();

    const usuario = getInputValue("usuario")
        .toLowerCase();

    const password = getInputValue("password");

    if (!usuario || !password) {

        alert("Completa todos los campos");
        return;
    }

    if (isBlocked()) {

        alert(
            "Demasiados intentos. Intenta más tarde."
        );

        return;
    }

    const users = getUsers();

    const user = users.find(
        user =>
            user.usuario === usuario &&
            user.password === password
    );

    if (!user) {

        increaseAttempts();

        alert(
            "Usuario o contraseña incorrectos"
        );

        return;
    }

    resetAttempts();

    updateLastLogin(user, users);

    createSession(user);

    alert(
        `Bienvenido ${user.nombre}`
    );

    window.location.href =
        "../dashboard/Dashboard.html";
}

function getInputValue(id) {

    return document
        .getElementById(id)
        .value
        .trim();
}

function createSession(user) {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    localStorage.setItem(
        "loginTime",
        Date.now()
    );
}

function updateLastLogin(user, users) {

    const index = users.findIndex(
        current => current.id === user.id
    );

    if (index === -1) return;

    users[index].lastLogin =
        new Date().toISOString();

    saveUsers(users);
}

function increaseAttempts() {

    const attempts =
        Number(
            localStorage.getItem(
                "loginAttempts"
            )
        ) || 0;

    localStorage.setItem(
        "loginAttempts",
        attempts + 1
    );
}

function resetAttempts() {

    localStorage.removeItem(
        "loginAttempts"
    );
}

function isBlocked() {

    const attempts =
        Number(
            localStorage.getItem(
                "loginAttempts"
            )
        ) || 0;

    return attempts >= MAX_ATTEMPTS;
}