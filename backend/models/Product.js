const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    category: {
      type: String,
      enum: ["t-shirt", "chemise", "pantalon", "jean", "veste", "manteau", "pull", "sweat", "chaussures", "accessoires"],
      required: true,
    },
    gender: {
      type: String,
      enum: ["homme", "femme", "unisexe"],
      required: true,
    },
    sizes: [
      {
        size: {
           type: String,
           enum: ["XS", "S", "M", "L", "XL", "XXL", "38", "40", "42", "44", "46"],
           required: true }, // ex: "S", "M", "L", "38", "42"
        stock: { type: Number, required: true, min: 0, default: 0 },
      },
    ],
    images: [{ type: String, required: true }], // URLs des images
    colors: [{ type: String }], // ex: ["Rouge", "Noir", "Blanc"]
    tags: [{ type: String }], // ex: ["nouveauté", "promotion"]
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Index pour la recherche rapide
productSchema.index({ name: "text", description: "text", tags: "text" });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;