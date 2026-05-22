// frontend/js/catalog.js

let productsData = []; 

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');

    const renderProducts = (items) => {
        productGrid.innerHTML = '';
        
        if(items.length === 0) {
            productGrid.innerHTML = '<p style="color: white;">No se encontraron productos.</p>';
            return;
        }

        items.forEach(prod => {
            const card = document.createElement('div');
            card.className = 'product-card';
            const imageUrl = prod.image_url || "https://via.placeholder.com/300x200?text=Sin+Imagen";
            
            card.innerHTML = `
                <img src="${imageUrl}" class="product-img" alt="${prod.name}">
                <div class="product-info">
                    <h3>${prod.name}</h3>
                    <p>${prod.description || 'Sin descripción'}</p>
                    <small>Stock: ${prod.stock}</small>
                </div>
                <div class="product-price-row">
                    <span class="price">$${parseFloat(prod.price).toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm btn-add-cart" data-id="${prod.idProduct}">
                        <i class="fa fa-plus"></i>
                    </button>
                </div>
            `;
            productGrid.appendChild(card);
        });
    };

    // --- CORRECCIÓN: Uso de api.js ---
    const fetchProducts = async () => {
        try {
            productGrid.innerHTML = '<p style="color: white;">Cargando catálogo...</p>';
            
            // Verificación rápida para evitar la petición si no hay token
            if (!localStorage.getItem('token')) {
                alert("Sesión no válida.");
                window.location.href = "login.html";
                return;
            }

            // ¡Mira qué limpio queda esto!
            productsData = await API.get('/products');
            renderProducts(productsData);

        } catch (error) {
            console.error("Error:", error);
            productGrid.innerHTML = `<p style="color: #ff4d4d;">${error.message}</p>`;
        }
    };

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = productsData.filter(p => p.name.toLowerCase().includes(term));
            renderProducts(filtered);
        });
    }

    if (productGrid) {
        productGrid.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-add-cart');
            if (btn) {
                const productId = parseInt(btn.getAttribute('data-id'));
                const product = productsData.find(p => p.idProduct === productId);
                
                if (product) {
                    addProductToCart(product);
                }
            }
        });
    }

    fetchProducts();
});