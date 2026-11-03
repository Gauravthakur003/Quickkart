import { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    document.title = "Sign In | QuickKart";
    document.body.className = "auth-page";
    const styleLinks = ["common.css", "auth.css"];
    const scriptFiles = ["common.js", "auth.js"];
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
        <a href="/" className="auth-logo" aria-label="QuickKart home">
          Quick<span>Kart</span>
          <span className="logo-dot">.</span>
        </a>
        <p>Welcome back to better shopping.</p>
      </header>
      <main className="auth-main">
        <section className="auth-card">
          <div className="auth-card-heading">
            <div className="auth-icon" aria-hidden="true">
              ↗
            </div>
            <h1>Sign in</h1>
            <p>Access your orders, wishlist and account.</p>
          </div>
          <form id="loginForm" novalidate="">
            <div className="form-group">
              <label htmlFor="loginEmail">Email address</label>
              <input
                type="email"
                id="loginEmail"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required=""
              />
              <small className="field-error" id="loginEmailError"></small>
            </div>
            <div className="form-group">
              <div className="label-row">
                <label htmlFor="loginPassword">Password</label>
                <button
                  type="button"
                  className="text-button"
                  id="togglePassword"
                >
                  Show
                </button>
              </div>
              <input
                type="password"
                id="loginPassword"
                name="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required=""
              />
              <small className="field-error" id="loginPasswordError"></small>
            </div>
            <div className="auth-options">
              <label className="remember-option">
                <input type="checkbox" id="rememberMe" name="rememberMe" />
                <span>Remember me</span>
              </label>
              <a href="#" id="forgotPasswordLink">
                Forgot password?
              </a>
            </div>
            <div
              className="auth-message"
              id="loginMessage"
              role="status"
              aria-live="polite"
            ></div>
            <button type="submit" className="auth-submit" id="loginSubmit">
              Sign in
              <span aria-hidden="true">→</span>
            </button>
            <p className="auth-terms">
              By continuing, you agree to QuickKart's
              <a href="#" id="termsLink">
                Terms of Use
              </a>
              and
              <a href="#" id="privacyLink">
                Privacy Policy
              </a>
              .
            </p>
          </form>
          <div className="auth-divider">
            <span>New to QuickKart?</span>
          </div>
          <a href="/register" className="auth-secondary-button">
            Create your QuickKart account
          </a>
        </section>
      </main>
      <footer className="auth-footer">
        <div className="auth-footer-links">
          <a href="#" id="footerTermsLink">
            Terms
          </a>
          <a href="#" id="footerPrivacyLink">
            Privacy
          </a>
          <a href="/">Back to shopping</a>
        </div>
        <p>
          © <span id="currentYear"></span> QuickKart. All rights reserved.
        </p>
        <p className="auth-demo-note">
          QuickKart is a demo storefront. Authentication depends on your
          project's JavaScript implementation.
        </p>
      </footer>
    </>
  );
}
