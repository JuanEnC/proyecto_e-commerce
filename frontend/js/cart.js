// frontend/js/cart.js

// 1. Inicializamos el carrito leyendo el localStorage al instante
let cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];

// 2. Función principal para agregar (será llamada desde catalog.js)
function addProductToCart(product) {
    if (product.stock <= 0) {
        alert("Lo sentimos, este producto está agotado.");
        return;
    }

    cart.push(product);
    saveCartState();

    // Animación: Abrir el sidebar automáticamente
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

// 3. Función para eliminar productos del carrito
function removeProductFromCart(index) {
    cart.splice(index, 1);
    saveCartState();
}

// 4. Guardar en memoria y actualizar UI
function saveCartState() {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    renderCartUI();
}

// 5. Renderizar el Sidebar del carrito
function renderCartUI() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (!cartItemsContainer) return; // Por si estamos en una página sin sidebar

    cartCount.innerText = cart.length;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Tu carrito está vacío</p>';
        cartTotal.innerText = '$0.00';
        return;
    }

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const price = parseFloat(item.price);
        total += price;
        
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div style="flex:1">
                <h4>${item.name}</h4>
                <span>$${price.toFixed(2)}</span>
            </div>
            <button class="btn-remove-item" data-index="${index}" style="background:none; border:none; color:#ff4d4d; cursor:pointer">
                <i class="fa fa-trash"></i>
            </button>
        `;
        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = `$${total.toFixed(2)}`;
}

// 6. Configurar Eventos de la Interfaz del Carrito
document.addEventListener('DOMContentLoaded', () => {
    // Renderizamos el estado inicial guardado en memoria
    renderCartUI();

    const cartSidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    const openCartBtn = document.getElementById('openCart');
    const closeCartBtn = document.getElementById('closeCart');
    const btnCheckout = document.getElementById('btnCheckout');

    // Manejar apertura/cierre
    const toggleCart = () => {
        if(cartSidebar && overlay) {
            cartSidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        }
    };

    if(openCartBtn) openCartBtn.addEventListener('click', toggleCart);
    if(closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if(overlay) overlay.addEventListener('click', toggleCart);

    // Delegación de eventos para los botones de eliminar dentro del carrito
    const cartItemsContainer = document.getElementById('cartItems');
    if(cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-remove-item');
            if (btn) {
                const index = parseInt(btn.getAttribute('data-index'));
                removeProductFromCart(index);
            }
        });
    }

    // Redirección al Checkout (ahora vive aquí porque es lógica de compra)
    if (btnCheckout) {
        btnCheckout.addEventListener('click', () => {
            if (cart.length === 0) {
                alert("Tu carrito está vacío. Agrega algunos productos primero.");
                return;
            }
            // Ya está guardado en localStorage por la función saveCartState()
            window.location.href = "checkout.html";
        });
    }
});