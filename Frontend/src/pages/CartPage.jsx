import { useEffect } from "react";

export default function CartPage() {
  useEffect(() => {
    document.title = "Shopping Cart | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "cart.css"];
    const scriptFiles = ["common.js", "cart.js"];
    const addedLinks = [];
    const addedScripts = [];
    styleLinks.forEach((file) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `/css/${file}`;
      link.dataset.quickkartStyle = file;
      document.head.appendChild(link);
      addedLinks.push(link);
    });
    let cancelled = false;
    const loadScripts = async () => {
      for (const file of scriptFiles) {
        if (cancelled) return;
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = `/js/${file}`;
          script.async = false;
          script.onload = resolve;
          script.onerror = resolve;
          document.body.appendChild(script);
          addedScripts.push(script);
        });
      }
      if (!cancelled) document.dispatchEvent(new Event("DOMContentLoaded"));
    };
    loadScripts();
    return () => {
      cancelled = true;
      addedScripts.forEach((script) => script.remove());
      addedLinks.forEach((link) => link.remove());
      document.body.className = "";
    };
  }, []);
  return (
    <>
      <header className="header">
        <div className="container header-main">
          <a href="/" className="logo" aria-label="QuickKart Home">
            Quick<span>Kart</span>
          </a>
          <div className="search-box">
            <label htmlFor="globalSearch" className="sr-only">
              Search products
            </label>
            <input
              type="search"
              id="globalSearch"
              placeholder="Search products..."
              autoComplete="off"
            />
            <button
              type="button"
              id="searchButton"
              className="search-btn"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="header-actions">
            <a href="/login" className="header-action">
              <i className="fa-regular fa-user"></i>
              Account
            </a>
            <a href="/orders" className="header-action">
              <i className="fa-solid fa-box"></i>
              Orders
            </a>
            <a href="/cart" className="header-action cart-link">
              <i className="fa-solid fa-cart-shopping"></i>
              Cart
              <span className="cart-count">0</span>
            </a>
          </div>
        </div>
      </header>

      <nav className="navbar" aria-label="Main navigation">
        <div className="container navbar-inner">
          <a href="/">
            <i className="fa-solid fa-house"></i> Home
          </a>
          <a href="/categories">Categories</a>
          <a href="/products">All Products</a>
          <a href="/orders">My Orders</a>
          <a href="/wishlist">Wishlist</a>
        </div>
      </nav>

      <main className="page">
        <div className="container">
          <div className="cart-heading">
            <div>
              <h1 className="page-title">Shopping Cart</h1>
              <p className="cart-subtitle">
                Review your items before proceeding to checkout.
              </p>
            </div>
            <a href="/products" className="continue-shopping-top">
              <i className="fa-solid fa-arrow-left"></i>
              Continue shopping
            </a>
          </div>
          <div className="cart-layout">
            <section className="cart-items card" aria-label="Cart items">
              <div className="cart-items-heading">
                <h2>Your Items</h2>
                <span id="cartItemCount">0 items</span>
              </div>
              <div id="cartContainer" aria-live="polite"></div>
            </section>

            <aside className="cart-summary card" aria-label="Order summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong id="subtotal">₹0</strong>
              </div>
              <div className="summary-row">
                <span>Discount</span>
                <strong id="discount" className="discount">
                  −₹0
                </strong>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <strong id="delivery">₹0</strong>
              </div>
              <p id="deliveryMessage" className="delivery-message">
                Delivery charges are calculated from your cart.
              </p>
              <hr />
              <div className="summary-total">
                <span>Total Amount</span>
                <strong id="total">₹0</strong>
              </div>
              <p className="cart-tax-note">
                Final charges, if applicable, will be shown at checkout.
              </p>
              <a
                href="/checkout"
                id="checkoutButton"
                className="btn btn-primary checkout-btn"
              >
                <i className="fa-solid fa-lock"></i>
                Proceed to Checkout
              </a>
              <a href="/products" className="btn btn-outline continue-btn">
                Continue Shopping
              </a>
              <div className="cart-benefits">
                <div>
                  <i className="fa-solid fa-shield-halved"></i>
                  <span>Shop with confidence</span>
                </div>
                <div>
                  <i className="fa-solid fa-truck-fast"></i>
                  <span>Delivery details at checkout</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <h2>QuickKart</h2>
            <p>Everything you need, delivered fast.</p>
          </div>
          <div className="footer-column">
            <h3>Shop</h3>
            <a href="/products">All Products</a>
            <a href="/categories">Categories</a>
            <a href="/cart">Shopping Cart</a>
          </div>
          <div className="footer-column">
            <h3>Account</h3>
            <a href="/login">Login</a>
            <a href="/orders">My Orders</a>
            <a href="/profile">My Profile</a>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <a href="/tracking">Track Order</a>
            <a href="/admin/delivery-details">Delivery Information</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © <span id="currentYear">2026</span> QuickKart. All rights reserved.
          </p>
        </div>
      </footer>

      <div
        id="notification"
        className="notification"
        role="status"
        aria-live="polite"
      ></div>
    </>
  );
}
