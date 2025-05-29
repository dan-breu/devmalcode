"use strict";
import express from 'express';
import session from 'express-session';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Secure session config
app.use(session({
    secret: 'superSecureSecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to true in production with HTTPS
        maxAge: 1000 * 60 * 15 // 15 minutes
    }
}));

// 👮‍♂️ User DB with pre-hashed passwords
const users = {
    admin: {
        passwordHash: bcrypt.hashSync('admin123', 10),
        isAdmin: true
    },
    dan: {
        passwordHash: bcrypt.hashSync('qwe123', 10),
        isAdmin: false
    }
};

// 🏠 Home
app.get("/", (req, res) => {
    res.send("🏦 Welcome to SecureBank! Use POST /login with name & password.");
});

// 🔐 Secure login
app.post("/login", async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send("Please provide both name and password.");
    }

    const user = users[name.toLowerCase()];
    if (!user) return res.status(401).send("User not found.");

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    console.log(password, user.passwordHash)
    if (!passwordMatch) return res.status(403).send("Incorrect password.");

    // ✅ Set only necessary session info
    req.session.username = name;
    req.session.isAdmin = user.isAdmin;

    res.send(`✅ Logged in as ${name}`);
});

// 🔓 Logout
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send("Error logging out.");
        res.send("👋 Logged out.");
    });
});

// 👑 Admin area
app.get("/admin", (req, res) => {
    if (req.session.isAdmin) {
        return res.send("👑 Welcome to the Admin Panel.");
    }
    return res.send("❌ Access denied.");
});

// 👤 User profile
app.get("/user", (req, res) => {
    if (req.session.username) {
        res.send(`👤 Logged in as ${req.session.username}`);
    } else {
        res.send("❌ Not logged in.");
    }
});

// 🕵️‍♂️ Secure credentials route
app.get("/credentials", (req, res) => {
    if (req.session.username) {
        res.send(`🔐 You are logged in as ${req.session.username}. No passwords exposed!`);
    } else {
        res.send("❌ Not logged in.");
    }
});

// Start
app.listen(port, () => {
    console.log(`🔐 Secure server running on http://localhost:${port}`);
});
