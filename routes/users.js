const path = require("path");
const UserController = require(path.join(__dirname, "..", "controllers", "user-controller"));
const express = require("express");
const users = express.Router();

users.get("/", UserController.list);
users.post("/", UserController.create);
users.post("/login", UserController.login);
users.get("/urls", UserController.listUrls);

module.exports = users;