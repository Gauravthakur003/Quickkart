import { useEffect } from "react";

export default function AdminUserPage() {
  useEffect(() => {
    document.title = "Users | QuickKart Admin";
    document.body.className = "admin-body";
    const styleLinks = ["common.css", "admin.css"];
    const scriptFiles = ["admin.js"];
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
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <a href="/">
            Quick<span>Kart</span>
          </a>
          <small>ADMIN PANEL</small>
        </div>
        <nav className="admin-nav">
          <a href="/admin/dashboard">
            <i className="fa-solid fa-chart-line"></i>
            Dashboard
          </a>
          <a href="/admin/products">
            <i className="fa-solid fa-box"></i>
            Products
          </a>
          <a href="/admin/add-product">
            <i className="fa-solid fa-plus"></i>
            Add Product
          </a>
          <a href="/admin/orders">
            <i className="fa-solid fa-cart-shopping"></i>
            Orders
          </a>
          <a href="/admin/users" className="active">
            <i className="fa-solid fa-users"></i>
            Users
          </a>
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/">
            <i className="fa-solid fa-store"></i>
            View Store
          </a>
          <button onClick={() => window.adminLogout()}>
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-heading">
            <h1>Customers</h1>
            <p>View and manage QuickKart customers.</p>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                id="userSearch"
                placeholder="Search customers..."
              />
            </div>
          </div>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="usersTableBody"></tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
