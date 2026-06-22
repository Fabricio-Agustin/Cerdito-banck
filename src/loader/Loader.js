window.addEventListener("load", () => {

    checkSession();
    checkStorageIntegrity();

    const loader =
        document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.classList.add(
            "loader-hidden"
        );

        setTimeout(() => {
            loader.remove();
        }, 500);

    }, 3000);

});

function checkSession() {

    const currentUser =
        localStorage.getItem(
            "currentUser"
        );

    if (
        window.location.pathname
            .includes("Dashboard") &&
        !currentUser
    ) {

        window.location.href =
            "../login/Login.html";
    }

}

function checkStorageIntegrity() {

    const users =
        JSON.parse(
            localStorage.getItem("users")
        ) || [];

    const corrupted =
        users.some(user =>
            !user.id ||
            !user.usuario ||
            !user.cvu
        );

    if (corrupted) {

        console.warn(
            "Datos corruptos detectados"
        );

    }

}