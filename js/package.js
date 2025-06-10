document.addEventListener('DOMContentLoaded', function () {
    // Show modal and set prices when "Book Now" is clicked
    document.querySelectorAll('.package-book-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            // Set prices in modal
            document.getElementById('package-price-student').textContent = btn.getAttribute('data-price-student');
            document.getElementById('package-price-citizen').textContent = btn.getAttribute('data-price-citizen');
            document.getElementById('package-price-foreign').textContent = btn.getAttribute('data-price-foreign');
            document.getElementById('selectedPackagePrice').textContent = btn.getAttribute('data-price-student');
            // Store data for later
            document.getElementById('confirmPackageType').dataset.image = btn.getAttribute('data-image');
            document.getElementById('confirmPackageType').dataset.id = btn.getAttribute('data-id');
            document.getElementById('confirmPackageType').dataset.name = btn.getAttribute('data-name');
            document.getElementById('confirmPackageType').dataset.priceStudent = btn.getAttribute('data-price-student');
            document.getElementById('confirmPackageType').dataset.priceCitizen = btn.getAttribute('data-price-citizen');
            document.getElementById('confirmPackageType').dataset.priceForeign = btn.getAttribute('data-price-foreign');
            // Show modal
            var modal = new bootstrap.Modal(document.getElementById('packageTypeModal'));
            modal.show();
        });
    });

    // Update selected price in modal
    document.querySelectorAll('input[name="packageType"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            let price = '';
            if (this.value === 'student') price = document.getElementById('package-price-student').textContent;
            if (this.value === 'citizen') price = document.getElementById('package-price-citizen').textContent;
            if (this.value === 'foreign') price = document.getElementById('package-price-foreign').textContent;
            document.getElementById('selectedPackagePrice').textContent = price;
        });
    });

    // Add package to main cart
    document.getElementById('confirmPackageType').addEventListener('click', function () {
        const type = document.querySelector('input[name="packageType"]:checked').value;
        let price = '';
        if (type === 'student') price = this.dataset.priceStudent;
        if (type === 'citizen') price = this.dataset.priceCitizen;
        if (type === 'foreign') price = this.dataset.priceForeign;

        // Prepare cart item (reuse your add-to-cart logic)
        const cartEvent = new CustomEvent('add-to-cart', {
            detail: {
                image: this.dataset.image,
                id: this.dataset.id + '-' + type,
                name: this.dataset.name + ' (' + type.charAt(0).toUpperCase() + type.slice(1) + ')',
                price: price
            }
        });
        window.dispatchEvent(cartEvent);

        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('packageTypeModal')).hide();
    });
});