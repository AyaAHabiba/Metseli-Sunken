document.addEventListener('DOMContentLoaded', function () {
    let currentEventData = null;

    // Intercept "Book Now" in Events section
    document.querySelectorAll('.events .add-to-cart').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // Save event data for later use
            currentEventData = {
                image: btn.getAttribute('data-image'),
                id: btn.getAttribute('data-id'),
                name: btn.getAttribute('data-name'),
                priceStudent: btn.getAttribute('data-price-student'),
                priceCitizen: btn.getAttribute('data-price-citizen'),
                priceForeign: btn.getAttribute('data-price-foreign')
            };
            // Set modal prices
            document.getElementById('price-student').textContent = currentEventData.priceStudent;
            document.getElementById('price-citizen').textContent = currentEventData.priceCitizen;
            document.getElementById('price-foreign').textContent = currentEventData.priceForeign;
            // Set default selected price
            document.getElementById('selectedEventPrice').textContent = currentEventData.priceStudent;
            document.getElementById('eventTypeStudent').checked = true;
            // Show modal
            const eventTypeModal = new bootstrap.Modal(document.getElementById('eventTypeModal'));
            eventTypeModal.show();
        });
    });

    // Update price display when selection changes
    document.querySelectorAll('input[name="eventType"]').forEach(radio => {
        radio.addEventListener('change', function () {
            if (!currentEventData) return;
            let price = currentEventData['price' + this.value.charAt(0).toUpperCase() + this.value.slice(1)];
            document.getElementById('selectedEventPrice').textContent = price;
        });
    });

    // Handle confirm button in modal
    document.getElementById('confirmEventType')?.addEventListener('click', function () {
        if (!currentEventData) return;
        const selectedType = document.querySelector('input[name="eventType"]:checked').value;
        let price = currentEventData['price' + selectedType.charAt(0).toUpperCase() + selectedType.slice(1)];
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        let itemId = currentEventData.id + '-' + selectedType;
        let existingIndex = cart.findIndex(item => item.id === itemId);

        if (existingIndex >= 0) {
            // Already in cart, show message and do not add again
            alert('This ticket type is already in your bag. Use the + button to add more.');
        } else {
            // Add new item with quantity 1
            cart.push({
                image: currentEventData.image,
                id: itemId,
                name: currentEventData.name + ' (' + selectedType.charAt(0).toUpperCase() + selectedType.slice(1) + ')',
                price: price,
                quantity: 1
            });
            localStorage.setItem('cart', JSON.stringify(cart));
            alert('Added ' + currentEventData.name + ' (' + selectedType.charAt(0).toUpperCase() + selectedType.slice(1) + ') to bag for $' + price);
            // Optionally update cart UI here
            if (typeof updateCartDisplay === 'function') updateCartDisplay();
        }

        // Hide modal
        const eventTypeModal = bootstrap.Modal.getInstance(document.getElementById('eventTypeModal'));
        eventTypeModal.hide();
    });
});