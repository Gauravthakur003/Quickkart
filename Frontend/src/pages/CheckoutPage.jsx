import { useEffect } from "react";

export default function CheckoutPage() {
  useEffect(() => {
    document.title = "Checkout | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "checkout.css"];
    const scriptFiles = ["common.js", "checkout.js"];
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
      <main className="page">
        <div className="container">
          <h1 className="page-title">Checkout</h1>
          <div className="checkout-layout">
            <section>
              <div className="checkout-section card">
                <div className="section-heading">
                  <span className="step-number">1</span>
                  <h2>Delivery Address</h2>
                </div>
                <div className="address-card selected">
                  <strong>Gaurav Thakur</strong>
                  <p>
                    123 Main Street, Andheri West, Mumbai, Maharashtra - 400053
                  </p>
                  <p>Phone: +91 98765 43210</p>
                  <button className="btn btn-outline">Change Address</button>
                </div>
              </div>

              <div className="checkout-section card">
                <div className="section-heading">
                  <span className="step-number">2</span>
                  <h2>Payment Method</h2>
                </div>
                <label className="payment-option">
                  <input type="radio" name="payment" value="cod" checked="" />
                  <div>
                    <strong>Cash on Delivery</strong>
                    <small>Pay when your order arrives.</small>
                  </div>
                </label>
                <label className="payment-option">
                  <input type="radio" name="payment" value="online" />
                  <div>
                    <strong>Online Payment</strong>
                    <small>UPI, Cards, Net Banking</small>
                  </div>
                </label>
              </div>

              <div className="checkout-section card">
                <div className="section-heading">
                  <span className="step-number">3</span>
                  <h2>Review Order</h2>
                </div>
                <div id="checkoutItems"></div>
              </div>
            </section>

            <aside className="checkout-summary card">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal</span>
                <strong id="checkoutSubtotal">₹0</strong>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <strong>₹40</strong>
              </div>
              <hr />
              <div className="summary-total">
                <span>Total</span>
                <strong id="checkoutTotal">₹0</strong>
              </div>
              <button
                id="placeOrder"
                className="btn btn-primary place-order-btn"
              >
                Place Order
              </button>
              <p className="secure-payment">
                <i className="fa-solid fa-lock"></i>
                Secure & encrypted checkout
              </p>
            </aside>
          </div>
        </div>
      </main>
      <footer className="footer">
        <div className="container footer-bottom">
          © 2026 QuickKart. Secure Checkout.
        </div>
      </footer>
    </>
  );
}
