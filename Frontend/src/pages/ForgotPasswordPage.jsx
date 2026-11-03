import { useEffect } from "react";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = "Forgot Password | QuickKart";
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
        <a href="/login" className="back-home">
          <i className="fa-solid fa-arrow-left"></i>
          Back to Login
        </a>
      </header>

      <main className="auth-page">
        <div className="forgot-wrapper">
          <div className="auth-card forgot-card">
            <div className="auth-card-header">
              <div className="auth-icon">
                <i className="fa-solid fa-key"></i>
              </div>
              <h2>Forgot your password?</h2>
              <p>Don't worry. We'll help you get back into your account.</p>
            </div>
            <form id="forgotPasswordForm">
              <div className="form-group">
                <label htmlFor="forgotEmail">Email Address</label>
                <div className="input-wrapper">
                  <i className="fa-regular fa-envelope"></i>
                  <input
                    type="email"
                    id="forgotEmail"
                    className="form-control"
                    placeholder="Enter your registered email"
                    required=""
                  />
                </div>
              </div>
              <button type="submit" className="auth-submit">
                <span>Send Reset Link</span>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
            <div className="auth-divider">
              <span>OR</span>
            </div>
            <div className="auth-switch">
              <p>
                Remember your password?
                <a href="/login">Login here</a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
