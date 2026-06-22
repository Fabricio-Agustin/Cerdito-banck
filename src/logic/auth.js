const currentUser = JSON.parse(
    localStorage.getItem("currentUser")
);

if(!currentUser){
    window.location.href =
    "../login/Login.html";
}