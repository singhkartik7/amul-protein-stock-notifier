// ========================================
// Authentication
// ========================================

const token = getToken();

if (!token) {

    window.location.href = "index.html";

}

// ========================================
// Cached Elements
// ========================================

const ui = {

    welcome:
        document.getElementById("welcome"),

    pincode:
        document.getElementById("pincode"),

    search:
        document.getElementById("searchProduct"),

    products:
        document.getElementById("productsContainer"),

    notifyDays:
        document.getElementById("notifyDuration"),

    notificationStatus:
        document.getElementById("notificationStatus"),

    telegramStatus:
        document.getElementById("telegramStatus"),

    saveBtn:
        document.getElementById("saveBtn"),

    resetBtn:
        document.getElementById("resetBtn"),

    activateBtn:
        document.getElementById("activateBtn"),

    stopBtn:
        document.getElementById("stopBtn"),

    telegramBtn:
        document.getElementById("telegramBtn"),

    disconnectBtn:
        document.getElementById("disconnectTelegramBtn"),

    logoutBtn:
        document.getElementById("logoutBtn"),

    deleteBtn:
        document.getElementById("deleteAccountBtn"),

    toast:
        document.getElementById("toast")

};


// ========================================
// Welcome
// ========================================

const fullName = getFullName();

if (fullName) {

    ui.welcome.textContent =

        `Welcome, ${fullName} 👋`;

}
// ========================================
// Global State
// ========================================

let selectedProducts = [];
let preferencesSaved = false;
let telegramConnected = false;

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

    ui.toast.textContent = message;

    ui.toast.classList.add("show");

    setTimeout(() => {

        ui.toast.classList.remove("show");

    }, 2500);

}
function updateButtonStates() {

    const hasPincode =
        ui.pincode.value.trim().length === 6;

    const hasProducts =
        selectedProducts.length > 0;

    ui.saveBtn.disabled =
        !(hasPincode && hasProducts);

ui.saveBtn.textContent =
    preferencesSaved
        ? "💾 Update Preferences"
        : "💾 Save Preferences";

        ui.resetBtn.disabled =
    !preferencesSaved;

    ui.telegramBtn.disabled =
        !preferencesSaved;

    ui.activateBtn.disabled =
        !preferencesSaved ||
        !telegramConnected;
  
        ui.notifyDays.disabled =
    !preferencesSaved ||
    !telegramConnected;

ui.disconnectBtn.disabled =
    !telegramConnected;
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

        ui.products.innerHTML = "";

        products.forEach(product => {

            const card =

                document.createElement("div");

            card.className =

                "productCard";

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

                    class="productCheckbox"

                    type="checkbox"

                    ${isSelected ? "checked" : ""}>

                <h4>

                    ${product.name}

                </h4>

            `;

            card.addEventListener(

                "click",

                () => {

                    const checkbox =

                        card.querySelector(

                            "input"

                        );

                    if (

                        selectedProducts.includes(

                            product.id

                        )

                    ) {

                        selectedProducts =

                            selectedProducts.filter(

                                id =>

                                    id !== product.id

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
updateButtonStates();
                }

            );

            ui.products.appendChild(card);

        });

        ui.search.oninput = () => {

            const value =

                ui.search.value

                    .toLowerCase();

            document

                .querySelectorAll(

                    ".productCard"

                )

                .forEach(card => {

                    card.style.display =

                        card.innerText

                            .toLowerCase()

                            .includes(value)

                            ? ""

                            : "none";

                });

        };

    }

    catch (err) {

        console.error(err);

        showToast(

            "❌ Unable to load products."

        );

    }

}
// ========================================
// Load Preferences
// ========================================

async function loadPreferences() {

    try {

        const response = await fetch(

            `${API_URL}/preferences`,

            {

                headers: getAuthHeaders()

            }

        );

        if (response.status === 401) {

            logout();

            return;

        }

        const data =

            await response.json();

        if (!response.ok) {

            showToast(

                `❌ ${data.message}`

            );

            return;

        }

        if (!data) {

            return;

        }

        // ===========================
        // Pincode
        // ===========================

        ui.pincode.value =

            data.pincode || "";

        // ===========================
        // Selected Products
        // ===========================

        selectedProducts =

            data.products || [];

        // ===========================
        // Telegram
        // ===========================

        if (data.chatId) {

    if (data.notifyUntil && new Date(data.notifyUntil) > new Date()) {

        ui.telegramStatus.innerHTML = `
<div><strong>🟢 Telegram Connected</strong></div>
<div>You're ready to receive stock alerts.</div>
`;

    } else {

        ui.telegramStatus.innerHTML = `
<div><strong>🟢 Telegram Connected</strong></div>
<div>✅ Next: Activate Notifications</div>
`;

    }

    ui.telegramBtn.textContent = "Reconnect Telegram";
    ui.disconnectBtn.disabled = false;

}

        else {

            ui.telegramStatus.innerHTML = `
 <div><strong>🔴Telegram Not Connected</strong></div>


<div>Connect Telegram to receive stock alerts.</div>
`;

            ui.telegramBtn.textContent =

                "Connect Telegram";
                ui.disconnectBtn.disabled = true;
                

        }

        // ===========================
        // Notifications
        // ===========================

        if (!data.notifyUntil) {

           ui.notificationStatus.innerHTML = `
 <div><strong>🔴Notifications Inactive</strong></div>


<div>Click <strong>Activate Notifications</strong> to start monitoring.</div>
`;

ui.activateBtn.textContent =
    "🔔 Activate Notifications";
    ui.stopBtn.disabled = true;

        }

        else {

            const expiry =

                new Date(data.notifyUntil);

            const now =

                new Date();

            if (expiry <= now) {

                ui.notificationStatus.innerHTML = `
 <div><strong>🟡Notifications Expired</strong></div>



<div>Click <strong>Activate Notifications</strong> to continue monitoring.</div>
`;
ui.activateBtn.textContent =
    "🔔 Activate Notifications";
    ui.stopBtn.disabled = true;
            }

            else {

                const remainingDays = Math.ceil(

                    (expiry - now) /

                    (1000 * 60 * 60 * 24)

                );
                ui.notificationStatus.innerHTML = `

 <div><strong>🟢Notifications Active</strong></div>



<div>📅 Expires on:

${expiry.toLocaleDateString(

    "en-IN",

    {

        day: "numeric",

        month: "long",

        year: "numeric"

    }

)}
</div>
<div>

⏳ ${remainingDays} day${

    remainingDays > 1

        ? "s"

        : ""

} remaining</div>

`;

ui.activateBtn.textContent =
    "🔄 Extend Notifications";
    ui.stopBtn.disabled = false;

            }

        }
preferencesSaved =
    !!data.pincode &&
    data.products.length > 0;

telegramConnected =
    !!data.chatId;

updateButtonStates();
    }

    catch (err) {

        console.error(err);

        showToast(

            "❌ Unable to load your preferences."

        );

    }

}

async function checkTelegramStatus() {

    try {

        const response = await fetch(

            `${API_URL}/preferences`,

            {

                headers: getAuthHeaders()

            }

        );

        if (!response.ok) {

            return false;

        }

        const data = await response.json();

        if (data.chatId) {

            ui.telegramStatus.innerHTML =

                "🟢 Connected";

            ui.telegramBtn.textContent =

                "Reconnect Telegram";
                telegramConnected = true;
preferencesSaved = true;
updateButtonStates();

            return true;

        }

        return false;

    }

    catch {

        return false;

    }

}

// ========================================
// Initialize Dashboard
// ========================================

async function initialize() {

    await loadPreferences();

    await loadProducts();

}

initialize();
ui.pincode.addEventListener("input", updateButtonStates);

// ========================================
// Save Preferences
// ========================================

ui.saveBtn.addEventListener(

    "click",

    async () => {

        const pincode =

            ui.pincode.value.trim();

        if (pincode.length !== 6) {

            showToast(

                "❌ Enter a valid 6-digit pincode."

            );

            return;

        }

        if (selectedProducts.length === 0) {

            showToast(

                "❌ Please select at least one product."

            );

            return;

        }

        ui.saveBtn.disabled = true;

        ui.saveBtn.textContent =

            "⏳ Saving...";

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

            await loadPreferences();

showToast(
    telegramConnected
        ? "✅ Preferences saved. Next: Activate Notifications."
        : "✅ Preferences saved. Next: Connect Telegram."
);

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to save preferences."

            );

        }

        finally {

           updateButtonStates();

        }

    }

);
// ========================================
// Activate Notifications
// ========================================

ui.activateBtn.addEventListener(

    "click",

    async () => {

        const pincode =

            ui.pincode.value.trim();

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

            ui.notifyDays.value

        );

        ui.activateBtn.disabled = true;
ui.activateBtn.textContent = "⏳ Activating...";

        try {

            const response =

                await fetch(

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
    "🎉 You're all set! We'll notify you when your selected products are back in stock."
);

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

            updateButtonStates();

    ui.activateBtn.textContent =
        "🔔 Activate Notifications";

            showToast(

                "❌ Unable to activate notifications."

            );

        }
        

    }

);

// ========================================
// Stop Notifications
// ========================================

ui.stopBtn.addEventListener(

    "click",

    async () => {
ui.stopBtn.disabled = true;
ui.stopBtn.textContent = "⏳ Stopping...";
        try {

            const response =

                await fetch(

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
    "🔕 Notifications stopped. You won't receive stock alerts until you activate them again."
);

            await loadPreferences();
            ui.stopBtn.textContent = "Stop";

        }

        catch (err) {

            console.error(err);
updateButtonStates();

ui.stopBtn.textContent = "Stop";
            showToast(

                "❌ Unable to stop notifications."

            );

        }

    }

);
// ========================================
// Connect Telegram
// ========================================

ui.telegramBtn.addEventListener(

    "click",

    async () => {
ui.telegramBtn.disabled = true;
ui.telegramBtn.textContent = "⏳ Opening Telegram...";
        try {

            const response =

                await fetch(

                    `${API_URL}/telegram/link`,

                    {

                        headers:

                            getAuthHeaders()

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

            window.open(

                data.link,

                "_blank"

            );

            ui.telegramBtn.textContent = "Waiting for connection...";

            let attempts = 0;

            const interval =

                setInterval(

                    async () => {

                        attempts++;

                        const connected = await checkTelegramStatus();

                       if (connected) {

    clearInterval(interval);

    await loadPreferences();
    ui.telegramBtn.textContent = "Reconnect Telegram";

    showToast(
        "✅ Telegram connected. You can now activate notifications."
    );

    return;

}

                        if (

                            attempts >= 15

                        ) {

                            clearInterval(

                                interval

                            );
updateButtonStates();

ui.telegramBtn.textContent =
    telegramConnected
        ? "Reconnect Telegram"
        : "Connect Telegram";
                            showToast(

                                "❌ Telegram connection timed out."

                            );

                        }

                    },

                    2000

                );

        }

        catch (err) {

            console.error(err);

    updateButtonStates();

    ui.telegramBtn.textContent =
        telegramConnected
            ? "Reconnect Telegram"
            : "Connect Telegram";

            showToast(

                "❌ Unable to generate Telegram link."

            );

        }

    }

);

// ========================================
// Disconnect Telegram
// ========================================

ui.disconnectBtn.addEventListener(

    "click",

    async () => {
ui.disconnectBtn.disabled = true;
ui.disconnectBtn.textContent = "⏳ Disconnecting...";
        try {

            const response =

                await fetch(

                    `${API_URL}/telegram/disconnect`,

                    {

                        method: "POST",

                        headers:

                            getAuthHeaders()

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

            ui.telegramStatus.innerHTML = `
 <div><strong>🔴Telegram Not Connected</strong></div>



<div>Connect Telegram to receive stock alerts.</div>
`;

            ui.telegramBtn.textContent =

                "Connect Telegram";
                ui.disconnectBtn.disabled = true;
                telegramConnected = false;

updateButtonStates();

ui.notificationStatus.innerHTML = `
<div><strong>🔴 Notifications Unavailable</strong></div>
<div>Connect Telegram to activate notifications.</div>
`;

ui.activateBtn.textContent = "🔔 Activate Notifications";
ui.stopBtn.disabled = true;

            showToast(

                "✅ Telegram disconnected."

            );

            ui.disconnectBtn.textContent = "Disconnect";

        }

        catch (err) {

            console.error(err);
updateButtonStates();

ui.disconnectBtn.textContent = "Disconnect";
            showToast(

                "❌ Unable to disconnect Telegram."

            );

        }

    }

);
// ========================================
// Reset Preferences
// ========================================

ui.resetBtn.addEventListener(

    "click",

    async () => {

        if (

            !confirm(

                "Reset all preferences?"

            )

        ) {

            return;

        }

        try {

            const response =

                await fetch(

                    `${API_URL}/preferences/reset`,

                    {

                        method:"POST",

                        headers:

                            getAuthHeaders()

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

            ui.pincode.value = "";
            preferencesSaved = false;
telegramConnected = false;

updateButtonStates();

            await loadPreferences();

            await loadProducts();

            showToast(
    "🔄 Preferences reset. Configure your preferences to start monitoring again."
);

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to reset preferences."

            );

        }

    }

);

// ========================================
// Logout
// ========================================

ui.logoutBtn.addEventListener(

    "click",

    logout

);

// ========================================
// Delete Account
// ========================================

ui.deleteBtn.addEventListener(

    "click",

    async () => {

        if (

            !confirm(

                "Delete your account permanently?"

            )

        ) {

            return;

        }

        try {

            const response =

                await fetch(

                    `${API_URL}/auth/delete`,

                    {

                        method:"DELETE",

                        headers:

                            getAuthHeaders()

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

                "✅ Account deleted."

            );

            setTimeout(

                logout,

                1000

            );

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to delete account."

            );

        }

    }

);

