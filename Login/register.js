document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        const phoneField = document.getElementById("phone");
        const passwordField = document.getElementById("password");
        const confirmPasswordField = document.getElementById("confirm-password");
        const phoneError = document.getElementById("phone-error");
        const passwordError = document.getElementById("password-error");
        const confirmPasswordError = document.getElementById("confirm-password-error");

        // Live check for password match
        confirmPasswordField.addEventListener("input", function () {
            if (passwordField.value !== confirmPasswordField.value) {
                confirmPasswordError.textContent = "Passwords do not match!";
                confirmPasswordError.style.color = "red";
            } else {
                confirmPasswordError.textContent = "";
            }
        });

        registerForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const phone = phoneField.value.trim();
            const password = passwordField.value;
            const confirmPassword = confirmPasswordField.value;

            let valid = true;

            // Validate Phone Number (Must be exactly 10 digits)
            if (!/^\d{10}$/.test(phone)) {
                phoneError.textContent = "Phone number must be exactly 10 digits.";
                phoneError.style.color = "red";
                valid = false;
            } else {
                phoneError.textContent = "";
            }

            // Validate Password Strength
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordRegex.test(password)) {
                passwordError.textContent = "Password must have at least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 special char.";
                passwordError.style.color = "red";
                valid = false;
            } else {
                passwordError.textContent = "";
            }

            // Check if Passwords Match
            if (password !== confirmPassword) {
                confirmPasswordError.textContent = "Passwords do not match!";
                confirmPasswordError.style.color = "red";
                valid = false;
            } else {
                confirmPasswordError.textContent = "";
            }

            if (valid) {
                alert("Registration Successful!");
                registerForm.submit(); // Only submits if all checks pass
            }
        });
    }
});
