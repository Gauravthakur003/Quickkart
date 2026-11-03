import { useEffect } from "react";

export default function AddressPage() {
  useEffect(() => {
    document.title = "My Addresses | QuickKart";
    document.body.className = "";
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
      <header className="header">
        <div className="header-main">
          <a href="/" className="logo">
            Quick<span>Kart</span>
          </a>
          <div className="location">
            <i className="fa-solid fa-location-dot"></i>
            <div>
              <small>Deliver to</small>
              <strong>Mumbai</strong>
            </div>
          </div>
          <div className="search-box">
            <input
              type="text"
              id="globalSearch"
              placeholder="Search products..."
            />
            <button id="searchButton">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </div>
          <div className="header-actions">
            <a href="/orders" className="header-action">
              <i className="fa-solid fa-box"></i>
              <span>Orders</span>
            </a>
            <a href="/wishlist" className="header-action">
              <i className="fa-regular fa-heart"></i>
              <span>Wishlist</span>
            </a>
            <a href="/cart" className="header-action cart-link">
              <i className="fa-solid fa-cart-shopping"></i>
              <span>Cart</span>
              <span className="cart-count">0</span>
            </a>
          </div>
        </div>
        <nav className="navbar">
          <div className="navbar-inner">
            <a href="/">Home</a>
            <a href="/products">Products</a>
            <a href="/categories">Categories</a>
            <a href="/orders">My Orders</a>
            <a href="/profile">Profile</a>
          </div>
        </nav>
      </header>

      <main className="page">
        <div className="container">
          <div className="page-title-row">
            <div>
              <h1 className="page-title">My Addresses</h1>
              <p className="page-subtitle">
                Manage your saved delivery addresses.
              </p>
            </div>
            <button className="btn btn-primary" id="addAddressButton">
              <i className="fa-solid fa-plus"></i>
              Add New Address
            </button>
          </div>

          <div className="address-grid" id="addressContainer"></div>

          <div
            className="address-empty"
            id="addressEmpty"
            style={{ display: "none" }}
          >
            <div className="empty-icon">
              <i className="fa-solid fa-location-dot"></i>
            </div>
            <h2>No saved addresses</h2>
            <p>Add an address to make checkout faster.</p>
            <button className="btn btn-primary" id="emptyAddAddress">
              <i className="fa-solid fa-plus"></i>
              Add Address
            </button>
          </div>
        </div>
      </main>

      <div className="modal-overlay" id="addressModal">
        <div className="address-modal">
          <div className="modal-header">
            <div>
              <h2 id="modalTitle">Add New Address</h2>
              <p>Enter your delivery details.</p>
            </div>
            <button className="modal-close" id="closeAddressModal">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form id="addressForm">
            <div className="address-form-grid">
              <div className="form-group">
                <label htmlFor="addressName">Full Name</label>
                <input
                  type="text"
                  id="addressName"
                  className="form-control"
                  placeholder="Enter full name"
                  required=""
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressPhone">Phone Number</label>
                <input
                  type="tel"
                  id="addressPhone"
                  className="form-control"
                  maxLength="10"
                  placeholder="10-digit mobile number"
                  required=""
                />
              </div>
              <div className="form-group full-width">
                <label htmlFor="addressLine">Address</label>
                <textarea
                  id="addressLine"
                  className="form-control"
                  rows="3"
                  placeholder="House / Flat / Street / Area"
                  required=""
                ></textarea>
              </div>
              <div className="form-group">
                <label htmlFor="addressCity">City</label>
                <input
                  type="text"
                  id="addressCity"
                  className="form-control"
                  placeholder="Mumbai"
                  required=""
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressState">State</label>
                <input
                  type="text"
                  id="addressState"
                  className="form-control"
                  placeholder="Maharashtra"
                  required=""
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressPincode">Pincode</label>
                <input
                  type="text"
                  id="addressPincode"
                  className="form-control"
                  maxLength="6"
                  placeholder="400001"
                  required=""
                />
              </div>
              <div className="form-group">
                <label htmlFor="addressType">Address Type</label>
                <select id="addressType" className="form-control">
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="default-address">
              <label className="checkbox-label">
                <input type="checkbox" id="defaultAddress" />
                <span>Make this my default address</span>
              </label>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline"
                id="cancelAddress"
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fa-solid fa-check"></i>
                Save Address
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
