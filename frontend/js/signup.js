// ========================================
// Elements
// ========================================

const signupForm =
    document.getElementById("signupForm");

const fullNameInput =
    document.getElementById("fullName");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const errorMessage =
    document.getElementById("errorMessage");

// ========================================
// Helpers
// ========================================

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.classList.remove("hidden");

}

function hideError() {

    errorMessage.textContent = "";

    errorMessage.classList.add("hidden");

}

function setLoading(isLoading) {

    const button =
        signupForm.querySelector("button");

    if (isLoading) {

        button.disabled = true;

        button.textContent = "Creating Account...";

    }

    else {

        button.disabled = false;

        button.textContent = "Create Account";

    }

}
// ========================================
// Signup
// ========================================

signupForm.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        hideError();

        const fullName =
            fullNameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;

        if (

            !fullName ||

            !email ||

            !password ||

            !confirmPassword

        ) {

            showError(

                "Please fill all fields."

            );

            return;

        }

        if (

            fullName.length < 2

        ) {

            showError(

                "Please enter your full name."

            );

            return;

        }

        const emailRegex =

            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (

            !emailRegex.test(email)

        ) {

            showError(

                "Please enter a valid email."

            );

            return;

        }

        if (

            password.length < 6

        ) {

            showError(

                "Password must be at least 6 characters."

            );

            return;

        }

        if (

            password !== confirmPassword

        ) {

            showError(

                "Passwords do not match."

            );

            return;

        }

        setLoading(true);

        try {
                      const response =

                await fetch(

                    `${API_URL}/auth/signup`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":

                                "application/json"

                        },

                        body: JSON.stringify({

                            fullName,

                            email,

                            password

                        })

                    }

                );

            const data =

                await response.json();

            if (!response.ok) {

                showError(

                    data.message ||

                    "Signup failed."

                );

                return;

            }

            localStorage.setItem(

                STORAGE_KEYS.email,

                email

            );

            localStorage.setItem(

                STORAGE_KEYS.fullName,

                fullName

            );

            alert(

                "🎉 Account created successfully!"

            );

            window.location.href =

                "login.html";

        }

        catch (err) {

            console.error(err);

            showError(

                "Unable to create your account."

            );

        }

        finally {

            setLoading(false);

        }

    }

);
// ========================================
// Live Validation
// ========================================

fullNameInput.addEventListener(

    "input",

    hideError

);

emailInput.addEventListener(

    "input",

    hideError

);

passwordInput.addEventListener(

    "input",

    hideError

);

confirmPasswordInput.addEventListener(

    "input",

    hideError

);

// ========================================
// Enter Key Support
// ========================================

document.addEventListener(

    "keydown",

    (e) => {

        if (

            e.key === "Enter"

        ) {

            hideError();

        }

    }

);