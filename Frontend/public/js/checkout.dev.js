"use strict";

document.addEventListener("DOMContentLoaded", function () {
  loadCheckout();
  document.getElementById("placeOrder").addEventListener("click", placeOrder);
});

function loadCheckout() {
  var cart = JSON.parse(localStorage.getItem("quickkart_cart")) || [];
  var container = document.getElementById("checkoutItems");

  if (cart.length === 0) {
    container.innerHTML = "\n\n            <p style=\"color:#6b7280;\">\n                Your cart is empty.\n            </p>\n\n        ";
    return;
  }

  container.innerHTML = cart.map(function (item) {
    return "\n\n            <div class=\"checkout-item\">\n\n                <img\n                    src=\"".concat(item.image, "\"\n                    alt=\"").concat(item.name, "\">\n\n                <div class=\"checkout-item-info\">\n\n                    <h3>\n                        ").concat(item.name, "\n                    </h3>\n\n                    <p>\n                        Quantity: ").concat(item.quantity, "\n                    </p>\n\n                </div>\n\n                <strong>\n                    \u20B9").concat(item.price * item.quantity, "\n                </strong>\n\n            </div>\n\n        ");
  }).join("");
  var subtotal = cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
  var delivery = subtotal > 0 ? 40 : 0;
  var total = subtotal + delivery;
  document.getElementById("checkoutSubtotal").textContent = "\u20B9".concat(subtotal);
  document.getElementById("checkoutTotal").textContent = "\u20B9".concat(total);
}

function placeOrder() {
  var cart = JSON.parse(localStorage.getItem("quickkart_cart")) || [];

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  var order = {
    id: "QK" + Date.now(),
    date: new Date().toLocaleDateString(),
    status: "Confirmed",
    items: cart,
    total: cart.reduce(function (total, item) {
      return total + item.price * item.quantity;
    }, 0) + 40
  };
  localStorage.setItem("quickkart_last_order", JSON.stringify(order));
  localStorage.removeItem("quickkart_cart");
  window.location.href = "order-success.html";
}