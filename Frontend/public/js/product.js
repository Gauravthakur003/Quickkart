
/* =========================================================
   QUICKKART | PRODUCT LISTING
   File: js/product.js
   ========================================================= */

"use strict";

/*
    Demo product data.

    These products use your existing image files:
    box1_image.jpg through box8_image.jpg.

    Update product names, categories and prices once the
    images have been matched to the actual products.
*/

const QUICKKART_PRODUCTS = [
    {
        id: "qk-101",
        name: "Smart Wireless Accessory",
        category: "Electronics",
        price: 799,
        originalPrice: 999,
        rating: 4.3,
        reviews: 120,
        image: "../assets/box1_image.jpg",
        badge: "POPULAR",
        popularity: 120,
        newest: 8
    },
    {
        id: "qk-102",
        name: "Home Living Essential",
        category: "Home",
        price: 499,
        originalPrice: 699,
        rating: 4.8,
        reviews: 85,
        image: "../assets/box2_image.jpg",
        badge: "BEST VALUE",
        popularity: 110,
        newest: 7
    },
    {
        id: "qk-103",
        name: "Daily Beauty Essential",
        category: "Beauty",
        price: 349,
        originalPrice: 449,
        rating: 4.2,
        reviews: 64,
        image: "../assets/box3_image.jpg",
        badge: "TRENDING",
        popularity: 95,
        newest: 6
    },
    {
        id: "qk-104",
        name: "Everyday Style Pick",
        category: "Fashion",
        price: 1299,
        originalPrice: 1599,
        rating: 4.5,
        reviews: 92,
        image: "../assets/box4_image.jpg",
        badge: "",
        popularity: 90,
        newest: 5
    },
    {
        id: "qk-105",
        name: "Pantry Daily Essential",
        category: "Groceries",
        price: 199,
        originalPrice: 249,
        rating: 4.4,
        reviews: 56,
        image: "../assets/box5_image.jpg",
        badge: "GREAT PRICE",
        popularity: 82,
        newest: 4
    },
    {
        id: "qk-106",
        name: "Home Utility Product",
        category: "Home",
        price: 899,
        originalPrice: 1099,
        rating: 4.1,
        reviews: 38,
        image: "../assets/box6_image.jpg",
        badge: "",
        popularity: 70,
        newest: 3
    },
    {
        id: "qk-107",
        name: "Electronics Daily Pick",
        category: "Electronics",
        price: 1499,
        originalPrice: 1899,
        rating: 4.6,
        reviews: 104,
        image: "../assets/box7_image.jpg",
        badge: "TOP RATED",
        popularity: 105,
        newest: 2
    },
    {
        id: "qk-108",
        name: "Personal Care Essential",
        category: "Beauty",
        price: 599,
        originalPrice: 799,
        rating: 4.3,
        reviews: 71,
        image: "../assets/box8_image.jpg",
        badge: "",
        popularity: 65,
        newest: 1
    }
];

const QUICKKART_CART_KEY = "quickkart_cart";

let filteredProducts = [...QUICKKART_PRODUCTS];

/* ---------- Start the page ---------- */

document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("productGrid");

    // Do nothing if this script is accidentally loaded on another page.
    if (!productGrid) return;

    document.getElementById("currentYear").textContent =
        new Date().getFullYear();

    setupProductFilters();
    setupProductSorting();
    setupClearFilters();
    setupGlobalSearch();
    setupURLFilters();

    renderProducts();
    updateProductCartCount();
});

/* ---------- Safe Cart Storage ---------- */

function readQuickKartCart() {
    try {
        const savedCart = localStorage.getItem(QUICKKART_CART_KEY);

        if (!savedCart) return [];

        const parsedCart = JSON.parse(savedCart);

        return Array.isArray(parsedCart) ? parsedCart : [];
    } catch (error) {
        console.error("Could not read the QuickKart cart:", error);
        return [];
    }
}

function saveQuickKartCart(cart) {
    try {
        localStorage.setItem(
            QUICKKART_CART_KEY,
            JSON.stringify(cart)
        );

        window.dispatchEvent(
            new CustomEvent("quickkart:cart-updated")
        );

        return true;
    } catch (error) {
        console.error("Could not save the QuickKart cart:", error);
        showProductNotification(
            "Unable to save your cart. Check your browser storage.",
            "error"
        );

        return false;
    }
}

/* ---------- Currency Formatting ---------- */

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

/* ---------- Product Card HTML ---------- */

function createProductCard(product) {
    const card = document.createElement("article");
    card.className = "product-card";

    const discount = product.originalPrice > product.price
        ? Math.round(
            ((product.originalPrice - product.price) /
                product.originalPrice) * 100
        )
        : 0;

    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating - fullStars >= 0.5;

    let stars = "";

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += "★";
        } else if (i === fullStars && hasHalfStar) {
            stars += "★";
        } else {
            stars += "☆";
        }
    }

    const badgeHTML = product.badge
        ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
        : "";

    const discountHTML = discount > 0
        ? `<span class="product-discount">${discount}% off</span>`
        : "";

    const originalPriceHTML = product.originalPrice > product.price
        ? `<span class="product-original-price">${formatPrice(product.originalPrice)}</span>`
        : "";

    card.innerHTML = `
        <div class="product-image-wrapper">
            ${badgeHTML}

            <a
                class="product-image-link"
                href="product-details.html?id=${encodeURIComponent(product.id)}"
                aria-label="View ${escapeHTML(product.name)}"
            >
                <img
                    class="product-image"
                    src="${escapeHTML(product.image)}"
                    alt="${escapeHTML(product.name)}"
                    loading="lazy"
                >
            </a>
        </div>

        <div class="product-card-body">
            <span class="product-category">
                ${escapeHTML(product.category)}
            </span>

            <h3 class="product-title">
                <a href="product-details.html?id=${encodeURIComponent(product.id)}">
                    ${escapeHTML(product.name)}
                </a>
            </h3>

            <div
                class="product-rating"
                aria-label="Rated ${product.rating} out of 5"
            >
                <span class="stars" aria-hidden="true">${stars}</span>
                <span class="rating-value">${product.rating.toFixed(1)}</span>
                <span class="review-count">(${product.reviews} reviews)</span>
            </div>

            <div class="product-price-row">
                <span class="product-price">${formatPrice(product.price)}</span>
                ${originalPriceHTML}
                ${discountHTML}
            </div>

            <div class="product-delivery">
                <i class="fa-solid fa-truck-fast" aria-hidden="true"></i>
                <span>Delivery options at checkout</span>
            </div>

            <button
                type="button"
                class="add-to-cart"
                data-add-to-cart="${escapeHTML(product.id)}"
            >
                <i class="fa-solid fa-cart-plus" aria-hidden="true"></i>
                Add to Cart
            </button>
        </div>
    `;

    // Show a placeholder if an image cannot be loaded.
    const image = card.querySelector(".product-image");

    image.addEventListener("error", () => {
        image.style.display = "none";

        const placeholder = document.createElement("div");
        placeholder.className = "product-image-placeholder";
        placeholder.innerHTML =
            '<i class="fa-regular fa-image" aria-hidden="true"></i>';

        placeholder.style.cssText = [
            "display:grid",
            "place-items:center",
            "width:100%",
            "height:100%",
            "color:#aab1be",
            "font-size:36px"
        ].join(";");

        card.querySelector(".product-image-link").appendChild(placeholder);
    }, { once: true });

    return card;
}

/* ---------- Render Products ---------- */

function renderProducts() {
    const productGrid = document.getElementById("productGrid");
    const resultCount = document.getElementById("resultCount");
    const emptyState = document.getElementById("emptyState");

    if (!productGrid) return;

    productGrid.replaceChildren();

    filteredProducts.forEach(product => {
        productGrid.appendChild(createProductCard(product));
    });

    if (resultCount) {
        const count = filteredProducts.length;

        resultCount.textContent =
            `${count} ${count === 1 ? "product" : "products"} found`;
    }

    if (emptyState) {
        emptyState.hidden = filteredProducts.length !== 0;
    }

    productGrid.hidden = filteredProducts.length === 0;

    updateActiveSearch();
}

/* ---------- Search and Filtering ---------- */

function setupProductFilters() {
    document.querySelectorAll("[data-category-filter]").forEach(input => {
        input.addEventListener("change", applyProductFilters);
    });

    document.querySelectorAll("[data-price-filter]").forEach(input => {
        input.addEventListener("change", applyProductFilters);
    });
}

function getSelectedCategories() {
    return Array.from(
        document.querySelectorAll("[data-category-filter]:checked")
    ).map(input => input.value.toLowerCase());
}

function getSelectedPriceRanges() {
    return Array.from(
        document.querySelectorAll("[data-price-filter]:checked")
    ).map(input => input.value);
}

function getSearchQuery() {
    const searchInput = document.getElementById("globalSearch");

    if (searchInput && searchInput.value.trim()) {
        return searchInput.value.trim().toLowerCase();
    }

    return new URLSearchParams(window.location.search)
        .get("search")?.trim().toLowerCase() || "";
}

function applyProductFilters() {
    const selectedCategories = getSelectedCategories();
    const selectedPriceRanges = getSelectedPriceRanges();
    const query = getSearchQuery();

    filteredProducts = QUICKKART_PRODUCTS.filter(product => {
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(product.category.toLowerCase());

        const matchesPrice =
            selectedPriceRanges.length === 0 ||
            selectedPriceRanges.some(range => {
                if (range === "under500") {
                    return product.price < 500;
                }

                if (range === "500to1000") {
                    return product.price >= 500 && product.price < 1000;
                }

                if (range === "over1000") {
                    return product.price >= 1000;
                }

                return true;
            });

        const searchableText = [
            product.name,
            product.category
        ].join(" ").toLowerCase();

        const matchesSearch =
            !query || searchableText.includes(query);

        return matchesCategory && matchesPrice && matchesSearch;
    });

    sortFilteredProducts();
    renderProducts();
}

/* ---------- Sorting ---------- */

function setupProductSorting() {
    const sortSelect = document.getElementById("sortProducts");

    if (!sortSelect) return;

    sortSelect.addEventListener("change", () => {
        sortFilteredProducts();
        renderProducts();
    });
}

function sortFilteredProducts() {
    const sortSelect = document.getElementById("sortProducts");
    const sortValue = sortSelect ? sortSelect.value : "popular";

    switch (sortValue) {
        case "price-asc":
            filteredProducts.sort((a, b) => a.price - b.price);
            break;

        case "price-desc":
            filteredProducts.sort((a, b) => b.price - a.price);
            break;

        case "newest":
            filteredProducts.sort((a, b) => b.newest - a.newest);
            break;

        case "popular":
        default:
            filteredProducts.sort((a, b) => b.popularity - a.popularity);
            break;
    }
}

/* ---------- URL Parameters ---------- */

function setupURLFilters() {
    const params = new URLSearchParams(window.location.search);

    const searchQuery = params.get("search");
    const category = params.get("category");

    const searchInput = document.getElementById("globalSearch");

    if (searchInput && searchQuery) {
        searchInput.value = searchQuery;
    }

    if (category) {
        document.querySelectorAll("[data-category-filter]").forEach(input => {
            if (
                input.value.toLowerCase() === category.trim().toLowerCase()
            ) {
                input.checked = true;
            }
        });
    }

    // Also support a category-only URL.
    applyProductFilters();
}

/* ---------- Search UI ---------- */

function setupGlobalSearch() {
    const searchInput = document.getElementById("globalSearch");
    const searchButton = document.getElementById("searchButton");

    if (!searchInput) return;

    // Keep the search on the product listing page.
    function runSearch() {
        const query = searchInput.value.trim();
        const params = new URLSearchParams(window.location.search);

        if (query) {
            params.set("search", query);
        } else {
            params.delete("search");
        }

        const queryString = params.toString();

        window.location.href = queryString
            ? `product.html?${queryString}`
            : "product.html";
    }

    if (searchButton) {
        searchButton.addEventListener("click", runSearch);
    }

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            runSearch();
        }
    });
}

function updateActiveSearch() {
    const activeSearch = document.getElementById("activeSearch");

    if (!activeSearch) return;

    activeSearch.replaceChildren();

    const query = getSearchQuery();

    if (query) {
        const chip = document.createElement("span");
        chip.className = "search-chip";

        const label = document.createElement("span");
        label.textContent = `Search: ${query}`;

        const clearButton = document.createElement("button");
        clearButton.type = "button";
        clearButton.setAttribute("aria-label", "Clear search");
        clearButton.innerHTML = '<i class="fa-solid fa-xmark"></i>';

        clearButton.addEventListener("click", () => {
            const input = document.getElementById("globalSearch");

            if (input) input.value = "";

            const params = new URLSearchParams(window.location.search);
            params.delete("search");

            const queryString = params.toString();

            window.history.replaceState(
                {},
                "",
                queryString ? `?${queryString}` : window.location.pathname
            );

            applyProductFilters();
        });

        chip.append(label, clearButton);
        activeSearch.appendChild(chip);
    }
}

/* ---------- Clear Filters ---------- */

function setupClearFilters() {
    const clearButton = document.getElementById("clearFilters");
    const emptyClearButton = document.getElementById("emptyClearFilters");

    function clearAllFilters() {
        document.querySelectorAll(
            "[data-category-filter], [data-price-filter]"
        ).forEach(input => {
            input.checked = false;
        });

        const sortSelect = document.getElementById("sortProducts");
        if (sortSelect) sortSelect.value = "popular";

        const searchInput = document.getElementById("globalSearch");
        if (searchInput) searchInput.value = "";

        window.history.replaceState(
            {},
            "",
            window.location.pathname
        );

        filteredProducts = [...QUICKKART_PRODUCTS];

        sortFilteredProducts();
        renderProducts();
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearAllFilters);
    }

    if (emptyClearButton) {
        emptyClearButton.addEventListener("click", clearAllFilters);
    }
}

/* ---------- Add to Cart ---------- */

document.addEventListener("click", event => {
    const button = event.target.closest("[data-add-to-cart]");

    if (!button) return;

    const productId = button.dataset.addToCart;

    const product = QUICKKART_PRODUCTS.find(
        item => item.id === productId
    );

    if (!product) {
        showProductNotification("Product not found.", "error");
        return;
    }

    addProductToCart(product, button);
});

function addProductToCart(product, button) {
    const cart = readQuickKartCart();

    const existingItem = cart.find(item =>
        String(item.id) === String(product.id)
    );

    if (existingItem) {
        existingItem.quantity = Math.max(
            1,
            Number(existingItem.quantity) || 1
        ) + 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            quantity: 1
        });
    }

    if (!saveQuickKartCart(cart)) return;

    updateProductCartCount();

    const originalHTML = button.innerHTML;

    button.innerHTML =
        '<i class="fa-solid fa-check" aria-hidden="true"></i> Added to Cart';

    button.disabled = true;

    showProductNotification(
        `${product.name} added to your cart.`,
        "success"
    );

    window.setTimeout(() => {
        if (!button.isConnected) return;

        button.innerHTML = originalHTML;
        button.disabled = false;
    }, 1000);
}

/* ---------- Cart Count ---------- */

function updateProductCartCount() {
    const cart = readQuickKartCart();

    const totalItems = cart.reduce((total, item) => {
        const quantity = Number(item.quantity);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            return total;
        }

        return total + quantity;
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalItems;
        element.setAttribute(
            "aria-label",
            `${totalItems} items in cart`
        );
    });
}

window.addEventListener("storage", event => {
    if (event.key === QUICKKART_CART_KEY) {
        updateProductCartCount();
    }
});

window.addEventListener("quickkart:cart-updated", () => {
    updateProductCartCount();
});

/* ---------- Notifications ---------- */

let productNotificationTimer;

function showProductNotification(message, type = "success") {
    const notification = document.getElementById("notification");

    if (!notification) {
        console.log(message);
        return;
    }

    window.clearTimeout(productNotificationTimer);

    notification.textContent = message;
    notification.className = `notification show ${type}`;

    productNotificationTimer = window.setTimeout(() => {
        notification.classList.remove("show");
    }, 2600);
}

/* ---------- HTML Escaping ---------- */

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}
