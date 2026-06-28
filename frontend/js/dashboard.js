const username = localStorage.getItem("username");

document.getElementById("welcome").textContent =
`Welcome, ${username} 👋`;

let selectedProducts = [];

// Fetch products from backend

async function loadProducts(){

    try{

        const response =
            await fetch("http://localhost:3001/products");

        const products =
            await response.json();

        const container =
            document.getElementById("productsContainer");

        container.innerHTML = "";

        products.forEach(product=>{

            const card = document.createElement("div");

card.className = "productItem";

const checked =
    selectedProducts.includes(product.name);

if (checked) {

    card.classList.add("selected");

}

card.innerHTML = `

    <input
        type="checkbox"
        ${checked ? "checked" : ""}>

    <span>${product.name}</span>

`;

card.addEventListener("click", () => {

    const checkbox =
        card.querySelector("input");

    if (selectedProducts.includes(product.name)) {

        selectedProducts =
            selectedProducts.filter(
                p => p !== product.name
            );

        checkbox.checked = false;

        card.classList.remove("selected");

    }
    else {

        selectedProducts.push(product.name);

        checkbox.checked = true;

        card.classList.add("selected");

    }

});
            container.appendChild(card);
        });
            const search =
    document.getElementById("searchProduct");

search.oninput = () => {

    const value =
        search.value.toLowerCase();

    document
        .querySelectorAll(".productItem")
        .forEach(card => {

            const text =
                card.innerText.toLowerCase();

            card.style.display =
                text.includes(value)
                    ? "flex"
                    : "none";

        });

};

      

    }
    catch(err){

        alert("Cannot load products.");

        console.log(err);

    }

}
async function loadPreferences() {

    const response = await fetch(
        `http://localhost:3001/preferences/${username}`
    );

    const data = await response.json();

    if (!data) return;

    document.getElementById("pincode").value =
        data.pincode;

    selectedProducts = data.products;
    if (data.chatId) {

    document.getElementById(
        "telegramStatus"
    ).textContent =
        "🟢 Connected";

    document.getElementById(
        "telegramBtn"
    ).textContent =
        "Reconnect Telegram";

}
else {

    document.getElementById(
        "telegramStatus"
    ).textContent =
        "🔴 Not Connected";

}
const notificationStatus =
    document.getElementById(
        "notificationStatus"
    );

if (!data.notifyUntil) {

    notificationStatus.innerHTML =

        "🔴 Notifications Stopped";

}
else {

    const expiry =
        new Date(data.notifyUntil);

    const now =
        new Date();

    if (expiry <= now) {

        notificationStatus.innerHTML =

            "🟡 Notifications Expired";

    }
    else {

        const remainingDays =
            Math.ceil(

                (expiry - now) /

                (1000 * 60 * 60 * 24)

            );

        notificationStatus.innerHTML = `

🟢 <strong>Notifications Active</strong>

<br><br>

📅 Expires on:

${expiry.toLocaleDateString(

    "en-IN",

    {

        day: "numeric",

        month: "long",

        year: "numeric"

    }

)}

<br><br>

⏳ ${remainingDays} day${remainingDays > 1 ? "s" : ""} remaining

`;

    }

}

}
async function initialize() {

    await loadPreferences();

    await loadProducts();

}

initialize();


function showToast(message){

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

document
.getElementById("saveBtn")
.addEventListener("click", async () => {

    const pincode =
        document.getElementById("pincode").value;

    if (pincode.length !== 6) {

        showToast("❌ Enter a valid 6-digit pincode");

        return;

    }

    if (selectedProducts.length === 0) {

        showToast("❌ Select at least one product");

        return;

    }

    const saveBtn =
        document.getElementById("saveBtn");

    saveBtn.disabled = true;

    saveBtn.textContent = "Saving...";

    try {

        const response = await fetch(
            "http://localhost:3001/preferences",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    pincode,
                    selectedProducts
                })
            }
        );

        if (!response.ok) {

            throw new Error("Failed to save.");

        }

        showToast("✅ Preferences Saved");

    }
    catch (err) {

        console.log(err);

        showToast("❌ Failed to save");

    }
    finally {

        saveBtn.disabled = false;

        saveBtn.textContent = "Save Preferences";

    }

});
document
.getElementById("activateNotificationBtn")
.addEventListener("click", async () => {

    const pincode =
        document.getElementById("pincode").value;

    if (pincode.length !== 6) {

        showToast("❌ Save your pincode first");

        return;

    }

    if (selectedProducts.length === 0) {

        showToast("❌ Select at least one product");

        return;

    }

    const days = Number(

        document.getElementById(

            "notifyDays"

        ).value

    );

    try {

        const response = await fetch(

            "http://localhost:3001/preferences/notifications/start",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username,

                    days

                })

            }

        );

        if (!response.ok) {

            throw new Error();

        }

        showToast(
    "🟢 Notifications Activated"
);

await loadPreferences();

    }

    catch (err) {

        console.log(err);

        showToast(

            "❌ Failed to activate notifications"

        );

    }

});

document
.getElementById("stopNotificationBtn")
.addEventListener("click", async () => {

    try {

        const response = await fetch(

            "http://localhost:3001/preferences/notifications/stop",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    username

                })

            }

        );

        if (!response.ok) {

            throw new Error();

        }

       showToast(
    "🔴 Notifications Stopped"
);

await loadPreferences();

    }

    catch (err) {

        console.log(err);

        showToast(

            "❌ Failed to stop notifications"

        );

    }

});
document
.getElementById("logoutBtn")
.addEventListener("click",()=>{

    localStorage.clear();

    window.location.href="login.html";

});

document
.getElementById("telegramBtn")
.addEventListener("click",()=>{

    window.open(

        `https://t.me/Amul_Protein_Stock_Notifier_Bot?start=${username}`,

        "_blank"

    );

    let attempts = 0;

    const interval = setInterval(async () => {

        attempts++;

        await loadPreferences();

        if (

            document
                .getElementById("telegramStatus")
                .textContent
                .includes("Connected")

        ) {

            clearInterval(interval);

            showToast("✅ Telegram Connected");

        }

        if (attempts >= 15) {

            clearInterval(interval);

        }

    }, 2000);

});

document
.getElementById("disconnectTelegramBtn")
.addEventListener("click", async () => {

    await fetch(
        "http://localhost:3001/telegram/disconnect",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                username

            })

        }
    );

    

    showToast("✅ Telegram disconnected.");
    document.getElementById(
    "telegramStatus"
).textContent =
    "🔴 Not Connected";

document.getElementById(
    "telegramBtn"
).textContent =
    "Connect Telegram";

});

document
.getElementById("resetBtn")
.addEventListener("click",async()=>{

    if(
        !confirm(
            "Reset all preferences?"
        )
    ) return;

    await fetch(
        "http://localhost:3001/preferences/reset",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                username

            })

        }
    );

   selectedProducts = [];

document.getElementById("pincode").value = "";

await loadProducts();

showToast("✅ Preferences Reset");
document.getElementById(
    "saveBtn"
).disabled = false;

});

document
.getElementById("deleteBtn")
.addEventListener("click",async()=>{

    const ok=confirm(

        "Delete your account permanently?"

    );

    if(!ok) return;

    const response = await fetch(

        "http://localhost:3001/auth/delete",

        {

            method:"DELETE",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                username

            })

        }

    );
    if (!response.ok) {

    showToast("❌ Failed to delete account");

    return;

}

    localStorage.clear();

    window.location.href="login.html";

});