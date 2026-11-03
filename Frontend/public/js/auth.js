/* =========================================
   QUICKKART AUTHENTICATION
========================================= */


/* =========================================
   GET USERS
========================================= */

function getUsers() {

    return JSON.parse(
        localStorage.getItem("quickkart_users")
    ) || [];

}


/* =========================================
   SAVE USERS
========================================= */

function saveUsers(users) {

    localStorage.setItem(
        "quickkart_users",
        JSON.stringify(users)
    );

}


/* =========================================
   SHOW MESSAGE
========================================= */

function showAuthMessage(message, type = "success") {

    const oldMessage =
        document.querySelector(".auth-message");

    if (oldMessage) {
        oldMessage.remove();
    }


    const messageBox =
        document.createElement("div");

    messageBox.className =
        `auth-message ${type}`;

    messageBox.textContent = message;


    const form =
        document.querySelector("form");

    if (form) {
        form.before(messageBox);
    }


    setTimeout(() => {

        messageBox.remove();

    }, 3000);

}


/* =========================================
   PASSWORD TOGGLE
========================================= */

function setupPasswordToggle(buttonId, inputId) {

    const button =
        document.getElementById(buttonId);

    const input =
        document.getElementById(inputId);


    if (!button || !input) {
        return;
    }


    button.addEventListener("click", () => {

        if (input.type === "password") {

            input.type = "text";

            button.innerHTML =
                '<i class="fa-regular fa-eye-slash"></i>';

        } else {

            input.type = "password";

            button.innerHTML =
                '<i class="fa-regular fa-eye"></i>';

        }

    });

}


/* =========================================
   REGISTER
========================================= */

function setupRegister() {

    const form =
        document.getElementById("registerForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const name =
            document.getElementById("registerName")
                .value.trim();

        const email =
            document.getElementById("registerEmail")
                .value.trim()
                .toLowerCase();

        const phone =
            document.getElementById("registerPhone")
                .value.trim();

        const password =
            document.getElementById("registerPassword")
                .value;

        const confirmPassword =
            document.getElementById("confirmPassword")
                .value;


        /* -----------------------------
           VALIDATION
        ----------------------------- */

        if (name.length < 2) {

            showAuthMessage(
                "Please enter a valid name.",
                "error"
            );

            return;
        }


        if (!/^[0-9]{10}$/.test(phone)) {

            showAuthMessage(
                "Please enter a valid 10-digit phone number.",
                "error"
            );

            return;
        }


        if (password.length < 6) {

            showAuthMessage(
                "Password must contain at least 6 characters.",
                "error"
            );

            return;
        }


        if (password !== confirmPassword) {

            showAuthMessage(
                "Passwords do not match.",
                "error"
            );

            return;
        }


        /* -----------------------------
           CHECK EXISTING USER
        ----------------------------- */

        const users = getUsers();


        const existingUser =
            users.find(user =>
                user.email === email
            );


        if (existingUser) {

            showAuthMessage(
                "An account with this email already exists.",
                "error"
            );

            return;
        }


        /* -----------------------------
           CREATE USER
        ----------------------------- */

        const newUser = {

            id:
                "USER-" +
                Date.now(),

            name: name,

            email: email,

            phone: phone,

            password: password,

            role: "CUSTOMER",

            createdAt:
                new Date().toISOString()

        };


        users.push(newUser);

        saveUsers(users);


        /* -----------------------------
           SUCCESS
        ----------------------------- */

        showAuthMessage(
            "Account created successfully!",
            "success"
        );


        form.reset();


        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1200);

    });

}


/* =========================================
   LOGIN
========================================= */

function setupLogin() {

    const form =
        document.getElementById("loginForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("loginEmail")
                .value.trim()
                .toLowerCase();

        const password =
            document.getElementById("loginPassword")
                .value;


        const users = getUsers();


        const user =
            users.find(currentUser =>
                currentUser.email === email &&
                currentUser.password === password
            );


        if (!user) {

            showAuthMessage(
                "Invalid email or password.",
                "error"
            );

            return;
        }


        /* -----------------------------
           SAVE LOGGED-IN USER
        ----------------------------- */

        const loggedInUser = {

            id: user.id,

            name: user.name,

            email: user.email,

            phone: user.phone,

            role: user.role

        };


        localStorage.setItem(
            "quickkart_user",
            JSON.stringify(loggedInUser)
        );


        showAuthMessage(
            "Login successful! Welcome back.",
            "success"
        );


        setTimeout(() => {

            window.location.href =
                "../index.html";

        }, 1000);

    });

}


/* =========================================
   FORGOT PASSWORD
========================================= */

function setupForgotPassword() {

    const form =
        document.getElementById(
            "forgotPasswordForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const email =
            document.getElementById("forgotEmail")
                .value.trim()
                .toLowerCase();


        const users = getUsers();


        const user =
            users.find(currentUser =>
                currentUser.email === email
            );


        if (!user) {

            showAuthMessage(
                "No account found with this email.",
                "error"
            );

            return;
        }


        showAuthMessage(
            "Password reset link sent successfully!",
            "success"
        );


        form.reset();

    });

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupRegister();

        setupLogin();

        setupForgotPassword();


        setupPasswordToggle(
            "toggleLoginPassword",
            "loginPassword"
        );


        setupPasswordToggle(
            "toggleRegisterPassword",
            "registerPassword"
        );


        setupPasswordToggle(
            "toggleConfirmPassword",
            "confirmPassword"
        );

    }
);