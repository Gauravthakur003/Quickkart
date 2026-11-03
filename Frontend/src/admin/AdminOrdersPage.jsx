import { useEffect } from "react";

export default function AdminOrdersPage() {
  useEffect(() => {
    document.title = "Manage Orders | QuickKart";
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
          <a href="/admin/orders" className="active">
            <i className="fa-solid fa-cart-shopping"></i>
            Orders
          </a>
          <a href="/admin/users">
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
            <h1>Orders</h1>
            <p>Manage customer orders and delivery status.</p>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-toolbar">
            <div className="admin-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                id="orderSearch"
                placeholder="Search order ID..."
              />
            </div>
            <select id="orderStatusFilter" className="admin-select">
              <option value="all">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Processing">Processing</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody id="adminOrdersBody"></tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
