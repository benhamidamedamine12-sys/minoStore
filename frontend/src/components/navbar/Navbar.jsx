'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/redux/features/auth/authSlice';
import { FiShoppingCart, FiMenu, FiX } from 'react-icons/fi';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalQuantity } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to get avatar image
  const getAvatarImage = () => {
    if (user?.image && user.image !== 'assets/picture.png' && user.image !== '/assets/Images/picture.png') {
      return user.image;
    }
    if (user?.gender === 'female') {
      return '/assets/FemmeProfileImageDefault.png';
    }
    if (user?.gender === 'male') {
      return '/assets/HommeProfileImageDefault.png';
    }
    return '/assets/HommeProfileImageDefault.png';
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
  };

  // Fermer le dropdown au clic sur un lien
  const handleProductClick = () => {
    setShowProductsDropdown(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo + Burger (mobile) */}
        <div className={styles.logoBurger}>
          <button 
            className={styles.burgerIcon}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <Link href="/" className={styles.logo}>
            MinoStore
          </Link>
        </div>

        {/* Navigation desktop & mobile (sidebar) */}
        <div className={`${styles.navWrapper} ${isMobileMenuOpen ? styles.mobileOpen : ''}`}>
          <ul className={styles.navLinks}>
            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Accueil</Link></li>
            <li 
              className={styles.dropdown}
              onMouseEnter={() => setShowProductsDropdown(true)}
              onMouseLeave={() => setShowProductsDropdown(false)}
            >
              <button className={styles.dropdownTrigger}>
                Produits
              </button>
              {showProductsDropdown && (
                <ul className={styles.dropdownMenu}>
                  <li><Link href="/homme" onClick={handleProductClick}>Homme</Link></li>
                  <li><Link href="/femme" onClick={handleProductClick}>Femme</Link></li>
                </ul>
              )}
            </li>
            <li><Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>À propos</Link></li>
            <li><Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link></li>
            {isAuthenticated && user?.role === 'admin' && (
              <li><Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link></li>
            )}
          </ul>

          {/* Zone utilisateur + panier (mobile aussi) */}
          <div className={styles.authButtons}>
            <div className={styles.cartIconContainer}>
              <Link href="/cart" className={styles.cartLink} onClick={() => setIsMobileMenuOpen(false)}>
                <FiShoppingCart size={22} />
                {totalQuantity > 0 && (
                  <span className={styles.cartBadge}>{totalQuantity}</span>
                )}
              </Link>
            </div>

            {isAuthenticated ? (
              <div className={styles.userMenuContainer}>
                <button
                  className={styles.userAvatar}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  title="Menu utilisateur"
                >
                  <img src={getAvatarImage()} alt={user.name} className={styles.avatarImage} />
                </button>

                {showUserMenu && (
                  <div className={styles.userDropdown}>
                    <div className={styles.dropdownName}>
                      <span>{user?.name?.split(' ')[0]}</span>
                    </div>
                    <Link href="/profile" className={styles.dropdownLink} onClick={() => { setShowUserMenu(false); setIsMobileMenuOpen(false); }}>
                      <span>👤</span>
                      <span>Mon profil</span>
                    </Link>
                    <button onClick={handleLogout} className={styles.dropdownLogout}>
                      <span>🚪</span>
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.authLinks}>
                <Link href="/login" className={styles.loginBtn} onClick={() => setIsMobileMenuOpen(false)}>
                  Connexion
                </Link>
                <Link href="/register" className={styles.registerBtn} onClick={() => setIsMobileMenuOpen(false)}>
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
