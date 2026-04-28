'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from './Home.module.css';
import hommeImg from '@/assets/Images/Homme.jpg';
import femmeImg from '@/assets/Images/Femme.jpg';
import promoMan from '../../../public/images/promo-man.jpg';
import promoWoman from '../../../public/images/promo-woman.jpg';
import BackgroundVideo from '@/components/BackgroundVideo';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5501/api/products?limit=4');
        const shuffled = res.data.products.sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 4));
      } catch (error) {
        console.error('Erreur chargement produits:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className={styles.homePage}>
      <BackgroundVideo />

      {/* Conteneur pour hero et catégories */}
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <span className={styles.gradient}>MinoStore</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Votre destination mode pour homme et femme
            </p>
            <p className={styles.heroDescription}>
              Découvrez les dernières tendances et exprimez votre style unique
            </p>
            <Link href="/product" className={styles.ctaButton}>
              Explorer la collection →
            </Link>
          </div>
        </section>

        {/* Catégories Homme / Femme */}
        <div className={styles.categories}>
          <Link href="/homme" className={styles.categoryCard}>
            <div className={styles.categoryImage}>
              <img src={hommeImg.src} alt="Collection Homme" />
            </div>
            <div className={styles.categoryOverlay}>
              <h2>Homme</h2>
              <span className={styles.categoryLink}>Découvrir →</span>
            </div>
          </Link>

          <Link href="/femme" className={styles.categoryCard}>
            <div className={styles.categoryImage}>
              <img src={femmeImg.src} alt="Collection Femme" />
            </div>
            <div className={styles.categoryOverlay}>
              <h2>Femme</h2>
              <span className={styles.categoryLink}>Découvrir →</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Bannières pleine largeur (images locales) */}
     <div className={styles.homePage2}>
      <h1>DECOUVRIR NOTRE COLLECTION</h1>
      <p>Découvrez nos dernières créations</p>
<div className={styles.fullWidthBanner}>
  <img src={promoMan.src} className={styles.bannerImg} />
  <div className={styles.bannerTextLeft}>
    <h2>NOUVELLE COLLECTION</h2>
    <p>Style urbain, qualité supérieure</p>
  </div>
</div>
<div className={styles.fullWidthBanner}>
  <img src={promoWoman.src} className={styles.bannerImg} />
  <div className={styles.bannerTextRight}>
    <h2>Élégance intemporelle</h2>
    <p>Les tendances de la saison</p>
  </div>
</div>
      {/* Conteneur pour les produits vedettes */}
      <div className={styles.container}>
        <section className={styles.featured}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Nos coups de cœur</h2>
            <p className={styles.sectionSubtitle}>Sélectionnés avec passion</p>
          </div>
          {loading ? (
            <div className={styles.loading}>
              <span className={styles.loader}></span>
              <span>Chargement des produits...</span>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <Link href={`/product/${product._id}`} key={product._id} className={styles.productCard}>
                    <div className={styles.productImage}>
                      <img
                        src={product.images?.[0] || 'https://via.placeholder.com/400x500?text=MinoStore'}
                        alt={product.name}
                      />
                      {product.discountPrice && (
                        <span className={styles.discountBadge}>
                          -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                        </span>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productPrice}>
                        {product.discountPrice ? (
                          <>
                            <span className={styles.oldPrice}>{product.price} TND</span>
                            <span className={styles.newPrice}>{product.discountPrice} TND</span>
                          </>
                        ) : (
                          <span className={styles.price}>{product.price} TND</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p>Aucun produit pour le moment.</p>
              )}
            </div>
          )}
        </section>
      </div>
      </div>
    </div>
  );
}