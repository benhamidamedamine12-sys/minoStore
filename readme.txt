# 🛒 minosStore - Plateforme E-commerce Full-Stack

**minosStore** est une application e-commerce moderne et performante dédiée à la mode homme et femme. Développé intégralement en solo, ce projet démontre une maîtrise complète du cycle de développement, de la gestion de base de données NoSQL à l'implémentation d'une interface utilisateur dynamique et responsive.

---

## 🛠️ Stack Technique

### Frontend (Client)
* **Next.js 14+ (App Router)** : Pour une navigation rapide et optimisée.
* **Redux Toolkit** : Gestion centralisée de l'état (Authentification et Panier).
* **Axios** : Communication fluide avec l'API Backend.
* **CSS Modules** : Design modulaire et maintenable.
* **Google OAuth 2.0** : Intégration de l'authentification sociale.

### Backend (Serveur)
* **Node.js & Express** : Serveur d'API structuré et sécurisé.
* **MongoDB & Mongoose** : Modélisation des données produits, catégories et utilisateurs.
* **Passport.js** : Système d'authentification hybride (Local & Google Strategy).
* **JWT (JSON Web Tokens)** : Sécurisation des sessions utilisateurs.
* **Multer** : Gestion du stockage des images de produits en local.

---

## ✨ Fonctionnalités Majeures

* **Système d'Authentification Complet** : Inscription et connexion sécurisées avec hachage de mots de passe (Bcrypt) + Option de connexion rapide via Google.
* **Gestion Dynamique des Produits** : Catalogue alimenté par une base de données MongoDB, incluant des filtres par genre (Homme/Femme) et catégories.
* **Panier Interactif** : Ajout/Suppression d'articles avec persistance de l'état grâce à Redux.
* **Génération de Données Automatisée** : Inclusion d'un script `generateProducts.js` pour peupler instantanément la boutique avec des centaines de produits tests.
* **Design Professionnel** : Palette de couleurs moderne (*Ink Black*, *Electric Sapphire*) et typographie *Inter* pour une lisibilité maximale.

---

## 📁 Architecture du Projet

```text
├── backend/
│   ├── config/             # Connexion DB & Stratégies Passport
│   ├── controllers/        # Logique métier (Auth, Products, Users)
│   ├── models/             # Modèles Mongoose (Product.js, User.js)
│   ├── routes/             # Endpoints API
│   ├── uploads/            # Stockage des images produits
│   └── server.js           # Point d'entrée Express
├── frontend/
│   ├── src/app/            # Routes Next.js (Home, Auth, Providers)
│   ├── src/components/     # UI Components (Navbar, Footer, Cards)
│   ├── src/redux/          # Store et Slices (authSlice, cartSlice)
│   └── public/             # Assets statiques