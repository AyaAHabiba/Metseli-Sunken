document.addEventListener('DOMContentLoaded', function () {
    // Initialize cart and load it
    initializeCart();
    loadCart();

    // Event delegation for cart actions
    document.addEventListener('click', function (e) {
        const addToCartBtn = e.target.closest('.add-to-cart');
        const removeItemBtn = e.target.closest('.remove-item');
        const clearCartBtn = e.target.closest('.clear-cart');

        if (addToCartBtn) {
            e.preventDefault();
            handleAddToCart(e);
        }

        if (removeItemBtn) {
            e.preventDefault();
            handleRemoveFromCart(e);
        }

        if (clearCartBtn) {
            e.preventDefault();
            resetCart();
        }
    });
    

    // Refresh cart when modal is shown
    document.getElementById('bagModal')?.addEventListener('show.bs.modal', function () {
        updateCartDisplay();
    });

    // Booking form handler for modal
    const bookingForm = document.querySelector('#itemModal .contact-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Collect form values
            const name = bookingForm.querySelector('[name="name"]')?.value?.trim() || '';
            const email = bookingForm.querySelector('[name="email"]')?.value?.trim() || '';
            const telephone = bookingForm.querySelector('[name="telephone"]')?.value?.trim() || '';
            const address = bookingForm.querySelector('[name="address"]')?.value?.trim() || '';
            const message = bookingForm.querySelector('[name="message"]')?.value?.trim() || '';

            // Save booking info separately (not in cart)
            localStorage.setItem('bookingInfo', JSON.stringify({
                name, email, telephone, address, message
            }));

            // Properly close the modal using Bootstrap's API
            const modalEl = document.getElementById('itemModal');
            if (modalEl) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) {
                    modalInstance.hide();
                }
            }

            // Reset the form
            bookingForm.reset();

            // Update cart display to show booking info
            updateCartDisplay();
        });
    }

        // Prevent opening checkout modal if cart is empty
    const openCheckoutBtn = document.getElementById('openCheckoutModal');
    if (openCheckoutBtn) {
    openCheckoutBtn.addEventListener('click', function (e) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        // Exclude the generic event booking from count
        const filtered = cart.filter(item => !(item.name === 'Event Booking' && parseFloat(item.price) === 0));
        if (filtered.length === 0) {
            e.preventDefault();
            e.stopImmediatePropagation(); // <-- Add this line
            alert("Your bag is empty. Please select items before checking out."); // Show alert
            showToast("Your bag is empty. Please select items before checking out.", "danger");
            // Re-open or keep the bag modal open
            const bagModalEl = document.getElementById('bagModal');
            if (bagModalEl) {
                const bagModal = bootstrap.Modal.getOrCreateInstance(bagModalEl);
                bagModal.show();
            }
            return false;
        }
        // If not empty, open the modal
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });
}
});

// Patch updateCartItems to show booking details

function updateCartItems() {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

     cartItemsContainer.innerHTML = '';

      // --- Show booking info at the top ---
    const bookingInfo = JSON.parse(localStorage.getItem('bookingInfo') || 'null');
if (bookingInfo && bookingInfo.name && bookingInfo.email && bookingInfo.telephone && bookingInfo.address) {
    cartItemsContainer.innerHTML += `
        <div class="cart-booking-info mb-3 p-2 border-bottom" style="color: antiquewhite;">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>Booking Info:</strong>
                <button class="btn btn-sm btn-outline-primary edit-booking-btn" style="border:none; background: transparent;">
                    <ion-icon name="create-outline"></ion-icon> Edit 
                </button>
                
            </div>
            <div id="booking-info-display">
                <div><strong>Name:</strong> ${escapeHtml(bookingInfo.name)}</div>
                <div><strong>Email:</strong> ${escapeHtml(bookingInfo.email)}</div>
                <div><strong>Telephone:</strong> ${escapeHtml(bookingInfo.telephone)}</div>
                <div><strong>Address:</strong> ${escapeHtml(bookingInfo.address)}</div>
                <div><strong>Message:</strong> ${escapeHtml(bookingInfo.message)}</div>
            </div>
            <form id="booking-info-edit" style="display: none;">
                <div class="mb-2">
                    <input type="text" class="form-control form-control-sm" name="edit-name" 
                           value="${escapeHtml(bookingInfo.name)}" placeholder="Name">
                </div>
                <div class="mb-2">
                    <input type="email" class="form-control form-control-sm" name="edit-email" 
                           value="${escapeHtml(bookingInfo.email)}" placeholder="Email">
                </div>
                <div class="mb-2">
                    <input type="text" class="form-control form-control-sm" name="edit-telephone" 
                           value="${escapeHtml(bookingInfo.telephone)}" placeholder="Telephone">
                </div>
                <div class="mb-2">
                    <input type="text" class="form-control form-control-sm" name="edit-address" 
                           value="${escapeHtml(bookingInfo.address)}" placeholder="Address">
                </div>
                <div class="mb-2">
                    <textarea class="form-control form-control-sm" name="edit-message" 
                              placeholder="Message">${escapeHtml(bookingInfo.message)}</textarea>
                </div>
                <div class="d-flex justify-content-end gap-2 mt-2">
                    <button type="button" class="btn btn-sm btn-outline-secondary cancel-edit-booking">Cancel</button>
                    <button type="submit" class="btn btn-sm btn-primary save-edit-booking" style="background-color:darkblue;border:none;">Save</button>
                </div>
            </form>
        </div>
    `;
}

    // Filter out the generic event booking (name exactly "Event Booking" and price 0)
    const filteredCart = cart.filter(item => !(item.name === 'Event Booking' && parseFloat(item.price) === 0));

    if (filteredCart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-3">
                Your bag is empty. Start shopping!
            </div>
        `;
        return;
    }

    filteredCart.forEach((item) => {
        if (!item || typeof item !== 'object' || !item.name || item.price === undefined) {
            console.warn('Invalid cart item skipped:', item);
            return;
        }

        const imageUrl = item.image || '';
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item d-flex justify-content-between align-items-center py-2 border-bottom';

        // If it's a booking, show ONLY the details (no price, no controls)
        if (item.type === 'booking' && item.bookingDetails) {
            itemElement.innerHTML = `
                <div>
                    <div class="cart-item-name">${escapeHtml(item.name)}</div>
                    <div class="small ms-2" style="color: antiquewhite;">
                        <div><strong>Name:</strong> ${escapeHtml(item.bookingDetails.name)}</div>
                        <div><strong>Email:</strong> ${escapeHtml(item.bookingDetails.email)}</div>
                        <div><strong>Telephone:</strong> ${escapeHtml(item.bookingDetails.telephone)}</div>
                        <div><strong>Address:</strong> ${escapeHtml(item.bookingDetails.address)}</div>
                        <div><strong>Message:</strong> ${escapeHtml(item.bookingDetails.message)}</div>
                    </div>
                </div>
            `;
        } else {
            // Normal cart item (show price, controls)
            itemElement.innerHTML = `
                <div class="d-flex align-items-center">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${escapeHtml(item.name)}" class="cart-item-image me-3" style="width: 60px; height: 60px; object-fit: cover;">` : ''}
                    <div>
                        <div class="cart-item-name">${escapeHtml(item.name)}</div>
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <div class="quantity-controls d-flex align-items-center me-3">
                        <button class="btn btn-sm btn-outline-secondary decrease-quantity" data-id="${item.id}">-</button>
                        <span class="mx-2 quantity-display">${item.quantity || 1}</span>
                        <button class="btn btn-sm btn-outline-secondary increase-quantity" data-id="${item.id}">+</button>
                    </div>
                    <div class="cart-item-price me-3">$${safeToFixed((item.price * (item.quantity || 1)))}</div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                        <ion-icon name="trash-outline"></ion-icon>
                    </button>
                </div>
            `;
        }

        cartItemsContainer.appendChild(itemElement);
    });

    // Add event listeners for the new quantity buttons (only for non-booking items)
    document.querySelectorAll('.increase-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            updateQuantity(id, 1);
        });
    });

    document.querySelectorAll('.decrease-quantity').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            updateQuantity(id, -1);
        });
    });
}

// Initialize or clean the cart data
function initializeCart() {
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    } else {
        cleanCartData();
    }
}

// Thoroughly clean cart data
function cleanCartData() {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cleanedCart = cart
            .filter(item => {
                // Validate item structure
                if (!item || typeof item !== 'object' || Array.isArray(item)) {
                    return false;
                }

                const hasValidName = 'name' in item && typeof item.name === 'string';
                const hasValidPrice = 'price' in item &&
                    (typeof item.price === 'number' ||
                        (typeof item.price === 'string' && !isNaN(parseFloat(item.price))));

                return hasValidName && hasValidPrice;
            })
            .map(item => ({
                // Normalize items
                name: String(item.name),
                price: parseFloat(item.price) || 0
            }));

        if (cleanedCart.length !== cart.length) {
            localStorage.setItem('cart', JSON.stringify(cleanedCart));
        }
        return cleanedCart;
    } catch (error) {
        console.error("Error cleaning cart data:", error);
        localStorage.setItem('cart', JSON.stringify([]));
        return [];
    }
}

// Handle add to cart button clicks
function handleAddToCart(e) {
    const button = e.target.closest('.add-to-cart');
    if (!button) return;

    const name = button.getAttribute('data-name') || 'Unnamed Item';
    const price = parseFloat(button.getAttribute('data-price')) || 0;
    const id = button.getAttribute('data-id') || Date.now().toString();

    addToCart({ name, price, id });
}

// Handle remove item button clicks
function handleRemoveFromCart(e) {
    const button = e.target.closest('.remove-item');
    if (!button) return;

    const id = button.getAttribute('data-id');
    if (!id) return;

    removeFromCart(id);
}

// Add item to cart
function addToCart(item) {
    try {
        if (!item || typeof item !== 'object') {
            throw new Error('Invalid item');
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItemIndex = cart.findIndex(cartItem =>
            cartItem.id === item.id ||  // Match by ID if available
            (cartItem.name === item.name && cartItem.price === item.price) // Or match by name+price
        );

        if (existingItemIndex >= 0) {
            // Item already exists - show message but don't add again
            showToast(`${item.name} is already in your cart`);
            return;
        }

        const newItem = {
            name: String(item.name || 'Unnamed Item'),
            price: parseFloat(item.price) || 0,
            id: item.id || Date.now().toString(),
            quantity: 1 // Initialize quantity
        };

        // If booking details/type exist, add them
        if (item.bookingDetails) newItem.bookingDetails = item.bookingDetails;
        if (item.type) newItem.type = item.type;

        cart.push(newItem);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
        showToast(`Added ${newItem.name} to cart!`);
    } catch (error) {
        console.error("Error adding to cart:", error);
        showToast("Failed to add item to cart", 'danger');
    }
}

// Remove item from cart by ID
function removeFromCart(id) {
    try {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const index = cart.findIndex(item => item.id === id);

        if (index >= 0) {
            const removedItem = cart.splice(index, 1)[0];
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            showToast(`Removed ${removedItem.name} from cart`);
        }
    } catch (error) {
        console.error("Error removing from cart:", error);
        showToast("Failed to remove item", 'danger');
    }
}

// Completely reset the cart
function resetCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartDisplay();
    showToast("Cart has been cleared");
}

// Update the entire cart display
function updateCartDisplay() {
    updateCartItems();
    updateCartTotal();
    updateCartCount();
}

// Update cart total
function updateCartTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Exclude booking items and the generic event booking from total
    const filteredCart = cart.filter(item =>
        !(item.type === 'booking') &&
        !(item.name === 'Event Booking' && parseFloat(item.price) === 0)
    );
    const total = filteredCart.reduce((sum, item) => {
        if (!item || typeof item !== 'object') return sum;
        const price = parseFloat(item.price);
        const quantity = parseInt(item.quantity) || 1;
        return sum + (isNaN(price) ? 0 : (price * quantity));
    }, 0);

    const totalElement = document.getElementById('cart-total');
    if (totalElement) {
        totalElement.textContent = `$${safeToFixed(total)}`;
    }
}
// Update cart count badge
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    // Exclude the generic event booking from count
    const filtered = cart.filter(item => !(item.name === 'Event Booking' && parseFloat(item.price) === 0));
    const countElement = document.querySelector('.bag .number');
    if (countElement) {
        countElement.textContent = filtered.length;
    }
}

// Function to update item quantity
function updateQuantity(id, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex >= 0) {
        // Initialize quantity if it doesn't exist
        if (!cart[itemIndex].quantity) {
            cart[itemIndex].quantity = 1;
        }
        
        // Update quantity with change
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity reaches 0 or below
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
            showToast("Item removed from cart");
        } else {
            showToast(`Quantity updated to ${cart[itemIndex].quantity}`);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

// Helper function to safely format numbers
function safeToFixed(value) {
    const num = typeof value === 'number' ? value : parseFloat(value) || 0;
    return num.toFixed(2);
}

// Helper to escape HTML (prevent XSS)
function escapeHtml(unsafe) {
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Show toast notifications
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');

    toast.className = `toast show align-items-center text-white bg-${type} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove toast after delay
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
    return container;
}

// Initialize cart on load
function loadCart() {
    updateCartDisplay();
}

// Initialize Bootstrap Modal if available
if (typeof bootstrap !== 'undefined') {
    const bagModal = new bootstrap.Modal(document.getElementById('bagModal'));
}

// ...existing code...

// --- Place this at the end of app.js ---

function handleCheckoutSuccess() {
    // 1. Clear stored data
    localStorage.removeItem('bookingInfo');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Keep event booking if present (with price 0)
    const updatedCart = cart.filter(item => item.name === 'Event Booking' && parseFloat(item.price) === 0);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // 2. Update UI
    updateCartDisplay();
    showToast("Thank you for your payment! Your booking is confirmed.", "success");

    // 3. Reset form
    const bookingForm = document.querySelector('#itemModal .contact-form');
    if (bookingForm) bookingForm.reset();

    // 4. Close modals
    const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (checkoutModal) checkoutModal.hide();

    const bagModal = bootstrap.Modal.getInstance(document.getElementById('bagModal'));
    if (bagModal) bagModal.hide();

    // 5. Redirect handling (GitHub Pages compatible)
    setTimeout(() => {
        const basePath = window.location.host.includes('github.io') 
            ? `/${window.location.pathname.split('/')[1]}/` 
            : '/';
        
        // Option 1: Redirect to home with success hash
        window.location.href = `${basePath}#payment-success`;
        
        // Option 2: Or use this if you have a dedicated success page:
        // window.location.href = `${basePath}success.html`;
    }, 1500); // Short delay for UX
}

// Helper function to initialize checkout button (prevent duplicates)
function initCheckoutButton() {
    const openCheckoutBtn = document.getElementById('openCheckoutModal');
    if (!openCheckoutBtn) return;

    // Remove existing listeners to prevent duplicates
    openCheckoutBtn.replaceWith(openCheckoutBtn.cloneNode(true));
    const newBtn = document.getElementById('openCheckoutModal');

    newBtn.addEventListener('click', function(e) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const filtered = cart.filter(item => !(item.name === 'Event Booking' && parseFloat(item.price) === 0));
        
        if (filtered.length === 0) {
            e.preventDefault();
            showToast("Your bag is empty. Please add items before checkout.", "danger");
            
            const bagModalEl = document.getElementById('bagModal');
            if (bagModalEl) {
                bootstrap.Modal.getOrCreateInstance(bagModalEl).show();
            }
            return;
        }
        
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });
}

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initCheckoutButton();
    
    // If returning from payment with success hash
    if (window.location.hash === '#payment-success') {
        showToast("Payment successful! Thank you for your booking.", "success");
    }
});

document.getElementById('payCashBtn')?.addEventListener('click', function() {
    // ...your payment logic here...
    handleCheckoutSuccess();
});

document.getElementById('payCreditBtn')?.addEventListener('click', function() {
    // ...your payment logic here...
    handleCheckoutSuccess();
});



document.addEventListener('click', function(e) {
    // Handle edit booking info button
    if (e.target.classList.contains('edit-booking-btn')) {
        e.preventDefault();
        const container = e.target.closest('.cart-booking-info');
        container.querySelector('#booking-info-display').style.display = 'none';
        container.querySelector('#booking-info-edit').style.display = 'block';
    }
    
    // Handle cancel edit button
    if (e.target.classList.contains('cancel-edit-booking')) {
        e.preventDefault();
        const container = e.target.closest('.cart-booking-info');
        container.querySelector('#booking-info-display').style.display = 'block';
        container.querySelector('#booking-info-edit').style.display = 'none';
    }
    
    // Handle save edit button
    if (e.target.classList.contains('save-edit-booking')) {
        e.preventDefault();
        const form = e.target.closest('form');
        const updatedInfo = {
            name: form.querySelector('[name="edit-name"]').value.trim(),
            email: form.querySelector('[name="edit-email"]').value.trim(),
            telephone: form.querySelector('[name="edit-telephone"]').value.trim(),
            address: form.querySelector('[name="edit-address"]').value.trim(),
            message: form.querySelector('[name="edit-message"]').value.trim()
        };
        
        // Validate the inputs
        if (!updatedInfo.name || !updatedInfo.email || !updatedInfo.telephone || !updatedInfo.address) {
            showToast("Please fill in all required fields", "danger");
            return;
        }
        
        // Save the updated info
        localStorage.setItem('bookingInfo', JSON.stringify(updatedInfo));
        showToast("Booking information updated successfully");
        
        // Refresh the cart display
        updateCartDisplay();
    }
});
