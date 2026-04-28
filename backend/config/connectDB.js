const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); 
    console.log("✅ Base De Donnée MongoDB Connectée...");
  } catch (error) {
    console.log("⛔ Problème de connexion de la Base De Donnée", error);
    process.exit(1);
  }
};
module.exports = connectDB;
