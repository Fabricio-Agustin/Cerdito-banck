window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if(!loader) return;
    setTimeout(() => {
        loader.classList.add("loader-hidden");
        setTimeout(() => {
            loader.remove();
        }, 500); 
    }, 3000);
});