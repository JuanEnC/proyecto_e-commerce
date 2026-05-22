document.addEventListener('DOMContentLoaded', () => {

    const signupForm = document.getElementById("signupForm");
    
    if (signupForm) {
        // Añadimos 'async' aquí para poder usar 'await' con nuestra API
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (password !== confirmPassword) {
                alert("Las contraseñas no coinciden. Por favor, verifica.");
                return; 
            }

            if (password.length < 8) {
                alert("La contraseña debe tener al menos 8 caracteres.");
                return;
            }

            const payload = {
                username: username,
                email: email,
                password: password 
            };

            // --- CORRECCIÓN: Uso de api.js ---
            try {
                // Bloqueamos el botón o mostramos estado de carga (opcional pero recomendado)
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                submitBtn.innerText = "Registrando...";
                submitBtn.disabled = true;

                // Llamada real al backend
                await API.post('/auth/register', payload); // Ajusta la ruta según tu backend
                
                alert(`¡Excelente! Cuenta creada para ${username}. Por favor, inicia sesión.`);
                signupForm.reset();
                
                // Redirigimos al login tras el registro exitoso
                window.location.href = "login.html";

            } catch (error) {
                alert(`Error al registrar: ${error.message}`);
                const submitBtn = signupForm.querySelector('button[type="submit"]');
                submitBtn.innerText = "Registrarse";
                submitBtn.disabled = false;
            }
        });
    }
});