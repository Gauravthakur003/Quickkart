
"use strict";

/* =========================================
   QUICKKART - PRODUCT DETAILS
========================================= */

const DETAIL_CART_KEY = "quickkart_cart";
const DETAIL_WISHLIST_KEY = "quickkart_wishlist";

/*
  Keep these products synchronized with js/product.js.
  Product IDs must match the IDs in the listing page.
*/

const DETAIL_PRODUCTS = [
    {
        id: "qk-101",
        name: "Smart Wireless Accessory",
        category: "Electronics",
        price: 799,
        originalPrice: 999,
        rating: 4.3,
        reviews: 120,
        image: "../assets/box1_image.jpg",
        badge: "Popular",
        description:
            "A practical wireless accessory designed for everyday convenience. A useful choice for home, office, and daily activities."
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
        badge: "Top Rated",
        description:
            "An everyday home essential that combines practical use with a simple, convenient design."
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
        badge: "",
        description:
            "A beauty and personal care pick for your everyday routine."
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
        badge: "Trending",
        description:
            "An everyday fashion choice designed to complement your personal style."
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
        badge: "",
        description:
            "A convenient grocery pick for your everyday household shopping."
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
        description:
            "A useful home product selected to make everyday tasks more convenient."
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
        badge: "Recommended",
        description:
            "An electronics pick for customers looking for useful everyday technology."
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
        description:
            "A personal care essential for your everyday grooming and self-care routine."
    }
];

/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const productId = new URLSearchParams(
        window.location.search
    ).get("id");

    const product = DETAIL_PRODUCTS.find(
        item => item.id === productId
    );

    setCurrentYear();
    updateCartCount();
    setupGlobalSearch();

    if (!product) {
        showProductNotFound();
        return;
    }

    renderProductDetails(product);
    setupQuantityControls();
    setupAddToCart(product);
    setupBuyNow(product);
    setupWishlist(product);
});

/* =========================================
   SAFE LOCAL STORAGE HELPERS
========================================= */

function readStorage(key) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        console.error(`Unable to read ${key}:`, error);
        return [];
    }
}

function saveStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error(`Unable to save ${key}:`, error);
        showMessage("Unable to save your changes. Please try again.");
        return false;
    }
}

/* =========================================
   DISPLAY PRODUCT DETAILS
========================================= */

function renderProductDetails(product) {
    const image = document.getElementById("productDetailImage");
    const badge = document.getElementById("detailBadge");

    document.getElementById("productDetailName").textContent =
        product.name;

    document.getElementById("productDetailCategory").textContent =
        product.category;

    document.getElementById("productDetailPrice").textContent =
        formatPrice(product.price);

    document.getElementById("productDetailOriginalPrice").textContent =
        formatPrice(product.originalPrice);

    document.getElementById("productDetailRating").textContent =
        product.rating.toFixed(1);

    document.getElementById("productDetailReviews").textContent =
        `(${product.reviews} reviews)`;

    document.getElementById("productDetailDescription").textContent =
        product.description;

    document.getElementById("infoProductName").textContent =
        product.name;

    document.getElementById("infoProductCategory").textContent =
        product.category;

    const discount = product.originalPrice > 0
        ? Math.round(
            ((product.originalPrice - product.price) /
                product.originalPrice) * 100
        )
        : 0;

    document.getElementById("productDetailDiscount").textContent =
        `${discount}% OFF`;

    const roundedRating = Math.round(product.rating);

    document.getElementById("productDetailStars").textContent =
        "★".repeat(roundedRating) +
        "☆".repeat(5 - roundedRating);

    image.src = product.image;
    image.alt = product.name;

    image.onerror = () => {
        image.onerror = null;
        image.alt = `${product.name} image unavailable`;
    };

    if (product.badge) {
        badge.textContent = product.badge;
        badge.hidden = false;
    } else {
        badge.hidden = true;
    }

    document.title = `${product.name} | QuickKart`;
}

/* =========================================
   PRODUCT NOT FOUND
========================================= */

function showProductNotFound() {
    const details = document.getElementById("productDetails");

    details.innerHTML = `
        <div class="product-not-found">
            <i class="fa-solid fa-box-open"></i>
            <h1>Product Not Found</h1>
            <p>
                We couldn't find this product. It may have been removed
                or the product link may be incorrect.
            </p>
            <a href="product.html" class="btn btn-primary">
                Browse Products
            </a>
        </div>
    `;

    details.style.gridTemplateColumns = "1fr";
    details.style.textAlign = "center";
}

/* =========================================
   PRICE FORMATTING
========================================= */

function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

/* =========================================
   QUANTITY CONTROLS
========================================= */

function setupQuantityControls() {
    const quantityInput = document.getElementById("quantity");
    const decreaseButton = document.getElementById("decreaseQuantity");
    const increaseButton = document.getElementById("increaseQuantity");

    function getQuantity() {
        let quantity = Number.parseInt(quantityInput.value, 10);

        if (!Number.isFinite(quantity)) {
            quantity = 1;
        }

        quantity = Math.max(1, Math.min(99, quantity));
        quantityInput.value = quantity;

        return quantity;
    }

    decreaseButton.addEventListener("click", () => {
        quantityInput.value = Math.max(1, getQuantity() - 1);
    });

    increaseButton.addEventListener("click", () => {
        quantityInput.value = Math.min(99, getQuantity() + 1);
    });

    quantityInput.addEventListener("change", getQuantity);

    quantityInput.addEventListener("input", () => {
        if (quantityInput.value === "") {
            return;
        }

        getQuantity();
    });
}

/* =========================================
   ADD TO CART
========================================= */

function setupAddToCart(product) {
    document.getElementById("addToCart").addEventListener("click", () => {
        const quantity = getSelectedQuantity();

        if (addProductToCart(product, quantity)) {
            showMessage(`${product.name} added to your cart.`);
        }
    });
}

function addProductToCart(product, quantity) {
    const cart = readStorage(DETAIL_CART_KEY);

    const existingItem = cart.find(
        item => String(item.id) === String(product.id)
    );

    if (existingItem) {
        const currentQuantity = Number(existingItem.quantity) || 0;

        if (currentQuantity + quantity > 99) {
            showMessage("Maximum quantity per product is 99.");
            return false;
        }

        existingItem.quantity = currentQuantity + quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category,
            quantity
        });
    }

    if (!saveStorage(DETAIL_CART_KEY, cart)) {
        return false;
    }

    updateCartCount();

    document.dispatchEvent(
        new CustomEvent("quickkart:cart-updated", {
            detail: { cart }
        })
    );

    return true;
}

function getSelectedQuantity() {
    const input = document.getElementById("quantity");
    const parsed = Number.parseInt(input.value, 10);

    const quantity = Number.isFinite(parsed)
        ? Math.max(1, Math.min(99, parsed))
        : 1;

    input.value = quantity;

    return quantity;
}

/* =========================================
   BUY NOW
========================================= */

function setupBuyNow(product) {
    document.getElementById("buyNowButton").addEventListener("click", () => {
        const quantity = getSelectedQuantity();

        if (addProductToCart(product, quantity)) {
            window.location.href = "checkout.html";
        }
    });
}

/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {
    const cart = readStorage(DETAIL_CART_KEY);

    const totalItems = cart.reduce((total, item) => {
        return total + Math.max(0, Number(item.quantity) || 0);
    }, 0);

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalItems;
    });
}

/* =========================================
   WISHLIST
========================================= */

function setupWishlist(product) {
    const button = document.getElementById("wishlistButton");

    function getWishlist() {
        return readStorage(DETAIL_WISHLIST_KEY);
    }

    function isWishlisted() {
        return getWishlist().some(
            item => String(item.id) === String(product.id)
        );
    }

    function updateWishlistButton() {
        const active = isWishlisted();

        button.setAttribute("aria-pressed", String(active));
        button.setAttribute(
            "aria-label",
            active ? "Remove from wishlist" : "Add to wishlist"
        );

        button.innerHTML = active
            ? '<i class="fa-solid fa-heart"></i>'
            : '<i class="fa-regular fa-heart"></i>';
    }

    updateWishlistButton();

    button.addEventListener("click", () => {
        const wishlist = getWishlist();
        const index = wishlist.findIndex(
            item => String(item.id) === String(product.id)
        );

        if (index !== -1) {
            wishlist.splice(index, 1);

            if (saveStorage(DETAIL_WISHLIST_KEY, wishlist)) {
                updateWishlistButton();
                showMessage("Removed from your wishlist.");
            }

            return;
        }

        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.image,
            category: product.category
        });

        if (saveStorage(DETAIL_WISHLIST_KEY, wishlist)) {
            updateWishlistButton();
            showMessage("Added to your wishlist.");
        }
    });
}

/* =========================================
   GLOBAL SEARCH
========================================= */

function setupGlobalSearch() {
    const searchInput = document.getElementById("globalSearch");
    const searchButton = document.getElementById("searchButton");

    if (!searchInput || !searchButton) {
        return;
    }

    function performSearch() {
        const query = searchInput.value.trim();

        if (!query) {
            searchInput.focus();
            return;
        }

        window.location.href =
            `product.html?search=${encodeURIComponent(query)}`;
    }

    searchButton.addEventListener("click", performSearch);

    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            performSearch();
        }
    });
}

/* =========================================
   NOTIFICATION
========================================= */

function showMessage(message) {
    const notification = document.getElementById("notification");
    const detailMessage = document.getElementById("detailMessage");

    if (detailMessage) {
        detailMessage.textContent = message;
    }

    if (typeof window.showNotification === "function") {
        window.showNotification(message);
        return;
    }

    if (!notification) {
        return;
    }

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(showMessage.timeout);

    showMessage.timeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

/* =========================================
   FOOTER YEAR
========================================= */

function setCurrentYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
