'use client';
import Link from 'next/link';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaCcVisa, FaCcMastercard, FaCcPaypal } from 'react-icons/fa';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo & description */}
        <div className={styles.section}>
          <h3 className={styles.logo}>MinoStore</h3>
          <p className={styles.description}>
            Votre destination mode pour homme et femme. 
            Découvrez les dernières tendances et exprimez votre style unique.
          </p>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* Liens utiles */}
        <div className={styles.section}>
          <h4>Liens rapides</h4>
          <ul className={styles.links}>
            <li><Link href="/">Accueil</Link></li>
            <li><Link href="/product">Produits</Link></li>
            <li><Link href="/about">À propos</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Catégories */}
        <div className={styles.section}>
          <h4>Catégories</h4>
          <ul className={styles.links}>
            <li><Link href="/homme">Homme</Link></li>
            <li><Link href="/femme">Femme</Link></li>
            <li><Link href="/product?category=accessoires">Accessoires</Link></li>
            <li><Link href="/product?category=chaussures">Chaussures</Link></li>
          </ul>
        </div>

        {/* Contact & paiement */}
        <div className={styles.section}>
          <h4>Contact</h4>
          <ul className={styles.contactList}>
            <li>Email : contact@minostore.tn</li>
            <li>Tél : +216 52 670 426</li>
            <li>Adresse : Tunis, Tunisie</li>
          </ul>
          <div className={styles.paymentIcons}>
            <FaCcVisa size={32} />
            <FaCcMastercard size={32} />
            <FaCcPaypal size={32} />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className={styles.copyright}>
        <p>&copy; {currentYear} MinoStore. Tous droits réservés.</p>
      </div>
    </footer>
  );
}