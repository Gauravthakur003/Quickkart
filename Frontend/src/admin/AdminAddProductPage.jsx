import { useEffect } from "react";

export default function AdminAddProductPage() {
  useEffect(() => {
    document.title = "Add Product | QuickKart";
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
          <a href="/admin/add-product" className="active">
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
          <div className="admin-heading">
            <h1>Add Product</h1>
            <p>Add a new product to QuickKart.</p>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-form-card">
            <form id="addProductForm">
              <div className="admin-form-section">
                <div className="form-section-title">
                  <h2>Product Information</h2>
                  <p>Basic details about your product.</p>
                </div>
                <div className="admin-form-grid">
                  <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                      type="text"
                      id="productName"
                      className="form-control"
                      placeholder="e.g. Wireless Headphones"
                      required=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productCategory">Category</label>
                    <select
                      id="productCategory"
                      className="form-control"
                      required=""
                    >
                      <option value="">Select Category</option>
                      <option value="Groceries">Groceries</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Beauty">Beauty</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                      <option value="Stationery">Stationery</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="productPrice">Price</label>
                    <input
                      type="number"
                      id="productPrice"
                      className="form-control"
                      placeholder="799"
                      min="1"
                      required=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productOldPrice">Original Price</label>
                    <input
                      type="number"
                      id="productOldPrice"
                      className="form-control"
                      placeholder="1199"
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productStock">Stock Quantity</label>
                    <input
                      type="number"
                      id="productStock"
                      className="form-control"
                      placeholder="50"
                      min="0"
                      required=""
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="productImage">Image Path</label>
                    <input
                      type="text"
                      id="productImage"
                      className="form-control"
                      placeholder="../assets/box1_image.jpg"
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="productDescription">Description</label>
                    <textarea
                      id="productDescription"
                      className="form-control"
                      rows="5"
                      placeholder="Describe your product..."
                      required=""
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="admin-form-section">
                <div className="form-section-title">
                  <h2>Product Settings</h2>
                  <p>Configure product availability.</p>
                </div>
                <div className="admin-checkbox-grid">
                  <label className="admin-checkbox">
                    <input type="checkbox" id="productActive" checked="" />
                    <span>
                      <strong>Active Product</strong>
                      <small>Product will be visible in the store.</small>
                    </span>
                  </label>
                  <label className="admin-checkbox">
                    <input type="checkbox" id="featuredProduct" />
                    <span>
                      <strong>Featured Product</strong>
                      <small>Show product in featured sections.</small>
                    </span>
                  </label>
                </div>
              </div>

              <div className="admin-form-footer">
                <a href="/admin/products" className="btn btn-outline">
                  Cancel
                </a>
                <button type="submit" className="btn btn-primary">
                  <i className="fa-solid fa-plus"></i>
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
