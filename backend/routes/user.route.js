const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");
const isAuth = require("../middlewares/isAuth");
const isAdmin = require("../middlewares/isAdmin");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const {
  updateProfileValidation,
  changePasswordValidation,
  addressValidation,
  wishlistValidation,
  validation,
} = require("../middlewares/validators");

// Profil
router.get(
  "/profile", 
  isAuth, 
  usersController.getProfile);

router.put(
  "/profile",
  isAuth,
  upload.single("image"),
  updateProfileValidation(),
  validation,
  usersController.updateProfile
);

router.put(
  "/change-password",
  isAuth,
  changePasswordValidation(),
  validation,
  usersController.changePassword,
);

// Adresses
router.get
("/addresses", 
  isAuth, 
  usersController.getAddresses);

router.post(
  "/addresses",
  isAuth,
  addressValidation(),
  validation,
  usersController.addAddress,
);
router.put(
  "/addresses/:addressId",
  isAuth,
  addressValidation(),
  validation,
  usersController.updateAddress,
);
router.delete
("/addresses/:addressId", 
  isAuth, 
  usersController.deleteAddress);

// Wishlist
router.post(
  "/wishlist/:productId",
  isAuth,
  wishlistValidation(),
  validation,
  usersController.addToWishlist,
);
router.delete(
  "/wishlist/:productId",
  isAuth,
  wishlistValidation(),
  validation,
  usersController.removeFromWishlist,
);

// Admin
router.get("/", isAuth, isAdmin, usersController.getAllUsers);
router.get("/:id", isAuth, isAdmin, usersController.getUserById);
router.put("/:id", isAuth, isAdmin, usersController.updateUserByAdmin);
router.delete("/:id", isAuth, isAdmin, usersController.deleteUser);

module.exports = router;
