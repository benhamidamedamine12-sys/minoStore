const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Sous-schéma pour une adresse
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String, required: true },
  governorate: { type: String, required: true }, 
  country: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  phone: { type: String },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false }, // select false pour ne pas le renvoyer par défaut
    phone: { type: String }, // téléphone principal
    birthDate: { type: Date },
    gender: { type: String, enum: ["male", "female"], default: null },
    addresses: [addressSchema], // adresses multiples
    image: { type: String, default: "../assets/picture.png" },
    isAdmin: { type: Boolean, default: false },
    role: {
      type: String,
      enum: ["user", "admin", "agent", "seller"],
      default: "user",
    },
    isActive: { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: true },
    emailVerificationToken: { type: String },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    cart: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // simplifié, mieux vaut un modèle Cart séparé
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

// Hacher le mot de passe avant sauvegarde
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer le mot de passe
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Générer un token de réinitialisation de mot de passe
userSchema.methods.generatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 heure
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
