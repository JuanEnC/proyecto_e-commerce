document.addEventListener('DOMContentLoaded', () => {
    const summaryContainer = document.getElementById('summaryItems');
    const subtotalEl = document.getElementById('subtotal');
    const grandTotalEl = document.getElementById('grandTotal');
    const checkoutForm = document.getElementById('checkoutForm');

    const cartData = JSON.parse(localStorage.getItem('shoppingCart')) || [];

    if (cartData.length === 0) {
        alert("No hay productos en el carrito.");
        window.location.href = "catalog.html";
        return;
    }

    let total = 0;
    cartData.forEach(item => {
        const itemPrice = parseFloat(item.price);
        total += itemPrice;

        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `
            <span>${item.name}</span>
            <span>$${itemPrice.toFixed(2)}</span>
        `;
        summaryContainer.appendChild(div);
    });

    subtotalEl.innerText = `$${total.toFixed(2)}`;
    grandTotalEl.innerText = `$${total.toFixed(2)}`;

    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!localStorage.getItem('token')) {
            alert("Tu sesión ha expirado.");
            window.location.href = "login.html";
            return;
        }

        const orderPayload = {
            address: document.getElementById('address').value,
            paymentMethod: document.querySelector('input[name="payment"]:checked').value,
            total: total,
            items: cartData.map(item => ({
                idProduct: item.idProduct,
                quantity: 1, 
                priceEach: parseFloat(item.price)
            }))
        };

        // --- CORRECCIÓN: Uso de api.js ---
        try {
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Procesando pago...";
            submitBtn.disabled = true;

            // Llamada real para crear la orden
            await API.post('/orders', orderPayload);

            alert("¡Pedido realizado con éxito! Gracias por tu compra.");
            localStorage.removeItem('shoppingCart');
            window.location.href = "orders.html";

        } catch (error) {
            alert(`Hubo un error al procesar tu pedido: ${error.message}`);
            const submitBtn = checkoutForm.querySelector('button[type="submit"]');
            submitBtn.innerText = "Confirmar y Pagar";
            submitBtn.disabled = false;
        }
    });
});