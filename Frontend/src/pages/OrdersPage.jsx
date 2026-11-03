import { useEffect } from "react";

export default function OrdersPage() {
  useEffect(() => {
    document.title = "My Orders | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "orders.css"];
    const scriptFiles = ["common.js", "orders.js"];
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
            <input
              id="globalSearch"
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
            />
            <button
              id="searchButton"
              className="search-btn"
              type="button"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="header-actions">
            <a href="/profile" className="header-action">
              <i className="fa-regular fa-user"></i>
              Account
            </a>
            <a href="/orders" className="header-action" aria-current="page">
              <i className="fa-solid fa-box"></i>
              Orders
            </a>
            <a href="/cart" className="header-action cart-link">
              <i className="fa-solid fa-cart-shopping"></i>
              Cart
              <span className="cart-count" id="cartCount">
                0
              </span>
            </a>
          </div>
        </div>
      </header>

      <nav className="navbar" aria-label="Main navigation">
        <div className="container navbar-inner">
          <a href="/">
            <i className="fa-solid fa-house"></i>
            Home
          </a>
          <a href="/categories">Categories</a>
          <a href="/products">Products</a>
          <a href="/orders" aria-current="page">
            My Orders
          </a>
          <a href="/wishlist">Wishlist</a>
        </div>
      </nav>

      <main className="page">
        <div className="container">
          <div className="orders-page-header">
            <div>
              <h1 className="page-title">My Orders</h1>
              <p className="page-subtitle">
                View your purchases, check order status, and track your
                deliveries.
              </p>
            </div>
            <a href="/products" className="continue-shopping">
              <i className="fa-solid fa-arrow-left"></i>
              Continue Shopping
            </a>
          </div>

          <div className="order-tabs" role="group" aria-label="Filter orders">
            <button
              type="button"
              className="active"
              data-filter="all"
              aria-pressed="true"
            >
              All Orders
            </button>
            <button type="button" data-filter="processing" aria-pressed="false">
              Processing
            </button>
            <button type="button" data-filter="delivered" aria-pressed="false">
              Delivered
            </button>
            <button type="button" data-filter="cancelled" aria-pressed="false">
              Cancelled
            </button>
          </div>

          <section
            id="ordersContainer"
            className="orders-container"
            aria-label="Your orders"
            aria-live="polite"
          >
            <div className="orders-loading">
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true"></i>
              Loading your orders...
            </div>
          </section>

          <div className="orders-bottom-action">
            <p>Looking for something else?</p>
            <a href="/products" className="continue-shopping">
              Explore Products
              <i className="fa-solid fa-arrow-right"></i>
            </a>
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
            <a href="/products">Products</a>
            <a href="/categories">Categories</a>
            <a href="/cart">Shopping Cart</a>
          </div>
          <div className="footer-column">
            <h3>Account</h3>
            <a href="/profile">My Profile</a>
            <a href="/orders">My Orders</a>
            <a href="/wishlist">My Wishlist</a>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <a href="mailto:support@quickkart.example">Contact Support</a>
            <a href="/orders">Order Help</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © <span id="currentYear"></span> QuickKart. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
