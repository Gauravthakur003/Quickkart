import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    document.title = "QuickKart | Everything You Need, All in One Place";
    document.body.className = "";
    const styleLinks = ["home.css"];
    const scriptFiles = ["home.js"];
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
      <header className="site-header">
        <div className="header-main container">
          <button
            className="mobile-menu"
            type="button"
            aria-label="Open navigation"
            aria-expanded="false"
            aria-controls="mainPanel"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <a href="/" className="logo" aria-label="QuickKart home">
            Quick<span>Kart</span>
            <span className="logo-dot">.</span>
          </a>
          <div className="location">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <small>Deliver to</small>
              <strong>Mumbai, India</strong>
            </div>
          </div>
          <form className="search-box" id="homeSearchForm" role="search">
            <label className="sr-only" htmlFor="homeSearchCategory">
              Choose a product category
            </label>
            <select
              className="search-select"
              id="homeSearchCategory"
              aria-label="Search category"
            >
              <option value="All">All</option>
              <option value="Groceries">Groceries</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
              <option value="Beauty">Beauty</option>
              <option value="Home">Home</option>
            </select>
            <label className="sr-only" htmlFor="homeSearchInput">
              Search QuickKart products
            </label>
            <input
              className="search-input"
              id="homeSearchInput"
              type="search"
              placeholder="Search for products, brands and more..."
              autoComplete="off"
            />
            <button
              className="search-icon"
              type="submit"
              aria-label="Search products"
            >
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
          <div className="header-actions">
            <a href="/login" className="header-action account-action">
              <span className="action-top">Welcome</span>
              <strong>
                Sign in <i className="fa-solid fa-chevron-down"></i>
              </strong>
            </a>
            <a href="/orders" className="header-action orders-action">
              <span className="action-top">Your purchases</span>
              <strong>Orders</strong>
            </a>
            <a
              href="/cart"
              className="header-action cart-link"
              aria-label="Shopping cart"
            >
              <span className="cart-icon-wrap">
                <i className="fa-solid fa-bag-shopping"></i>
                <span className="cart-count" aria-live="polite">
                  0
                </span>
              </span>
              <strong>Cart</strong>
            </a>
          </div>
        </div>
        <nav className="main-nav" aria-label="Main navigation">
          <div className="container nav-inner" id="mainPanel">
            <a href="/categories">
              <i className="fa-solid fa-layer-group"></i> All categories
            </a>
            <a href="/products">
              <i className="fa-solid fa-store"></i> All products
            </a>
            <a href="/products?category=Electronics">Electronics</a>
            <a href="/products?category=Fashion">Fashion</a>
            <a href="/products?category=Beauty">Beauty</a>
            <a href="/products?category=Home">Home essentials</a>
            <a href="/products?category=Groceries">Groceries</a>
            <a href="/wishlist">
              <i className="fa-regular fa-heart"></i> Wishlist
            </a>
          </div>
        </nav>
      </header>
      <main>
        <section className="hero-section">
          <div
            className="hero-image"
            role="img"
            aria-label="QuickKart shopping banner"
          ></div>
          <div className="hero-shade"></div>
          <div className="container hero-content">
            <span className="eyebrow">
              <i className="fa-solid fa-bag-shopping"></i> YOUR EVERYDAY
              SHOPPING DESTINATION
            </span>
            <h1>
              Good finds.
              <br />
              <span>Great prices.</span>
            </h1>
            <p>
              From daily essentials to things you love, discover more ways to
              make every day better.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="/products">
                Explore products <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a className="hero-secondary-link" href="#categories">
                Explore categories <i className="fa-solid fa-arrow-down"></i>
              </a>
            </div>
            <div className="hero-trust">
              <span>
                <i className="fa-solid fa-check-circle"></i> Everyday essentials
              </span>
              <span>
                <i className="fa-solid fa-check-circle"></i> Easy shopping
              </span>
              <span>
                <i className="fa-solid fa-check-circle"></i> One convenient
                place
              </span>
            </div>
          </div>
          <div className="hero-pagination" aria-hidden="true">
            <span className="active"></span>
            <span></span>
            <span></span>
          </div>
        </section>

        <section className="benefits-section">
          <div className="container benefits-grid">
            <article className="benefit-item">
              <span className="benefit-icon">
                <i className="fa-solid fa-truck-fast"></i>
              </span>
              <div>
                <h3>Convenient shopping</h3>
                <p>Shop from wherever you are</p>
              </div>
            </article>
            <article className="benefit-item">
              <span className="benefit-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </span>
              <div>
                <h3>Shop with confidence</h3>
                <p>Clear product information</p>
              </div>
            </article>
            <article className="benefit-item">
              <span className="benefit-icon">
                <i className="fa-solid fa-tags"></i>
              </span>
              <div>
                <h3>Discover great finds</h3>
                <p>Explore products for every day</p>
              </div>
            </article>
            <article className="benefit-item">
              <span className="benefit-icon">
                <i className="fa-solid fa-headset"></i>
              </span>
              <div>
                <h3>Here to help</h3>
                <p>Find what you need with ease</p>
              </div>
            </article>
          </div>
        </section>

        <section className="section container" id="categories">
          <div className="section-heading">
            <div>
              <span className="section-kicker">EXPLORE QUICKKART</span>
              <h2>Shop by category</h2>
              <p>Find your next favourite in just a few clicks.</p>
            </div>
            <a href="/categories" className="text-link">
              View all categories <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="category-grid">
            <a className="category-card" href="/products?category=Electronics">
              <div className="category-image">
                <img
                  src="/assets/box1_image.jpg"
                  alt="Electronics"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Electronics</h3>
                <span>
                  Discover devices <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products?category=Home">
              <div className="category-image">
                <img
                  src="/assets/box2_image.jpg"
                  alt="Home essentials"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Home essentials</h3>
                <span>
                  Make room for better{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products?category=Beauty">
              <div className="category-image">
                <img
                  src="/assets/box3_image.jpg"
                  alt="Beauty and personal care"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Beauty & care</h3>
                <span>
                  Your daily routine <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products?category=Fashion">
              <div className="category-image">
                <img
                  src="/assets/box4_image.jpg"
                  alt="Fashion"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Fashion</h3>
                <span>
                  Find your style <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products?category=Groceries">
              <div className="category-image">
                <img
                  src="/assets/box5_image.jpg"
                  alt="Groceries"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Groceries</h3>
                <span>
                  Everyday must-haves{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products?category=Home">
              <div className="category-image">
                <img
                  src="/assets/box6_image.jpg"
                  alt="Lifestyle essentials"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Lifestyle</h3>
                <span>
                  Little everyday upgrades{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products">
              <div className="category-image">
                <img
                  src="/assets/box7_image.jpg"
                  alt="Everyday discoveries"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>Everyday finds</h3>
                <span>
                  Something for you <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
            <a className="category-card" href="/products">
              <div className="category-image">
                <img
                  src="/assets/box8_image.jpg"
                  alt="More products at QuickKart"
                  loading="lazy"
                />
              </div>
              <div className="category-info">
                <h3>More to explore</h3>
                <span>
                  See all products <i className="fa-solid fa-arrow-right"></i>
                </span>
              </div>
            </a>
          </div>
        </section>

        <section className="promo-section container">
          <div className="promo-copy">
            <span className="section-kicker">YOUR NEXT GREAT FIND</span>
            <h2>
              A little something
              <br />
              for every part of life.
            </h2>
            <p>
              Browse everyday essentials, thoughtful upgrades, and products that
              fit your routine.
            </p>
            <a href="/products" className="btn btn-light">
              Explore the collection <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="promo-decoration promo-decoration-one"></div>
          <div className="promo-decoration promo-decoration-two"></div>
          <div className="promo-icon">
            <i className="fa-solid fa-gift"></i>
          </div>
        </section>

        <section className="section container" id="featured">
          <div className="section-heading">
            <div>
              <span className="section-kicker">WORTH A LOOK</span>
              <h2>Featured picks</h2>
              <p>Explore a few ideas to get your shopping started.</p>
            </div>
            <a href="/products" className="text-link">
              Shop all products <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
          <div className="deal-grid">
            <article className="deal-card">
              <a className="deal-image" href="/products?category=Electronics">
                <img
                  src="/assets/box1_image.jpg"
                  alt="Electronics collection"
                  loading="lazy"
                />
                <span className="deal-badge">Explore</span>
              </a>
              <div className="deal-content">
                <span className="deal-category">TECH & ACCESSORIES</span>
                <h3>Upgrade your everyday</h3>
                <p>Explore useful tech and accessories for your routine.</p>
                <a href="/products?category=Electronics" className="deal-link">
                  Explore electronics{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </article>
            <article className="deal-card">
              <a className="deal-image" href="/products?category=Home">
                <img
                  src="/assets/box2_image.jpg"
                  alt="Home essentials collection"
                  loading="lazy"
                />
                <span className="deal-badge">Discover</span>
              </a>
              <div className="deal-content">
                <span className="deal-category">HOME & LIVING</span>
                <h3>Make yourself at home</h3>
                <p>Find practical ideas for a more comfortable space.</p>
                <a href="/products?category=Home" className="deal-link">
                  Shop home essentials{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </article>
            <article className="deal-card">
              <a className="deal-image" href="/products?category=Fashion">
                <img
                  src="/assets/box4_image.jpg"
                  alt="Fashion collection"
                  loading="lazy"
                />
                <span className="deal-badge">Find your style</span>
              </a>
              <div className="deal-content">
                <span className="deal-category">STYLE & EVERYDAY</span>
                <h3>Made for your day</h3>
                <p>Discover fashion and accessories for everyday life.</p>
                <a href="/products?category=Fashion" className="deal-link">
                  Explore fashion <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="newsletter-section">
          <div className="container newsletter-inner">
            <div className="newsletter-icon">
              <i className="fa-solid fa-bag-shopping"></i>
            </div>
            <div>
              <span className="section-kicker">
                YOUR SHOPPING JOURNEY STARTS HERE
              </span>
              <h2>Ready to find something great?</h2>
              <p>
                Explore the QuickKart collection and find products for your
                everyday needs.
              </p>
            </div>
            <a href="/products" className="btn btn-primary">
              Start shopping <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <a href="/" className="logo footer-logo">
              Quick<span>Kart</span>
              <span className="logo-dot">.</span>
            </a>
            <p>
              Your everyday shopping destination. Discover useful products, new
              favourites, and essentials in one convenient place.
            </p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" aria-label="X">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Discover</h3>
            <a href="/">Home</a>
            <a href="/categories">Categories</a>
            <a href="/products">All products</a>
            <a href="/wishlist">Wishlist</a>
          </div>
          <div className="footer-column">
            <h3>Your account</h3>
            <a href="/login">Sign in</a>
            <a href="/register">Create account</a>
            <a href="/orders">Your orders</a>
            <a href="/profile">Your profile</a>
          </div>
          <div className="footer-column">
            <h3>Need help?</h3>
            <a href="/admin/delivery-details">Delivery information</a>
            <a href="/cart">Shopping cart</a>
            <a href="/orders">Order tracking</a>
            <a href="/admin/dashboard">Admin</a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container footer-bottom-inner">
            <span>© 2026 QuickKart. All rights reserved.</span>
            <span>Made for easier everyday shopping.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
