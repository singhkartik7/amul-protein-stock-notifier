// ========================================
// Elements
// ========================================

const loginForm =
    document.getElementById("loginForm");

const emailInput =
    document.getElementById("email");

const passwordInput =
    document.getElementById("password");

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
        loginForm.querySelector("button");

    if (isLoading) {

        button.disabled = true;

        button.textContent = "Signing In...";

    }

    else {

        button.disabled = false;

        button.textContent = "Login";

    }

}
// ========================================
// Login
// ========================================

loginForm.addEventListener(

    "submit",

    async (e) => {

        e.preventDefault();

        hideError();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (!email || !password) {

            showError(

                "Please fill all fields."

            );

            return;

        }

        setLoading(true);

        try {

            const response =
                await fetch(

                    `${API_URL}/auth/login`,

                    {

                        method: "POST",

                        headers: {

                            "Content-Type":

                                "application/json"

                        },

                        body: JSON.stringify({

                            email,

                            password

                        })

                    }

                );

            const data =
                await response.json();

            if (!response.ok) {

                showError(

                    data.message

                );

                return;

            }
                        localStorage.setItem(

                STORAGE_KEYS.token,

                data.token

            );

            // These will work after we update the backend
            // to return fullName and email.

            if (data.email) {

                localStorage.setItem(

                    STORAGE_KEYS.email,

                    data.email

                );

            }

            if (data.fullName) {

                localStorage.setItem(

                    STORAGE_KEYS.fullName,

                    data.fullName

                );

            }

            window.location.href =

                "dashboard.html";

        }

        catch (err) {

            console.error(err);

            showError(

                "Unable to login. Please try again."

            );

        }

        finally {

            setLoading(false);

        }

    }

);

// ========================================
// Hide Error While Typing
// ========================================

emailInput.addEventListener(

    "input",

    hideError

);

passwordInput.addEventListener(

    "input",

    hideError

);