// frontend/js/services/api.js
// Reemplaza la línea "const BASE_URL = ..." por esto:
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
// Aquí pondrás la URL que te dé Render en el Paso 3
const PRODUCTION_URL = 'https://proyecto-e-commerce-1.onrender.com/api';

const BASE_URL = isLocal ? 'http://localhost:3000/api' : PRODUCTION_URL;

// 2. Creamos el objeto global API que contendrá todos nuestros métodos
const API = {

    // Método auxiliar privado para generar los headers (incluyendo el Token)
    _getHeaders: function() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        // Si el usuario ya se logueó, adjuntamos su llave de acceso
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },

    // Método genérico para procesar las respuestas y errores del servidor
    _handleResponse: async function(response) {
        if (!response.ok) {
            let errorMessage = 'Error en el servidor';
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                // Si falla el parseo del error
            }
            
            // Si el token expiró o es inválido
            if (response.status === 401 || response.status === 403) {
                this.logout("Tu sesión ha expirado o no tienes permisos. Por favor, inicia sesión nuevamente.");
            }
            
            throw new Error(errorMessage);
        }
        
        // CORRECCIÓN 1: Prevención de error al recibir respuestas vacías (ej. 204 No Content)
        if (response.status === 204) {
            return null;
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {};
    },

    // ==========================================
    // MÉTODOS PÚBLICOS PARA USAR EN TUS ARCHIVOS JS
    // ==========================================

    get: async function(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'GET',
                headers: this._getHeaders()
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error(`[API GET Error] en ${endpoint}:`, error);
            throw error;
        }
    },

    post: async function(endpoint, data) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: this._getHeaders(),
                body: JSON.stringify(data) 
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error(`[API POST Error] en ${endpoint}:`, error);
            throw error;
        }
    },

    put: async function(endpoint, data) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'PUT',
                headers: this._getHeaders(),
                body: JSON.stringify(data)
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error(`[API PUT Error] en ${endpoint}:`, error);
            throw error;
        }
    },

    // CORRECCIÓN 2: Método DELETE agregado para operaciones CRUD completas
    delete: async function(endpoint) {
        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'DELETE',
                headers: this._getHeaders()
            });
            return await this._handleResponse(response);
        } catch (error) {
            console.error(`[API DELETE Error] en ${endpoint}:`, error);
            throw error;
        }
    },

    // CORRECCIÓN 3: Helper para cerrar sesión de manera limpia
    logout: function(mensaje = "Has cerrado sesión exitosamente.") {
        localStorage.removeItem('token');
        localStorage.removeItem('shoppingCart'); // Limpiamos también el carrito por seguridad
        alert(mensaje);
        window.location.href = "login.html";
    }
};