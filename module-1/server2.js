"use strict";
import express from "express";
import session from "express-session";

let app = express();
const port = 3000;

// Middleware to manage sessions

app.use(
  session({
    secret: "dontrevealthis",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to Bank");
});

app.get("/user", (req, res) => {
  if (req.session.username) {
    res.send(`User Profile: ${req.session.username}`);
  } else {
    res.send("User Profile: Not logged in");
  }
});
app.get("/admin", (req, res) => {
  if (req.session.username) {
    res.send(`Admin Profile: ${req.session.username}`);
  } else {
    res.send("Admin Profile: Not logged in");
  }
});

app.get("/login", (req, res) => {
  const name = req.query.name;
  console.log(name + " = req.query.name");
  req.session.username = name;
  res.send(`Logged in as ${name}`);
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send("Error logging out");
    }
    res.send("Logged out");
  });
});

app.listen(port, () => {
  console.log(`Server is rolling on http://localhost:${port}`);
});
