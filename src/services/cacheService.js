const { getSession } = require("./sessionService");
const { getStoreMap } = require("./storeService");

let session = null;
let storeMap = null;

async function initializeCache() {

    session = await getSession();
storeMap = await getStoreMap(session.jar);

    console.log("✅ Cache initialized");

}

function getSessionCache() {

    if (!session) {

        throw new Error(
            "Session cache not initialized."
        );

    }

    return session;

}

function getStoreMapCache() {

    if (!storeMap) {

        throw new Error(
            "Store map cache not initialized."
        );

    }

    return storeMap;

}

async function refreshSession() {

    console.log("🔄 Refreshing session...");

    session = await getSession();

    storeMap = await getStoreMap(session.jar);

    console.log("✅ Session refreshed");

}

module.exports = {

    initializeCache,

    getSessionCache,

    getStoreMapCache,

    refreshSession

};