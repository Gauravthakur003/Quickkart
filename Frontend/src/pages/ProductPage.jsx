import { useEffect } from "react";

export default function ProductPage() {
  useEffect(() => {
    document.title = "All Products | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "product.css"];
    const scriptFiles = ["common.js", "product.js"];
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
        <div className="header-main">
          <a href="/" className="logo" aria-label="QuickKart home">
            Quick<span>Kart</span>
          </a>
          <div className="location">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <span className="location-label">Deliver to</span>
              <strong>India</strong>
            </div>
          </div>
          <div className="search-box">
            <label className="sr-only" htmlFor="globalSearch">
              Search products
            </label>
            <input
              type="search"
              id="globalSearch"
              placeholder="Search QuickKart products..."
              autoComplete="off"
            />
            <button
              type="button"
              id="searchButton"
              aria-label="Search products"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="header-actions">
            <a href="/login" className="header-action">
              <i className="fa-regular fa-user"></i>
              <span>Account</span>
            </a>
            <a href="/orders" className="header-action">
              <i className="fa-solid fa-box"></i>
              <span>Orders</span>
            </a>
            <a href="/cart" className="header-action cart-link">
              <span className="cart-icon-wrapper">
                <i className="fa-solid fa-cart-shopping"></i>
                <span className="cart-count">0</span>
              </span>
              <span>Cart</span>
            </a>
          </div>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="/">
            <i className="fa-solid fa-house"></i>
            Home
          </a>
          <a href="/categories">
            <i className="fa-solid fa-layer-group"></i>
            Categories
          </a>
          <a href="/products" className="active" aria-current="page">
            <i className="fa-solid fa-bag-shopping"></i>
            All Products
          </a>
          <a href="/orders">
            <i className="fa-solid fa-box-open"></i>
            My Orders
          </a>
          <a href="/wishlist">
            <i className="fa-regular fa-heart"></i>
            Wishlist
          </a>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <i className="fa-solid fa-chevron-right"></i>
            <span>All Products</span>
          </div>

          <section className="page-heading">
            <div>
              <span className="eyebrow">DISCOVER YOUR NEXT FAVOURITE</span>
              <h1>Explore All Products</h1>
              <p>
                Find everyday essentials, trending picks, and more in one place.
              </p>
            </div>
            <div className="heading-icon" aria-hidden="true">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
          </section>

          <section className="product-layout" aria-label="Product catalogue">
            <aside className="filters card">
              <div className="filter-header">
                <div>
                  <h2>
                    <i className="fa-solid fa-sliders"></i>
                    Filters
                  </h2>
                  <p>Refine your search</p>
                </div>
                <button
                  type="button"
                  id="clearFilters"
                  className="clear-filters"
                >
                  Clear all
                </button>
              </div>
              <div className="filter-group">
                <h3>Categories</h3>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="category"
                    value="Groceries"
                    data-category-filter=""
                  />
                  <span>Groceries</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="category"
                    value="Electronics"
                    data-category-filter=""
                  />
                  <span>Electronics</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="category"
                    value="Beauty"
                    data-category-filter=""
                  />
                  <span>Beauty</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="category"
                    value="Fashion"
                    data-category-filter=""
                  />
                  <span>Fashion</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="category"
                    value="Home"
                    data-category-filter=""
                  />
                  <span>Home & Living</span>
                </label>
              </div>
              <div className="filter-divider"></div>
              <div className="filter-group">
                <h3>Price Range</h3>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="price"
                    value="under500"
                    data-price-filter=""
                  />
                  <span>Under ₹500</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="price"
                    value="500to1000"
                    data-price-filter=""
                  />
                  <span>₹500 – ₹1,000</span>
                </label>
                <label className="filter-option">
                  <input
                    type="checkbox"
                    name="price"
                    value="over1000"
                    data-price-filter=""
                  />
                  <span>₹1,000 and above</span>
                </label>
              </div>
              <div className="filter-divider"></div>
              <div className="filter-help">
                <i className="fa-solid fa-truck-fast"></i>
                <div>
                  <strong>Shopping made simple</strong>
                  <p>Explore products across different categories.</p>
                </div>
              </div>
            </aside>

            <div className="products-content">
              <div className="products-toolbar">
                <div className="results-info">
                  <h2>Our Products</h2>
                  <p id="resultCount" aria-live="polite">
                    Loading products...
                  </p>
                </div>
                <div className="sort-control">
                  <label htmlFor="sortProducts">Sort by:</label>
                  <select id="sortProducts">
                    <option value="popular">Most Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>
              <div
                id="activeSearch"
                className="active-search"
                aria-live="polite"
              ></div>

              <div
                id="productGrid"
                className="product-grid"
                aria-live="polite"
              ></div>

              <div id="emptyState" className="empty-state" hidden="">
                <div className="empty-state-icon">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <h2>No products found</h2>
                <p>
                  Try a different search term or clear your filters to see more
                  products.
                </p>
                <button
                  type="button"
                  id="emptyClearFilters"
                  className="primary-button"
                >
                  Show all products
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <a href="/" className="logo">
              Quick<span>Kart</span>
            </a>
            <p>
              Your everyday shopping destination. Discover more, shop smarter.
            </p>
          </div>
          <div className="footer-links">
            <h3>Quick Links</h3>
            <a href="/">Home</a>
            <a href="/categories">Categories</a>
            <a href="/products">All Products</a>
          </div>
          <div className="footer-links">
            <h3>Your Account</h3>
            <a href="/login">Sign In</a>
            <a href="/orders">My Orders</a>
            <a href="/wishlist">Wishlist</a>
            <a href="/cart">Shopping Cart</a>
          </div>
          <div className="footer-links">
            <h3>Shopping</h3>
            <span>Explore Products</span>
            <span>Discover Categories</span>
            <span>Shop with QuickKart</span>
          </div>
        </div>
        <div className="footer-bottom">
          <p>
            © <span id="currentYear"></span> QuickKart. All rights reserved.
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
