const DEFAULT_ROLES = [
    {
        id: "admin",
        name: "Administrator",
        description: "Full access to users, roles, products, and orders.",
        permissions: ["users", "roles", "products", "orders"]
    },
    {
        id: "seller",
        name: "Customer & Seller",
        description: "Can browse, buy items, create listings, and manage their profile.",
        permissions: ["products", "orders"]
    },
    {
        id: "customer",
        name: "Legacy Customer",
        description: "Legacy buyer-only account type. New marketplace users can buy and sell.",
        permissions: ["orders"]
    },
    {
        id: "moderator",
        name: "Moderator",
        description: "Can review users and listings.",
        permissions: ["users", "products"]
    }
];

const DEMO_ADMIN_USER = {
    id: 1,
    fullName: "Admin User",
    email: "admin@hustlehub.co.za",
    phone: "0710000000",
    location: "Gauteng",
    roleId: "admin",
    password: "admin123",
    memberSince: "May 2026"
};

document.addEventListener("DOMContentLoaded", async function () {
    seedAdminData();
    if (!requireAdminAccess()) {
        return;
    }

    await syncAdminDataFromApi();
    renderAdminShell();
    renderDashboard();
    setupRoleForm();
    setupUserForm();
    renderRolesTable();
    renderUsersTable();
    renderAdminProducts();
    renderReportsTable();
});

function requireAdminAccess() {
    const currentUser = getCurrentAdminUser();

    if (currentUser && currentUser.roleId === "admin") {
        document.querySelectorAll("[data-admin-logout]").forEach(function (button) {
            button.addEventListener("click", logoutAdmin);
        });
        return true;
    }

    localStorage.setItem("hustleHubAuthRedirect", "admin/dashboard.html");
    window.location.href = "../login.html";
    return false;
}

function getCurrentAdminUser() {
    try {
        return JSON.parse(localStorage.getItem("hustleHubCurrentUser")) || null;
    } catch (error) {
        return null;
    }
}

function logoutAdmin() {
    localStorage.removeItem("hustleHubCurrentUser");
    window.location.href = "../login.html";
}

function seedAdminData() {
    if (!localStorage.getItem("hustleHubRoles")) {
        localStorage.setItem("hustleHubRoles", JSON.stringify(DEFAULT_ROLES));
    }

    const users = getAdminUsers();
    const hasAdmin = users.some(function (user) {
        return user.roleId === "admin";
    });

    const normalizedUsers = users.map(function (user) {
        const roleId = user.roleId === "admin" ? "admin" : "seller";

        return {
            ...user,
            username: roleId === "admin" ? (user.username || "admin") : user.username,
            roleId: roleId,
            accountCapabilities: roleId === "admin" ? ["admin"] : (user.accountCapabilities || ["customer", "seller"]),
            sellerType: user.sellerType && user.sellerType !== "Buyer" ? user.sellerType : (roleId === "admin" ? "Platform administrator" : "Student reseller"),
            password: roleId === "admin" ? (user.password || "admin123") : user.password
        };
    });

    if (!hasAdmin) {
        normalizedUsers.unshift(DEMO_ADMIN_USER);
    }

    localStorage.setItem("hustleHubUsers", JSON.stringify(normalizedUsers));
}

async function syncAdminDataFromApi() {
    if (typeof adminApiRequest !== "function") {
        return;
    }

    try {
        const rolesResponse = await adminApiRequest("roles");
        const usersResponse = await adminApiRequest("users");
        const listingsResponse = await adminApiRequest("listings");
        const reportsResponse = await adminApiRequest("reports");

        localStorage.setItem("hustleHubRoles", JSON.stringify(rolesResponse.roles));
        localStorage.setItem("hustleHubUsers", JSON.stringify(usersResponse.users));
        localStorage.setItem("hustleHubListings", JSON.stringify(listingsResponse.listings));
        localStorage.setItem("hustleHubReports", JSON.stringify(reportsResponse.reports));
    } catch (error) {
        // Keep the localStorage prototype working when the database API is unavailable.
    }
}

function renderAdminShell() {
    const roleSelects = document.querySelectorAll("[data-role-select]");
    const roles = getRoles();

    roleSelects.forEach(function (select) {
        select.innerHTML = '<option value="">Choose user type</option>';

        roles.forEach(function (role) {
            const option = document.createElement("option");

            option.value = role.id;
            option.textContent = role.name;
            select.appendChild(option);
        });
    });
}

function renderDashboard() {
    const dashboardStats = document.getElementById("dashboardStats");

    if (!dashboardStats) {
        return;
    }

    const stats = [
        { label: "Users", value: getAdminUsers().length },
        { label: "User Types", value: getRoles().length },
        { label: "Listings", value: getListings().length + getBuiltInProducts().length },
        { label: "Orders", value: getOrders().length },
        { label: "Open Reports", value: getReports().filter(function (report) { return report.status === "open"; }).length }
    ];

    dashboardStats.innerHTML = "";

    stats.forEach(function (stat) {
        const column = document.createElement("div");

        column.className = "col-md";
        column.innerHTML = `
            <div class="card shadow-sm admin-stat-card">
                <div class="card-body">
                    <p class="text-muted mb-1">${stat.label}</p>
                    <h2 class="mb-0">${stat.value}</h2>
                </div>
            </div>
        `;
        dashboardStats.appendChild(column);
    });
}

function setupRoleForm() {
    const form = document.getElementById("roleForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const roleId = form.roleId.value || createId(form.roleName.value);
        const permissions = Array.from(form.querySelectorAll("input[name='permissions']:checked")).map(function (input) {
            return input.value;
        });
        const roles = getRoles();
        const role = {
            id: roleId,
            name: form.roleName.value.trim(),
            description: form.roleDescription.value.trim(),
            permissions: permissions
        };
        const existingIndex = roles.findIndex(function (item) {
            return item.id === roleId;
        });

        if (existingIndex >= 0) {
            roles[existingIndex] = role;
        } else {
            roles.push(role);
        }

        if (typeof adminApiRequest === "function") {
            try {
                await adminApiRequest("save-role", role);
            } catch (error) {
                // Continue with local prototype data if the API is unavailable.
            }
        }

        localStorage.setItem("hustleHubRoles", JSON.stringify(roles));
        form.reset();
        form.roleId.value = "";
        form.classList.remove("was-validated");
        renderRolesTable();
        renderAdminShell();
    });
}

function setupUserForm() {
    const form = document.getElementById("adminUserForm");

    if (!form) {
        return;
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        form.email.setCustomValidity("");
        form.phone.setCustomValidity("");

        if (!isValidAdminEmail(form.email.value.trim())) {
            form.email.setCustomValidity("Enter a valid email.");
        }

        if (!/^[0-9]{10}$/.test(form.phone.value.trim())) {
            form.phone.setCustomValidity("Enter 10 digits.");
        }

        if (!form.checkValidity()) {
            form.classList.add("was-validated");
            return;
        }

        const users = getAdminUsers();
        const userId = Number(form.userId.value) || Date.now();
        const email = form.email.value.trim().toLowerCase();
        const duplicate = users.some(function (user) {
            return user.email === email && Number(user.id) !== userId;
        });

        if (duplicate) {
            form.email.setCustomValidity("This email is already used.");
            form.classList.add("was-validated");
            return;
        }

        const user = {
            id: userId,
            fullName: form.fullName.value.trim(),
            email: email,
            phone: form.phone.value.trim(),
            location: form.location.value.trim(),
            roleId: form.roleId.value,
            password: form.password.value || "password123",
            memberSince: form.memberSince.value || new Date().toLocaleDateString("en-ZA", {
                month: "long",
                year: "numeric"
            })
        };

        if (typeof adminApiRequest === "function") {
            try {
                await adminApiRequest("save-user", user);
            } catch (error) {
                // Continue with local prototype data if the API is unavailable.
            }
        }

        const index = users.findIndex(function (item) {
            return Number(item.id) === userId;
        });

        if (index >= 0) {
            users[index] = user;
        } else {
            users.push(user);
        }

        localStorage.setItem("hustleHubUsers", JSON.stringify(users));
        form.reset();
        form.userId.value = "";
        form.classList.remove("was-validated");
        renderUsersTable();
    });
}

function renderRolesTable() {
    const tableBody = document.getElementById("rolesTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    getRoles().forEach(function (role) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${role.name}</td>
            <td>${role.description}</td>
            <td>${role.permissions.join(", ") || "None"}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-dark me-2" data-edit-role="${role.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" data-delete-role="${role.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll("[data-edit-role]").forEach(function (button) {
        button.addEventListener("click", function () {
            editRole(button.dataset.editRole);
        });
    });

    tableBody.querySelectorAll("[data-delete-role]").forEach(function (button) {
        button.addEventListener("click", function () {
            deleteRole(button.dataset.deleteRole);
        });
    });
}

function renderUsersTable() {
    const tableBody = document.getElementById("usersTableBody");

    if (!tableBody) {
        return;
    }

    const roles = getRoles();
    tableBody.innerHTML = "";

    getAdminUsers().forEach(function (user) {
        const role = roles.find(function (item) {
            return item.id === user.roleId;
        });
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>${user.phone || "Not set"}</td>
            <td>
                ${role ? role.name : "Customer & Seller"}
                ${user.accountStatus === "suspended" ? '<span class="badge text-bg-warning ms-1">Suspended</span>' : ""}
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-dark me-2" data-edit-user="${user.id}">Edit</button>
                <button class="btn btn-sm btn-outline-danger" data-delete-user="${user.id}">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll("[data-edit-user]").forEach(function (button) {
        button.addEventListener("click", function () {
            editUser(Number(button.dataset.editUser));
        });
    });

    tableBody.querySelectorAll("[data-delete-user]").forEach(function (button) {
        button.addEventListener("click", function () {
            deleteUser(Number(button.dataset.deleteUser));
        });
    });
}

function renderReportsTable() {
    const tableBody = document.getElementById("reportsTableBody");

    if (!tableBody) {
        return;
    }

    const reports = getReports();
    tableBody.innerHTML = "";

    if (reports.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No reports yet.</td></tr>';
        return;
    }

    reports.forEach(function (report) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <strong>${escapeAdminHtml(report.productName || "Unknown product")}</strong><br>
                <span class="small text-muted">${escapeAdminHtml(formatAdminDate(report.createdAt))}</span>
            </td>
            <td>${escapeAdminHtml(report.sellerEmail || "Unknown")}</td>
            <td>${escapeAdminHtml(report.reporterEmail || "Unknown")}</td>
            <td>${escapeAdminHtml(report.reason || "")}</td>
            <td><span class="badge ${report.status === "open" ? "text-bg-danger" : "text-bg-secondary"}">${escapeAdminHtml(report.status || "open")}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger me-2" data-remove-reported-product="${report.id}">Remove Product</button>
                <button class="btn btn-sm btn-outline-warning me-2" data-suspend-reported-user="${report.id}">Suspend User</button>
                <button class="btn btn-sm btn-danger me-2" data-ban-reported-user="${report.id}">Ban & Delete</button>
                <button class="btn btn-sm btn-outline-secondary" data-resolve-report="${report.id}">Resolve</button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll("[data-remove-reported-product]").forEach(function (button) {
        button.addEventListener("click", function () {
            removeReportedProduct(Number(button.dataset.removeReportedProduct));
        });
    });

    tableBody.querySelectorAll("[data-suspend-reported-user]").forEach(function (button) {
        button.addEventListener("click", function () {
            suspendReportedUser(Number(button.dataset.suspendReportedUser));
        });
    });

    tableBody.querySelectorAll("[data-ban-reported-user]").forEach(function (button) {
        button.addEventListener("click", function () {
            banReportedUser(Number(button.dataset.banReportedUser));
        });
    });

    tableBody.querySelectorAll("[data-resolve-report]").forEach(function (button) {
        button.addEventListener("click", function () {
            updateReportStatus(Number(button.dataset.resolveReport), "resolved");
        });
    });
}

function renderAdminProducts() {
    const tableBody = document.getElementById("productsTableBody");

    if (!tableBody) {
        return;
    }

    tableBody.innerHTML = "";

    getBuiltInProducts().concat(getListings()).forEach(function (product) {
        const sold = product.sold || getSoldProductIds().includes(product.id);
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${product.name}</td>
            <td>R${product.price}</td>
            <td>${product.category || "Marketplace"}</td>
            <td>${product.sellerEmail || "Demo product"}</td>
            <td>${sold ? '<span class="badge text-bg-secondary">Sold</span>' : '<span class="badge text-bg-success">Available</span>'}</td>
            <td class="text-end">
                ${product.id ? '<button class="btn btn-sm btn-outline-secondary me-2" data-toggle-sold-product="' + product.id + '">' + (sold ? "Mark Available" : "Mark Sold") + '</button>' : ""}
                ${product.sellerEmail ? '<button class="btn btn-sm btn-outline-danger" data-delete-product="' + product.id + '">Delete</button>' : '<span class="text-muted">Demo</span>'}
            </td>
        `;
        tableBody.appendChild(row);
    });

    tableBody.querySelectorAll("[data-toggle-sold-product]").forEach(function (button) {
        button.addEventListener("click", function () {
            toggleProductSold(button.dataset.toggleSoldProduct);
        });
    });

    tableBody.querySelectorAll("[data-delete-product]").forEach(function (button) {
        button.addEventListener("click", function () {
            deleteProduct(Number(button.dataset.deleteProduct));
        });
    });
}

async function removeReportedProduct(reportId) {
    const report = getReportById(reportId);

    if (!report || !window.confirm("Remove this reported product?")) {
        return;
    }

    const listings = getListings().filter(function (listing) {
        return String(listing.id) !== String(report.productId) && listing.name !== report.productName;
    });
    const soldProducts = getSoldProductIds();

    if (String(report.productId).startsWith("product") && !soldProducts.includes(report.productId)) {
        localStorage.setItem("hustleHubSoldProducts", JSON.stringify(soldProducts.concat(report.productId)));
    }

    if (typeof adminApiRequest === "function" && !String(report.productId).startsWith("product")) {
        try {
            await adminApiRequest("delete-listing", { id: report.productId });
        } catch (error) {
            // Continue locally when the API is unavailable.
        }
    }

    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    notifyUser(report.sellerEmail, "Your listing '" + report.productName + "' was removed after an admin report review.", "admin/reports.html");
    updateReportStatus(reportId, "product removed");
    renderAdminProducts();
}

async function suspendReportedUser(reportId) {
    const report = getReportById(reportId);

    if (!report || !report.sellerEmail || !window.confirm("Suspend this seller and notify them?")) {
        return;
    }

    const users = getAdminUsers().map(function (user) {
        if (user.email === report.sellerEmail) {
            return {
                ...user,
                accountStatus: "suspended"
            };
        }

        return user;
    });

    if (typeof adminApiRequest === "function") {
        try {
            await adminApiRequest("suspend-user", { email: report.sellerEmail });
        } catch (error) {
            // Continue locally when the API is unavailable.
        }
    }

    localStorage.setItem("hustleHubUsers", JSON.stringify(users));
    notifyUser(report.sellerEmail, "Your account has been suspended after an admin report review.", "notifications.html");
    updateReportStatus(reportId, "user suspended");
    renderUsersTable();
}

async function banReportedUser(reportId) {
    const report = getReportById(reportId);

    if (!report || !report.sellerEmail || !window.confirm("Ban this seller, delete their page/listings,and block future registration?")) {
        return;
    }

    const bannedEmails = getBannedEmails();
    const users = getAdminUsers().filter(function (user) {
        return user.email !== report.sellerEmail;
    });
    const listings = getListings().filter(function (listing) {
        return listing.sellerEmail !== report.sellerEmail;
    });
    const reports = getReports().map(function (item) {
        if (item.sellerEmail === report.sellerEmail) {
            return {
                ...item,
                status: "seller banned"
            };
        }

        return item;
    });

    if (typeof adminApiRequest === "function") {
        try {
            await adminApiRequest("ban-user", {
                email: report.sellerEmail,
                reason: report.reason || "Banned after admin report review."
            });
        } catch (error) {
            // Continue locally when the API is unavailable.
        }
    }

    localStorage.setItem("hustleHubUsers", JSON.stringify(users));
    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    localStorage.setItem("hustleHubReports", JSON.stringify(reports));
    saveBannedEmails(bannedEmails.concat(report.sellerEmail));
    renderReportsTable();
    renderUsersTable();
    renderAdminProducts();
}

async function updateReportStatus(reportId, status) {
    const reports = getReports().map(function (report) {
        if (Number(report.id) === reportId) {
            return {
                ...report,
                status: status
            };
        }

        return report;
    });

    if (typeof adminApiRequest === "function") {
        try {
            await adminApiRequest("resolve-report", {
                id: reportId,
                status: status
            });
        } catch (error) {
            // Continue locally when the API is unavailable.
        }
    }

    localStorage.setItem("hustleHubReports", JSON.stringify(reports));
    renderReportsTable();
}

function getReportById(reportId) {
    return getReports().find(function (report) {
        return Number(report.id) === reportId;
    });
}

function notifyUser(email, message, link) {
    if (!email) {
        return;
    }

    const notifications = JSON.parse(localStorage.getItem("hustleHubNotifications")) || [];

    notifications.unshift({
        id: Date.now(),
        userEmail: email,
        actorEmail: "admin@hustlehub.co.za",
        actorName: "HustleHub Admin",
        message: message,
        detail: "Open this notice for more information.",
        link: link || "notifications.html",
        read: false,
        createdAt: new Date().toISOString()
    });
    localStorage.setItem("hustleHubNotifications", JSON.stringify(notifications));
}

function toggleProductSold(productId) {
    const soldIds = getSoldProductIds();
    const isBuiltIn = getBuiltInProducts().some(function (product) {
        return product.id === productId;
    });

    if (isBuiltIn) {
        const updatedIds = soldIds.includes(productId)
            ? soldIds.filter(function (id) { return id !== productId; })
            : soldIds.concat(productId);

        localStorage.setItem("hustleHubSoldProducts", JSON.stringify(updatedIds));
    } else {
        const listings = getListings().map(function (listing) {
            if (String(listing.id) === String(productId)) {
                return {
                    ...listing,
                    sold: !listing.sold,
                    soldAt: listing.sold ? "" : new Date().toISOString()
                };
            }

            return listing;
        });

        localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    }

    renderAdminProducts();
}

function editRole(roleId) {
    const form = document.getElementById("roleForm");
    const role = getRoles().find(function (item) {
        return item.id === roleId;
    });

    if (!form || !role) {
        return;
    }

    form.roleId.value = role.id;
    form.roleName.value = role.name;
    form.roleDescription.value = role.description;
    form.querySelectorAll("input[name='permissions']").forEach(function (input) {
        input.checked = role.permissions.includes(input.value);
    });
}

async function deleteRole(roleId) {
    if (["admin", "seller", "customer"].includes(roleId)) {
        alert("Core user types cannot be deleted in this prototype.");
        return;
    }

    if (!window.confirm("Delete this user type?")) {
        return;
    }

    const roles = getRoles().filter(function (role) {
        return role.id !== roleId;
    });

    if (typeof adminApiRequest === "function") {
        try {
            await adminApiRequest("delete-role", {
                id: roleId
            });
        } catch (error) {
            // Continue with local prototype data if the API is unavailable.
        }
    }

    localStorage.setItem("hustleHubRoles", JSON.stringify(roles));
    renderRolesTable();
    renderAdminShell();
}

function editUser(userId) {
    const form = document.getElementById("adminUserForm");
    const user = getAdminUsers().find(function (item) {
        return Number(item.id) === userId;
    });

    if (!form || !user) {
        return;
    }

    form.userId.value = user.id;
    form.fullName.value = user.fullName || "";
    form.email.value = user.email || "";
    form.phone.value = user.phone || "";
    form.location.value = user.location || "";
    form.roleId.value = user.roleId === "admin" ? "admin" : "seller";
    form.memberSince.value = user.memberSince || "";
    form.password.value = "";
}

async function deleteUser(userId) {
    const users = getAdminUsers();
    const user = users.find(function (item) {
        return Number(item.id) === userId;
    });

    if (!user || !window.confirm("Delete this user?")) {
        return;
    }

    const updatedUsers = users.filter(function (item) {
        return Number(item.id) !== userId;
    });
    const listings = getListings().filter(function (listing) {
        return listing.sellerEmail !== user.email;
    });

    if (typeof adminApiRequest === "function") {
        try {
            await adminApiRequest("delete-user", {
                id: userId
            });
        } catch (error) {
            // Continue with local prototype data if the API is unavailable.
        }
    }

    localStorage.setItem("hustleHubUsers", JSON.stringify(updatedUsers));
    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    renderUsersTable();
}

async function deleteProduct(productId) {
    if (!window.confirm("Delete this listing?")) {
        return;
    }

    if (typeof adminApiRequest === "function") {
        try {
            await adminApiRequest("delete-listing", {
                id: productId
            });
        } catch (error) {
            // Continue with local prototype data if the API is unavailable.
        }
    }

    const listings = getListings().filter(function (listing) {
        return Number(listing.id) !== productId;
    });

    localStorage.setItem("hustleHubListings", JSON.stringify(listings));
    renderAdminProducts();
}

function getRoles() {
    return JSON.parse(localStorage.getItem("hustleHubRoles")) || DEFAULT_ROLES;
}

function getAdminUsers() {
    return JSON.parse(localStorage.getItem("hustleHubUsers")) || [];
}

function getListings() {
    return JSON.parse(localStorage.getItem("hustleHubListings")) || [];
}

function getOrders() {
    return JSON.parse(localStorage.getItem("hustleHubOrders")) || [];
}

function getReports() {
    return JSON.parse(localStorage.getItem("hustleHubReports")) || [];
}

function getBannedEmails() {
    return JSON.parse(localStorage.getItem("hustleHubBannedEmails")) || [];
}

function saveBannedEmails(emails) {
    localStorage.setItem("hustleHubBannedEmails", JSON.stringify(Array.from(new Set(emails))));
}

function getBuiltInProducts() {
    return [
        { id: "product1", name: "Adidas Sneakers", price: 700, category: "Fashion" },
        { id: "product2", name: "Leather Jacket", price: 2500, category: "Fashion" },
        { id: "product3", name: "Backpack", price: 300, category: "Fashion" },
        { id: "product4", name: "Apple MacBook Pro", price: 6500, category: "Tech" },
        { id: "product5", name: "Sony Headphones", price: 3000, category: "Tech" },
        { id: "product6", name: "Apple Watch", price: 5000, category: "Tech" },
        { id: "product7", name: "PS5 Game Console", price: 12000, category: "Tech" },
        { id: "product8", name: "Corduroy Pants", price: 400, category: "Fashion" }
    ];
}

function getSoldProductIds() {
    return JSON.parse(localStorage.getItem("hustleHubSoldProducts")) || [];
}

function createId(value) {
    return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now();
}

function isValidAdminEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function escapeAdminHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}

function formatAdminDate(value) {
    if (!value) {
        return "No date";
    }

    return new Date(value).toLocaleString("en-ZA", {
        dateStyle: "medium",
        timeStyle: "short"
    });
}
