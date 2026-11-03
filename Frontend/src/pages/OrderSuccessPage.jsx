import { useEffect } from "react";

export default function OrderSuccessPage() {
  useEffect(() => {
    document.title = "Order Confirmed | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css"];
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
          <div className="header-actions">
            <a href="/orders" className="header-action">
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
      <main className="success-page">
        <div className="container">
          <section className="success-card">
            <div className="success-icon">
              <i className="fa-solid fa-check"></i>
            </div>
            <h1 id="successHeading">Order placed successfully!</h1>
            <p className="success-message" id="successMessage">
              Thank you for shopping with QuickKart. Your order confirmation is
              shown below.
            </p>
            <div id="orderConfirmation">
              <div className="order-info">
                <h2>Order Details</h2>
                <div className="info-row">
                  <span>Order ID</span>
                  <strong id="successOrderId">Loading...</strong>
                </div>
                <div className="info-row">
                  <span>Order Date</span>
                  <strong id="successOrderDate">—</strong>
                </div>
                <div className="info-row">
                  <span>Items</span>
                  <strong id="successItemCount">—</strong>
                </div>
                <div className="info-row">
                  <span>Payment Method</span>
                  <strong id="successPayment">—</strong>
                </div>
                <div className="info-row">
                  <span>Payment Status</span>
                  <strong id="successPaymentStatus">—</strong>
                </div>
                <div className="info-row">
                  <span>Order Total</span>
                  <strong id="successTotal">—</strong>
                </div>
                <div className="info-row">
                  <span>Order Status</span>
                  <strong id="successStatus">—</strong>
                </div>
              </div>
              <div className="order-info">
                <h2>Delivery Address</h2>
                <p id="successAddress">—</p>
                <p id="successPhone"></p>
              </div>
            </div>
            <div id="orderError" className="order-error" hidden="">
              We couldn't find this order in your browser storage. Please check
              My Orders.
            </div>
            <div className="success-actions">
              <a href="/orders" className="btn btn-primary">
                <i className="fa-solid fa-box"></i>
                View My Orders
              </a>
              <a href="/products" className="btn btn-outline">
                Continue Shopping
              </a>
            </div>
            <p className="success-note">
              This demo stores orders in your current browser. Online payments
              are not processed by a real payment gateway.
            </p>
          </section>
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
