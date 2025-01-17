// Function to show error message
function showError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('error-message')) {
        error = document.createElement('div');
        error.className = 'error-message';
        input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = message;
}

// Function to clear error message
function clearError(input) {
    const error = input.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
        error.remove();
    }
}

// Validate form
function validateForm(event) {
    event.preventDefault();
    const form = event.target;
    let isValid = true;

    // Check required fields
    const requiredFields = form.querySelectorAll('input[required]');
    requiredFields.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
            showError(input, 'This field is required.');
        } else {
            input.classList.remove('error');
            clearError(input);
        }
    });

    // Check email field (optional)
    const emailField = form.querySelector('input[name="email"]');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i; // Case-insensitive regex
    if (emailField) {
        if (emailField.value.trim() && !emailPattern.test(emailField.value.trim())) {
            isValid = false;
            emailField.classList.add('error');
            showError(emailField, 'Please enter a valid email address.');
        } else {
            emailField.classList.remove('error');
            clearError(emailField);
        }
    }

    // Check phone number field
    const phoneField = form.querySelector('input[name="phone"]');
    const phonePattern = /^[0-9]{10}$/; // Exactly 10 digits
    if (phoneField && !phonePattern.test(phoneField.value.trim())) {
        isValid = false;
        phoneField.classList.add('error');
        showError(phoneField, 'Please enter a valid 10-digit phone number.');
    } else {
        phoneField.classList.remove('error');
        clearError(phoneField);
    }

    // Check WhatsApp number field
    const whatsappField = form.querySelector('input[name="whatsapp"]');
    if (whatsappField && !phonePattern.test(whatsappField.value.trim())) {
        isValid = false;
        whatsappField.classList.add('error');
        showError(whatsappField, 'Please enter a valid 10-digit WhatsApp number.');
    } else {
        whatsappField.classList.remove('error');
        clearError(whatsappField);
    }

    if (isValid) {
        form.submit();
    }
}

// Attach validateForm function to form submit event
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    if (form) {
        form.addEventListener('submit', validateForm);
    }

    // Disable alphabets in phone and WhatsApp number fields
    const phoneField = form.querySelector('input[name="phone"]');
    const whatsappField = form.querySelector('input[name="whatsapp"]');

    const disableAlphabets = (event) => {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    };

    if (phoneField) {
        phoneField.addEventListener('input', disableAlphabets);
    }

    if (whatsappField) {
        whatsappField.addEventListener('input', disableAlphabets);
    }
});