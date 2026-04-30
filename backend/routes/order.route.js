const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

router.post("/", isAuth, orderController.createOrder);
router.get("/my", isAuth, orderController.getMyOrders);
router.get("/", isAuth, isAdmin, orderController.getAllOrders);

module.exports = router;
