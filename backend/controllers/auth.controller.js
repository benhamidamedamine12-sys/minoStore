const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const getFrontendUrl = () => process.env.FRONTEND_URL || "http://localhost:3000";
const getBackendUrl = (req) =>
  process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// -------------------------------------------------------------------
// REGISTER (ajout du cookie)
// -------------------------------------------------------------------
exports.register = async (req, res) => {
  try {
    console.log("📦 Body reçu :", req.body);
    const { name, lastName, email, password, phone, birthDate, gender, address } = req.body;

    if (!name || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        errors: [{ msg: "Tous les champs (name, lastName, email, password, phone) sont requis" }]
      });
    }

    if (!address || !address.street || !address.city || !address.postalCode || !address.governorate || !address.country) {
      return res.status(400).json({
        errors: [{ msg: "L'adresse complète est obligatoire (rue, ville, code postal, gouvernorat, pays)" }]
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: "Cet email est déjà utilisé" }] });
    }

    const user = new User({
      name,
      lastName,
      email,
      password,
      phone,
      birthDate: birthDate || null,
      gender: gender || null,
      emailVerified: false,
      isActive: true,
      role: "user",
      addresses: [{
        street: address.street,
        city: address.city,
        postalCode: address.postalCode,
        governorate: address.governorate,
        country: address.country,
        isDefault: true
      }]
    });

  const verificationToken = crypto.randomBytes(32).toString("hex");

        user.emailVerificationToken = crypto
  .createHash("sha256")
  .update(verificationToken)
  .digest("hex");

    await user.save();

    const verificationUrl = `${getBackendUrl(req)}/api/auth/verify-email/${verificationToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verifier votre email MinoStore",
      text: `Cliquez sur ce lien pour verifier votre email: ${verificationUrl}`,
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Merci de creer votre compte MinoStore.</p>
        <p><a href="${verificationUrl}">Verifier mon email</a></p>
      `,
    });

    const token = generateToken(user._id, user.role);

    // 🔥 Définir le cookie HTTP-only
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });

    const userToReturn = {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,
      gender: user.gender,
      image: user.image,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      addresses: user.addresses
    };

    return res.status(201).json({
      success: [{ msg: "Utilisateur créé avec succès" }],
      user: userToReturn,
    });
  } catch (error) {
    console.error("Erreur register:", error);
    return res.status(500).json({
      errors: [{ msg: "Échec de l'inscription", detail: error.message }]
    });
  }
};

// -------------------------------------------------------------------
// LOGIN (avec cookie)
// -------------------------------------------------------------------
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        errors: [{ msg: "Email ou mot de passe incorrect" }]
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        errors: [{ msg: "Compte désactivé" }]
      });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id, user.role);

    // ✅ COOKIE HTTP-ONLY (propre)
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS en prod
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

   const userToReturn = {
  _id: user._id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  birthDate: user.birthDate,
  gender: user.gender,
  image: user.image,
  role: user.role,
  addresses: user.addresses,
  isActive: user.isActive,
  emailVerified: user.emailVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,

};

    return res.status(200).json({
      success: [{ msg: "Connexion réussie" }],
      user: userToReturn,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      errors: [{ msg: "Impossible de se connecter" }]
    });
  }
};
// -------------------------------------------------------------------
// LOGOUT 
// -------------------------------------------------------------------
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: [{ msg: "Déconnexion réussie" }] });
};

// -------------------------------------------------------------------
// GET ME - Vérifier l'authentification
// -------------------------------------------------------------------
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ errors: [{ msg: "Non authentifié" }] });
    }

    const userToReturn = {
      _id: user._id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      birthDate: user.birthDate,      
      gender: user.gender,     
      image: user.image,
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      addresses: user.addresses,      // ← Ajouté
      wishlist: user.wishlist         // ← Ajouté (optionnel)
    };

    return res.json({
      success: [{ msg: "Utilisateur authentifié" }],
      user: userToReturn,
    });
  } catch (error) {
    console.error("Erreur getMe:", error);
    return res.status(500).json({ errors: [{ msg: "Erreur serveur" }] });
  }
};

// -------------------------------------------------------------------
// FORGOT PASSWORD (inchangé)
// -------------------------------------------------------------------
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        success: [{ msg: "Si cet email existe, un lien a ete envoye" }],
      });
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    const resetUrl = `${getFrontendUrl()}/reset-password/${resetToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reinitialisation de votre mot de passe MinoStore",
      text: `Cliquez sur ce lien pour reinitialiser votre mot de passe: ${resetUrl}`,
      html: `
        <p>Bonjour ${user.name},</p>
        <p>Vous avez demande une reinitialisation de mot de passe.</p>
        <p><a href="${resetUrl}">Reinitialiser mon mot de passe</a></p>
        <p>Ce lien expire dans 1 heure.</p>
      `,
    });

    return res.json({ success: [{ msg: "Email de reinitialisation envoye" }] });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({ errors: [{ msg: "Impossible d'envoyer l'email" }] });
  }
};

// -------------------------------------------------------------------
// RESET PASSWORD (inchangé)
// -------------------------------------------------------------------
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ errors: [{ msg: "Token invalide ou expiré" }] });
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    return res.json({ success: [{ msg: "Mot de passe réinitialisé" }] });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Erreur" }] });
  }
};

// -------------------------------------------------------------------
// VERIFY EMAIL (inchangé)
// -------------------------------------------------------------------
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({ emailVerificationToken: hashedToken });
    if (!user) {
      if (req.accepts(["html", "json"]) === "html") {
        return res.redirect(`${getFrontendUrl()}/login?verified=invalid`);
      }
      return res.status(400).json({ errors: [{ msg: "Token invalide" }] });
    }
    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    await user.save();
    if (req.accepts(["html", "json"]) === "html") {
      return res.redirect(`${getFrontendUrl()}/login?verified=true`);
    }
    return res.json({ success: [{ msg: "Email vérifié" }] });
  } catch (error) {
    return res.status(500).json({ errors: [{ msg: "Erreur" }] });
  }
};

// -------------------------------------------------------------------
// GOOGLE OAUTH CALLBACK (avec cookie)
// -------------------------------------------------------------------
exports.googleCallback = (req, res) => {
  try {
    const user = req.user;
    const token = generateToken(user._id, user.role);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(`${getFrontendUrl()}/profile`);
  } catch (error) {
    console.error("Erreur googleCallback:", error);
    res.redirect(`${getFrontendUrl()}/login?error=google_auth_failed`);
  }
};
