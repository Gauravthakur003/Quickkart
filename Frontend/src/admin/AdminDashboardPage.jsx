import { useEffect } from "react";

export default function AdminDashboardPage() {
  useEffect(() => {
    document.title = "Admin Dashboard | QuickKart";
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
          <a href="/admin/dashboard" className="active">
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
          <div>
            <button className="mobile-sidebar-btn" id="mobileSidebarButton">
              <i className="fa-solid fa-bars"></i>
            </button>
            <div className="admin-heading">
              <h1>Dashboard</h1>
              <p>Welcome back, Admin.</p>
            </div>
          </div>
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <small>Super Admin</small>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fa-solid fa-box"></i>
              </div>
              <div>
                <span>Total Products</span>
                <strong id="totalProducts">0</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fa-solid fa-cart-shopping"></i>
              </div>
              <div>
                <span>Total Orders</span>
                <strong id="totalOrders">0</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fa-solid fa-indian-rupee-sign"></i>
              </div>
              <div>
                <span>Total Revenue</span>
                <strong id="totalRevenue">₹0</strong>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fa-solid fa-users"></i>
              </div>
              <div>
                <span>Customers</span>
                <strong id="totalUsers">0</strong>
              </div>
            </div>
          </section>

          <section className="admin-section">
            <div className="section-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>Manage your store quickly.</p>
              </div>
            </div>
            <div className="admin-quick-grid">
              <a href="/admin/add-product" className="admin-action-card">
                <div className="action-icon">
                  <i className="fa-solid fa-plus"></i>
                </div>
                <div>
                  <h3>Add Product</h3>
                  <p>Add a new product to your store.</p>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href="/admin/products" className="admin-action-card">
                <div className="action-icon">
                  <i className="fa-solid fa-box"></i>
                </div>
                <div>
                  <h3>Manage Products</h3>
                  <p>Edit inventory and product details.</p>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href="/admin/orders" className="admin-action-card">
                <div className="action-icon">
                  <i className="fa-solid fa-truck"></i>
                </div>
                <div>
                  <h3>Manage Orders</h3>
                  <p>View and update customer orders.</p>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
              <a href="/admin/users" className="admin-action-card">
                <div className="action-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div>
                  <h3>Customers</h3>
                  <p>View registered customers.</p>
                </div>
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </section>

          <section className="admin-section">
            <div className="section-heading">
              <div>
                <h2>Recent Orders</h2>
                <p>Latest customer activity.</p>
              </div>
              <a href="/admin/orders" className="view-all">
                View All
                <i className="fa-solid fa-arrow-right"></i>
              </a>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="recentOrders">
                  <tr>
                    <td colSpan="5" className="table-empty">
                      No orders available.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
