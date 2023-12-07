var express = require("express");
var router = express.Router();
const Controller = require("../controllers/mainController")

router.get("/", Controller.login);

module.exports = router