import { useEffect } from "react";

export default function RegisterPage() {
  useEffect(() => {
    document.title = "Create Account | QuickKart";
    document.body.className = "";
    const styleLinks = ["common.css", "auth.css"];
    const scriptFiles = ["auth.js"];
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
      <header className="auth-header">
        <div className="auth-logo">
          <a href="/">
            Quick<span>Kart</span>
          </a>
        </div>
        <a href="/" className="back-home">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Home
        </a>
      </header>

      <main className="auth-page">
        <div className="auth-container register-container">
          <div className="auth-info">
            <div className="auth-info-content">
              <span className="auth-badge">
                <i className="fa-solid fa-user-plus"></i>
                Join QuickKart
              </span>
              <h1>
                Start your
                <span>QuickKart</span>
                journey
              </h1>
              <p>
                Create your account and get access to faster checkout, order
                tracking, wishlist and personalized shopping.
              </p>
              <div className="auth-benefits">
                <div className="auth-benefit">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-cart-shopping"></i>
                  </div>
                  <div>
                    <h3>Easy Shopping</h3>
                    <p>Browse and purchase products easily.</p>
                  </div>
                </div>
                <div className="auth-benefit">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    <h3>Track Deliveries</h3>
                    <p>Know exactly where your order is.</p>
                  </div>
                </div>
                <div className="auth-benefit">
                  <div className="benefit-icon">
                    <i className="fa-solid fa-heart"></i>
                  </div>
                  <div>
                    <h3>Save Favorites</h3>
                    <p>Keep your favorite products nearby.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="auth-card">
            <div className="auth-card-header">
              <div className="auth-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h2>Create your account</h2>
              <p>It only takes a minute</p>
            </div>
            <form id="registerForm">
              <div className="form-group">
                <label htmlFor="registerName">Full Name</label>
                <div className="input-wrapper">
                  <i className="fa-regular fa-user"></i>
                  <input
                    type="text"
                    id="registerName"
                    className="form-control"
                    placeholder="Enter your full name"
                    required=""
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="registerEmail">Email Address</label>
                <div className="input-wrapper">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    id="registerEmail"
                    className="form-control"
                    placeholder="Enter your email"
                    required=""
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="registerPhone">Phone Number</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-phone"></i>
                  <input
                    type="tel"
                    id="registerPhone"
                    className="form-control"
                    placeholder="Enter your phone number"
                    maxLength="10"
                    required=""
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="registerPassword">Password</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    id="registerPassword"
                    className="form-control"
                    placeholder="Create a password"
                    required=""
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    id="toggleRegisterPassword"
                  >
                    <i className="fa-regular fa-eye"></i>
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="input-wrapper">
                  <i className="fa-solid fa-lock"></i>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    required=""
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    id="toggleConfirmPassword"
                  >
                    <i className="fa-regular fa-eye"></i>
                  </button>
                </div>
              </div>

              <div className="terms-row">
                <label className="checkbox-label">
                  <input type="checkbox" id="terms" required="" />
                  <span>
                    I agree to the
                    <a href="#">Terms & Conditions</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="auth-submit">
                <span>Create Account</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </form>
            <div className="auth-divider">
              <span>OR</span>
            </div>
            <div className="auth-switch">
              <p>
                Already have an account?
                <a href="/login">Login</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
