
/* =========================================
   QUICKKART - SHOPPING CART
   File: js/cart.js
========================================= */

"use strict";

const CART_STORAGE_KEY = "quickkart_cart";
const FREE_DELIVERY_LIMIT = 999;
const DELIVERY_CHARGE = 40;
const MAX_QUANTITY = 99;

/* =========================================
   STORAGE HELPERS
========================================= */

function getCart() {
    try {
        const savedCart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(savedCart)) return [];

        return savedCart
            .filter(item => item && item.id != null)
            .map(item => ({
                ...item,
                id: String(item.id),
                name: String(item.name || "Product"),
                price: Math.max(0, Number(item.price) || 0),
                originalPrice: Math.max(
                    0,
                    Number(item.originalPrice) || Number(item.price) || 0
                ),
                quantity: Math.min(
                    MAX_QUANTITY,
                    Math.max(1, Math.floor(Number(item.quantity) || 1))
                )
            }));
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        return true;
    } catch (error) {
        console.error("Unable to save cart:", error);
        notify("Unable to update your cart. Please try again.");
        return false;
    }
}

/* =========================================
   FORMATTERS
========================================= */

function formatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
}

/* =========================================
   NOTIFICATIONS
========================================= */

function notify(message) {
    if (typeof window.showNotification === "function") {
        window.showNotification(message);
        return;
    }

    const notification = document.getElementById("notification");

    if (!notification) {
        console.log(message);
        return;
    }

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(notify.timeout);

    notify.timeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 2500);
}

/* =========================================
   CART COUNT
========================================= */

function updateCartCount() {
    const cart = getCart();

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = totalItems;
    });
}

/* =========================================
   CART CALCULATIONS
========================================= */

function calculateCart(cart) {
    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const originalTotal = cart.reduce(
        (total, item) =>
            total +
            Math.max(item.originalPrice, item.price) * item.quantity,
        0
    );

    const discount = Math.max(0, originalTotal - subtotal);

    const delivery = subtotal === 0
        ? 0
        : subtotal >= FREE_DELIVERY_LIMIT
            ? 0
            : DELIVERY_CHARGE;

    const total = subtotal + delivery;

    return {
        subtotal,
        discount,
        delivery,
        total,
        itemCount: cart.reduce(
            (count, item) => count + item.quantity,
            0
        )
    };
}

/* =========================================
   CART ITEM ELEMENTS
========================================= */

function createCartItem(item) {
    const article = createElement("article", "cart-item");
    article.dataset.id = item.id;

    /* Product image */

    const imageWrapper = createElement("div", "cart-item-image");
    const image = document.createElement("img");

    image.src = typeof item.image === "string" ? item.image : "";
    image.alt = item.name;
    image.loading = "lazy";

    image.addEventListener("error", () => {
        image.style.display = "none";

        if (!imageWrapper.querySelector(".image-placeholder")) {
            const placeholder = createElement(
                "div",
                "image-placeholder",
                "Image unavailable"
            );

            placeholder.style.cssText =
                "font-size:12px;color:#667085;text-align:center;";

            imageWrapper.appendChild(placeholder);
        }
    }, { once: true });

    imageWrapper.appendChild(image);

    /* Product details */

    const details = createElement("div", "cart-item-details");

    if (item.category) {
        details.appendChild(
            createElement("span", "cart-item-category", item.category)
        );
    }

    const title = createElement("h3", "cart-item-title");
    const titleLink = createElement("a", "", item.name);

    titleLink.href =
        `product-details.html?id=${encodeURIComponent(item.id)}`;

    title.appendChild(titleLink);
    details.appendChild(title);

    const price = createElement(
        "div",
        "cart-item-price",
        formatPrice(item.price)
    );

    if (item.originalPrice > item.price) {
        price.appendChild(
            createElement(
                "span",
                "cart-item-original-price",
                formatPrice(item.originalPrice)
            )
        );
    }

    details.appendChild(price);

    const stock = createElement("div", "cart-item-stock");
    const stockIcon = createElement("i", "fa-solid fa-circle-check");
    stockIcon.setAttribute("aria-hidden", "true");

    stock.append(stockIcon, document.createTextNode("Added to your cart"));
    details.appendChild(stock);

    /* Quantity, subtotal and remove */

    const actions = createElement("div", "cart-item-actions");

    const quantityControls = createElement("div", "cart-quantity");
    quantityControls.setAttribute("aria-label", `Quantity for ${item.name}`);

    const decreaseButton = createElement("button", "", "−");
    decreaseButton.type = "button";
    decreaseButton.dataset.action = "decrease";
    decreaseButton.setAttribute("aria-label", "Decrease quantity");
    decreaseButton.disabled = item.quantity <= 1;

    const quantityValue = createElement("span", "", String(item.quantity));
    quantityValue.setAttribute("aria-live", "polite");

    const increaseButton = createElement("button", "", "+");
    increaseButton.type = "button";
    increaseButton.dataset.action = "increase";
    increaseButton.setAttribute("aria-label", "Increase quantity");
    increaseButton.disabled = item.quantity >= MAX_QUANTITY;

    quantityControls.append(
        decreaseButton,
        quantityValue,
        increaseButton
    );

    const itemSubtotal = createElement(
        "div",
        "cart-item-subtotal",
        formatPrice(item.price * item.quantity)
    );

    const removeButton = createElement("button", "remove-item");
    removeButton.type = "button";
    removeButton.dataset.action = "remove";
    removeButton.setAttribute(`aria-label`, `Remove ${item.name}`);

    const removeIcon = createElement("i", "fa-regular fa-trash-can");
    removeIcon.setAttribute("aria-hidden", "true");

    removeButton.append(
        removeIcon,
        document.createTextNode(" Remove")
    );

    actions.append(quantityControls, itemSubtotal, removeButton);

    article.append(imageWrapper, details, actions);

    return article;
}

/* =========================================
   EMPTY CART
========================================= */

function createEmptyCart() {
    const wrapper = createElement("div", "empty-cart");

    const iconWrapper = createElement("div", "empty-cart-icon");
    const icon = createElement("i", "fa-solid fa-cart-shopping");

    icon.setAttribute("aria-hidden", "true");
    iconWrapper.appendChild(icon);

    const heading = createElement("h2", "", "Your cart is empty");

    const message = createElement(
        "p",
        "",
        "Looks like you haven't added anything yet. Explore our products and find something you love."
    );

    const shopButton = createElement(
        "a",
        "btn btn-primary",
        "Start Shopping"
    );

    shopButton.href = "product.html";

    wrapper.append(iconWrapper, heading, message, shopButton);

    return wrapper;
}

/* =========================================
   ORDER SUMMARY
========================================= */

function updateSummary(cart) {
    const totals = calculateCart(cart);

    const subtotalElement = document.getElementById("subtotal");
    const discountElement = document.getElementById("discount");
    const deliveryElement = document.getElementById("delivery");
    const totalElement = document.getElementById("total");
    const countElement = document.getElementById("cartItemCount");
    const deliveryMessage = document.getElementById("deliveryMessage");
    const checkoutButton = document.getElementById("checkoutButton");

    if (subtotalElement) {
        subtotalElement.textContent = formatPrice(totals.subtotal);
    }

    if (discountElement) {
        discountElement.textContent = `−${formatPrice(totals.discount)}`;
    }

    if (deliveryElement) {
        deliveryElement.textContent = totals.delivery === 0
            ? (totals.subtotal > 0 ? "FREE" : formatPrice(0))
            : formatPrice(totals.delivery);

        if (totals.subtotal > 0 && totals.delivery === 0) {
            deliveryElement.style.color = "#15803d";
        } else {
            deliveryElement.style.color = "";
        }
    }

    if (totalElement) {
        totalElement.textContent = formatPrice(totals.total);
    }

    if (countElement) {
        countElement.textContent =
            `${totals.itemCount} ${totals.itemCount === 1 ? "item" : "items"}`;
    }

    if (deliveryMessage) {
        if (totals.subtotal === 0) {
            deliveryMessage.textContent =
                `Delivery is ₹${DELIVERY_CHARGE} below ₹${FREE_DELIVERY_LIMIT}.`;
        } else if (totals.delivery === 0) {
            deliveryMessage.textContent = "You've unlocked free delivery!";
        } else {
            const remaining = FREE_DELIVERY_LIMIT - totals.subtotal;

            deliveryMessage.textContent =
                `Add ${formatPrice(remaining)} more to unlock free delivery.`;
        }
    }

    if (checkoutButton) {
        const isEmpty = cart.length === 0;

        checkoutButton.classList.toggle("disabled", isEmpty);
        checkoutButton.setAttribute("aria-disabled", String(isEmpty));
        checkoutButton.tabIndex = isEmpty ? -1 : 0;
    }
}

/* =========================================
   RENDER CART
========================================= */

function renderCart() {
    const container = document.getElementById("cartContainer");

    if (!container) return;

    const cart = getCart();

    container.replaceChildren();

    if (cart.length === 0) {
        container.appendChild(createEmptyCart());
    } else {
        const fragment = document.createDocumentFragment();

        cart.forEach(item => {
            fragment.appendChild(createCartItem(item));
        });

        container.appendChild(fragment);
    }

    updateSummary(cart);
    updateCartCount();
}

/* =========================================
   QUANTITY AND REMOVE EVENTS
========================================= */

function handleCartAction(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const itemElement = button.closest(".cart-item");

    if (!itemElement) return;

    const itemId = itemElement.dataset.id;
    const action = button.dataset.action;
    const cart = getCart();

    const item = cart.find(product => product.id === itemId);

    if (!item) {
        renderCart();
        return;
    }

    if (action === "increase") {
        if (item.quantity >= MAX_QUANTITY) {
            notify(`You can add up to ${MAX_QUANTITY} of this item.`);
            return;
        }

        item.quantity += 1;
    } else if (action === "decrease") {
        if (item.quantity <= 1) return;

        item.quantity -= 1;
    } else if (action === "remove") {
        const updatedCart = cart.filter(product => product.id !== itemId);

        if (!saveCart(updatedCart)) return;

        renderCart();
        notify(`${item.name} removed from your cart.`);
        return;
    } else {
        return;
    }

    if (saveCart(cart)) {
        renderCart();
    }
}

/* =========================================
   CHECKOUT GUARD
========================================= */

function setupCheckoutGuard() {
    const checkoutButton = document.getElementById("checkoutButton");

    if (!checkoutButton) return;

    checkoutButton.addEventListener("click", event => {
        if (getCart().length === 0) {
            event.preventDefault();
            notify("Your cart is empty. Add a product before checkout.");
        }
    });
}

/* =========================================
   INITIALIZATION
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("cartContainer");

    if (container) {
        container.addEventListener("click", handleCartAction);
    }

    setupCheckoutGuard();
    renderCart();

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

/* Refresh the cart if it changes in another browser tab. */

window.addEventListener("storage", event => {
    if (event.key === CART_STORAGE_KEY) {
        renderCart();
    }
});
