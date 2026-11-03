import { useEffect } from "react";

export default function TrackingPage() {
  useEffect(() => {
    document.title = "Track Order | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "tracking.css"];
    const scriptFiles = ["common.js", "tracking.js"];
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
          <div className="header-actions">
            <a href="/orders" className="header-action">
              <i className="fa-solid fa-box"></i>
              My Orders
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
          <a href="/">
            <i className="fa-solid fa-house"></i>
            Home
          </a>
          <a href="/products">
            <i className="fa-solid fa-box-open"></i>
            Products
          </a>
          <a href="/orders">
            <i className="fa-solid fa-receipt"></i>
            My Orders
          </a>
        </div>
      </nav>

      <main className="page">
        <div className="container">
          <h1 className="page-title">Track Your Order</h1>
          <div className="tracking-card card">
            <div className="tracking-header">
              <div>
                <small>ORDER ID</small>
                <h2 id="trackingOrderId">Loading...</h2>
              </div>
              <span className="order-status" id="trackingStatus">
                Loading...
              </span>
            </div>

            <div className="tracking-progress">
              <div className="tracking-step">
                <div className="step-icon">
                  <i className="fa-solid fa-check"></i>
                </div>
                <strong>Order Placed</strong>
                <small>Order confirmed</small>
              </div>
              <div className="tracking-line"></div>
              <div className="tracking-step">
                <div className="step-icon">
                  <i className="fa-solid fa-box"></i>
                </div>
                <strong>Packed</strong>
                <small>Order prepared</small>
              </div>
              <div className="tracking-line"></div>
              <div className="tracking-step">
                <div className="step-icon">
                  <i className="fa-solid fa-truck"></i>
                </div>
                <strong>Out for Delivery</strong>
                <small>On the way to you</small>
              </div>
              <div className="tracking-line"></div>
              <div className="tracking-step">
                <div className="step-icon">
                  <i className="fa-solid fa-house"></i>
                </div>
                <strong>Delivered</strong>
                <small>Delivery completed</small>
              </div>
            </div>

            <div className="delivery-box">
              <div className="delivery-location-icon">
                <i className="fa-solid fa-location-dot"></i>
              </div>
              <div className="delivery-address-details">
                <small>DELIVERING TO</small>
                <strong id="trackingAddressName">Loading address...</strong>
                <p id="trackingAddress">
                  Your saved delivery address will appear here.
                </p>
                <p id="trackingPhone"></p>
              </div>
            </div>

            <div className="delivery-partner" hidden="">
              <div className="driver-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <div>
                <small>DELIVERY PARTNER</small>
                <strong id="trackingPartnerName">Not assigned</strong>
                <p>Your delivery partner details will appear here.</p>
              </div>
            </div>

            <div className="tracking-order-info">
              <h3>
                <i className="fa-solid fa-receipt"></i>
                Order Information
              </h3>
              <div className="tracking-info-row">
                <span>Order Date</span>
                <strong id="trackingOrderDate">—</strong>
              </div>
              <div className="tracking-info-row">
                <span>Items</span>
                <strong id="trackingItemCount">—</strong>
              </div>
              <div className="tracking-info-row">
                <span>Payment Method</span>
                <strong id="trackingPayment">—</strong>
              </div>
              <div className="tracking-info-row">
                <span>Payment Status</span>
                <strong id="trackingPaymentStatus">—</strong>
              </div>
              <div className="tracking-info-row">
                <span>Order Total</span>
                <strong id="trackingTotal">—</strong>
              </div>
            </div>

            <p id="trackingMessage" role="status" hidden=""></p>

            <div className="tracking-actions">
              <a href="/orders" className="btn btn-outline">
                <i className="fa-solid fa-arrow-left"></i>
                My Orders
              </a>
              <a href="/products" className="btn btn-primary">
                Continue Shopping
              </a>
            </div>
          </div>
        </div>
      </main>

      <footer className="footer">
        <div className="container footer-bottom">
          © <span id="currentYear"></span> QuickKart. All rights reserved.
        </div>
      </footer>
    </>
  );
}
