// cart.js
document.addEventListener('DOMContentLoaded', function() {
    
    // When checkout button is clicked in bag modal
    document.getElementById('openCheckoutModal')?.addEventListener('click', function() {
        // Close bag modal and open checkout modal
        const bagModal = bootstrap.Modal.getInstance(document.getElementById('bagModal'));
        bagModal.hide();
        
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });

    // Show/hide credit card form based on payment method selection
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardForm = document.getElementById('creditCardForm');
    
    // Initialize - hide credit card form if not selected
    if (document.getElementById('creditCard')?.checked) {
        creditCardForm.style.display = 'block';
    } else {
        creditCardForm.style.display = 'none';
    }

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.id === 'creditCard') {
                creditCardForm.style.display = 'block';
            } else {
                creditCardForm.style.display = 'none';
            }
        });
    });
    
    // Handle confirm payment button with full validation
    document.getElementById('confirmPayment')?.addEventListener('click', function() {
        const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked').id;
        let isValid = true;

        // Clear previous error states
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });

        // Validate based on payment method
        if (selectedPayment === 'creditCard') {
            const cardNumber = document.getElementById('cardNumber');
            const expiryDate = document.getElementById('expiryDate');
            const cvv = document.getElementById('cvv');
            const cardName = document.getElementById('cardName');

            // Validate card number (16 digits, may have spaces)
            if (!cardNumber.value.trim() || !/^(\d{4}\s?){4}$/.test(cardNumber.value.trim())) {
                cardNumber.classList.add('is-invalid');
                isValid = false;
            }

            // Validate expiry date (MM/YY format)
            if (!expiryDate.value.trim() || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(expiryDate.value.trim())) {
                expiryDate.classList.add('is-invalid');
                isValid = false;
            }

            // Validate CVV (3 or 4 digits)
            if (!cvv.value.trim() || !/^\d{3,4}$/.test(cvv.value.trim())) {
                cvv.classList.add('is-invalid');
                isValid = false;
            }

            // Validate card name (not empty)
            if (!cardName.value.trim()) {
                cardName.classList.add('is-invalid');
                isValid = false;
            }
        }
        // Add validation for other payment methods if needed
        // else if (selectedPayment === 'paypal') { ... }

        if (!isValid) {
            // Scroll to first invalid field
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstInvalid.focus();
            }
            return;
        }

        // If all validations pass, process payment
        processPayment(selectedPayment);
    });

    // Payment processing function
    function processPayment(paymentMethod) {
        // Here you would typically send the data to your server
        // This is just a simulation
        console.log('Processing payment with:', paymentMethod);
        
        // Show success message
        alert('Payment processed successfully!');
        
        // Close checkout modal
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        checkoutModal.hide();
        
        // Clear the cart (implement your own clearCart function)
        clearCart();

        // Reset form for next use
        if (paymentMethod === 'creditCard') {
            document.getElementById('cardNumber').value = '';
            document.getElementById('expiryDate').value = '';
            document.getElementById('cvv').value = '';
            document.getElementById('cardName').value = '';
        }

        // Redirect to home page after a short delay (optional)
        setTimeout(function() {
            window.location.href = '/';
        }, 500);
    }

    // Dummy clearCart function (replace with your own logic)
    function clearCart() {
        // Example: remove cart items from localStorage or reset cart array
        if (window.localStorage) {
            localStorage.removeItem('cart');
        }
        // If you have a cart display, clear it here as well
        // document.getElementById('cartItems').innerHTML = '';
    }

    // Helper function to format card number as user types
    document.getElementById('cardNumber')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, ''); // Remove all spaces
        if (value.length > 16) value = value.substring(0, 16); // Limit to 16 digits
        
        // Add space after every 4 digits
        value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
        
        e.target.value = value;
    });

    // Helper function to format expiry date as user types
    document.getElementById('expiryDate')?.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 4) value = value.substring(0, 4); // Limit to 4 digits
        
        // Add slash after 2 digits (MM/YY)
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        
        e.target.value = value;
    });

    // Handle "Back to Bag" button in checkout modal
    document.querySelector('#checkoutModal .btn-secondary')?.addEventListener('click', function () {
        // Hide checkout modal
        const checkoutModal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        checkoutModal.hide();

        // Show bag modal
        const bagModal = new bootstrap.Modal(document.getElementById('bagModal'));
        bagModal.show();
    });

});