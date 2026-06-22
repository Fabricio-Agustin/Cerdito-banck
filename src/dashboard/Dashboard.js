import { getUsers, saveUsers } from "../logic/storage.js";

const MOVEMENT_TYPES = {
    CREATED: "ALTA_CUENTA",
    RECEIVED: "TRANSFERENCIA_RECIBIDA",
    SENT: "TRANSFERENCIA_ENVIADA"
};

const currentUser = getCurrentUser();

if (!currentUser) {
    redirectToLogin();
}

const elements = {
    welcome: document.getElementById("welcomeMessage"),
    saldo: document.getElementById("saldo"),
    cvu: document.getElementById("cvu"),
    cbu: document.getElementById("cbu"),
    movimientos: document.getElementById("movimientos"),
    transferForm: document.getElementById("transferForm"),
    logoutBtn: document.getElementById("logoutBtn")
};

init();

function init() {
    loadDashboard();

    elements.transferForm.addEventListener(
        "submit",
        handleTransfer
    );

    elements.logoutBtn.addEventListener(
        "click",
        logout
    );
}

function loadDashboard() {

    const user = findCurrentUser();

    if (!user) {
        logout();
        return;
    }

    elements.welcome.textContent = `Hola, ${user.nombre}`;

    elements.saldo.textContent = formatMoney(user.saldo);

    elements.cvu.textContent = user.cvu;

    elements.cbu.textContent = user.cbu;

    renderMovements(user.movimientos);
}

function handleTransfer(event) {

    event.preventDefault();

    const cvuDestino =
        document
            .getElementById("cvuDestino")
            .value
            .trim();

    const monto = Number(
        document
            .getElementById("monto")
            .value
    );

    if (!isValidTransfer(cvuDestino, monto)) {
        alert("Datos inválidos");
        return;
    }

    const users = getUsers();

    const sender = users.find(
        user => user.id === currentUser.id
    );

    const receiver = users.find(
        user => user.cvu === cvuDestino
    );

    if (!receiver) {
        alert("CVU no encontrado");
        return;
    }

    if (receiver.id === sender.id) {
        alert("No puedes transferirte a ti mismo");
        return;
    }

    if (sender.saldo < monto) {
        alert("Saldo insuficiente");
        return;
    }

    executeTransfer(
        sender,
        receiver,
        monto
    );

    saveUsers(users);

    updateCurrentUser(sender);

    elements.transferForm.reset();

    alert(
        `Transferencia enviada a ${receiver.usuario}`
    );

    loadDashboard();
}

function executeTransfer(
    sender,
    receiver,
    amount
) {

    sender.saldo -= amount;
    receiver.saldo += amount;

    sender.movimientos.unshift({
        tipo: MOVEMENT_TYPES.SENT,
        detalle: `Transferencia a ${receiver.usuario}`,
        monto: amount,
        fecha: getCurrentDate()
    });

    receiver.movimientos.unshift({
        tipo: MOVEMENT_TYPES.RECEIVED,
        detalle: `Transferencia de ${sender.usuario}`,
        monto: amount,
        fecha: getCurrentDate()
    });
}

function renderMovements(movements) {

    elements.movimientos.innerHTML = "";

    if (!movements.length) {

        elements.movimientos.innerHTML = `
            <li class="empty-movement">
                No hay movimientos registrados
            </li>
        `;

        return;
    }

    movements.forEach(movement => {

        const isIncome = movement.tipo === MOVEMENT_TYPES.RECEIVED ||
        movement.tipo === MOVEMENT_TYPES.CREATED;

        const li = document.createElement("li");

        li.classList.add("movement-item");

        li.innerHTML = `
            <div>
                <strong>${movement.detalle}</strong>
                <small>${movement.fecha}</small>
            </div>

            <span class="${
                isIncome
                    ? "ingreso"
                    : "egreso"
            }">
                ${isIncome ? "+" : "-"}
                ${formatMoney(movement.monto)}
            </span>
        `;

        elements.movimientos.appendChild(li);
    });
}

function findCurrentUser() {

    return getUsers().find(
        user => user.id === currentUser.id
    );
}

function getCurrentUser() {

    return JSON.parse(
        localStorage.getItem("currentUser")
    );
}

function updateCurrentUser(user) {

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );
}

function isValidTransfer(
    cvu,
    amount
) {

    return (
        cvu.length > 0 &&
        amount > 0 &&
        !Number.isNaN(amount)
    );
}

function formatMoney(amount) {

    return new Intl.NumberFormat(
        "es-AR",
        {
            style: "currency",
            currency: "ARS"
        }
    ).format(amount);
}

function getCurrentDate() {

    return new Date()
        .toLocaleString("es-AR");
}

function logout() {

    localStorage.removeItem(
        "currentUser"
    );

    redirectToLogin();
}

function redirectToLogin() {

    window.location.href =
        "../login/Login.html";
}