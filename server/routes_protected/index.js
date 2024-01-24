var express = require("express");
var router = express.Router();
const Controller = require("../controllers/mainController")

router.get("/logged", Controller.logged);

module.exports = router