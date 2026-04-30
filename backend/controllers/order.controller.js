const Order = require("../models/Order");
const Product = require("../models/Product");

exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ errors: [{ msg: "La commande est vide" }] });
    }

    if (!shippingAddress) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Adresse de livraison obligatoire" }] });
    }

    const productIds = items.map((item) => item.id);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });
    const productsById = new Map(
      products.map((product) => [product._id.toString(), product])
    );

    const orderItems = items.map((item) => {
      const product = productsById.get(item.id);
      if (!product) {
        throw new Error(`Produit indisponible: ${item.name || item.id}`);
      }

      const quantity = Number(item.quantity);
      if (!Number.isInteger(quantity) || quantity < 1) {
        throw new Error(`Quantite invalide pour ${product.name}`);
      }

      const selectedSize = product.sizes.find((entry) => entry.size === item.size);
      if (!selectedSize) {
        throw new Error(`Taille indisponible pour ${product.name}`);
      }
      if (selectedSize.stock < quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`);
      }

      const price = product.discountPrice || product.price;
      return {
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        size: item.size,
        quantity,
        price,
      };
    });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalPrice,
    });

    for (const item of orderItems) {
      await Product.updateOne(
        { _id: item.product, "sizes.size": item.size },
        { $inc: { "sizes.$.stock": -item.quantity } }
      );
    }

    res.status(201).json({
      success: [{ msg: "Commande creee avec succes" }],
      order,
    });
  } catch (error) {
    console.error("createOrder error:", error);
    res.status(400).json({
      errors: [{ msg: error.message || "Impossible de creer la commande" }],
    });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur recuperation commandes" }] });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name lastName email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ errors: [{ msg: "Erreur recuperation commandes" }] });
  }
};
