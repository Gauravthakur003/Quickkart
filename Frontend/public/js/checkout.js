
/* =========================================
   QUICKKART - CHECKOUT
   File: js/checkout.js
========================================= */

"use strict";

const CHECKOUT_CART_KEY = "quickkart_cart";
const CHECKOUT_ORDERS_KEY = "quickkart_orders";

const FREE_DELIVERY_LIMIT = 999;
const DELIVERY_CHARGE = 40;

/* =========================================
   HELPERS
========================================= */

function checkoutGetCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CHECKOUT_CART_KEY) || "[]"
        );

        if (!Array.isArray(cart)) return [];

        return cart
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
                quantity: Math.max(
                    1,
                    Math.floor(Number(item.quantity) || 1)
                )
            }));
    } catch (error) {
        console.error("Could not read shopping cart:", error);
        return [];
    }
}

function checkoutFormatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(amount);
}

function checkoutNotify(message) {
    if (typeof window.showNotification === "function") {
        window.showNotification(message);
        return;
    }

    let notification = document.getElementById("notification");

    if (!notification) {
        notification = document.createElement("div");
        notification.id = "notification";
        notification.className = "notification";

        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.classList.add("show");

    clearTimeout(checkoutNotify.timeout);

    checkoutNotify.timeout = setTimeout(() => {
        notification.classList.remove("show");
    }, 3000);
}

function checkoutCalculateTotals(cart) {
    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const delivery = subtotal === 0
        ? 0
        : subtotal >= FREE_DELIVERY_LIMIT
            ? 0
            : DELIVERY_CHARGE;

    return {
        subtotal,
        delivery,
        total: subtotal + delivery,
        itemCount: cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        )
    };
}

/* =========================================
   HEADER CART COUNT
========================================= */

function checkoutUpdateCartCount(cart) {
    const count = cart.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
    });
}

/* =========================================
   RENDER ORDER ITEMS
========================================= */

function checkoutRenderItems(cart) {
    const container = document.getElementById("checkoutItems");

    if (!container) return;

    container.replaceChildren();

    if (cart.length === 0) {
        const emptyMessage = document.createElement("div");
        emptyMessage.className = "checkout-empty";

        const message = document.createElement("p");
        message.textContent = "Your cart is empty.";

        const link = document.createElement("a");
        link.href = "product.html";
        link.className = "btn btn-outline";
        link.textContent = "Continue Shopping";

        emptyMessage.append(message, link);
        container.appendChild(emptyMessage);

        return;
    }

    const fragment = document.createDocumentFragment();

    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "checkout-item";

        const image = document.createElement("img");
        image.className = "checkout-item-image";
        image.src = typeof item.image === "string" ? item.image : "";
        image.alt = item.name;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            image.style.visibility = "hidden";
        }, { once: true });

        const details = document.createElement("div");
        details.className = "checkout-item-details";

        const name = document.createElement("h3");
        name.textContent = item.name;

        const quantity = document.createElement("p");
        quantity.textContent = `Quantity: ${item.quantity}`;

        const price = document.createElement("strong");
        price.textContent = checkoutFormatPrice(
            item.price * item.quantity
        );

        details.append(name, quantity, price);
        row.append(image, details);
        fragment.appendChild(row);
    });

    container.appendChild(fragment);
}

/* =========================================
   RENDER SUMMARY
========================================= */

function checkoutRenderSummary(cart) {
    const totals = checkoutCalculateTotals(cart);

    const subtotalElement = document.getElementById("checkoutSubtotal");
    const totalElement = document.getElementById("checkoutTotal");

    if (subtotalElement) {
        subtotalElement.textContent = checkoutFormatPrice(totals.subtotal);
    }

    if (totalElement) {
        totalElement.textContent = checkoutFormatPrice(totals.total);
    }

    // Find the Delivery summary row in the existing HTML.
    const summaryRows = document.querySelectorAll(
        ".checkout-summary .summary-row"
    );

    summaryRows.forEach(row => {
        const label = row.querySelector("span");
        const value = row.querySelector("strong");

        if (
            label &&
            value &&
            label.textContent.trim().toLowerCase() === "delivery"
        ) {
            value.textContent = totals.delivery === 0 && totals.subtotal > 0
                ? "FREE"
                : checkoutFormatPrice(totals.delivery);
        }
    });

    const placeOrderButton = document.getElementById("placeOrder");

    if (placeOrderButton) {
        placeOrderButton.disabled = cart.length === 0;
        placeOrderButton.setAttribute(
            "aria-disabled",
            String(cart.length === 0)
        );
    }

    return totals;
}

/* =========================================
   DELIVERY ADDRESS
========================================= */

function checkoutGetAddress() {
    const addressCard = document.querySelector(".address-card");

    if (!addressCard) {
        return {
            name: "",
            address: "",
            phone: ""
        };
    }

    const nameElement = addressCard.querySelector("strong");
    const paragraphs = addressCard.querySelectorAll("p");

    return {
        name: nameElement?.textContent.trim() || "",
        address: paragraphs[0]?.textContent.trim() || "",
        phone: paragraphs[1]?.textContent
            .replace(/^Phone:\s*/i, "")
            .trim() || ""
    };
}

/* =========================================
   PAYMENT METHOD
========================================= */

function checkoutGetPaymentMethod() {
    const selectedPayment = document.querySelector(
        'input[name="payment"]:checked'
    );

    return selectedPayment?.value || "cod";
}

/* =========================================
   PLACE ORDER
========================================= */

function checkoutPlaceOrder() {
    const cart = checkoutGetCart();

    if (cart.length === 0) {
        checkoutNotify("Your cart is empty. Add products before checkout.");
        return;
    }

    const totals = checkoutCalculateTotals(cart);
    const address = checkoutGetAddress();
    const paymentMethod = checkoutGetPaymentMethod();

    if (!address.name || !address.address || !address.phone) {
        checkoutNotify("Please provide a complete delivery address.");
        return;
    }

    const order = {
        id: "QK-" + Date.now(),
        items: cart.map(item => ({ ...item })),
        subtotal: totals.subtotal,
        delivery: totals.delivery,
        total: totals.total,
        itemCount: totals.itemCount,
        address,
        paymentMethod,
        paymentStatus: paymentMethod === "cod"
            ? "Pay on delivery"
            : "Pending",
        status: "Placed",
        createdAt: new Date().toISOString()
    };

    let orders = [];

    try {
        const savedOrders = JSON.parse(
            localStorage.getItem(CHECKOUT_ORDERS_KEY) || "[]"
        );

        orders = Array.isArray(savedOrders) ? savedOrders : [];
    } catch (error) {
        console.error("Could not read saved orders:", error);
        checkoutNotify("Unable to access your orders. Please try again.");
        return;
    }

    orders.unshift(order);

    try {
        // Save the order before clearing the cart.
        localStorage.setItem(
            CHECKOUT_ORDERS_KEY,
            JSON.stringify(orders)
        );

        localStorage.removeItem(CHECKOUT_CART_KEY);
    } catch (error) {
        console.error("Could not save order:", error);
        checkoutNotify(
            "Unable to save your order. Please check browser storage."
        );
        return;
    }

    // Keep the cart badge in sync.
    checkoutUpdateCartCount([]);

    const button = document.getElementById("placeOrder");

    if (button) {
        button.disabled = true;
        button.textContent = "Order Placed";
    }

    checkoutNotify("Your order has been placed successfully!");

    // Open the existing order-success page.
    window.location.href =
        `order-success.html?orderId=${encodeURIComponent(order.id)}`;
}

/* =========================================
   INITIALIZE CHECKOUT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const cart = checkoutGetCart();

    checkoutUpdateCartCount(cart);
    checkoutRenderItems(cart);
    checkoutRenderSummary(cart);

    const placeOrderButton = document.getElementById("placeOrder");

    if (placeOrderButton) {
        placeOrderButton.addEventListener("click", checkoutPlaceOrder);
    }

    const changeAddressButton = document.querySelector(
        ".address-card .btn"
    );

    if (changeAddressButton) {
        changeAddressButton.addEventListener("click", () => {
            checkoutNotify(
                "Address editing is not implemented yet. Update the address in checkout.html for this demo."
            );
        });
    }
});

/* Refresh checkout if the cart changes in another browser tab. */

window.addEventListener("storage", event => {
    if (event.key === CHECKOUT_CART_KEY) {
        const cart = checkoutGetCart();

        checkoutUpdateCartCount(cart);
        checkoutRenderItems(cart);
        checkoutRenderSummary(cart);
    }
});
