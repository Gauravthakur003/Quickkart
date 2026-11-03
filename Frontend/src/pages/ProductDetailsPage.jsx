import { useEffect } from "react";

export default function ProductDetailsPage() {
  useEffect(() => {
    document.body.className = "";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/css/product-details.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "/js/product-details.js";
    script.onload = () => document.dispatchEvent(new Event("DOMContentLoaded"));
    document.body.appendChild(script);
    return () => {
      link.remove();
      script.remove();
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
          <div className="location">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <small className="location-label">Deliver to</small>
              <strong>Mumbai, India</strong>
            </div>
          </div>
          <div className="search-box">
            <label htmlFor="globalSearch" className="sr-only">
              Search products
            </label>
            <input
              id="globalSearch"
              type="search"
              placeholder="Search products..."
              autoComplete="off"
            />
            <button type="button" id="searchButton" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="header-actions">
            <a href="/login" className="header-action">
              <i className="fa-regular fa-user"></i> Account
            </a>
            <a href="/orders" className="header-action">
              <i className="fa-solid fa-box"></i> Orders
            </a>
            <a href="/cart" className="header-action">
              <span className="cart-icon-wrapper">
                <i className="fa-solid fa-cart-shopping"></i>
                <span className="cart-count">0</span>
              </span>{" "}
              Cart
            </a>
          </div>
        </div>
      </header>
      <nav className="main-nav" aria-label="Main navigation">
        <a href="/">Home</a>
        <a href="/categories">Categories</a>
        <a href="/products">All Products</a>
        <a href="/orders">My Orders</a>
        <a href="/wishlist">Wishlist</a>
      </nav>
      <main className="page">
        <div className="container">
          <div className="breadcrumb">
            <a href="/">Home</a>
            <i className="fa-solid fa-chevron-right"></i>
            <a href="/products">Products</a>
            <i className="fa-solid fa-chevron-right"></i>
            <span>Product details</span>
          </div>
          <section className="product-details card" id="productDetails">
            <div className="product-detail-image">
              <span className="product-badge" id="detailBadge" hidden></span>
              <img
                id="productDetailImage"
                src="/assets/box1_image.jpg"
                alt="QuickKart product"
              />
            </div>
            <div className="product-detail-info">
              <span className="product-category" id="productDetailCategory">
                Product category
              </span>
              <h1 id="productDetailName">Product details</h1>
              <div className="detail-rating">
                <span className="stars" id="productDetailStars">
                  ★★★★★
                </span>
                <span id="productDetailRating">0.0</span>
                <span id="productDetailReviews">(0 reviews)</span>
              </div>
              <div className="detail-divider"></div>
              <p className="product-description" id="productDetailDescription">
                Product description
              </p>
              <div className="detail-price-row">
                <span className="detail-price" id="productDetailPrice">
                  ₹0
                </span>
                <span
                  className="detail-original-price"
                  id="productDetailOriginalPrice"
                >
                  ₹0
                </span>
                <span className="detail-discount" id="productDetailDiscount">
                  0% OFF
                </span>
              </div>
              <p className="stock-status">
                <i className="fa-solid fa-circle-check"></i> In stock and ready
                to ship
              </p>
              <div className="delivery-info">
                <div className="delivery-item">
                  <i className="fa-solid fa-truck-fast"></i>
                  <div>
                    <strong>Fast delivery</strong>
                    <small>Delivery options available at checkout</small>
                  </div>
                </div>
                <div className="delivery-item">
                  <i className="fa-solid fa-rotate-left"></i>
                  <div>
                    <strong>Easy returns</strong>
                    <small>Check our return policy for details</small>
                  </div>
                </div>
                <div className="delivery-item">
                  <i className="fa-solid fa-shield-halved"></i>
                  <div>
                    <strong>Secure shopping</strong>
                    <small>Your order information is protected</small>
                  </div>
                </div>
              </div>
              <div className="quantity-box">
                <label htmlFor="quantity">Quantity</label>
                <div className="quantity-controls">
                  <button
                    type="button"
                    id="decreaseQuantity"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max="99"
                    defaultValue="1"
                  />
                  <button
                    type="button"
                    id="increaseQuantity"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="product-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  id="addToCart"
                >
                  <i className="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
                <button
                  type="button"
                  className="btn btn-dark"
                  id="buyNowButton"
                >
                  <i className="fa-solid fa-bolt"></i> Buy Now
                </button>
                <button
                  type="button"
                  className="btn btn-outline"
                  id="wishlistButton"
                  aria-pressed="false"
                  aria-label="Add to wishlist"
                >
                  <i className="fa-regular fa-heart"></i>
                </button>
              </div>
              <p
                className="detail-message"
                id="detailMessage"
                role="status"
                aria-live="polite"
              ></p>
            </div>
          </section>
          <section className="product-information card">
            <h2>Product information</h2>
            <div className="info-grid">
              <div>
                <strong>Product name</strong>
                <span id="infoProductName">QuickKart product</span>
              </div>
              <div>
                <strong>Category</strong>
                <span id="infoProductCategory">General</span>
              </div>
              <div>
                <strong>Availability</strong>
                <span className="available">Available</span>
              </div>
              <div>
                <strong>Store</strong>
                <span>QuickKart</span>
              </div>
            </div>
          </section>
          <div className="back-to-products">
            <a href="/products">
              <i className="fa-solid fa-arrow-left"></i> Continue shopping
            </a>
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <div className="container footer-content">
          <div>
            <a href="/" className="logo">
              Quick<span>Kart</span>
            </a>
            <p>Your everyday shopping destination.</p>
          </div>
          <div>
            <h3>Quick links</h3>
            <a href="/products">Shop products</a>
            <a href="/orders">Your orders</a>
            <a href="/cart">Shopping cart</a>
          </div>
          <div>
            <h3>Help</h3>
            <a href="/profile">Your account</a>
            <a href="/tracking">Track order</a>
          </div>
        </div>
        <div className="container footer-bottom">
          <p>
            © <span id="currentYear">2026</span> QuickKart. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
