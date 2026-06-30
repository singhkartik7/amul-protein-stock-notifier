const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    if (!username || !password) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await fetch(

            `${API_URL}/auth/login`,

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username,

                    password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            alert(data.message);

            return;

        }

        localStorage.setItem(

            "username",

            username

        );

        localStorage.setItem(

            "token",

            data.token

        );

        alert(data.message);

        window.location.href = "dashboard.html";

    }

    catch (err) {

        console.error(err);

        alert("Unable to login.");

    }

});