const Product = require("../models/Product");

// GET /api/products - Liste avec filtres (catégorie, genre, prix)
exports.getProducts = async (req, res) => {
  try {
    const { category, gender, minPrice, maxPrice, search, limit = 20, page = 1 } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (gender) filter.gender = gender;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("getProducts error:", error);
    res.status(500).json({ errors: [{ msg: "Erreur serveur" }] });
  }
};

// GET /api/products/:id - Détail d'un produit
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ errors: [{ msg: "Produit non trouvé" }] });
    }
    res.json({ product });
  } catch (error) {
    console.error("getProductById error:", error);
    res.status(500).json({ errors: [{ msg: "Erreur serveur" }] });
  }
};

// ADMIN SEULEMENT - Créer un produit
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json({ product });
  } catch (error) {
    console.error("createProduct error:", error);
    res.status(400).json({ errors: [{ msg: "Données invalides", detail: error.message }] });
  }
};

// ADMIN SEULEMENT - Modifier un produit
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ errors: [{ msg: "Produit non trouvé" }] });
    res.json({ product });
  } catch (error) {
    res.status(400).json({ errors: [{ msg: "Erreur mise à jour" }] });
  }
};

// ADMIN SEULEMENT - Supprimer (soft delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) return res.status(404).json({ errors: [{ msg: "Produit non trouvé" }] });
    res.json({ success: [{ msg: "Produit désactivé" }] });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur serveur" }] });
  }
};