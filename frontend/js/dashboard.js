// ========================================
// Authentication
// ========================================

const token =
    localStorage.getItem("token");

const username =
    localStorage.getItem("username");

if (!token) {

    window.location.href = "index.html";

}

document.getElementById(
    "welcome"
).textContent =
    `Welcome, ${username} 👋`;


// ========================================
// Global State
// ========================================

let selectedProducts = [];


// ========================================
// Helper Functions
// ========================================

function getAuthHeaders() {

    return {

        "Content-Type": "application/json",

        Authorization: `Bearer ${token}`

    };

}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}

// ========================================
// Products
// ========================================

async function loadProducts() {

    try {

        const response = await fetch(

            `${API_URL}/products`

        );

        if (!response.ok) {

            throw new Error();

        }

        const products =
            await response.json();

        const container =
            document.getElementById(
                "productsContainer"
            );

        container.innerHTML = "";

        products.forEach(product => {

            const card =
                document.createElement("div");

            card.className =
                "productItem";

            const isSelected =
                selectedProducts.includes(
                    product.id
                );

            if (isSelected) {

                card.classList.add(
                    "selected"
                );

            }

            card.innerHTML = `

                <input
                    type="checkbox"
                    ${isSelected ? "checked" : ""}>

                <span>${product.name}</span>

            `;

            card.addEventListener("click", () => {

                const checkbox =
                    card.querySelector("input");

                if (selectedProducts.includes(product.id)) {

                    selectedProducts =
                        selectedProducts.filter(

                            id => id !== product.id

                        );

                    checkbox.checked = false;

                    card.classList.remove(
                        "selected"
                    );

                }

                else {

                    selectedProducts.push(
                        product.id
                    );

                    checkbox.checked = true;

                    card.classList.add(
                        "selected"
                    );

                }

            });

            container.appendChild(card);

        });

        const search =
            document.getElementById(
                "searchProduct"
            );

        search.oninput = () => {

            const value =
                search.value.toLowerCase();

            document
                .querySelectorAll(".productItem")
                .forEach(card => {

                    card.style.display =

                        card.innerText
                            .toLowerCase()
                            .includes(value)

                            ? "flex"

                            : "none";

                });

        };

    }

    catch (err) {

        console.error(err);

        showToast(

            "❌ Unable to load products. Please refresh the page."

        );

    }

}

// ========================================
// Preferences
// ========================================

async function loadPreferences() {

    try {

        const response = await fetch(

            `${API_URL}/preferences`,

            {

                headers: getAuthHeaders()

            }

        );

        // JWT expired / invalid
        if (response.status === 401) {

            localStorage.clear();

            window.location.href = "index.html";

            return;

        }

        const data = await response.json();

        if (!response.ok) {

            showToast(`❌ ${data.message}`);

            return;

        }

        if (!data) return;

        // Pincode
        document.getElementById(
            "pincode"
        ).value = data.pincode;

        // Selected Products
        selectedProducts = data.products;

        // ========================================
        // Telegram Status
        // ========================================

        const telegramStatus =
            document.getElementById(
                "telegramStatus"
            );

        const telegramBtn =
            document.getElementById(
                "telegramBtn"
            );

        if (data.chatId) {

            telegramStatus.textContent =
                "🟢 Connected";

            telegramBtn.textContent =
                "Reconnect Telegram";

        }

        else {

            telegramStatus.textContent =
                "🔴 Not Connected";

            telegramBtn.textContent =
                "Connect Telegram";

        }

        // ========================================
        // Notification Status
        // ========================================

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

                const remainingDays = Math.ceil(

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

    catch (err) {

        console.error(err);

        showToast(

            "❌ Unable to load your preferences."

        );

    }

}

// ========================================
// Initialization
// ========================================

async function initialize() {

    await loadPreferences();

    await loadProducts();

}

initialize();

// ========================================
// Save Preferences
// ========================================

document
    .getElementById("saveBtn")
    .addEventListener("click", async () => {

        const pincode =
            document
                .getElementById("pincode")
                .value
                .trim();

        if (pincode.length !== 6) {

            showToast(
                "❌ Enter a valid 6-digit pincode."
            );

            return;

        }

        if (selectedProducts.length === 0) {

            showToast(
                "❌ Select at least one product."
            );

            return;

        }

        const saveBtn =
            document.getElementById("saveBtn");

        saveBtn.disabled = true;

        saveBtn.textContent = "Saving...";

        try {

            const response = await fetch(

                `${API_URL}/preferences`,

                {

                    method: "POST",

                    headers: getAuthHeaders(),

                    body: JSON.stringify({

                        pincode,

                        selectedProducts

                    })

                }

            );

            const data =
                await response.json();

            if (!response.ok) {

                showToast(

                    `❌ ${data.message}`

                );

                return;

            }

            showToast(

                "✅ Preferences saved successfully."

            );

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to save preferences. Please try again."

            );

        }

        finally {

            saveBtn.disabled = false;

            saveBtn.textContent =
                "Save Preferences";

        }

    });

// ========================================
// Activate Notifications
// ========================================

document
    .getElementById("activateNotificationBtn")
    .addEventListener("click", async () => {

        const pincode =
            document
                .getElementById("pincode")
                .value
                .trim();

        if (pincode.length !== 6) {

            showToast(
                "❌ Please save your pincode first."
            );

            return;

        }

        if (selectedProducts.length === 0) {

            showToast(
                "❌ Please select at least one product."
            );

            return;

        }

        const days = Number(

            document
                .getElementById("notifyDays")
                .value

        );

        try {

            const response = await fetch(

                `${API_URL}/preferences/notifications/start`,

                {

                    method: "POST",

                    headers: getAuthHeaders(),

                    body: JSON.stringify({

                        days

                    })

                }

            );

            const data =
                await response.json();

            if (!response.ok) {

                showToast(

                    `❌ ${data.message}`

                );

                return;

            }

            showToast(

                "✅ Notifications enabled."

            );

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to activate notifications."

            );

        }

    });


// ========================================
// Stop Notifications
// ========================================

document
    .getElementById("stopNotificationBtn")
    .addEventListener("click", async () => {

        try {

            const response = await fetch(

                `${API_URL}/preferences/notifications/stop`,

                {

                    method: "POST",

                    headers: getAuthHeaders()

                }

            );

            const data =
                await response.json();

            if (!response.ok) {

                showToast(

                    `❌ ${data.message}`

                );

                return;

            }

            showToast(

                "✅ Notifications disabled."

            );

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to stop notifications."

            );

        }

    });


// ========================================
// Logout
// ========================================

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "index.html";

    });

// ========================================
// Connect Telegram
// ========================================

document
    .getElementById("telegramBtn")
    .addEventListener("click", () => {

        window.open(

            `https://t.me/Amul_Protein_Stock_Notifier_Bot?start=${username}`,

            "_blank"

        );

        let attempts = 0;

        const interval = setInterval(async () => {

            attempts++;

            await loadPreferences();

            const telegramStatus =

                document.getElementById(
                    "telegramStatus"
                );

            if (

                telegramStatus.textContent.includes(
                    "Connected"
                )

            ) {

                clearInterval(interval);

                showToast(

                    "✅ Telegram connected."

                );

                return;

            }

            if (attempts >= 15) {

                clearInterval(interval);

                showToast(

                    "❌ Telegram connection timed out."

                );

            }

        }, 2000);

    });

// ========================================
// Disconnect Telegram
// ========================================

document
    .getElementById("disconnectTelegramBtn")
    .addEventListener("click", async () => {

        try {

            const response = await fetch(

                `${API_URL}/telegram/disconnect`,

                {

                    method: "POST",

                    headers: getAuthHeaders()

                }

            );

            const data =
                await response.json();

            if (!response.ok) {

                showToast(

                    `❌ ${data.message}`

                );

                return;

            }

            document.getElementById(

                "telegramStatus"

            ).textContent =

                "🔴 Not Connected";

            document.getElementById(

                "telegramBtn"

            ).textContent =

                "Connect Telegram";

            showToast(

                "✅ Telegram disconnected."

            );

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to disconnect Telegram."

            );

        }

    });

// ========================================
// Reset Preferences
// ========================================

document
    .getElementById("resetBtn")
    .addEventListener("click", async () => {

        const confirmed = confirm(

            "Reset all preferences?"

        );

        if (!confirmed) {

            return;

        }

        try {

            const response = await fetch(

                `${API_URL}/preferences/reset`,

                {

                    method: "POST",

                    headers: getAuthHeaders()

                }

            );

            const data =
                await response.json();

            if (!response.ok) {

                showToast(

                    `❌ ${data.message}`

                );

                return;

            }

            selectedProducts = [];

            document.getElementById(

                "pincode"

            ).value = "";

            await loadPreferences();

            await loadProducts();

            showToast(

                "✅ Preferences reset successfully."

            );

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to reset preferences."

            );

        }

    });

// ========================================
// Delete Account
// ========================================

document
    .getElementById("deleteBtn")
    .addEventListener("click", async () => {

        const confirmed = confirm(

            "Delete your account permanently?"

        );

        if (!confirmed) {

            return;

        }

        try {

            const response = await fetch(

                `${API_URL}/auth/delete`,

                {

                    method: "DELETE",

                    headers: getAuthHeaders()

                }

            );

            const data =
                await response.json();

            if (!response.ok) {

                showToast(

                    `❌ ${data.message}`

                );

                return;

            }

            showToast(

                "✅ Account deleted successfully."

            );

            localStorage.clear();

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1000);

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to delete your account."

            );

        }

    });






