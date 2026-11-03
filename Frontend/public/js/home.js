
/* =========================================================
   QUICKKART — HOMEPAGE FUNCTIONALITY
   File: js/home.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupHomeSearch();
    setupMobileNavigation();
    updateHomeCartCount();
});

/* ---------- Product Search ---------- */

function setupHomeSearch() {
    const form = document.getElementById("homeSearchForm");
    const searchInput = document.getElementById("homeSearchInput");
    const searchCategory = document.getElementById("homeSearchCategory");

    if (!form || !searchInput || !searchCategory) return;

    // Preserve search terms when the user returns to the homepage.
    const params = new URLSearchParams(window.location.search);
    searchInput.value = params.get("search") || "";

    const categoryFromURL = params.get("category");

    if (categoryFromURL) {
        const matchingOption = Array.from(searchCategory.options).find(
            option => option.value.toLowerCase() === categoryFromURL.toLowerCase()
        );

        if (matchingOption) {
            searchCategory.value = matchingOption.value;
        }
    }

    form.addEventListener("submit", event => {
        event.preventDefault();

        const query = searchInput.value.trim();
        const category = searchCategory.value;

        if (!query && (!category || category === "All")) {
            searchInput.focus();
            return;
        }

        const destination = new URL("product.html", window.location.href);

        if (query) {
            destination.searchParams.set("search", query);
        }

        if (category && category !== "All") {
            destination.searchParams.set("category", category);
        }

        window.location.href = destination.pathname + destination.search;
    });
}

/* ---------- Mobile Navigation ---------- */

function setupMobileNavigation() {
    const menuButton = document.querySelector(".mobile-menu");
    const navigation = document.getElementById("mainPanel");

    if (!menuButton || !navigation) return;

    function closeNavigation() {
        navigation.classList.remove("mobile-panel-open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.setAttribute("aria-label", "Open navigation");

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    }

    function toggleNavigation() {
        const isOpen = navigation.classList.toggle("mobile-panel-open");

        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute(
            "aria-label",
            isOpen ? "Close navigation" : "Open navigation"
        );

        const icon = menuButton.querySelector("i");

        if (icon) {
            icon.classList.toggle("fa-bars", !isOpen);
            icon.classList.toggle("fa-xmark", isOpen);
        }
    }

    menuButton.addEventListener("click", event => {
        event.stopPropagation();
        toggleNavigation();
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("click", event => {
        if (
            !navigation.contains(event.target) &&
            !menuButton.contains(event.target)
        ) {
            closeNavigation();
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeNavigation();
        }
    });

    // Reset the mobile menu if the browser viewport changes to desktop.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeNavigation();
        }
    });
}

/* ---------- Shared Cart Count ---------- */

function readHomeCart() {
    try {
        const storedCart = localStorage.getItem("quickkart_cart");

        if (!storedCart) return [];

        const cart = JSON.parse(storedCart);

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.warn("QuickKart could not read the saved cart.", error);
        return [];
    }
}

function updateHomeCartCount() {
    const cart = readHomeCart();

    const totalItems = cart.reduce((total, item) => {
        const quantity = Number(item?.quantity);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            return total;
        }

        return total + quantity;
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalItems;
        element.setAttribute("aria-label", `${totalItems} items in cart`);
    });
}

// Refresh after returning to the page, including browser back navigation.
window.addEventListener("pageshow", updateHomeCartCount);

// localStorage changes in another browser tab.
window.addEventListener("storage", event => {
    if (event.key === "quickkart_cart") {
        updateHomeCartCount();
    }
});

// Other QuickKart scripts can announce a cart update in this tab.
window.addEventListener("quickkart:cart-updated", updateHomeCartCount);
