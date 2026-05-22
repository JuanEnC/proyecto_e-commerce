// frontend/js/login.js

document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById("loginForm");
    
    if (loginForm) {
        // Agregamos 'async' para interactuar con la API
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;

            if (!username || !password) {
                alert("Por favor, completa todos los campos.");
                return; 
            }

            const payload = {
                username: username,
                password: password
            };

            // --- CORRECCIÓN: Uso de api.js ---
            try {
                // Cambio visual mientras carga
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.innerText = "Iniciando sesión...";
                submitBtn.disabled = true;

                // Llamada real al endpoint de login
                const response = await API.post('/auth/login', payload);
                
                // Guardamos el token devuelto por el servidor de forma segura
                localStorage.setItem('token', response.token);
                
                // Redirigimos al usuario al catálogo
                window.location.href = "catalog.html";

            } catch (error) {
                // Si las credenciales son incorrectas, mostramos el error
                alert(`Error al iniciar sesión: ${error.message}`);
                
                // Restauramos el botón
                const submitBtn = loginForm.querySelector('button[type="submit"]');
                submitBtn.innerText = "Iniciar Sesión";
                submitBtn.disabled = false;
            }
        });
    }

});