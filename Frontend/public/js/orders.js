
/* =========================================================
   QuickKart - My Orders
   File: js/orders.js

   Storage:
   - quickkart_orders
   - quickkart_cart

   Compatible with:
   - pages/orders.html
   - pages/tracking.html
   - pages/checkout.html
   ========================================================= */

"use strict";

const ORDERS_STORAGE_KEY = "quickkart_orders";
const CART_STORAGE_KEY = "quickkart_cart";

let currentOrderFilter = "all";

/* ================= INITIALIZATION ================= */

document.addEventListener("DOMContentLoaded", () => {
    setupOrderTabs();
    renderOrders();
    updateOrdersCartCount();
    updateOrdersYear();
});

/* ================= STORAGE HELPERS ================= */

function getSavedOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(ORDERS_STORAGE_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Unable to read saved orders:", error);
        return [];
    }
}

function getSavedCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(CART_STORAGE_KEY) || "[]"
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function saveOrders(orders) {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

/* ================= FORMAT HELPERS ================= */

function formatOrderPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
}

function escapeOrderHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => {
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

function formatOrderDate(value) {
    if (!value) {
        return "Date unavailable";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });
}

function normalizeOrderStatus(status) {
    return String(status || "Placed")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
}

function getOrderStatusLabel(status) {
    const normalized = normalizeOrderStatus(status);

    const labels = {
        placed: "Placed",
        confirmed: "Confirmed",
        processing: "Processing",
        packed: "Packed",
        shipped: "Shipped",
        "in transit": "In Transit",
        "out for delivery": "Out for Delivery",
        delivered: "Delivered",
        cancelled: "Cancelled",
        canceled: "Cancelled"
    };

    return labels[normalized] || "Placed";
}

function getOrderStatusClass(status) {
    const normalized = normalizeOrderStatus(status);

    if (normalized === "delivered") {
        return "delivered";
    }

    if (normalized === "cancelled" || normalized === "canceled") {
        return "cancelled";
    }

    if (normalized === "confirmed") {
        return "confirmed";
    }

    if (normalized === "packed") {
        return "packed";
    }

    if (
        normalized === "shipped" ||
        normalized === "in transit" ||
        normalized === "out for delivery"
    ) {
        return normalized.replace(/\s+/g, "-");
    }

    return "processing";
}

/* ================= FILTER TABS ================= */

function setupOrderTabs() {
    const tabs = document.querySelectorAll(".order-tabs button");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            currentOrderFilter = tab.dataset.filter || "all";

            tabs.forEach((item) => {
                const isActive = item === tab;

                item.classList.toggle("active", isActive);
                item.setAttribute("aria-pressed", String(isActive));
            });

            renderOrders();
        });
    });
}

function orderMatchesFilter(order, filter) {
    const status = normalizeOrderStatus(order.status);

    if (filter === "all") {
        return true;
    }

    if (filter === "processing") {
        return [
            "placed",
            "confirmed",
            "processing",
            "packed",
            "shipped",
            "in transit",
            "out for delivery"
        ].includes(status);
    }

    if (filter === "delivered") {
        return status === "delivered";
    }

    if (filter === "cancelled") {
        return status === "cancelled" || status === "canceled";
    }

    return true;
}

/* ================= CART COUNT ================= */

function updateOrdersCartCount() {
    const cart = getSavedCart();

    const count = cart.reduce((total, item) => {
        return total + (Number(item.quantity) || 1);
    }, 0);

    document.querySelectorAll(
        ".cart-count, #cartCount, #cartItemCount"
    ).forEach((element) => {
        element.textContent = count;
    });
}

/* ================= FOOTER YEAR ================= */

function updateOrdersYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* ================= ORDER ITEM COUNT ================= */

function getOrderItemCount(order) {
    if (order.itemCount !== undefined && order.itemCount !== null) {
        return Number(order.itemCount) || 0;
    }

    const items = Array.isArray(order.items) ? order.items : [];

    return items.reduce((total, item) => {
        return total + (Number(item.quantity) || 1);
    }, 0);
}

/* ================= ORDER CARD ================= */

function createOrderCard(order) {
    const orderId = String(order.id || order.orderId || "Unknown");

    const items = Array.isArray(order.items) ? order.items : [];

    const statusLabel = getOrderStatusLabel(order.status);
    const statusClass = getOrderStatusClass(order.status);

    const itemCount = getOrderItemCount(order);

    const orderDate = formatOrderDate(
        order.createdAt || order.orderDate
    );

    const total = Number(order.total) || 0;

    const productHTML = items.length
        ? items.map((item) => {
            const name = escapeOrderHTML(item.name || "Product");
            const image = escapeOrderHTML(
                item.image || "../assets/box1_image.jpg"
            );

            const quantity = Number(item.quantity) || 1;
            const price = Number(item.price) || 0;

            return `
                <div class="order-product">
                    <img
                        src="${image}"
                        alt="${name}"
                        loading="lazy"
                        onerror="this.onerror=null;this.src='../assets/box1_image.jpg';"
                    >

                    <div class="order-product-info">
                        <h3>${name}</h3>

                        <p>
                            Quantity: ${quantity}
                        </p>

                        <p>
                            ${formatOrderPrice(price)} each
                        </p>
                    </div>

                    <div class="order-product-price">
                        ${formatOrderPrice(price * quantity)}
                    </div>
                </div>
            `;
        }).join("")
        : `
            <div class="order-product">
                <div class="order-product-info">
                    <h3>Order items unavailable</h3>
                    <p>Product details were not saved for this order.</p>
                </div>
            </div>
        `;

    const canTrack =
        statusClass !== "cancelled" &&
        statusClass !== "delivered";

    const trackButton = canTrack
        ? `
            <a
                href="tracking.html?orderId=${encodeURIComponent(orderId)}"
                class="btn btn-primary"
            >
                <i class="fa-solid fa-truck-fast"></i>
                Track Order
            </a>
        `
        : statusClass === "delivered"
            ? `
                <a
                    href="tracking.html?orderId=${encodeURIComponent(orderId)}"
                    class="btn"
                >
                    <i class="fa-solid fa-box"></i>
                    View Order
                </a>
            `
            : "";

    return `
        <article class="order-card">

            <div class="order-header">

                <div class="order-header-left">

                    <div>
                        <small>ORDER PLACED</small>
                        <strong>${escapeOrderHTML(orderDate)}</strong>
                    </div>

                    <div>
                        <small>ORDER ID</small>
                        <strong>${escapeOrderHTML(orderId)}</strong>
                    </div>

                    <div>
                        <small>ITEMS</small>
                        <strong>${itemCount}</strong>
                    </div>

                </div>

                <span class="order-status ${statusClass}">
                    ${escapeOrderHTML(statusLabel)}
                </span>

            </div>

            <div class="order-body">

                <div class="order-products">
                    ${productHTML}
                </div>

                <div class="order-footer">

                    <div class="order-total">
                        <small>Total amount</small>
                        ${formatOrderPrice(total)}
                    </div>

                    <div class="order-actions">

                        ${trackButton}

                        <button
                            type="button"
                            class="btn"
                            data-order-details="${escapeOrderHTML(orderId)}"
                        >
                            <i class="fa-solid fa-circle-info"></i>
                            Order Details
                        </button>

                        ${
                            statusClass !== "delivered" &&
                            statusClass !== "cancelled"
                                ? `
                                    <button
                                        type="button"
                                        class="btn"
                                        data-cancel-order="${escapeOrderHTML(orderId)}"
                                    >
                                        <i class="fa-solid fa-xmark"></i>
                                        Cancel Order
                                    </button>
                                `
                                : ""
                        }

                    </div>

                </div>

            </div>

        </article>
    `;
}

/* ================= EMPTY STATE ================= */

function renderEmptyOrders() {
    const container = document.getElementById("ordersContainer");

    if (!container) {
        return;
    }

    const isFiltered = currentOrderFilter !== "all";

    const title = isFiltered
        ? "No matching orders"
        : "You haven't placed any orders yet";

    const message = isFiltered
        ? "There are no orders in this category. Try another filter."
        : "Your purchases will appear here when you place your first order.";

    container.innerHTML = `
        <div class="no-orders">

            <i
                class="fa-solid fa-box-open"
                aria-hidden="true"
            ></i>

            <h2>${title}</h2>

            <p>${message}</p>

            ${
                isFiltered
                    ? `
                        <button
                            type="button"
                            class="btn"
                            data-reset-order-filter
                        >
                            View All Orders
                        </button>
                    `
                    : `
                        <a href="product.html" class="btn btn-primary">
                            <i class="fa-solid fa-cart-shopping"></i>
                            Start Shopping
                        </a>
                    `
            }

        </div>
    `;
}

/* ================= RENDER ORDERS ================= */

function renderOrders() {
    const container = document.getElementById("ordersContainer");

    if (!container) {
        console.error("Missing #ordersContainer in orders.html");
        return;
    }

    const orders = getSavedOrders();

    // Show newest orders first without changing saved storage order.
    const sortedOrders = [...orders].reverse();

    const filteredOrders = sortedOrders.filter((order) =>
        orderMatchesFilter(order, currentOrderFilter)
    );

    if (filteredOrders.length === 0) {
        renderEmptyOrders();
        return;
    }

    container.innerHTML = filteredOrders
        .map(createOrderCard)
        .join("");
}

/* ================= ORDER DETAILS ================= */

function showOrderDetails(orderId) {
    const order = getSavedOrders().find((item) => {
        return String(item.id || item.orderId) === String(orderId);
    });

    if (!order) {
        alert("Order not found.");
        return;
    }

    const address = order.address;

    let addressText = "Not available";

    if (typeof address === "string") {
        addressText = address || addressText;
    } else if (address && typeof address === "object") {
        addressText = [
            address.name || address.fullName,
            address.addressLine1,
            address.addressLine2,
            address.street,
            address.city,
            address.state,
            address.postalCode || address.pincode || address.zip,
            address.phone
        ]
            .filter(Boolean)
            .join(", ") || address.fullAddress || "Not available";
    }

    const paymentMethod = String(order.paymentMethod || "Not specified");

    const details = [
        `Order ID: ${order.id || order.orderId || "Unknown"}`,
        `Status: ${getOrderStatusLabel(order.status)}`,
        `Order Date: ${formatOrderDate(order.createdAt || order.orderDate)}`,
        `Items: ${getOrderItemCount(order)}`,
        `Subtotal: ${formatOrderPrice(order.subtotal)}`,
        `Delivery: ${formatOrderPrice(order.delivery)}`,
        `Total: ${formatOrderPrice(order.total)}`,
        `Payment Method: ${paymentMethod}`,
        `Payment Status: ${order.paymentStatus || "Pending"}`,
        `Delivery Address: ${addressText}`
    ];

    alert(details.join("\n"));
}

/* ================= CANCEL ORDER ================= */

function cancelOrder(orderId) {
    const orders = getSavedOrders();

    const orderIndex = orders.findIndex((item) => {
        return String(item.id || item.orderId) === String(orderId);
    });

    if (orderIndex === -1) {
        alert("Order not found.");
        return;
    }

    const order = orders[orderIndex];
    const status = normalizeOrderStatus(order.status);

    if (["shipped", "in transit", "out for delivery", "delivered"].includes(status)) {
        alert(
            "This order can no longer be cancelled from the order history page."
        );
        return;
    }

    if (status === "cancelled" || status === "canceled") {
        alert("This order has already been cancelled.");
        return;
    }

    const confirmed = window.confirm(
        `Are you sure you want to cancel order ${order.id || order.orderId}?`
    );

    if (!confirmed) {
        return;
    }

    orders[orderIndex] = {
        ...order,
        status: "Cancelled",
        cancelledAt: new Date().toISOString()
    };

    try {
        saveOrders(orders);
        renderOrders();
        alert("Order cancelled successfully.");
    } catch (error) {
        console.error("Unable to cancel order:", error);
        alert("Unable to save the cancellation. Please try again.");
    }
}

/* ================= BUTTON EVENTS ================= */

document.addEventListener("click", (event) => {
    const detailsButton = event.target.closest("[data-order-details]");

    if (detailsButton) {
        showOrderDetails(detailsButton.dataset.orderDetails);
        return;
    }

    const cancelButton = event.target.closest("[data-cancel-order]");

    if (cancelButton) {
        cancelOrder(cancelButton.dataset.cancelOrder);
        return;
    }

    const resetButton = event.target.closest("[data-reset-order-filter]");

    if (resetButton) {
        const allOrdersTab = document.querySelector(
            '.order-tabs button[data-filter="all"]'
        );

        if (allOrdersTab) {
            allOrdersTab.click();
        } else {
            currentOrderFilter = "all";
            renderOrders();
        }
    }
});

/* ================= CROSS-TAB UPDATES ================= */

window.addEventListener("storage", (event) => {
    if (
        event.key === ORDERS_STORAGE_KEY ||
        event.key === CART_STORAGE_KEY
    ) {
        renderOrders();
        updateOrdersCartCount();
    }
});
