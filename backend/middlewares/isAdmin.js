const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAdmin = async (req, res, next) => {
  try {
    // isAuth doit être appelé avant, donc req.user existe déjà
    if (!req.user) {
      return res.status(401).json({ errors: [{ msg: "Non authentifié" }] });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ errors: [{ msg: "Accès réservé aux administrateurs" }] });
    }

    next();
  } catch (error) {
    console.error("Erreur isAdmin:", error);
    res.status(500).json({ errors: [{ msg: "Erreur serveur" }] });
  }
};

module.exports = isAdmin;
