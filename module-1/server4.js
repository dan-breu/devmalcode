import express from 'express';
import session from 'express-session';

const app = express();
const port = 3000;

// Middleware to manage sessions
app.use(session({
    secret: 'dontrevealthis',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,   // Set to true if using HTTPS in production
        httpOnly: true,
        sameSite: 'Strict',
    }
}));

// Middleware to check if the user is an admin
function isAdmin(req, res, next) {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    }
    return res.status(403).send('Admins only 🚫');
}

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to Bank");
});

// User Profile Route
app.get("/user", (req, res) => {
    if (req.session.user) {
        res.send(`User Profile: ${req.session.user.username} (${req.session.user.role})`);
    } else {
        res.send("User Profile: Not logged in");
    }
});

// Admin Profile Route - Protected
app.get("/admin", isAdmin, (req, res) => {
    res.send("Admin Profile");
});

// Login Route
app.get("/login", (req, res) => {
    const name = req.query.name;
    console.log(name + " = req.query.name");

    // Assign role using ternary operator
    const user = {
        username: name,
        role: name.toLowerCase() === 'admin' ? 'admin' : 'user'
    };

    // Save the user object in the session
    req.session.user = user;

    // Manually set the cookie name for admin or user
    const cookieName = user.role === 'admin' ? 'admin.sid' : 'user.sid';
    res.cookie(cookieName, req.sessionID, { httpOnly: true, secure: false, sameSite: 'Strict' });

    res.send(`Logged in as ${user.username} (${user.role})`);
});

// Logout Route
app.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.send("Error logging out");
        }
        res.send("Logged out");
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is rolling on http://localhost:${port}`);
});
