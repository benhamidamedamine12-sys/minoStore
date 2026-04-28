'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './Checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items, totalPrice } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div className={styles.loading}>Redirection vers la connexion...</div>;
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits avant de passer commande.</p>
        <button onClick={() => router.push('/product')} className={styles.shopBtn}>
          Retour aux produits
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>Finaliser ma commande</h1>
      <div className={styles.checkoutLayout}>
        <div className={styles.formSection}>
          <h2>Informations de livraison</h2>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nom complet</label>
              <input type="text" defaultValue={`${user?.name} ${user?.lastName}`} required />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse email</label>
              <input type="email" defaultValue={user?.email} required />
            </div>
            <div className={styles.formGroup}>
              <label>Téléphone</label>
              <input type="tel" defaultValue={user?.phone} required />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse</label>
              <input type="text" placeholder="Rue, numéro" required />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Ville</label>
                <input type="text" required />
              </div>
              <div className={styles.formGroup}>
                <label>Code postal</label>
                <input type="text" required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Gouvernorat</label>
              <input type="text" required />
            </div>
            <button type="submit" className={styles.submitBtn}>Confirmer la commande</button>
          </form>
        </div>
        <div className={styles.summary}>
          <h2>Récapitulatif</h2>
          <ul className={styles.itemsList}>
            {items.map((item) => (
              <li key={`${item.id}-${item.size}`} className={styles.item}>
                <span>{item.name} (Taille {item.size})</span>
                <span>{item.quantity} x {item.price} TND</span>
              </li>
            ))}
          </ul>
          <div className={styles.total}>
            <span>Total :</span>
            <strong>{totalPrice.toFixed(2)} TND</strong>
          </div>
        </div>
      </div>
    </div>
  );
}