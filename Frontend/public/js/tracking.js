
/* =========================================================
   QuickKart - Order Tracking
   File: js/tracking.js
   Storage: quickkart_orders, quickkart_cart
   ========================================================= */

"use strict";

const TRACKING_ORDERS_KEY = "quickkart_orders";
const TRACKING_CART_KEY = "quickkart_cart";

document.addEventListener("DOMContentLoaded", () => {
    initializeTracking();
});

/* ---------- Storage helpers ---------- */

function trackingGetOrders() {
    try {
        const orders = JSON.parse(
            localStorage.getItem(TRACKING_ORDERS_KEY) || "[]"
        );

        return Array.isArray(orders) ? orders : [];
    } catch (error) {
        console.error("Unable to read orders:", error);
        return [];
    }
}

function trackingGetCart() {
    try {
        const cart = JSON.parse(
            localStorage.getItem(TRACKING_CART_KEY) || "[]"
        );

        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        console.error("Unable to read cart:", error);
        return [];
    }
}

function trackingFormatPrice(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    }).format(Number(amount) || 0);
}

function trackingSetText(selector, value) {
    const element = document.querySelector(selector);

    if (element) {
        element.textContent = value ?? "";
    }
}

/* ---------- Status helpers ---------- */

function trackingNormalizeStatus(status) {
    return String(status || "Placed")
        .trim()
        .toLowerCase()
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ");
}

function trackingGetStatusInfo(status) {
    const normalized = trackingNormalizeStatus(status);

    if (normalized === "cancelled" || normalized === "canceled") {
        return {
            label: "Cancelled",
            step: -1,
            message: "This order has been cancelled."
        };
    }

    if (normalized === "delivered") {
        return {
            label: "Delivered",
            step: 3,
            message: "Your order has been delivered successfully."
        };
    }

    if (
        normalized === "out for delivery" ||
        normalized === "outfordelivery"
    ) {
        return {
            label: "Out for Delivery",
            step: 2,
            message: "Your order is on its way to your delivery address."
        };
    }

    if (normalized === "shipped" || normalized === "in transit") {
        return {
            label: "Shipped",
            step: 2,
            message: "Your order has been shipped."
        };
    }

    if (normalized === "packed" || normalized === "processing") {
        return {
            label: normalized === "packed" ? "Packed" : "Processing",
            step: 1,
            message: "Your order is being prepared for shipment."
        };
    }

    return {
        label: "Placed",
        step: 0,
        message: "Your order has been placed successfully."
    };
}

/* ---------- Timeline ---------- */

function trackingRenderTimeline(order) {
    const steps = Array.from(
        document.querySelectorAll(".tracking-progress .tracking-step")
    );

    const lines = Array.from(
        document.querySelectorAll(".tracking-progress .tracking-line")
    );

    const statusElement =
        document.querySelector("#trackingStatus") ||
        document.querySelector(".tracking-header .order-status");

    const statusInfo = trackingGetStatusInfo(order.status);

    if (statusElement) {
        statusElement.textContent = statusInfo.label;
        statusElement.classList.remove(
            "placed",
            "packed",
            "shipped",
            "out-for-delivery",
            "delivered",
            "cancelled"
        );

        statusElement.classList.add(
            statusInfo.label.toLowerCase().replace(/\s+/g, "-")
        );
    }

    steps.forEach((step, index) => {
        step.classList.remove("completed", "active", "cancelled");

        if (statusInfo.step === -1) {
            step.classList.add("cancelled");
            return;
        }

        // Delivered means every timeline step is complete.
        if (
            statusInfo.step === 3 ||
            index < statusInfo.step
        ) {
            step.classList.add("completed");
        } else if (index === statusInfo.step) {
            step.classList.add("active");
        }
    });

    lines.forEach((line, index) => {
        line.classList.remove("completed", "active");

        if (statusInfo.step === -1) {
            return;
        }

        if (
            statusInfo.step === 3 ||
            index < statusInfo.step
        ) {
            line.classList.add("completed");
        } else if (index === statusInfo.step) {
            line.classList.add("active");
        }
    });

    const message = document.getElementById("trackingMessage");

    if (message) {
        message.textContent = statusInfo.message;
        message.hidden = false;
    }
}

/* ---------- Delivery address ---------- */

function trackingRenderAddress(order) {
    const address = order.address || {};

    let name = "";
    let addressText = "";
    let phone = "";

    if (typeof address === "string") {
        // Supports orders where the address was saved as plain text.
        addressText = address;
        name = order.customerName || order.name || "";
        phone = order.phone || order.customerPhone || "";
    } else {
        name =
            address.name ||
            address.fullName ||
            address.customerName ||
            order.customerName ||
            order.name ||
            "";

        phone =
            address.phone ||
            address.mobile ||
            address.phoneNumber ||
            order.phone ||
            order.customerPhone ||
            "";

        addressText = [
            address.addressLine1,
            address.addressLine2,
            address.street,
            address.city,
            address.state,
            address.postalCode || address.pincode || address.zip,
            address.country
        ]
            .filter(Boolean)
            .join(", ");

        // Also support an object with a single formatted address.
        if (!addressText) {
            addressText =
                address.fullAddress ||
                address.addressText ||
                address.location ||
                "";
        }
    }

    trackingSetText("#trackingAddressName", name || "Customer");

    trackingSetText(
        "#trackingAddress",
        addressText || "No delivery address was saved with this order."
    );

    trackingSetText("#trackingPhone", phone || "Phone number not provided");
}

/* ---------- Order information ---------- */

function trackingRenderOrderInfo(order) {
    const createdAt = order.createdAt || order.orderDate;

    let formattedDate = "Date not available";

    if (createdAt) {
        const date = new Date(createdAt);

        if (!Number.isNaN(date.getTime())) {
            formattedDate = date.toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            });
        }
    }

    const items = Array.isArray(order.items) ? order.items : [];

    const itemCount = order.itemCount != null
        ? Number(order.itemCount)
        : items.reduce(
            (total, item) => total + (Number(item.quantity) || 1),
            0
        );

    const paymentMethod = String(
        order.paymentMethod || "Not specified"
    );

    const readablePaymentMethod = {
        cod: "Cash on Delivery",
        online: "Online Payment",
        upi: "UPI",
        card: "Card",
        netbanking: "Net Banking"
    }[paymentMethod.toLowerCase()] || paymentMethod;

    const paymentStatus = order.paymentStatus || "Pending";

    trackingSetText("#trackingOrderDate", formattedDate);
    trackingSetText(
        "#trackingItemCount",
        `${itemCount} ${itemCount === 1 ? "item" : "items"}`
    );
    trackingSetText("#trackingPayment", readablePaymentMethod);
    trackingSetText("#trackingPaymentStatus", paymentStatus);
    trackingSetText(
        "#trackingTotal",
        trackingFormatPrice(order.total)
    );

    trackingSetText(
        "#trackingOrderId",
        order.id || order.orderId || "Not available"
    );
}

/* ---------- Delivery partner ---------- */

function trackingHideDeliveryPartner() {
    const partnerSection = document.querySelector(".delivery-partner");

    // Do not display a fictional driver or contact number.
    if (partnerSection) {
        partnerSection.hidden = true;
    }
}

/* ---------- Cart count ---------- */

function trackingUpdateCartCount() {
    const cart = trackingGetCart();

    const count = cart.reduce(
        (total, item) => total + (Number(item.quantity) || 1),
        0
    );

    const countElements = document.querySelectorAll(
        "#cartCount, #cartItemCount, .cart-count, .cart-badge"
    );

    countElements.forEach((element) => {
        element.textContent = count;
    });
}

/* ---------- Empty / invalid order ---------- */

function trackingShowNotFound() {
    const trackingCard = document.querySelector(".tracking-card");

    if (!trackingCard) {
        return;
    }

    trackingCard.innerHTML = `
        <div class="tracking-not-found">
            <div class="tracking-not-found-icon" aria-hidden="true">📦</div>

            <h2>Order Not Found</h2>

            <p>
                We couldn't find this order. Please open your order history
                and select the order you want to track.
            </p>

            <a href="orders.html" class="btn btn-primary">
                View My Orders
            </a>
        </div>
    `;
}

/* ---------- Initialize tracking ---------- */

function initializeTracking() {
    const params = new URLSearchParams(window.location.search);
    const requestedOrderId = params.get("orderId");

    const orders = trackingGetOrders();

    let order = null;

    if (requestedOrderId) {
        order = orders.find((item) =>
            String(item.id || item.orderId) === requestedOrderId
        );
    } else if (orders.length > 0) {
        // If no ID is provided, show the most recently saved order.
        order = orders[orders.length - 1];
    }

    trackingUpdateCartCount();

    trackingSetText("#currentYear", new Date().getFullYear());

    if (!order) {
        trackingShowNotFound();
        return;
    }

    trackingRenderOrderInfo(order);
    trackingRenderAddress(order);
    trackingRenderTimeline(order);
    trackingHideDeliveryPartner();
}

/* ---------- Keep page in sync across tabs ---------- */

window.addEventListener("storage", (event) => {
    if (
        event.key === TRACKING_ORDERS_KEY ||
        event.key === TRACKING_CART_KEY
    ) {
        initializeTracking();
    }
});
