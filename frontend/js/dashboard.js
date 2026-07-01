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
        document.getElementById("notifyDays"),

    notificationStatus:
        document.getElementById("notificationStatus"),

    telegramStatus:
        document.getElementById("telegramStatus"),

    saveBtn:
        document.getElementById("saveBtn"),

    resetBtn:
        document.getElementById("resetBtn"),

    activateBtn:
        document.getElementById("activateNotificationBtn"),

    stopBtn:
        document.getElementById("stopNotificationBtn"),

    telegramBtn:
        document.getElementById("telegramBtn"),

    disconnectBtn:
        document.getElementById("disconnectTelegramBtn"),

    logoutBtn:
        document.getElementById("logoutBtn"),

    deleteBtn:
        document.getElementById("deleteBtn"),

    toast:
        document.getElementById("toast")

};

// ========================================
// Sidebar Navigation
// ========================================

const dashboardNav =
    document.getElementById("dashboardNav");

const notificationNav =
    document.getElementById("notificationNav");

const telegramNav =
    document.getElementById("telegramNav");

const accountNav =
    document.getElementById("accountNav");

const dashboardSection =
    document.getElementById("dashboardSection");

const notificationSection =
    document.getElementById("notificationSection");

const telegramSection =
    document.getElementById("telegramSection");

const accountSection =
    document.getElementById("accountSection");

    const navItems = [

    dashboardNav,

    notificationNav,

    telegramNav,

    accountNav

];

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

            ui.telegramStatus.innerHTML =

                "🟢 Connected";

            ui.telegramBtn.textContent =

                "Reconnect Telegram";

        }

        else {

            ui.telegramStatus.innerHTML =

                "🔴 Not Connected";

            ui.telegramBtn.textContent =

                "Connect Telegram";

        }

        // ===========================
        // Notifications
        // ===========================

        if (!data.notifyUntil) {

            ui.notificationStatus.innerHTML =

                "🔴 Notifications Stopped";

        }

        else {

            const expiry =

                new Date(data.notifyUntil);

            const now =

                new Date();

            if (expiry <= now) {

                ui.notificationStatus.innerHTML =

                    "🟡 Notifications Expired";

            }

            else {

                const remainingDays = Math.ceil(

                    (expiry - now) /

                    (1000 * 60 * 60 * 24)

                );
                ui.notificationStatus.innerHTML = `

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

⏳ ${remainingDays} day${

    remainingDays > 1

        ? "s"

        : ""

} remaining

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

            "Saving...";

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

                "✅ Preferences saved."

            );

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

            showToast(

                "❌ Unable to save preferences."

            );

        }

        finally {

            ui.saveBtn.disabled = false;

            ui.saveBtn.textContent =

                "Save Preferences";

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

                "✅ Notifications activated."

            );

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

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

                "✅ Notifications stopped."

            );

            await loadPreferences();

        }

        catch (err) {

            console.error(err);

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

            let attempts = 0;

            const interval =

                setInterval(

                    async () => {

                        attempts++;

                        const connected = await checkTelegramStatus();

                        if (connected) {

                            clearInterval(

                                interval

                            );

                            showToast(

                                "✅ Telegram connected."

                            );

                            return;

                        }

                        if (

                            attempts >= 15

                        ) {

                            clearInterval(

                                interval

                            );

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

            ui.telegramStatus.textContent =

                "🔴 Not Connected";

            ui.telegramBtn.textContent =

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

            await loadPreferences();

            await loadProducts();

            showToast(

                "✅ Preferences reset."

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

// ========================================
// Sidebar Navigation
// ========================================

dashboardNav.addEventListener(

    "click",

    () => {

        dashboardSection.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    }

);

notificationNav.addEventListener(

    "click",

    () => {

        notificationSection.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

);

telegramNav.addEventListener(

    "click",

    () => {

        telegramSection.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

);

accountNav.addEventListener(

    "click",

    () => {

        accountSection.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

);

// ========================================
// Active Sidebar Highlight
// ========================================

function setActiveNav(activeNav) {

    navItems.forEach(item =>

        item.classList.remove("active")

    );

    activeNav.classList.add("active");

}

const observer = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (!entry.isIntersecting) {

                return;

            }

            switch (entry.target.id) {

                case "dashboardSection":

                    setActiveNav(dashboardNav);

                    break;

                case "notificationSection":

                    setActiveNav(notificationNav);

                    break;

                case "telegramSection":

                    setActiveNav(telegramNav);

                    break;

                case "accountSection":

                    setActiveNav(accountNav);

                    break;

            }

        });

    },

    {

        threshold: 0.35

    }

);

observer.observe(dashboardSection);

observer.observe(notificationSection);

observer.observe(telegramSection);

observer.observe(accountSection);