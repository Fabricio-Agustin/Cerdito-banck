const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if(!currentUser){
    window.location.href =
    "../login/Login.html";
}

const users = JSON.parse(
    localStorage.getItem("users")
) || [];

validateCurrentUser();

function validateCurrentUser() {

    const userExists = users.find(
        user => user.id === currentUser.id
    );

    if(!userExists){

        destroySession();

        return;
    }

    validateUserStructure(userExists);

    validateSessionTime();

    refreshUserData(userExists);
}

function validateUserStructure(user){

    const requiredFields = [
        "id",
        "nombre",
        "apellido",
        "usuario",
        "correo",
        "cvu",
        "saldo"
    ];

    const invalidField =
        requiredFields.some(
            field => !user[field]
        );

    if(invalidField){

        destroySession();
    }
}

function validateSessionTime(){

    const loginTime =
        localStorage.getItem(
            "loginTime"
        );

    if(!loginTime){
        return;
    }

    const now = Date.now();

    const sessionDuration =
        1000 * 60 * 60 * 24;

    const expired =
        now - Number(loginTime)
        > sessionDuration;

    if(expired){

        alert(
            "La sesión ha expirado"
        );

        destroySession();
    }
}

function refreshUserData(user){

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );
}

function destroySession(){

    localStorage.removeItem(
        "currentUser"
    );

    localStorage.removeItem(
        "loginTime"
    );

    window.location.href =
        "../login/Login.html";
}

export function logout(){

    destroySession();
}

export function getCurrentUser(){

    return JSON.parse(
        localStorage.getItem(
            "currentUser"
        )
    );
}

export function isAuthenticated(){

    return !!localStorage.getItem(
        "currentUser"
    );
}