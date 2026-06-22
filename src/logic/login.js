import { getUsers } from "./storage.js";

const form = document.querySelector("form");

form.addEventListener("submit", (e) => {

    e.preventDefault();

    const usuario = document
        .getElementById("usuario")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value
        .trim();

    if (!usuario || !password) {
        alert("Completa todos los campos");
        return;
    }

    const users = getUsers();

    const user = users.find(
        user =>
            user.usuario === usuario &&
            user.password === password
    );

    if (!user) {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    alert(`Bienvenido ${user.nombre}`);

    window.location.href =
        "../dashboard/Dashboard.html";
});