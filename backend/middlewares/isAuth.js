const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
  try {
    console.log("🍪 Cookies reçus :", req.cookies);     // Lire le token depuis le cookie ou le header Authorization
    let token = req.cookies?.token;
    if (!token) {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ errors: [{ msg: "Token manquant" }] });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const foundUser = await User.findById(decoded.id).select("-password");
    if (!foundUser) {
      return res.status(404).json({ errors: [{ msg: "Utilisateur non trouvé" }] });
    }

    req.user = foundUser;
    next();
  } catch (error) {
    console.error("Erreur isAuth:", error);
    return res.status(401).json({ errors: [{ msg: "Token invalide ou expiré" }] });
  }
};

module.exports = isAuth;