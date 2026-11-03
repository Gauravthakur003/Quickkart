"use strict";

document.addEventListener("DOMContentLoaded", function () {
  renderCart();
});

function getCart() {
  return JSON.parse(localStorage.getItem("quickkart_cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("quickkart_cart", JSON.stringify(cart));
}

function renderCart() {
  var container = document.getElementById("cartContainer");

  if (!container) {
    return;
  }

  var cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = "\n\n            <div class=\"empty-cart\">\n\n                <i class=\"fa-solid fa-cart-shopping\"></i>\n\n                <h2>Your cart is empty</h2>\n\n                <p>\n                    Looks like you haven't added\n                    anything to your cart yet.\n                </p>\n\n                <a\n                    href=\"products.html\"\n                    class=\"btn btn-primary\">\n\n                    Start Shopping\n\n                </a>\n\n            </div>\n\n        ";
    updateSummary();
    return;
  }

  container.innerHTML = cart.map(function (item) {
    return "\n\n        <div class=\"cart-item\">\n\n            <img\n                src=\"".concat(item.image, "\"\n                class=\"cart-item-image\"\n                alt=\"").concat(item.name, "\">\n\n            <div>\n\n                <span class=\"cart-item-category\">\n                    Product\n                </span>\n\n                <h3>\n                    ").concat(item.name, "\n                </h3>\n\n                <div class=\"cart-item-price\">\n                    \u20B9").concat(item.price, "\n                </div>\n\n                <div class=\"cart-quantity\">\n\n                    <button\n                        onclick=\"changeQuantity(").concat(item.id, ", -1)\">\n                        \u2212\n                    </button>\n\n                    <span>\n                        ").concat(item.quantity, "\n                    </span>\n\n                    <button\n                        onclick=\"changeQuantity(").concat(item.id, ", 1)\">\n                        +\n                    </button>\n\n                </div>\n\n                <button\n                    class=\"remove-item\"\n                    onclick=\"removeItem(").concat(item.id, ")\">\n\n                    <i class=\"fa-solid fa-trash\"></i>\n                    Remove\n\n                </button>\n\n            </div>\n\n            <strong>\n                \u20B9").concat(item.price * item.quantity, "\n            </strong>\n\n        </div>\n\n    ");
  }).join("");
  updateSummary();
}

function changeQuantity(id, change) {
  var cart = getCart();
  var item = cart.find(function (item) {
    return item.id === id;
  });

  if (!item) {
    return;
  }

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(function (item) {
      return item.id !== id;
    });
  }

  saveCart(cart);
  renderCart();
  updateCartCount();
}

function removeItem(id) {
  var cart = getCart();
  cart = cart.filter(function (item) {
    return item.id !== id;
  });
  saveCart(cart);
  renderCart();
  updateCartCount();
  showNotification("Item removed");
}

function updateSummary() {
  var cart = getCart();
  var subtotal = cart.reduce(function (total, item) {
    return total + item.price * item.quantity;
  }, 0);
  var delivery = subtotal > 0 ? 40 : 0;
  var total = subtotal + delivery;
  document.getElementById("subtotal").textContent = "\u20B9".concat(subtotal);
  document.getElementById("delivery").textContent = "\u20B9".concat(delivery);
  document.getElementById("total").textContent = "\u20B9".concat(total);
}