const signupBtn = document.getElementById("signupBtn");

signupBtn.addEventListener("click", async () => {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (!username || !password || !confirmPassword) {
        alert("Please fill all fields.");
        return;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {

        const response = await fetch("http://localhost:3001/auth/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            setTimeout(function () {
                window.location.href = "login.html";
            }, 0);
        } else {
            alert(data.message || "Signup failed. Please try again.");
        }

    } catch (err) {
        console.log(err);
        alert(err.message);
    }

});