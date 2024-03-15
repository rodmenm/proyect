var express = require("express");
var router = express.Router();
const Controller = require("../controllers/mainController");

router.get("/", Controller.login);

router.get("/logout", Controller.logout);

module.exports = router;
