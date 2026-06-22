import {
    getUsers,
    saveUsers
} from "../logic/storage.js";

const currentUser =
    JSON.parse(
        localStorage.getItem("currentUser")
    );

if (!currentUser) {

    window.location.href =
        "../login/Login.html";
}

const welcomeMessage =
    document.getElementById(
        "welcomeMessage"
    );

const saldo =
    document.getElementById(
        "saldo"
    );

const cvu =
    document.getElementById(
        "cvu"
    );

const usersList =
    document.getElementById(
        "usersList"
    );

const movimientos =
    document.getElementById(
        "movimientos"
    );

const userSelect =
    document.getElementById(
        "userSelect"
    );

init();

function init() {

    loadDashboard();

    document
        .getElementById("showTransfer")
        .addEventListener(
            "click",
            () => showSection(
                "transferSection"
            )
        );

    document
        .getElementById("showUsers")
        .addEventListener(
            "click",
            () => {
                showSection(
                    "usersSection"
                );

                renderUsers();
            }
        );

    document
        .getElementById("showMovements")
        .addEventListener(
            "click",
            () => {
                showSection(
                    "movementsSection"
                );

                renderMovements();
            }
        );

    document
        .getElementById("transferForm")
        .addEventListener(
            "submit",
            transferMoney
        );

    document
        .getElementById("logoutBtn")
        .addEventListener(
            "click",
            logout
        );
}

function loadDashboard() {

    const user =
        getCurrentUserData();

    welcomeMessage.textContent =
        `Hola ${user.nombre}`;

    saldo.textContent =
        formatMoney(
            user.saldo
        );

    cvu.textContent =
        user.cvu;

    loadUserOptions();
}

function loadUserOptions() {

    const users =
        getUsers();

    const current =
        getCurrentUserData();

    userSelect.innerHTML =
        `<option value="">
            Seleccionar usuario
        </option>`;

    users
        .filter(
            user =>
                user.id !== current.id
        )
        .forEach(user => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                user.cvu;

            option.textContent =
                `${user.usuario}`;

            userSelect.appendChild(
                option
            );
        });
}

function transferMoney(event) {

    event.preventDefault();

    const destination =
        userSelect.value;

    const amount =
        Number(
            document
                .getElementById("monto")
                .value
        );

    if (
        !destination ||
        amount <= 0
    ) {
        return;
    }

    const users =
        getUsers();

    const sender =
        users.find(
            user =>
                user.id ===
                currentUser.id
        );

    const receiver =
        users.find(
            user =>
                user.cvu ===
                destination
        );

    if (!receiver) {

        alert(
            "Usuario no encontrado"
        );

        return;
    }

    if (
        sender.saldo < amount
    ) {

        alert(
            "Saldo insuficiente"
        );

        return;
    }

    sender.saldo -= amount;

    receiver.saldo += amount;

    sender.movimientos.unshift({
        tipo:"EGRESO",
        detalle:
            `Transferencia a ${receiver.usuario}`,
        monto:amount,
        fecha:new Date()
            .toLocaleString()
    });

    receiver.movimientos.unshift({
        tipo:"INGRESO",
        detalle:
            `Transferencia de ${sender.usuario}`,
        monto:amount,
        fecha:new Date()
            .toLocaleString()
    });

    saveUsers(users);

    localStorage.setItem(
        "currentUser",
        JSON.stringify(sender)
    );

    loadDashboard();

    renderMovements();

    event.target.reset();

    alert(
        "Transferencia realizada"
    );
}

function renderUsers() {

    usersList.innerHTML = "";

    getUsers()
        .filter(
            user =>
                user.id !==
                currentUser.id
        )
        .forEach(user => {

            const li =
                document.createElement(
                    "li"
                );

            li.textContent =
                `${user.nombre} ${user.apellido}`;

            usersList.appendChild(
                li
            );
        });
}

function renderMovements() {

    movimientos.innerHTML = "";

    const user =
        getCurrentUserData();

    user.movimientos.forEach(
        movement => {

            const li =
                document.createElement(
                    "li"
                );

            const ingreso =
                movement.tipo ===
                "INGRESO";

            li.innerHTML = `
                <span>
                    ${movement.detalle}
                </span>

                <span class="${
                    ingreso
                    ? "ingreso"
                    : "egreso"
                }">
                    ${
                        ingreso
                        ? "+"
                        : "-"
                    }
                    ${formatMoney(
                        movement.monto
                    )}
                </span>
            `;

            movimientos.appendChild(
                li
            );
        }
    );
}

function showSection(id) {

    document
        .querySelectorAll(".panel")
        .forEach(section =>
            section.classList.add(
                "hidden"
            )
        );

    document
        .getElementById(id)
        .classList.remove(
            "hidden"
        );
}

function getCurrentUserData() {

    return getUsers().find(
        user =>
            user.id ===
            currentUser.id
    );
}

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style:"currency",
            currency:"ARS"
        }
    ).format(amount);
}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
        "../login/Login.html";
}