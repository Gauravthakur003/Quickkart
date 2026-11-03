/* =========================================
   QUICKKART ADMIN
========================================= */


/* =========================================
   DEFAULT PRODUCTS
========================================= */

const defaultAdminProducts = [

    {
        id: 1,
        name: "Smart Wireless Product",
        category: "Electronics",
        price: 799,
        oldPrice: 1199,
        stock: 25,
        image: "../assets/box1_image.jpg",
        description: "Useful smart wireless product.",
        active: true,
        featured: true
    },

    {
        id: 2,
        name: "Home Essential",
        category: "Home",
        price: 499,
        oldPrice: 699,
        stock: 40,
        image: "../assets/box2_image.jpg",
        description: "Essential product for your home.",
        active: true,
        featured: false
    },

    {
        id: 3,
        name: "Beauty Essentials",
        category: "Beauty",
        price: 349,
        oldPrice: 499,
        stock: 35,
        image: "../assets/box3_image.jpg",
        description: "Everyday beauty essentials.",
        active: true,
        featured: true
    },

    {
        id: 4,
        name: "Daily Grocery Pack",
        category: "Groceries",
        price: 599,
        oldPrice: 749,
        stock: 50,
        image: "../assets/box4_image.jpg",
        description: "Useful daily grocery products.",
        active: true,
        featured: false
    }

];


/* =========================================
   PRODUCT STORAGE
========================================= */

function getAdminProducts() {

    const stored =
        localStorage.getItem(
            "quickkart_products"
        );


    if (stored) {

        return JSON.parse(stored);

    }


    localStorage.setItem(
        "quickkart_products",
        JSON.stringify(
            defaultAdminProducts
        )
    );


    return defaultAdminProducts;

}


function saveAdminProducts(products) {

    localStorage.setItem(
        "quickkart_products",
        JSON.stringify(products)
    );

}


/* =========================================
   ORDERS
========================================= */

function getAdminOrders() {

    return JSON.parse(
        localStorage.getItem(
            "quickkart_orders"
        )
    ) || [];

}


/* =========================================
   USERS
========================================= */

function getAdminUsers() {

    return JSON.parse(
        localStorage.getItem(
            "quickkart_users"
        )
    ) || [];

}


/* =========================================
   DASHBOARD
========================================= */

function loadAdminDashboard() {

    const products =
        getAdminProducts();

    const orders =
        getAdminOrders();

    const users =
        getAdminUsers();


    const totalProducts =
        document.getElementById(
            "totalProducts"
        );

    const totalOrders =
        document.getElementById(
            "totalOrders"
        );

    const totalRevenue =
        document.getElementById(
            "totalRevenue"
        );

    const totalUsers =
        document.getElementById(
            "totalUsers"
        );


    if (totalProducts) {

        totalProducts.textContent =
            products.length;

    }


    if (totalOrders) {

        totalOrders.textContent =
            orders.length;

    }


    if (totalUsers) {

        totalUsers.textContent =
            users.length;

    }


    let revenue = 0;


    orders.forEach(
        order => {

            if (
                order.status !==
                "Cancelled"
            ) {

                revenue +=
                    Number(order.total) || 0;

            }

        }
    );


    if (totalRevenue) {

        totalRevenue.textContent =
            "₹" +
            revenue.toLocaleString("en-IN");

    }


    renderRecentOrders();

}


/* =========================================
   RECENT ORDERS
========================================= */

function renderRecentOrders() {

    const container =
        document.getElementById(
            "recentOrders"
        );


    if (!container) {
        return;
    }


    const orders =
        getAdminOrders();


    if (orders.length === 0) {

        container.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    class="table-empty">

                    No orders available.

                </td>

            </tr>

        `;

        return;

    }


    container.innerHTML = "";


    orders
        .slice(-5)
        .reverse()
        .forEach(order => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    <strong>
                        ${order.id}
                    </strong>
                </td>

                <td>
                    Customer
                </td>

                <td>
                    ${order.date || "-"}
                </td>

                <td>
                    ₹${Number(order.total || 0)
                        .toLocaleString("en-IN")}
                </td>

                <td>
                    ${getStatusBadge(order.status)}
                </td>

            `;


            container.appendChild(row);

        });

}


/* =========================================
   PRODUCT TABLE
========================================= */

function renderAdminProducts(
    products = null
) {

    const tbody =
        document.getElementById(
            "productTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!products) {

        products =
            getAdminProducts();

    }


    tbody.innerHTML = "";


    if (products.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-empty">

                    No products found.

                </td>

            </tr>

        `;

        return;

    }


    products.forEach(
        product => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="product-info">

                        <img
                            src="${product.image}"
                            class="product-thumb"
                            onerror="this.src='../assets/box1_image.jpg'"
                        >

                        <div>

                            <strong>
                                ${escapeAdminHTML(product.name)}
                            </strong>

                            <small>
                                ID: ${product.id}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${product.category}
                </td>


                <td>
                    ₹${Number(product.price)
                        .toLocaleString("en-IN")}
                </td>


                <td>
                    ${product.stock}
                </td>


                <td>

                    ${
                        product.active
                            ? `
                                <span class="admin-status status-active">
                                    Active
                                </span>
                              `
                            : `
                                <span class="admin-status status-inactive">
                                    Inactive
                                </span>
                              `
                    }

                </td>


                <td>

                    <div class="table-actions">

                        <button
                            class="table-action"
                            title="Toggle Status"
                            onclick="toggleProductStatus(${product.id})">

                            <i class="fa-solid fa-power-off"></i>

                        </button>


                        <button
                            class="table-action delete"
                            title="Delete"
                            onclick="deleteProduct(${product.id})">

                            <i class="fa-solid fa-trash"></i>

                        </button>

                    </div>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================
   PRODUCT SEARCH
========================================= */

function setupProductFilters() {

    const search =
        document.getElementById(
            "productSearch"
        );

    const category =
        document.getElementById(
            "categoryFilter"
        );


    if (!search && !category) {
        return;
    }


    function filterProducts() {

        const products =
            getAdminProducts();


        const searchValue =
            search
                ? search.value
                    .trim()
                    .toLowerCase()
                : "";


        const categoryValue =
            category
                ? category.value
                : "all";


        const filtered =
            products.filter(product => {

                const matchesSearch =
                    product.name
                        .toLowerCase()
                        .includes(searchValue);


                const matchesCategory =
                    categoryValue === "all" ||
                    product.category ===
                        categoryValue;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        renderAdminProducts(
            filtered
        );

    }


    if (search) {

        search.addEventListener(
            "input",
            filterProducts
        );

    }


    if (category) {

        category.addEventListener(
            "change",
            filterProducts
        );

    }

}


/* =========================================
   TOGGLE PRODUCT
========================================= */

function toggleProductStatus(id) {

    const products =
        getAdminProducts();


    const product =
        products.find(
            item => item.id === id
        );


    if (!product) {
        return;
    }


    product.active =
        !product.active;


    saveAdminProducts(
        products
    );


    renderAdminProducts();

}


/* =========================================
   DELETE PRODUCT
========================================= */

function deleteProduct(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this product?"
        );


    if (!confirmed) {
        return;
    }


    let products =
        getAdminProducts();


    products =
        products.filter(
            product =>
                product.id !== id
        );


    saveAdminProducts(
        products
    );


    renderAdminProducts();

}


/* =========================================
   ADD PRODUCT
========================================= */

function setupAddProduct() {

    const form =
        document.getElementById(
            "addProductForm"
        );


    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "productName"
                ).value.trim();


            const category =
                document.getElementById(
                    "productCategory"
                ).value;


            const price =
                Number(
                    document.getElementById(
                        "productPrice"
                    ).value
                );


            const oldPrice =
                Number(
                    document.getElementById(
                        "productOldPrice"
                    ).value
                ) || price;


            const stock =
                Number(
                    document.getElementById(
                        "productStock"
                    ).value
                );


            const image =
                document.getElementById(
                    "productImage"
                ).value.trim()
                ||
                "../assets/box1_image.jpg";


            const description =
                document.getElementById(
                    "productDescription"
                ).value.trim();


            const active =
                document.getElementById(
                    "productActive"
                ).checked;


            const featured =
                document.getElementById(
                    "featuredProduct"
                ).checked;


            const products =
                getAdminProducts();


            const newProduct = {

                id:
                    Date.now(),

                name,

                category,

                price,

                oldPrice,

                stock,

                image,

                description,

                active,

                featured

            };


            products.push(
                newProduct
            );


            saveAdminProducts(
                products
            );


            alert(
                "Product added successfully!"
            );


            window.location.href =
                "products.html";

        }
    );

}


/* =========================================
   ORDERS TABLE
========================================= */

function renderAdminOrders(
    orders = null
) {

    const tbody =
        document.getElementById(
            "adminOrdersBody"
        );


    if (!tbody) {
        return;
    }


    if (!orders) {

        orders =
            getAdminOrders();

    }


    tbody.innerHTML = "";


    if (orders.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="table-empty">

                    No orders found.

                </td>

            </tr>

        `;

        return;

    }


    orders.forEach(
        order => {

            const row =
                document.createElement("tr");


            const itemCount =
                order.items
                    ? order.items.reduce(
                        (
                            total,
                            item
                        ) =>
                            total +
                            Number(
                                item.quantity ||
                                0
                            ),
                        0
                    )
                    : 0;


            row.innerHTML = `

                <td>
                    <strong>
                        ${order.id}
                    </strong>
                </td>


                <td>
                    Customer
                </td>


                <td>
                    ${order.date || "-"}
                </td>


                <td>
                    ${itemCount}
                </td>


                <td>
                    ₹${Number(order.total || 0)
                        .toLocaleString("en-IN")}
                </td>


                <td>

                    <select
                        class="admin-select"
                        onchange="updateOrderStatus(
                            '${order.id}',
                            this.value
                        )">

                        ${getOrderStatusOptions(
                            order.status
                        )}

                    </select>

                </td>


                <td>

                    <button
                        class="table-action"
                        onclick="viewAdminOrder('${order.id}')">

                        <i class="fa-solid fa-eye"></i>

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================
   ORDER STATUS OPTIONS
========================================= */

function getOrderStatusOptions(
    currentStatus
) {

    const statuses = [

        "Confirmed",

        "Processing",

        "Out for Delivery",

        "Delivered",

        "Cancelled"

    ];


    return statuses.map(
        status => `

            <option
                value="${status}"
                ${
                    status === currentStatus
                        ? "selected"
                        : ""
                }>

                ${status}

            </option>

        `
    ).join("");

}


/* =========================================
   UPDATE ORDER STATUS
========================================= */

function updateOrderStatus(
    orderId,
    status
) {

    const orders =
        getAdminOrders();


    const order =
        orders.find(
            item =>
                item.id === orderId
        );


    if (!order) {
        return;
    }


    order.status =
        status;


    localStorage.setItem(
        "quickkart_orders",
        JSON.stringify(orders)
    );


    renderAdminOrders();

}


/* =========================================
   ORDER SEARCH
========================================= */

function setupOrderFilters() {

    const search =
        document.getElementById(
            "orderSearch"
        );


    const status =
        document.getElementById(
            "orderStatusFilter"
        );


    if (!search && !status) {
        return;
    }


    function filterOrders() {

        const orders =
            getAdminOrders();


        const searchValue =
            search
                ? search.value
                    .trim()
                    .toLowerCase()
                : "";


        const statusValue =
            status
                ? status.value
                : "all";


        const filtered =
            orders.filter(
                order => {

                    const matchesSearch =
                        order.id
                            .toLowerCase()
                            .includes(
                                searchValue
                            );


                    const matchesStatus =
                        statusValue === "all" ||
                        order.status ===
                            statusValue;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );


        renderAdminOrders(
            filtered
        );

    }


    if (search) {

        search.addEventListener(
            "input",
            filterOrders
        );

    }


    if (status) {

        status.addEventListener(
            "change",
            filterOrders
        );

    }

}


/* =========================================
   USERS TABLE
========================================= */

function renderAdminUsers(
    users = null
) {

    const tbody =
        document.getElementById(
            "usersTableBody"
        );


    if (!tbody) {
        return;
    }


    if (!users) {

        users =
            getAdminUsers();

    }


    tbody.innerHTML = "";


    if (users.length === 0) {

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="6"
                    class="table-empty">

                    No customers registered yet.

                </td>

            </tr>

        `;

        return;

    }


    users.forEach(
        user => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <div class="product-info">

                        <div class="admin-avatar">

                            ${escapeAdminHTML(
                                user.name
                                    ? user.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"
                            )}

                        </div>

                        <div>

                            <strong>
                                ${escapeAdminHTML(
                                    user.name
                                )}
                            </strong>

                            <small>
                                ${user.id}
                            </small>

                        </div>

                    </div>

                </td>


                <td>
                    ${escapeAdminHTML(
                        user.email
                    )}
                </td>


                <td>
                    ${escapeAdminHTML(
                        user.phone || "-"
                    )}
                </td>


                <td>

                    <span class="admin-status status-active">

                        ${user.role || "CUSTOMER"}

                    </span>

                </td>


                <td>
                    ${
                        user.createdAt
                            ? new Date(
                                user.createdAt
                            ).toLocaleDateString()
                            : "-"
                    }
                </td>


                <td>

                    <button
                        class="table-action delete"
                        onclick="deleteAdminUser('${user.id}')">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </td>

            `;


            tbody.appendChild(row);

        }
    );

}


/* =========================================
   USER SEARCH
========================================= */

function setupUserSearch() {

    const search =
        document.getElementById(
            "userSearch"
        );


    if (!search) {
        return;
    }


    search.addEventListener(
        "input",
        () => {

            const value =
                search.value
                    .trim()
                    .toLowerCase();


            const users =
                getAdminUsers();


            const filtered =
                users.filter(
                    user =>
                        user.name
                            .toLowerCase()
                            .includes(value) ||
                        user.email
                            .toLowerCase()
                            .includes(value)
                );


            renderAdminUsers(
                filtered
            );

        }
    );

}


/* =========================================
   DELETE USER
========================================= */

function deleteAdminUser(id) {

    const confirmed =
        confirm(
            "Are you sure you want to remove this customer?"
        );


    if (!confirmed) {
        return;
    }


    let users =
        getAdminUsers();


    users =
        users.filter(
            user =>
                user.id !== id
        );


    localStorage.setItem(
        "quickkart_users",
        JSON.stringify(users)
    );


    renderAdminUsers();

}


/* =========================================
   VIEW ORDER
========================================= */

function viewAdminOrder(id) {

    const orders =
        getAdminOrders();


    const order =
        orders.find(
            item =>
                item.id === id
        );


    if (!order) {
        return;
    }


    const items =
        order.items
            ? order.items
                .map(
                    item =>
                        `${item.name} × ${item.quantity}`
                )
                .join("\n")
            : "No items";


    alert(
        `Order: ${order.id}\n\n` +
        `Status: ${order.status}\n` +
        `Total: ₹${order.total}\n\n` +
        `Items:\n${items}`
    );

}


/* =========================================
   STATUS BADGE
========================================= */

function getStatusBadge(status) {

    let className =
        "status-processing";


    if (status === "Confirmed") {

        className =
            "status-confirmed";

    }


    if (status === "Delivered") {

        className =
            "status-delivered";

    }


    if (status === "Cancelled") {

        className =
            "status-cancelled";

    }


    if (status === "Out for Delivery") {

        className =
            "status-out";

    }


    return `

        <span class="admin-status ${className}">

            ${status || "Unknown"}

        </span>

    `;

}


/* =========================================
   HTML ESCAPE
========================================= */

function escapeAdminHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value || "";

    return div.innerHTML;

}


/* =========================================
   MOBILE SIDEBAR
========================================= */

function setupMobileSidebar() {

    const button =
        document.getElementById(
            "mobileSidebarButton"
        );


    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    if (!button || !sidebar) {
        return;
    }


    button.addEventListener(
        "click",
        () => {

            sidebar.classList.toggle(
                "mobile-open"
            );

        }
    );

}


/* =========================================
   ADMIN LOGOUT
========================================= */

function adminLogout() {

    window.location.href =
        "../index.html";

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadAdminDashboard();

        renderAdminProducts();

        setupProductFilters();

        setupAddProduct();

        renderAdminOrders();

        setupOrderFilters();

        renderAdminUsers();

        setupUserSearch();

        setupMobileSidebar();

    }
);

/* =========================================
   ADMIN DELIVERY DETAIL
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    if (
        document.querySelector("#detailOrderId")
    ) {

        loadAdminDeliveryDetail();

    }

});


/* =========================================
   LOAD ORDER
========================================= */

function loadAdminDeliveryDetail() {

    const orders =
        JSON.parse(
            localStorage.getItem(
                "quickkart_orders"
            )
        ) || [];


    const params =
        new URLSearchParams(
            window.location.search
        );

    const orderId =
        params.get("id");


    let order = null;


    if (orderId) {

        order = orders.find(
            item =>
                String(item.id) ===
                String(orderId)
        );

    }


    /*
        If no order exists,
        show demo order.
    */

    if (!order) {

        order = {

            id: "QK10001",

            date:
                new Date().toLocaleDateString(),

            status: "Processing",

            items: [

                {
                    name:
                        "Smart Wireless Product",

                    price: 799,

                    quantity: 1,

                    image:
                        "../assets/box1_image.jpg"
                },

                {
                    name:
                        "Home Essential",

                    price: 499,

                    quantity: 1,

                    image:
                        "../assets/box2_image.jpg"
                }

            ],

            total: 1338

        };

    }


    renderAdminDeliveryDetail(order);

}


/* =========================================
   RENDER
========================================= */

function renderAdminDeliveryDetail(order) {

    const orderId =
        document.querySelector(
            "#detailOrderId"
        );

    const orderDate =
        document.querySelector(
            "#detailOrderDate"
        );

    const status =
        document.querySelector(
            "#detailOrderStatus"
        );

    const items =
        document.querySelector(
            "#detailOrderItems"
        );

    const total =
        document.querySelector(
            "#detailOrderTotal"
        );

    const itemCount =
        document.querySelector(
            "#detailItemCount"
        );


    if (orderId) {

        orderId.textContent =
            order.id;

    }


    if (orderDate) {

        orderDate.textContent =
            `Order placed on ${order.date}`;

    }


    if (status) {

        status.textContent =
            order.status;

        status.className =
            `admin-status ${getAdminOrderStatusClass(
                order.status
            )}`;

    }


    if (items) {

        items.innerHTML =
            order.items.map(item => {

                const quantity =
                    item.quantity || 1;

                const itemTotal =
                    item.price * quantity;


                return `

                    <div class="admin-detail-item">

                        <div class="admin-detail-item-image">

                            <img
                                src="${item.image || "../assets/box1_image.jpg"}"
                                alt="${escapeAdminHTML(item.name)}"
                            >

                        </div>


                        <div class="admin-detail-item-info">

                            <h4>
                                ${escapeAdminHTML(item.name)}
                            </h4>

                            <span>
                                ₹${item.price} × ${quantity}
                            </span>

                        </div>


                        <div class="admin-detail-item-price">

                            ₹${itemTotal}

                        </div>

                    </div>

                `;

            }).join("");

    }


    if (itemCount) {

        const count =
            order.items.reduce(
                (total, item) =>
                    total + (item.quantity || 1),
                0
            );

        itemCount.textContent =
            `${count} item${count !== 1 ? "s" : ""}`;

    }


    if (total) {

        total.textContent =
            `₹${order.total}`;

    }


    updateAdminDeliveryProgress(
        order.status
    );

}


/* =========================================
   STATUS CLASS
========================================= */

function getAdminOrderStatusClass(status) {

    switch (status) {

        case "Confirmed":
            return "status-confirmed";

        case "Processing":
            return "status-processing";

        case "Out for Delivery":
            return "status-out";

        case "Delivered":
            return "status-delivered";

        case "Cancelled":
            return "status-cancelled";

        default:
            return "status-processing";

    }

}


/* =========================================
   UPDATE STATUS
========================================= */

function adminUpdateDeliveryStatus(status) {

    const orders =
        JSON.parse(
            localStorage.getItem(
                "quickkart_orders"
            )
        ) || [];


    const params =
        new URLSearchParams(
            window.location.search
        );

    const orderId =
        params.get("id");


    let index = -1;


    if (orderId) {

        index =
            orders.findIndex(
                order =>
                    String(order.id) ===
                    String(orderId)
            );

    }


    /*
        If no ID exists,
        update latest order.
    */

    if (
        index === -1 &&
        orders.length > 0
    ) {

        index =
            orders.length - 1;

    }


    if (index !== -1) {

        orders[index].status =
            status;


        localStorage.setItem(
            "quickkart_orders",
            JSON.stringify(orders)
        );


        localStorage.setItem(
            "quickkart_last_order",
            JSON.stringify(
                orders[index]
            )
        );


        renderAdminDeliveryDetail(
            orders[index]
        );

    }


    showNotification(
        `Order status changed to ${status}`
    );

}


/* =========================================
   PROGRESS
========================================= */

function updateAdminDeliveryProgress(status) {

    const steps =
        document.querySelectorAll(
            ".admin-progress-step"
        );

    const lines =
        document.querySelectorAll(
            ".admin-progress-line"
        );


    steps.forEach(step => {

        step.classList.remove(
            "completed",
            "active"
        );

    });


    lines.forEach(line => {

        line.classList.remove(
            "completed"
        );

    });


    if (status === "Confirmed") {

        steps[0]?.classList.add(
            "active"
        );

    }


    else if (status === "Processing") {

        steps[0]?.classList.add(
            "completed"
        );

        steps[1]?.classList.add(
            "active"
        );

        lines[0]?.classList.add(
            "completed"
        );

    }


    else if (
        status === "Out for Delivery"
    ) {

        steps[0]?.classList.add(
            "completed"
        );

        steps[1]?.classList.add(
            "completed"
        );

        steps[2]?.classList.add(
            "active"
        );

        lines[0]?.classList.add(
            "completed"
        );

        lines[1]?.classList.add(
            "completed"
        );

    }


    else if (
        status === "Delivered"
    ) {

        steps.forEach(step => {

            step.classList.add(
                "completed"
            );

        });


        lines.forEach(line => {

            line.classList.add(
                "completed"
            );

        });

    }

}


/* =========================================
   OPEN MAP
========================================= */

function openAdminMap() {

    const address =
        encodeURIComponent(
            "Andheri West, Mumbai, Maharashtra 400058"
        );


    window.open(
        `https://www.google.com/maps/search/?api=1&query=${address}`,
        "_blank"
    );

}


/* =========================================
   CONTACT DELIVERY PARTNER
========================================= */

function callDeliveryPartner() {

    window.location.href =
        "tel:+919876543210";

}


/* =========================================
   ASSIGN DELIVERY PARTNER
========================================= */

function assignDeliveryPartner() {

    const partner =
        prompt(
            "Enter delivery partner name:",
            "Rahul Sharma"
        );


    if (!partner) return;


    showNotification(
        `${partner} assigned successfully`
    );

}


/* =========================================
   CANCEL ORDER
========================================= */

function cancelAdminOrder() {

    const confirmCancel =
        confirm(
            "Are you sure you want to cancel this order?"
        );


    if (!confirmCancel) return;


    adminUpdateDeliveryStatus(
        "Cancelled"
    );

}