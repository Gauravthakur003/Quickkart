import { useEffect } from "react";

export default function WishlistPage() {
  useEffect(() => {
    document.title = "Wishlist | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "wishlist.css"];
    const scriptFiles = ["common.js"];
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
          <a href="/" className="logo">
            Quick<span>Kart</span>
          </a>
          <div className="search-box">
            <input id="globalSearch" placeholder="Search products..." />
            <button id="searchButton" className="search-btn">
              <i className="fa-solid fa-search"></i>
            </button>
          </div>
          <div className="header-actions">
            <a href="/profile" className="header-action">
              Account
            </a>
            <a href="/orders" className="header-action">
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
      <nav className="navbar">
        <div className="container navbar-inner">
          <a href="/">Home</a>
          <a href="/categories">Categories</a>
          <a href="/products">Products</a>
          <a href="/orders">Orders</a>
          <a href="/wishlist">Wishlist</a>
        </div>
      </nav>
      <main className="page">
        <div className="container">
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-subtitle">Products you've saved for later.</p>
          <div className="wishlist-grid">
            <article className="wishlist-card card">
              <div className="wishlist-image">
                <img src="/assets/box1_image.jpg" alt="Product" />
                <button className="remove-wishlist">
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>
              <div className="wishlist-content">
                <span className="product-category">Electronics</span>
                <h3>Smart Wireless Product</h3>
                <div className="rating">★★★★☆</div>
                <strong className="wishlist-price">₹799</strong>
                <button className="btn btn-primary">
                  <i className="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </button>
              </div>
            </article>
            <article className="wishlist-card card">
              <div className="wishlist-image">
                <img src="/assets/box2_image.jpg" alt="Product" />
                <button className="remove-wishlist">
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>
              <div className="wishlist-content">
                <span className="product-category">Home</span>
                <h3>Home Essential</h3>
                <div className="rating">★★★★★</div>
                <strong className="wishlist-price">₹499</strong>
                <button className="btn btn-primary">
                  <i className="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </button>
              </div>
            </article>
            <article className="wishlist-card card">
              <div className="wishlist-image">
                <img src="/assets/box3_image.jpg" alt="Product" />
                <button className="remove-wishlist">
                  <i className="fa-solid fa-heart"></i>
                </button>
              </div>
              <div className="wishlist-content">
                <span className="product-category">Beauty</span>
                <h3>Beauty Essentials</h3>
                <div className="rating">★★★★☆</div>
                <strong className="wishlist-price">₹349</strong>
                <button className="btn btn-primary">
                  <i className="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </button>
              </div>
            </article>
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="container footer-bottom">
          © 2026 QuickKart. All rights reserved.
        </div>
      </footer>
    </>
  );
}
