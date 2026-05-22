document.addEventListener('DOMContentLoaded', () => {
    
    // Botón de la barra de navegación
    const btnLogIn = document.getElementById("btnLogIn");
    if(btnLogIn) {
        btnLogIn.addEventListener("click", () => {
            window.location.href = "login.html";
        });
    }

    // Botón principal del Hero
    const btnSignUp = document.getElementById("btnSignUp");
    if(btnSignUp) {
        btnSignUp.addEventListener("click", () => {
            window.location.href = "signup.html";
        });
    }

});