const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");

// Routes publiques
router.get(
    "/", 
    productController.getProducts);

router.get(
    "/:id", 
    productController.getProductById);

// Routes admin
router.post(
    "/", 
    isAuth, 
    isAdmin, 
    productController.createProduct);

router.put(
    "/:id", 
    isAuth, 
    isAdmin, 
    productController.updateProduct);
    
router.delete(
    "/:id", 
    isAuth, 
    isAdmin, 
    productController.deleteProduct);

module.exports = router;