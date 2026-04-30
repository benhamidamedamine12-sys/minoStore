const express = require("express");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");           
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);


const connectDB = require("./config/connectDB");
const authRoutes = require("./routes/auth.route");
const userRoutes = require("./routes/user.route");
const productRoutes = require("./routes/product.route");
const orderRoutes = require("./routes/order.route");

// Configuration Passport
require("./config/passport");
const app = express();
connectDB();
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Dossier uploads créé");
}

// Middlewares
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(uploadDir)); // Exposer le dossier uploads
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Connexion DB

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("API E-commerce Tunisien - Bienvenue 🚀");
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// Gestion d'erreur
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`🛜  SERVEUR DÉMARRÉ SUR : http://localhost:${PORT}`);
});
