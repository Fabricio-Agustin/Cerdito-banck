const STORAGE_KEY = "cerditoBankUsers";

initializeStorage();

export function getUsers() {

    try {

        const data =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!data) {
            return [];
        }

        const users =
            JSON.parse(data);

        return Array.isArray(users)
            ? users
            : [];

    } catch (error) {

        console.error(
            "Error leyendo usuarios:",
            error
        );

        return [];
    }
}

export function saveUsers(users) {

    try {

        if (!Array.isArray(users)) {
            throw new Error(
                "Los usuarios deben ser un array"
            );
        }

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(users)
        );

        createBackup(users);

    } catch (error) {

        console.error(
            "Error guardando usuarios:",
            error
        );
    }
}

export function getUserById(id) {

    return getUsers().find(
        user => user.id === id
    );
}

export function getUserByCVU(cvu) {

    return getUsers().find(
        user => user.cvu === cvu
    );
}

export function updateUser(userId, updates) {

    const users = getUsers();

    const index = users.findIndex(
        user => user.id === userId
    );

    if (index === -1) {
        return false;
    }

    users[index] = {
        ...users[index],
        ...updates
    };

    saveUsers(users);

    return true;
}

export function deleteUser(userId) {

    const users = getUsers();

    const filteredUsers =
        users.filter(
            user => user.id !== userId
        );

    saveUsers(filteredUsers);
}

export function clearUsers() {

    localStorage.removeItem(
        STORAGE_KEY
    );
}

export function userExists(usuario, correo) {

    return getUsers().some(
        user =>
            user.usuario === usuario ||
            user.correo === correo
    );
}

function initializeStorage() {

    const storageExists =
        localStorage.getItem(
            STORAGE_KEY
        );

    if (!storageExists) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([])
        );
    }
}

function createBackup(users) {

    localStorage.setItem(
        `${STORAGE_KEY}_backup`,
        JSON.stringify(users)
    );
}