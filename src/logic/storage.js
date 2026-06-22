const STORAGE_KEY = "cerditoBankUsers";

export const getUsers = () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export const saveUsers = (users) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};