"use strict";
import express from 'express';
import session from 'express-session';

const app = express();
const port = 3000;

// Middleware for sessions
app.use(session({
    secret: 'dontrevealthis',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// 🚨 Insecure in-memory "database"
const users = {
    admin: { password: 'admin123', isAdmin: true },
    dan: { password: 'qwe123', isAdmin: false }
};

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to ChillBank! <br /> Login via /login?name=[...]&password=[...]");
});

// Login route
app.get("/login", (req, res) => {
    const { name, password } = req.query;
    console.log(JSON.stringify(req.query));

    if (!name || !password) {
        return res.send("Please provide both name and password.");
    }

    const user = users[name.toLowerCase()];
    console.log(user)
    if (!user) return res.send("User not found.");

    // 🔓 Plaintext password comparison
    if (user.password === password) {
        req.session.username = name;
        req.session.password = password; // Insecure: storing password in session
        req.session.isAdmin = user.isAdmin;

        return res.send(`✅ Logged in as ${name}`);
    } else {
        return res.send("Incorrect password.");
    }
});

// Logout route
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("Error logging out.");
        res.send("Logged out.");
    });
});

// Admin panel
app.get("/admin", (req, res) => {
    if (req.session.isAdmin) {
        return res.send("Welcome to the Admin Panel.");
    }
    return res.send("Access denied.");
});

// Show user profile
app.get("/user", (req, res) => {
    if (req.session.username) {
        res.send(`Logged in as ${req.session.username}`);
    } else {
        res.send("Not logged in.");
    }
});

// 🚨 View stored credentials (vulnerable)
app.get("/credentials", (req, res) => {
    if (req.session.username) {
        res.send(`Stored Credentials:<br>Username: ${req.session.username}<br>Password: ${req.session.password}`);
    } else {
        res.send("Not logged in.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is live at http://localhost:${port}`);
});
