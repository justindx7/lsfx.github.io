document.addEventListener("DOMContentLoaded", () => {
    const banner = document.getElementById("cookie-banner");
    const settings = document.getElementById("cookie-settings");
    const acceptBtn = document.getElementById("accept-cookies");
    const declineBtn = document.getElementById("decline-cookies");
    const savePreferencesBtn = document.getElementById("save-cookie-preferences");
    const analyticsCheckbox = document.getElementById("analytics-cookies");

    const COOKIE_NAME = "cookieConsent";
    const COOKIE_EXPIRY_DAYS = 365;

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
    }

    function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (const cookie of cookies) {
            const [key, value] = cookie.split("=");
            if (key === name) {
                return value;
            }
        }
        return null;
    }

    function deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    }

    function checkCookieConsent() {
        const consent = getCookie(COOKIE_NAME);
        if (!consent) {
            banner.style.display = "block";
        }
    }

    function handleAcceptCookies() {
        setCookie(COOKIE_NAME, "accepted", COOKIE_EXPIRY_DAYS);
        banner.style.display = "none";
        enableAnalytics();
    }

    function handleDeclineCookies() {
        setCookie(COOKIE_NAME, "declined", COOKIE_EXPIRY_DAYS);
        banner.style.display = "none";
        disableAnalytics();
    }

    function handleSavePreferences() {
        if (analyticsCheckbox.checked) {
            enableAnalytics();
        } else {
            disableAnalytics();
        }
        setCookie(COOKIE_NAME, JSON.stringify({ analytics: analyticsCheckbox.checked }), COOKIE_EXPIRY_DAYS);
        settings.style.display = "none";
        banner.style.display = "none";
    }

    function enableAnalytics() {
        // Re-enable Google Analytics (if applicable)
        console.log("Analytics enabled");
    }

    function disableAnalytics() {
        // Disable Google Analytics (if applicable)
        console.log("Analytics disabled");
        deleteCookie("_ga"); // Example of deleting Google Analytics cookie
    }

    acceptBtn.addEventListener("click", handleAcceptCookies);
    declineBtn.addEventListener("click", handleDeclineCookies);
    savePreferencesBtn.addEventListener("click", handleSavePreferences);

    checkCookieConsent();
});
