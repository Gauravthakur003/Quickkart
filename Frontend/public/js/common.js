document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
    setupSearch();
});

/* ================= CART COUNT ================= */

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("quickkart_cart")) || [];

    const totalItems = cart.reduce((total, item) => {
        return total + item.quantity;
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalItems;
    });
}

/* ================= SEARCH ================= */

function setupSearch() {

    const searchInput = document.querySelector("#globalSearch");
    const searchButton = document.querySelector("#searchButton");

    if (!searchInput || !searchButton) {
        return;
    }

    function performSearch() {

        const query = searchInput.value.trim();

        if (!query) {
            return;
        }

        window.location.href =
            `products.html?search=${encodeURIComponent(query)}`;
    }

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", event => {

        if (event.key === "Enter") {
            performSearch();
        }

    });
});

/* ================= NOTIFICATION ================= */

function showNotification(message) {

    const notification = document.createElement("div");

    notification.textContent = message;

    notification.style.position = "fixed";
    notification.style.bottom = "25px";
    notification.style.right = "25px";
    notification.style.background = "#111827";
    notification.style.color = "white";
    notification.style.padding = "14px 20px";
    notification.style.borderRadius = "8px";
    notification.style.zIndex = "9999";

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2500);
}

/* ================= LOGOUT ================= */

function logout() {

    localStorage.removeItem("quickkart_user");

    showNotification("Logged out successfully");

    setTimeout(() => {
        window.location.href = "login.html";
    }, 1000);
}