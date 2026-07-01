// ========================================
// API Configuration
// ========================================

const API_URL = "https://amul-stock-backend.onrender.com";

// ========================================
// Local Storage Keys
// ========================================

const STORAGE_KEYS = {

    token: "token",

    email: "email",

    fullName: "fullName"

};

// ========================================
// Helper Functions
// ========================================

function getToken() {

    return localStorage.getItem(
        STORAGE_KEYS.token
    );

}

function getEmail() {

    return localStorage.getItem(
        STORAGE_KEYS.email
    );

}

function getFullName() {

    return localStorage.getItem(
        STORAGE_KEYS.fullName
    );

}

function logout() {

    localStorage.clear();

    window.location.href = "index.html";

}