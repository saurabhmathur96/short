const path = require("path");
const UrlController = require(path.join(__dirname, "..", "controllers", "url-controller"));
const express = require("express");
const urls = express.Router();

urls.post("/", UrlController.create);
urls.get("/:id", UrlController.findOne);

module.exports = urls;