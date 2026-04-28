const User = require("../models/User");

// ------------------- PROFIL -------------------
// @route   GET /api/users/profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("wishlist", "name price images"); // peupler la wishlist
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur serveur" }], error });
  }
};

// @route   PUT /api/users/profile
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = ["name", "lastName", "phone", "birthDate", "gender", "image"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });

    // Si un fichier a été uploadé, utiliser son chemin
    if (req.file) {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  updates.image = `${baseUrl}/${req.file.path.replace(/\\/g, '/')}`;
}

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({ success: [{ msg: "Profil mis à jour" }], user });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur mise à jour" }], error });
  }
};

// @route   PUT /api/users/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json({ errors: [{ msg: "Mot de passe actuel incorrect" }] });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: [{ msg: "Mot de passe modifié" }] });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur changement mot de passe" }], error });
  }
};

// ------------------- ADRESSES -------------------
// @route   GET /api/users/addresses
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    res.json({ addresses: user.addresses || [] });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur récupération adresses" }], error });
  }
};

// @route   POST /api/users/addresses
exports.addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newAddress = {
      ...req.body,
      isDefault: user.addresses.length === 0 ? true : req.body.isDefault,
    };

    if (newAddress.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }
    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json({ addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur ajout adresse" }], error });
  }
};

// @route   PUT /api/users/addresses/:addressId
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    if (!address)
      return res.status(404).json({ errors: [{ msg: "Adresse non trouvée" }] });

    Object.assign(address, req.body);
    if (req.body.isDefault) {
      user.addresses.forEach(
        (addr) =>
          (addr.isDefault = addr._id.toString() === req.params.addressId),
      );
    }
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur mise à jour adresse" }], error });
  }
};
// Delete address
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.addresses.id(req.params.addressId);
    if (!address)
      return res.status(404).json({ errors: [{ msg: "Adresse non trouvée" }] });

    const wasDefault = address.isDefault;
    // ✅ Suppression moderne avec pull()
    user.addresses.pull({ _id: req.params.addressId });
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    res.json({ addresses: user.addresses });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur suppression adresse" }], error });
  }
};
// ------------------- WISHLIST -------------------
// @route   POST /api/users/wishlist/:productId
exports.addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const productId = req.params.productId;
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur ajout wishlist" }], error });
  }
};

// @route   DELETE /api/users/wishlist/:productId
exports.removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId,
    );
    await user.save();
    res.json({ wishlist: user.wishlist });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur suppression wishlist" }], error });
  }
};

// ------------------- ADMIN -------------------
// @route   GET /api/users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur récupération utilisateurs" }], error });
  }
};

// @route   GET /api/users/:id (admin)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    res.json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ errors: [{ msg: "Erreur récupération utilisateur" }], error });
  }
};

// @route   PUT /api/users/:id (admin)
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { role, isActive, emailVerified } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive, emailVerified },
      { new: true, runValidators: true },
    ).select("-password");
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    res.json({ success: [{ msg: "Utilisateur modifié" }], user });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur modification" }], error });
  }
};

// @route   DELETE /api/users/:id (admin)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    res.json({ success: [{ msg: "Utilisateur supprimé" }] });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur suppression" }], error });
  }
};
