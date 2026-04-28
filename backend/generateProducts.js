const fs = require('fs');

const categories = ["t-shirt", "chemise", "pantalon", "jean", "veste", "manteau", "pull", "sweat", "chaussures", "accessoires"];

// Fonction pour générer un produit
function createProduct(gender, index) {
  const cat = categories[index % categories.length];
  const basePrice = Math.floor(Math.random() * 120) + 30;
  const hasDiscount = Math.random() > 0.7;
  const images = {
    homme: {
      "t-shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      "chemise": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500",
      "pantalon": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500",
      "jean": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500",
      "veste": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500",
      "manteau": "https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=500",
      "pull": "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=500",
      "sweat": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500",
      "chaussures": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
      "accessoires": "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500"
    },
    femme: {
      "t-shirt": "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
      "chemise": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500",
      "pantalon": "https://images.unsplash.com/photo-1594633312681-8970d9f73d18?w=500",
      "jean": "https://images.unsplash.com/photo-1582552938357-32b424df40b3?w=500",
      "veste": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500",
      "manteau": "https://images.unsplash.com/photo-1544022613-ab87f5f39e2d?w=500",
      "pull": "https://images.unsplash.com/photo-1584273143988-2635bc9f5b9d?w=500",
      "sweat": "https://images.unsplash.com/photo-1576566588028-4149f3842f27?w=500",
      "chaussures": "https://images.unsplash.com/photo-1608231387042-66d3b2b5f8d1?w=500",
      "accessoires": "https://images.unsplash.com/photo-1584917865443-de89df76afd3?w=500"
    }
  };

  const names = {
    homme: { "t-shirt": "T-shirt basique homme", "chemise": "Chemise casual homme", "pantalon": "Pantalon chino homme", "jean": "Jean slim homme", "veste": "Veste légère homme", "manteau": "Manteau long homme", "pull": "Pull col rond homme", "sweat": "Sweat à capuche homme", "chaussures": "Baskets homme", "accessoires": "Ceinture cuir homme" },
    femme: { "t-shirt": "T-shirt crop top femme", "chemise": "Chemisier fluide femme", "pantalon": "Pantalon palazzo femme", "jean": "Jean mom femme", "veste": "Blazer femme", "manteau": "Trench coat femme", "pull": "Pull fin femme", "sweat": "Sweat crop femme", "chaussures": "Baskets femme", "accessoires": "Sac à main femme" }
  };

  return {
    name: `${names[gender][cat]} ${index + 1}`,
    description: `${names[gender][cat]} de haute qualité. Coupe tendance et matière agréable.`,
    price: basePrice,
    discountPrice: hasDiscount ? Math.floor(basePrice * 0.8) : undefined,
    category: cat,
    gender: gender,
    sizes: cat === "chaussures" ? [{ size: gender === "homme" ? "42" : "38", stock: 10 }] : [{ size: "M", stock: 15 }, { size: "L", stock: 10 }],
    images: [images[gender][cat]],
    colors: gender === "homme" ? ["Noir", "Blanc", "Bleu"] : ["Rose", "Blanc", "Beige"],
    tags: hasDiscount ? ["promotion"] : [],
    isActive: true
  };
}

const products = [];
for (let i = 0; i < 100; i++) products.push(createProduct("homme", i));
for (let i = 0; i < 100; i++) products.push(createProduct("femme", i));

fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log('✅ products.json généré avec 200 produits.');