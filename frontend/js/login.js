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
            "http://localhost:3001/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })

            }
        );

        const data = await response.json();

        alert(data.message);

        if(response.ok){

    localStorage.setItem("username", username);

    window.location.href = "dashboard.html";

}

    }
    catch(err){

        alert(err.message);

    }

});