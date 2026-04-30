const { check, validationResult, body, param } = require("express-validator");

// Liste des gouvernorats tunisiens
const tunisianGovernorates = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Gabès",
  "Médenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kébili",
];

// --------------------- VALIDATEURS (fonctions) ---------------------
const isValidEmail = () =>
  // ✅ Fonction
  check("email", "Email invalide").isEmail().normalizeEmail();

const isValidPassword = (field = "password") => {
  const chain = check(field)
    .isLength({ min: 8, max: 25 })
    .withMessage("Le mot de passe doit contenir entre 8 et 25 caractères")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,25}$/)
    .withMessage(
      "Le mot de passe doit contenir au moins une lettre et un chiffre",
    );
  return chain;
};

const isValidName = (field, label) => {
  const chain = check(field)
    .notEmpty()
    .withMessage(`${label} est obligatoire`)
    .trim()
    .isLength({ max: 50 })
    .withMessage(`${label} ne peut pas dépasser 50 caractères`);
  return chain;
};

const isValidPhone = (required = true) => {
  // ✅ Fonction
  let chain = check("phone");
  if (required)
    chain = chain.notEmpty().withMessage("Le téléphone est obligatoire");
  else chain = chain.optional();
  return chain
    .matches(/^[0-9+\-\s]{8,20}$/)
    .withMessage("Numéro de téléphone invalide");
};

const isValidBirthDate = (required = false) => {
  let chain = check("birthDate");
  if (!required) chain = chain.optional();
  return chain
    .isISO8601()
    .withMessage("Date de naissance invalide")
    .custom((value) => {
      if (!value) return true;
      const today = new Date();
      const birth = new Date(value);
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
      if (age < 13) throw new Error("Vous devez avoir au moins 13 ans");
      return true;
    });
};

// Validation d'adresse (inchangée)
const addressValidation = [
  check("governorate")
    .notEmpty()
    .withMessage("Le gouvernorat est obligatoire")
    .isIn(tunisianGovernorates)
    .withMessage("Gouvernorat tunisien invalide"),
  check("city")
    .notEmpty()
    .withMessage("La ville est obligatoire")
    .isLength({ min: 2, max: 50 })
    .withMessage("La ville doit faire entre 2 et 50 caractères"),
  check("street")
    .notEmpty()
    .withMessage("L'adresse (rue) est obligatoire")
    .isLength({ min: 3, max: 100 })
    .withMessage("L'adresse doit faire entre 3 et 100 caractères"),
  check("isDefault").optional().isBoolean(),
  check("phone")
    .optional()
    .matches(/^[0-9+\-\s]{8,20}$/)
    .withMessage("Téléphone invalide"),
];

// --------------------- VALIDATEURS PAR ROUTE ---------------------
exports.registerValidation = () => [
  isValidName("name", "Le nom"),
  isValidName("lastName", "Le prénom"),
  isValidEmail(),
  isValidPassword(),
  isValidPhone(true), // required
  isValidBirthDate(false),
];

exports.loginValidation = () => [
  isValidEmail(),
  check("password", "Mot de passe requis").notEmpty(),
];

exports.updateProfileValidation = () => [
  check("name")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Nom trop long"),
  check("lastName")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Prénom trop long"),
  isValidPhone(false), // optional
  isValidBirthDate(false),
  check("image")
    // .optional()
    // .isURL()
    // .withMessage("L'image doit être une URL valide"),
];

exports.changePasswordValidation = () => [
  check("currentPassword", "Le mot de passe actuel est requis").notEmpty(),
  isValidPassword("newPassword"),
  body("newPassword").custom((value, { req }) => {
    if (value === req.body.currentPassword) {
      throw new Error(
        "Le nouveau mot de passe doit être différent de l'ancien",
      );
    }
    return true;
  }),
];

exports.forgotPasswordValidation = () => [isValidEmail()];
exports.resetPasswordValidation = () => [isValidPassword()];
exports.addressValidation = () => addressValidation;
exports.wishlistValidation = () => [
  param("productId").isMongoId().withMessage("ID de produit invalide"),
];

exports.adminCreateUserValidation = () => [
  isValidName("name", "Le nom"),
  isValidName("lastName", "Le prénom"),
  isValidEmail(),
  isValidPassword(),
  isValidPhone(true),
  isValidBirthDate(false),
  check("role")
    .optional()
    .isIn(["user", "admin", "seller", "agent"])
    .withMessage("Rôle invalide"),
  check("isActive").optional().isBoolean(),
  check("emailVerified").optional().isBoolean(),
];

exports.adminUpdateUserValidation = () => [
  check("role")
    .optional()
    .isIn(["user", "admin", "seller", "agent"])
    .withMessage("Rôle invalide"),
  check("isActive").optional().isBoolean(),
  check("emailVerified").optional().isBoolean(),
];

// --------------------- MIDDLEWARE DE VALIDATION ---------------------
exports.validation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next(); // indispensable
};
