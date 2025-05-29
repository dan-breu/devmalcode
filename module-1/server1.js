"use strict";

import express from "express";

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("Welcome to Bank");
});

app.get("/user", (req, res) => {
  res.send("User Profile");
});

app.get("/admin", (req, res) => {
  res.send("admin Profile");
});

app.listen(port, () => {
  console.log(`Server is rolling on http://localhost:${port}`);
});
