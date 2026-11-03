
/* =====================================================
   QUICKKART PROFILE PAGE
   File: js/profile.js
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // -------------------------------------------------
    // DOM ELEMENTS
    // -------------------------------------------------

    const elements = {
        profileName: document.getElementById("profileName"),
        profileEmail: document.getElementById("profileEmail"),
        profileAvatar: document.getElementById("profileAvatar"),

        profileFullName: document.getElementById("profileFullName"),
        profileEmailAddress: document.getElementById("profileEmailAddress"),
        profilePhone: document.getElementById("profilePhone"),

        profileAddressName: document.getElementById("profileAddressName"),
        profileAddress: document.getElementById("profileAddress"),
        profileAddressPhone: document.getElementById("profileAddressPhone"),

        editButton: document.getElementById("editProfileButton"),
        editForm: document.getElementById("profileEditForm"),
        nameInput: document.getElementById("profileNameInput"),
        emailInput: document.getElementById("profileEmailInput"),
        phoneInput: document.getElementById("profilePhoneInput"),
        cancelButton: document.getElementById("cancelProfileEdit"),
        saveButton: document.getElementById("saveProfileButton"),
        feedback: document.getElementById("profileFeedback"),

        logoutButton: document.getElementById("logoutButton"),
        cartCount: document.getElementById("cartCount")
    };

    // -------------------------------------------------
    // STORAGE HELPERS
    // -------------------------------------------------

    function readStorage(key, fallback = null) {
        try {
            const value = localStorage.getItem(key);
            return value === null ? fallback : JSON.parse(value);
        } catch (error) {
            console.warn(`QuickKart: Unable to read "${key}".`, error);
            return fallback;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`QuickKart: Unable to save "${key}".`, error);
            return false;
        }
    }

    function readRawStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    // -------------------------------------------------
    // USER DATA
    // -------------------------------------------------

    /*
      This page supports common user object fields.
      The actual storage key should match auth.js.
      See the integration note below if your key differs.
    */

    const USER_STORAGE_KEYS = [
        "quickkart_user",
        "quickkart_currentUser",
        "quickkartUser",
        "currentUser",
        "loggedInUser",
        "user"
    ];

    const USER_LIST_KEYS = [
        "quickkart_users",
        "users"
    ];

    let userStorageKey = null;
    let userListKey = null;
    let userRecord = null;
    let userListIndex = -1;
    let originalFormValues = null;

    function isObject(value) {
        return value !== null &&
            typeof value === "object" &&
            !Array.isArray(value);
    }

    function findUserRecord() {
        for (const key of USER_STORAGE_KEYS) {
            const value = readStorage(key);

            if (isObject(value)) {
                userStorageKey = key;
                return value;
            }
        }

        for (const key of USER_LIST_KEYS) {
            const users = readStorage(key, []);

            if (!Array.isArray(users) || users.length === 0) {
                continue;
            }

            // Prefer a user marked as logged in/current.
            let index = users.findIndex(user =>
                isObject(user) &&
                (user.isLoggedIn === true || user.isCurrentUser === true)
            );

            // Otherwise match a current email if available.
            if (index === -1) {
                const currentEmail =
                    readRawStorage("quickkart_loggedInEmail") ||
                    readRawStorage("currentUserEmail");

                if (currentEmail) {
                    index = users.findIndex(user =>
                        isObject(user) &&
                        String(user.email || "").toLowerCase() ===
                            currentEmail.toLowerCase()
                    );
                }
            }

            if (index !== -1) {
                userListKey = key;
                userListIndex = index;
                return users[index];
            }
        }

        return {};
    }

    function getField(user, keys, fallback = "") {
        for (const key of keys) {
            if (
                user[key] !== undefined &&
                user[key] !== null &&
                String(user[key]).trim() !== ""
            ) {
                return String(user[key]).trim();
            }
        }

        return fallback;
    }

    function getUserName(user) {
        const fullName = getField(user, [
            "name",
            "fullName",
            "username",
            "userName",
            "displayName"
        ]);

        if (fullName) {
            return fullName;
        }

        const firstName = getField(user, ["firstName", "first_name"]);
        const lastName = getField(user, ["lastName", "last_name"]);

        return `${firstName} ${lastName}`.trim();
    }

    function getUserEmail(user) {
        return getField(user, ["email", "emailAddress", "mail"]);
    }

    function getUserPhone(user) {
        return getField(user, [
            "phone",
            "phoneNumber",
            "mobile",
            "mobileNumber",
            "contact"
        ]);
    }

    function getDisplayName(user) {
        return getUserName(user) || "QuickKart Customer";
    }

    // -------------------------------------------------
    // PROFILE DISPLAY
    // -------------------------------------------------

    function setText(element, value, fallback = "Not provided") {
        if (!element) return;
        element.textContent = value || fallback;
    }

    function updateAvatar(name) {
        if (!elements.profileAvatar) return;

        const firstLetter = (name || "").trim().charAt(0);

        elements.profileAvatar.textContent = "";

        if (firstLetter) {
            const initial = document.createElement("span");
            initial.textContent = firstLetter.toUpperCase();
            elements.profileAvatar.appendChild(initial);
        } else {
            const icon = document.createElement("i");
            icon.className = "fa-solid fa-user";
            elements.profileAvatar.appendChild(icon);
        }
    }

    function renderProfile() {
        userRecord = findUserRecord();

        const name = getUserName(userRecord);
        const email = getUserEmail(userRecord);
        const phone = getUserPhone(userRecord);

        setText(elements.profileName, getDisplayName(userRecord));
        setText(elements.profileEmail, email, "Manage your account details");

        setText(elements.profileFullName, name);
        setText(elements.profileEmailAddress, email);
        setText(elements.profilePhone, phone);

        updateAvatar(name);

        if (elements.nameInput) {
            elements.nameInput.value = name;
        }

        if (elements.emailInput) {
            elements.emailInput.value = email;
        }

        if (elements.phoneInput) {
            elements.phoneInput.value = phone;
        }

        originalFormValues = {
            name,
            email,
            phone
        };

        renderAddress();
    }

    // -------------------------------------------------
    // ADDRESS DISPLAY
    // -------------------------------------------------

    function findAddressObject(value) {
        if (Array.isArray(value)) {
            return value.find(isObject) || null;
        }

        return isObject(value) ? value : null;
    }

    function renderAddress() {
        let address = null;

        // Address data stored directly on the user.
        const embeddedAddress =
            userRecord.address ||
            userRecord.defaultAddress ||
            userRecord.deliveryAddress;

        address = findAddressObject(embeddedAddress);

        // Address data stored separately.
        if (!address) {
            const addressKeys = [
                "quickkart_addresses",
                "quickkart_address",
                "quickkart_savedAddress",
                "savedAddress",
                "deliveryAddress"
            ];

            for (const key of addressKeys) {
                const stored = readStorage(key);

                if (stored) {
                    address = findAddressObject(stored);

                    if (address) break;
                }
            }
        }

        if (!address) {
            setText(
                elements.profileAddressName,
                "",
                "Your saved delivery details"
            );

            setText(
                elements.profileAddress,
                "",
                "Add or update your address to make checkout easier."
            );

            setText(elements.profileAddressPhone, "", "");
            return;
        }

        const recipient = getField(address, [
            "fullName",
            "name",
            "recipient",
            "receiverName"
        ]);

        const phone = getField(address, [
            "phone",
            "phoneNumber",
            "mobile"
        ]);

        const addressParts = [
            getField(address, ["house", "houseNo", "flat", "flatNumber"]),
            getField(address, ["street", "addressLine1", "line1", "area"]),
            getField(address, ["landmark", "addressLine2", "line2"]),
            getField(address, ["city", "town"]),
            getField(address, ["state"]),
            getField(address, ["pincode", "pinCode", "postalCode", "zip"])
        ].filter(Boolean);

        const fullAddress = addressParts.length
            ? addressParts.join(", ")
            : getField(address, [
                "address",
                "fullAddress",
                "formattedAddress"
            ]);

        setText(
            elements.profileAddressName,
            recipient || getUserName(userRecord),
            "Delivery recipient"
        );

        setText(
            elements.profileAddress,
            fullAddress,
            "Address details are not available."
        );

        setText(elements.profileAddressPhone, phone, "");
    }

    // -------------------------------------------------
    // EDIT PROFILE
    // -------------------------------------------------

    function showFeedback(message, isError = false) {
        if (!elements.feedback) return;

        elements.feedback.textContent = message;
        elements.feedback.hidden = false;

        elements.feedback.style.color = isError ? "#b42318" : "#176b45";
        elements.feedback.style.background = isError ? "#fff0ef" : "#eaf8f0";
        elements.feedback.style.borderColor = isError ? "#f5c5c1" : "#ccebd9";
    }

    function clearFeedback() {
        if (!elements.feedback) return;

        elements.feedback.textContent = "";
        elements.feedback.hidden = true;
    }

    function openEditForm() {
        if (!elements.editForm) return;

        clearFeedback();

        if (elements.nameInput) {
            elements.nameInput.value = getUserName(userRecord);
        }

        if (elements.emailInput) {
            elements.emailInput.value = getUserEmail(userRecord);
        }

        if (elements.phoneInput) {
            elements.phoneInput.value = getUserPhone(userRecord);
        }

        elements.editForm.hidden = false;

        if (elements.editButton) {
            elements.editButton.setAttribute("aria-expanded", "true");
        }

        elements.editForm.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

        elements.nameInput?.focus();
    }

    function closeEditForm() {
        if (!elements.editForm) return;

        elements.editForm.hidden = true;

        if (elements.editButton) {
            elements.editButton.setAttribute("aria-expanded", "false");
        }

        clearFeedback();
    }

    function saveProfile(event) {
        event.preventDefault();

        const name = elements.nameInput?.value.trim() || "";
        const email = elements.emailInput?.value.trim() || "";
        const phone = elements.phoneInput?.value.trim() || "";

        if (!name) {
            showFeedback("Please enter your full name.", true);
            elements.nameInput?.focus();
            return;
        }

        if (!email) {
            showFeedback("Please enter your email address.", true);
            elements.emailInput?.focus();
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFeedback("Please enter a valid email address.", true);
            elements.emailInput?.focus();
            return;
        }

        if (phone && !/^[+\d\s()-]{7,20}$/.test(phone)) {
            showFeedback("Please enter a valid phone number.", true);
            elements.phoneInput?.focus();
            return;
        }

        if (!userStorageKey && !userListKey) {
            showFeedback(
                "Your user storage key has not been identified. Check the storage key used by auth.js before saving.",
                true
            );
            return;
        }

        // Preserve all existing fields, including IDs and other
        // account properties, while updating common profile fields.
        const updatedUser = { ...userRecord };

        updatedUser.name = name;
        updatedUser.email = email;
        updatedUser.phone = phone;

        if ("fullName" in updatedUser) {
            updatedUser.fullName = name;
        }

        if ("username" in updatedUser) {
            updatedUser.username = name;
        }

        if ("userName" in updatedUser) {
            updatedUser.userName = name;
        }

        if ("phoneNumber" in updatedUser) {
            updatedUser.phoneNumber = phone;
        }

        if ("mobile" in updatedUser) {
            updatedUser.mobile = phone;
        }

        if ("mobileNumber" in updatedUser) {
            updatedUser.mobileNumber = phone;
        }

        let saved = false;

        if (userStorageKey) {
            saved = writeStorage(userStorageKey, updatedUser);
        } else if (userListKey && userListIndex >= 0) {
            const users = readStorage(userListKey, []);

            if (Array.isArray(users) && users[userListIndex]) {
                users[userListIndex] = {
                    ...users[userListIndex],
                    ...updatedUser
                };

                saved = writeStorage(userListKey, users);
            }
        }

        if (!saved) {
            showFeedback(
                "Unable to save your changes. Please check browser storage and try again.",
                true
            );
            return;
        }

        userRecord = updatedUser;

        renderProfile();
        closeEditForm();
        showFeedback("Your profile has been updated successfully.");

        // Keep the feedback visible after the form closes.
        if (elements.feedback) {
            elements.feedback.hidden = false;
        }
    }

    // -------------------------------------------------
    // CART COUNT
    // -------------------------------------------------

    function updateCartCount() {
        if (!elements.cartCount) return;

        const cart = readStorage("quickkart_cart", []);
        let count = 0;

        if (Array.isArray(cart)) {
            count = cart.reduce((total, item) => {
                const quantity = Number(item?.quantity) || 1;
                return total + Math.max(0, quantity);
            }, 0);
        }

        elements.cartCount.textContent = String(count);
        elements.cartCount.setAttribute(
            "aria-label",
            `${count} items in cart`
        );
    }

    // -------------------------------------------------
    // LOGOUT
    // -------------------------------------------------

    function logout() {
        const confirmed = window.confirm(
            "Are you sure you want to log out of QuickKart?"
        );

        if (!confirmed) return;

        /*
          Only remove session markers that explicitly indicate
          the active login. Do not erase saved carts or orders.
          Match these keys to auth.js in your project.
        */

        const sessionKeys = [
            "quickkart_loggedIn",
            "quickkart_isLoggedIn",
            "quickkart_currentUser",
            "currentUser",
            "loggedInUser"
        ];

        try {
            sessionKeys.forEach(key => {
                localStorage.removeItem(key);
            });

            // Clear session-only authentication markers if present.
            sessionStorage.removeItem("quickkart_loggedIn");
            sessionStorage.removeItem("quickkart_currentUser");
            sessionStorage.removeItem("isLoggedIn");
        } catch (error) {
            console.error("QuickKart: Logout cleanup failed.", error);
        }

        window.location.href = "login.html";
    }

    // -------------------------------------------------
    // EVENT LISTENERS
    // -------------------------------------------------

    elements.editButton?.addEventListener("click", openEditForm);

    elements.cancelButton?.addEventListener("click", () => {
        renderProfile();
        closeEditForm();
    });

    elements.editForm?.addEventListener("submit", saveProfile);

    elements.logoutButton?.addEventListener("click", logout);

    // Refresh displayed information if another tab changes storage.
    window.addEventListener("storage", event => {
        if (
            event.key === null ||
            USER_STORAGE_KEYS.includes(event.key) ||
            USER_LIST_KEYS.includes(event.key) ||
            event.key.startsWith("quickkart_address")
        ) {
            renderProfile();
        }

        if (event.key === null || event.key === "quickkart_cart") {
            updateCartCount();
        }
    });

    // -------------------------------------------------
    // INITIALIZE
    // -------------------------------------------------

    renderProfile();
    updateCartCount();

    console.log("QuickKart profile initialized.");
});
