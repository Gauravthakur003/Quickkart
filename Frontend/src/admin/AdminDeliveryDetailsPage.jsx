import { useEffect } from "react";

export default function AdminDeliveryDetailsPage() {
  useEffect(() => {
    document.title = "Delivery Details | QuickKart Admin";
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
          <div className="admin-logo">Q</div>
          <div>
            <h2>QuickKart</h2>
            <span>ADMIN PANEL</span>
          </div>
        </div>
        <nav className="admin-nav">
          <a href="/admin/dashboard">
            <span>▣</span>
            Dashboard
          </a>
          <a href="/admin/products">
            <span>▤</span>
            Products
          </a>
          <a href="/admin/add-product">
            <span>＋</span>
            Add Product
          </a>
          <a href="/admin/orders" className="active">
            <span>◫</span>
            Orders
          </a>
          <a href="/admin/users">
            <span>♙</span>
            Users
          </a>
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/">
            <span>←</span>
            View Store
          </a>
          <button onClick={() => window.adminLogout()}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-heading">
            <h1>Delivery Details</h1>
            <p>View and manage order delivery information</p>
          </div>
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <div>
              <strong>Administrator</strong>
              <span>Super Admin</span>
            </div>
          </div>
        </header>

        <section className="admin-page">
          <div className="admin-detail-back">
            <a href="/admin/orders">← Back to Orders</a>
          </div>

          <div className="admin-detail-header">
            <div>
              <span className="admin-detail-label">ORDER ID</span>
              <h2 id="detailOrderId">QK10001</h2>
              <p id="detailOrderDate">Order placed today</p>
            </div>
            <div
              id="detailOrderStatus"
              className="admin-status status-processing"
            >
              Processing
            </div>
          </div>

          <div className="admin-detail-grid">
            <div className="admin-detail-left">
              <div className="admin-detail-card">
                <div className="admin-detail-card-header">
                  <div>
                    <h3>Customer Information</h3>
                    <p>Customer who placed this order</p>
                  </div>
                  <div className="admin-detail-icon">👤</div>
                </div>
                <div className="admin-customer">
                  <div className="admin-customer-avatar">G</div>
                  <div>
                    <h4 id="detailCustomerName">Gaurav Thakur</h4>
                    <p id="detailCustomerPhone">+91 98765 43210</p>
                    <p id="detailCustomerEmail">gaurav@example.com</p>
                  </div>
                </div>
              </div>

              <div className="admin-detail-card">
                <div className="admin-detail-card-header">
                  <div>
                    <h3>Delivery Address</h3>
                    <p>Customer's delivery location</p>
                  </div>
                  <div className="admin-detail-icon">📍</div>
                </div>
                <div className="admin-address-box">
                  <strong>Gaurav Thakur</strong>
                  <p>Flat 402, Sunshine Apartments</p>
                  <p>Andheri West, Mumbai</p>
                  <p>Maharashtra - 400058</p>
                  <p>India</p>
                </div>
                <button
                  className="admin-detail-button admin-detail-button-outline"
                  onClick={() => window.openAdminMap()}
                >
                  📍 Open Location
                </button>
              </div>

              <div className="admin-detail-card">
                <div className="admin-detail-card-header">
                  <div>
                    <h3>Order Items</h3>
                    <p id="detailItemCount">2 items</p>
                  </div>
                  <div className="admin-detail-icon">🛍️</div>
                </div>
                <div id="detailOrderItems"></div>
                <div className="admin-detail-total">
                  <span>Total Order Value</span>
                  <strong id="detailOrderTotal">₹1,338</strong>
                </div>
              </div>
            </div>

            <div className="admin-detail-right">
              <div className="admin-detail-card">
                <div className="admin-detail-card-header">
                  <div>
                    <h3>Delivery Status</h3>
                    <p>Current order progress</p>
                  </div>
                </div>
                <div className="admin-delivery-progress">
                  <div className="admin-progress-step completed">
                    <div className="admin-progress-circle">✓</div>
                    <div>
                      <strong>Order Confirmed</strong>
                      <span>Order successfully placed</span>
                    </div>
                  </div>
                  <div className="admin-progress-line completed"></div>
                  <div className="admin-progress-step active">
                    <div className="admin-progress-circle">2</div>
                    <div>
                      <strong>Processing</strong>
                      <span>Order is being prepared</span>
                    </div>
                  </div>
                  <div className="admin-progress-line"></div>
                  <div className="admin-progress-step">
                    <div className="admin-progress-circle">3</div>
                    <div>
                      <strong>Out for Delivery</strong>
                      <span>Delivery partner has the order</span>
                    </div>
                  </div>
                  <div className="admin-progress-line"></div>
                  <div className="admin-progress-step">
                    <div className="admin-progress-circle">4</div>
                    <div>
                      <strong>Delivered</strong>
                      <span>Order delivered successfully</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="admin-detail-card">
                <div className="admin-detail-card-header">
                  <div>
                    <h3>Change Status</h3>
                    <p>Update the order delivery status</p>
                  </div>
                </div>
                <div className="admin-status-options">
                  <button
                    onClick={() =>
                      window.adminUpdateDeliveryStatus("Confirmed")
                    }
                  >
                    <span className="admin-status-dot confirmed"></span>
                    Confirmed
                  </button>
                  <button
                    onClick={() =>
                      window.adminUpdateDeliveryStatus("Processing")
                    }
                  >
                    <span className="admin-status-dot processing"></span>
                    Processing
                  </button>
                  <button
                    onClick={() =>
                      window.adminUpdateDeliveryStatus("Out for Delivery")
                    }
                  >
                    <span className="admin-status-dot out"></span>
                    Out for Delivery
                  </button>
                  <button
                    onClick={() =>
                      window.adminUpdateDeliveryStatus("Delivered")
                    }
                  >
                    <span className="admin-status-dot delivered"></span>
                    Delivered
                  </button>
                  <button
                    onClick={() =>
                      window.adminUpdateDeliveryStatus("Cancelled")
                    }
                  >
                    <span className="admin-status-dot cancelled"></span>
                    Cancelled
                  </button>
                </div>
              </div>

              <div className="admin-detail-card">
                <div className="admin-detail-card-header">
                  <div>
                    <h3>Delivery Partner</h3>
                    <p>Assigned delivery executive</p>
                  </div>
                </div>
                <div className="admin-partner">
                  <div className="admin-partner-avatar">R</div>
                  <div>
                    <strong>Rahul Sharma</strong>
                    <span>QuickKart Delivery Partner</span>
                    <span>ID: QK-DP-001</span>
                  </div>
                </div>
                <button
                  className="admin-detail-button admin-detail-button-outline"
                  onClick={() => window.callDeliveryPartner()}
                >
                  📞 Contact Partner
                </button>
              </div>

              <div className="admin-detail-actions">
                <button
                  className="admin-detail-button admin-detail-button-primary"
                  onClick={() => window.assignDeliveryPartner()}
                >
                  🚚 Assign Delivery Partner
                </button>
                <button
                  className="admin-detail-button admin-detail-button-danger"
                  onClick={() => window.cancelAdminOrder()}
                >
                  ✕ Cancel Order
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
