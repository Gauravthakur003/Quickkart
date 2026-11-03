import { useEffect } from "react";

export default function ProfilePage() {
  useEffect(() => {
    document.title = "My Profile | QuickKart";
    document.body.className = "profile-page";
    const styleLinks = ["common.css", "profile.css"];
    const scriptFiles = ["common.js", "profile.js"];
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
      <header className="profile-topbar">
        <div className="profile-topbar-inner">
          <a href="/" className="profile-brand" aria-label="QuickKart home">
            <span className="profile-brand-icon">
              <i className="fa-solid fa-bolt"></i>
            </span>
            <span>
              Quick<span>Kart</span>
            </span>
          </a>
          <form className="profile-search" id="profileSearchForm" role="search">
            <label htmlFor="globalSearch" className="sr-only">
              Search products
            </label>
            <input
              type="search"
              id="globalSearch"
              placeholder="Search products, brands and more..."
              autoComplete="off"
            />
            <button type="submit" id="searchButton" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
          <nav className="profile-header-actions" aria-label="Quick links">
            <a href="/orders" className="profile-header-link">
              <i className="fa-solid fa-box"></i>
              <span>Orders</span>
            </a>
            <a href="/cart" className="profile-header-link profile-cart-link">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Cart</span>
              <span className="cart-count" id="cartCount">
                0
              </span>
            </a>
          </nav>
        </div>
      </header>

      <div className="profile-breadcrumb">
        <a href="/">Home</a>
        <i className="fa-solid fa-chevron-right"></i>
        <span>My Account</span>
      </div>

      <main className="profile-main">
        <section className="profile-page-heading">
          <div>
            <span className="profile-eyebrow">YOUR QUICKKART ACCOUNT</span>
            <h1>My Account</h1>
            <p>Manage your personal details, orders and saved addresses.</p>
          </div>
          <a href="/products" className="profile-shop-link">
            <i className="fa-solid fa-arrow-left"></i>
            Continue shopping
          </a>
        </section>
        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-user-card">
              <div className="profile-avatar" id="profileAvatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div className="profile-user-summary">
                <span className="profile-welcome">WELCOME BACK</span>
                <h2 id="profileName">QuickKart Customer</h2>
                <p id="profileEmail">Manage your account details</p>
              </div>
              <span className="profile-member-badge">
                <i className="fa-solid fa-shield-halved"></i>
                Member
              </span>
            </div>
            <nav className="profile-side-nav" aria-label="Account navigation">
              <p className="profile-nav-heading">MY ACCOUNT</p>
              <a
                href="#personalInformation"
                className="profile-nav-link active"
              >
                <i className="fa-regular fa-user"></i>
                <span>Personal Information</span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </a>
              <a href="/orders" className="profile-nav-link">
                <i className="fa-solid fa-box-open"></i>
                <span>My Orders</span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </a>
              <a href="/address" className="profile-nav-link">
                <i className="fa-solid fa-location-dot"></i>
                <span>My Addresses</span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </a>
              <a href="/wishlist" className="profile-nav-link">
                <i className="fa-regular fa-heart"></i>
                <span>My Wishlist</span>
                <i className="fa-solid fa-chevron-right nav-arrow"></i>
              </a>
              <div className="profile-nav-divider"></div>
              <button
                type="button"
                className="profile-logout-button"
                id="logoutButton"
              >
                <i className="fa-solid fa-arrow-right-from-bracket"></i>
                <span>Log Out</span>
              </button>
            </nav>
            <div className="profile-help-card">
              <div className="profile-help-icon">
                <i className="fa-solid fa-headset"></i>
              </div>
              <h3>Need help?</h3>
              <p>We're here to help with your shopping experience.</p>
              <a href="mailto:support@quickkart.example">
                Contact support
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </aside>

          <div className="profile-content">
            <section
              className="profile-overview-grid"
              aria-label="Account overview"
            >
              <a href="/orders" className="profile-overview-card">
                <div className="overview-icon overview-orders">
                  <i className="fa-solid fa-box-open"></i>
                </div>
                <div>
                  <span>Shopping activity</span>
                  <h3>My Orders</h3>
                  <p>View and track your orders</p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square overview-arrow"></i>
              </a>
              <a href="/wishlist" className="profile-overview-card">
                <div className="overview-icon overview-wishlist">
                  <i className="fa-regular fa-heart"></i>
                </div>
                <div>
                  <span>Your favourites</span>
                  <h3>My Wishlist</h3>
                  <p>Products saved for later</p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square overview-arrow"></i>
              </a>
            </section>

            <section className="profile-panel" id="personalInformation">
              <div className="profile-panel-header">
                <div>
                  <span className="profile-section-label">YOUR DETAILS</span>
                  <h2>Personal Information</h2>
                  <p>Keep your account information up to date.</p>
                </div>
                <button
                  type="button"
                  className="profile-edit-button"
                  id="editProfileButton"
                >
                  <i className="fa-solid fa-pen"></i>
                  Edit details
                </button>
              </div>
              <div className="profile-information-grid">
                <div className="profile-information-item">
                  <span className="profile-field-label">
                    <i className="fa-regular fa-user"></i>
                    Full name
                  </span>
                  <p id="profileFullName">Not provided</p>
                </div>
                <div className="profile-information-item">
                  <span className="profile-field-label">
                    <i className="fa-regular fa-envelope"></i>
                    Email address
                  </span>
                  <p id="profileEmailAddress">Not provided</p>
                </div>
                <div className="profile-information-item">
                  <span className="profile-field-label">
                    <i className="fa-solid fa-phone"></i>
                    Phone number
                  </span>
                  <p id="profilePhone">Not provided</p>
                </div>
                <div className="profile-information-item">
                  <span className="profile-field-label">
                    <i className="fa-regular fa-calendar"></i>
                    Account status
                  </span>
                  <p className="profile-status-value">
                    <span className="profile-status-dot"></span>
                    Active account
                  </p>
                </div>
              </div>

              <form
                id="profileEditForm"
                className="profile-edit-form"
                hidden=""
              >
                <div className="profile-form-grid">
                  <div className="profile-form-field">
                    <label htmlFor="profileNameInput">Full name</label>
                    <input
                      type="text"
                      id="profileNameInput"
                      name="name"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      maxLength="100"
                    />
                  </div>
                  <div className="profile-form-field">
                    <label htmlFor="profileEmailInput">Email address</label>
                    <input
                      type="email"
                      id="profileEmailInput"
                      name="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      maxLength="150"
                    />
                  </div>
                  <div className="profile-form-field">
                    <label htmlFor="profilePhoneInput">Phone number</label>
                    <input
                      type="tel"
                      id="profilePhoneInput"
                      name="phone"
                      placeholder="Enter your phone number"
                      autoComplete="tel"
                      maxLength="20"
                    />
                  </div>
                </div>
                <div className="profile-form-actions">
                  <button
                    type="button"
                    className="profile-cancel-button"
                    id="cancelProfileEdit"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="profile-save-button"
                    id="saveProfileButton"
                  >
                    <i className="fa-solid fa-check"></i>
                    Save changes
                  </button>
                </div>
              </form>
              <p
                className="profile-feedback"
                id="profileFeedback"
                role="status"
                aria-live="polite"
                hidden=""
              ></p>
            </section>

            <section className="profile-panel" id="savedAddresses">
              <div className="profile-panel-header">
                <div>
                  <span className="profile-section-label">
                    DELIVERY DETAILS
                  </span>
                  <h2>Saved Addresses</h2>
                  <p>Manage where you want your orders delivered.</p>
                </div>
                <a href="/address" className="profile-edit-button">
                  <i className="fa-solid fa-plus"></i>
                  Manage addresses
                </a>
              </div>
              <div className="profile-address-card">
                <div className="profile-address-icon">
                  <i className="fa-solid fa-house"></i>
                </div>
                <div className="profile-address-content">
                  <div className="profile-address-title">
                    <h3>Delivery address</h3>
                    <span className="profile-address-badge">DEFAULT</span>
                  </div>
                  <p id="profileAddressName">Your saved delivery details</p>
                  <p id="profileAddress">
                    Add or update your address to make checkout easier.
                  </p>
                  <p id="profileAddressPhone"></p>
                </div>
                <a
                  href="/address"
                  className="profile-address-action"
                  aria-label="Manage delivery address"
                >
                  <i className="fa-solid fa-chevron-right"></i>
                </a>
              </div>
              <div className="profile-address-note">
                <i className="fa-solid fa-circle-info"></i>
                <span>
                  Your delivery details help us deliver your orders to the right
                  place.
                </span>
              </div>
            </section>

            <section className="profile-security-banner">
              <div className="profile-security-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <h3>Your account, your control</h3>
                <p>
                  Keep your contact details current and only use trusted devices
                  when accessing your account.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="profile-footer">
        <div className="profile-footer-inner">
          <a href="/" className="profile-footer-brand">
            <i className="fa-solid fa-bolt"></i>
            QuickKart
          </a>
          <p>
            © <span id="currentYear">2026</span> QuickKart. Your everyday
            shopping partner.
          </p>
          <a href="/products">Continue shopping</a>
        </div>
      </footer>
    </>
  );
}
