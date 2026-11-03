import { useEffect } from "react";

export default function CategoriesPage() {
  useEffect(() => {
    document.title = "Shop Categories | QuickKart";
    document.body.className = "categories-page";
    const styleLinks = ["common.css", "categories.css"];
    const scriptFiles = ["common.js", "categories.js"];
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
          <form className="search-box" id="globalSearchForm" role="search">
            <input
              id="globalSearch"
              type="search"
              placeholder="Search products..."
              aria-label="Search products"
            />
            <button
              id="searchButton"
              className="search-btn"
              type="submit"
              aria-label="Search"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
          <div className="header-actions">
            <a href="/login" className="header-action">
              <i className="fa-regular fa-user"></i> Account
            </a>
            <a href="/orders" className="header-action">
              <i className="fa-solid fa-box"></i> Orders
            </a>
            <a href="/cart" className="header-action cart-link">
              <i className="fa-solid fa-cart-shopping"></i> Cart
              <span className="cart-count">0</span>
            </a>
          </div>
        </div>
      </header>
      <nav className="navbar" aria-label="Main navigation">
        <div className="container navbar-inner">
          <a href="/categories" aria-current="page">
            Categories
          </a>
          <a href="/products">All Products</a>
          <a href="/orders">Orders</a>
          <a href="/wishlist">Wishlist</a>
        </div>
      </nav>
      <main>
        <section className="category-hero">
          <div className="container category-hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">
                <i className="fa-solid fa-bag-shopping"></i> THE QUICKKART
                COLLECTION
              </span>
              <h1>
                Find your <span>everyday favourites.</span>
              </h1>
              <p>
                From daily essentials to the latest gadgets, discover something
                you'll love in every category.
              </p>
              <a href="/products" className="hero-button">
                Explore all products <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            <div className="hero-art" aria-hidden="true">
              <div className="hero-orbit orbit-one"></div>
              <div className="hero-orbit orbit-two"></div>
              <div className="hero-shopping-icon">
                <i className="fa-solid fa-bag-shopping"></i>
              </div>
              <span className="floating-icon floating-one">
                <i className="fa-solid fa-headphones"></i>
              </span>
              <span className="floating-icon floating-two">
                <i className="fa-solid fa-shirt"></i>
              </span>
              <span className="floating-icon floating-three">
                <i className="fa-solid fa-basket-shopping"></i>
              </span>
            </div>
          </div>
        </section>
        <section className="categories-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="section-eyebrow">EXPLORE OUR STORE</span>
                <h2>Shop by category</h2>
                <p>Pick a category and find what you need.</p>
              </div>
              <a href="/products" className="view-all-link">
                View all products <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            <div className="category-toolbar">
              <label className="category-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  id="categorySearch"
                  type="search"
                  placeholder="Find a category..."
                  aria-label="Filter categories"
                />
              </label>
              <span id="categoryResultCount" className="category-result-count">
                5 categories
              </span>
            </div>
            <div className="category-grid" id="categoryGrid">
              <a
                href="/products?category=groceries"
                className="category-card theme-green"
                data-category="groceries"
                data-name="groceries daily essentials food"
              >
                <div className="category-card-top">
                  <span className="category-icon">
                    <i className="fa-solid fa-basket-shopping"></i>
                  </span>
                  <span className="category-arrow">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </div>
                <div className="category-card-copy">
                  <span className="category-number">01 / EVERYDAY</span>
                  <h3>Groceries</h3>
                  <p>Fresh picks and daily essentials for your home.</p>
                  <span className="category-explore">
                    Explore groceries
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
                <i className="fa-solid fa-leaf category-decoration"></i>
              </a>
              <a
                href="/products?category=electronics"
                className="category-card theme-blue"
                data-category="electronics"
                data-name="electronics mobiles gadgets devices technology"
              >
                <div className="category-card-top">
                  <span className="category-icon">
                    <i className="fa-solid fa-mobile-screen-button"></i>
                  </span>
                  <span className="category-arrow">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </div>
                <div className="category-card-copy">
                  <span className="category-number">02 / TECH</span>
                  <h3>Electronics</h3>
                  <p>Smart gadgets and tech for everyday life.</p>
                  <span className="category-explore">
                    Explore electronics
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
                <i className="fa-solid fa-headphones category-decoration"></i>
              </a>
              <a
                href="/products?category=beauty"
                className="category-card theme-pink"
                data-category="beauty"
                data-name="beauty skincare personal care cosmetics"
              >
                <div className="category-card-top">
                  <span className="category-icon">
                    <i className="fa-solid fa-spa"></i>
                  </span>
                  <span className="category-arrow">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </div>
                <div className="category-card-copy">
                  <span className="category-number">03 / SELF CARE</span>
                  <h3>Beauty</h3>
                  <p>Everyday care and beauty essentials.</p>
                  <span className="category-explore">
                    Explore beauty
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
                <i className="fa-solid fa-wand-magic-sparkles category-decoration"></i>
              </a>
              <a
                href="/products?category=fashion"
                className="category-card theme-purple"
                data-category="fashion"
                data-name="fashion clothing clothes shoes accessories"
              >
                <div className="category-card-top">
                  <span className="category-icon">
                    <i className="fa-solid fa-shirt"></i>
                  </span>
                  <span className="category-arrow">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </div>
                <div className="category-card-copy">
                  <span className="category-number">04 / YOUR STYLE</span>
                  <h3>Fashion</h3>
                  <p>Clothing and accessories for your style.</p>
                  <span className="category-explore">
                    Explore fashion
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
                <i className="fa-solid fa-gem category-decoration"></i>
              </a>
              <a
                href="/products?category=stationery"
                className="category-card theme-orange"
                data-category="stationery"
                data-name="stationery books pens notebooks study office"
              >
                <div className="category-card-top">
                  <span className="category-icon">
                    <i className="fa-solid fa-book-open"></i>
                  </span>
                  <span className="category-arrow">
                    <i className="fa-solid fa-arrow-up-right-from-square"></i>
                  </span>
                </div>
                <div className="category-card-copy">
                  <span className="category-number">05 / GET CREATIVE</span>
                  <h3>Stationery</h3>
                  <p>Study, writing and office supplies in one place.</p>
                  <span className="category-explore">
                    Explore stationery
                    <i className="fa-solid fa-arrow-right"></i>
                  </span>
                </div>
                <i className="fa-solid fa-pencil category-decoration"></i>
              </a>
            </div>
            <div id="categoryEmptyState" className="category-empty" hidden="">
              <i className="fa-solid fa-magnifying-glass"></i>
              <h3>No categories found</h3>
              <p>Try another category name.</p>
              <button type="button" id="clearCategorySearch">
                Clear search
              </button>
            </div>
            <div className="category-promo">
              <div className="promo-icon">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <div>
                <h3>Your next favourite is just a click away.</h3>
                <p>Browse the collection and discover more from QuickKart.</p>
              </div>
              <a href="/products">
                Start shopping
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <h2>QuickKart</h2>
            <p>Everything you need, delivered fast.</p>
          </div>
          <div className="footer-column">
            <h3>Explore</h3>
            <a href="/">Home</a>
            <a href="/products">All Products</a>
            <a href="/categories">Categories</a>
          </div>
          <div className="footer-column">
            <h3>Your Account</h3>
            <a href="/login">Login</a>
            <a href="/orders">Orders</a>
            <a href="/profile">Profile</a>
            <a href="/wishlist">Wishlist</a>
          </div>
          <div className="footer-column">
            <h3>Help</h3>
            <a href="mailto:support@quickkart.example">Contact Support</a>
            <a href="/cart">Your Cart</a>
          </div>
        </div>
        <div className="footer-bottom">
          © <span id="currentYear">2026</span> QuickKart. All rights reserved.
        </div>
      </footer>
    </>
  );
}
