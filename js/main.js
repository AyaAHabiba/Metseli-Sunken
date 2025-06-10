newFunction();

function newFunction() {
    document.addEventListener('DOMContentLoaded', () => {
        console.log("Script loaded successfully!");

        // Section navigation logic
        const navBtns = document.querySelectorAll('.nav-btn');
        const banner = document.querySelector('.banner');
        const sections = document.querySelectorAll('section');

        navBtns.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                console.log(`Clicked on: ${targetId}`);

                // Hide all sections
                sections.forEach(section => {
                    section.style.display = 'none';
                    section.style.left = '-100%';
                });

                if (targetId === 'home') {
                    banner.style.display = 'flex';
                } else {
                    banner.style.display = 'none';
                    const targetSection = document.getElementById(targetId);
                    if (targetSection) {
                        targetSection.style.display = 'block';
                        setTimeout(() => {
                            targetSection.style.left = '0';
                        }, 10);
                    }
                }

                // Update active buttons
                navBtns.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Close mobile nav
                document.querySelector('.menu').classList.remove('active');
                document.querySelector('.nav-mobile').classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Mobile menu toggle
        const menuBtn = document.querySelector('.menu');
        const navMobile = document.querySelector('.nav-mobile');

        if (menuBtn) {
            menuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                menuBtn.classList.toggle('active');
                navMobile.classList.toggle('active');
                document.body.classList.toggle('no-scroll');
                console.log('Mobile nav toggled');
            });
        }

        // Intercept all add-to-cart/book-now/package-book-btn clicks
        function requireBookingFormBeforeOrder(selector) {
            document.querySelectorAll(selector).forEach(btn => {
                btn.addEventListener('click', function(e) {
                    if (!bookingFormCompleted) {
                        e.preventDefault();
                        // Show the booking modal
                        const itemModal = new bootstrap.Modal(document.getElementById('itemModal'));
                        itemModal.show();
                        alert('Please fill the booking form before ordering.');
                    }
                });
            });
        }

        // Apply to all relevant buttons
        requireBookingFormBeforeOrder('.add-to-cart');
        requireBookingFormBeforeOrder('.package-book-btn');
        requireBookingFormBeforeOrder('.content-btn.add-to-cart');
    });
}

// Helper to check if the booking form is filled
function isBookingFormFilled() {
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const telephone = document.getElementById('telephone')?.value.trim();
    const address = document.querySelector('textarea[name="address"]')?.value.trim();
    return name && email && telephone && address;
}

// Store if the user has filled the form
let bookingFormCompleted = false;

// Function to get booking info HTML for cart display
function getBookingInfoHtml() {
    if (!bookingFormCompleted) return '';
    const name = document.getElementById('name')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const telephone = document.getElementById('telephone')?.value || '';
    const address = document.querySelector('textarea[name="address"]')?.value || '';
    return `
        <div class="cart-booking-info" style="border-bottom:1px solid #eee; margin-bottom:10px; padding-bottom:10px;">
            <strong>Booking Info:</strong><br>
            Name: ${name}<br>
            Email: ${email}<br>
            Telephone: ${telephone}<br>
            Address: ${address}
        </div>
    `;
}

// Initialize cart
let cart = [];

// Function to add item to cart
function addToCart(item) {
    cart.push(item);
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// Function to update cart count display (only real items)
function updateCartCount() {
    const countElement = document.querySelector('.cart-count');
    if (countElement) {
        countElement.textContent = cart.length;
    }
}

// Render cart with booking info at the top

function renderCart() {
    const cartContainer = document.getElementById('cart-items'); // <-- use getElementById
    if (!cartContainer) return;
    let html = getBookingInfoHtml();
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <span>${item.name}</span> - <span>${item.price}</span>
            </div>
        `;
    });
    cartContainer.innerHTML = html;
    updateCartCount();
}

// Listen for booking form submit
document.querySelector('.contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    if (isBookingFormFilled()) {
        bookingFormCompleted = true;
        const itemModal = bootstrap.Modal.getOrCreateInstance(document.getElementById('itemModal'));
        itemModal.hide();
        alert('Thank you! You can now order.');
        renderCart();
    } else {
        alert('Please fill all required fields.');
    }
});

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function () {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
        updateCartCount();
    }
    renderCart();

    // Add click handlers to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function () {
            if (!bookingFormCompleted) return; // Extra safety
            const item = {
                id: this.dataset.id,
                name: this.dataset.name,
                price: this.dataset.price
            };
            addToCart(item);
        });
    });
});

// Listen for add-to-cart events from anywhere (events, shop, package)
window.addEventListener('add-to-cart', function(e) {
    if (!bookingFormCompleted) return;
    addToCart(e.detail); // This should be your function that adds items to the main cart
});



// --- Review Modal Logic ---
// Load reviews from localStorage or use default
let reviews = JSON.parse(localStorage.getItem('reviews')) || [
    { name: "Sarah", text: "Amazing place! Highly recommended.", rating: 5 },
    { name: "Ahmed", text: "Unique experience under the sea.", rating: 4 }
];

function saveReviews() {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

function renderReviews() {
    const reviewsList = document.getElementById('reviews-list');
    if (!reviewsList) return;
    if (!reviews.length) {
        reviewsList.innerHTML = '<p class="text-muted">No reviews yet.</p>';
        return;
    }
    reviewsList.innerHTML = reviews.map(r =>
        `<div style="margin-bottom:8px;">
            <strong>${r.name}</strong>
            <span style="color: gold;">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
            <div>${r.text}</div>
        </div>`
    ).join('');
}

document.addEventListener('DOMContentLoaded', function () {
    // Floating review icon click handler
    const openReviewBtn = document.getElementById('openReviewModal');
    if (openReviewBtn) {
        openReviewBtn.addEventListener('click', function() {
            renderReviews();
            const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
            modal.show();
        });
    }

    // Review form submit handler
    const addReviewForm = document.getElementById('addReviewForm');
    if (addReviewForm) {
        addReviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('reviewerName').value.trim();
            const text = document.getElementById('reviewText').value.trim();
            const rating = parseInt(document.getElementById('reviewRating').value, 10);
            if (name && text && rating) {
                reviews.unshift({ name, text, rating });
                saveReviews(); // Save to localStorage
                renderReviews();
                this.reset();
            }
        });
    }
});
