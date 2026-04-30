'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { clearCart } from '@/redux/features/cart/cartSlice';
import styles from './Checkout.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5501';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items, totalPrice } = useSelector((state) => state.cart);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    governorate: '',
    country: 'Tunisie',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/checkout');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (!user) return;

    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || `${user?.name || ''} ${user?.lastName || ''}`.trim(),
      email: prev.email || user?.email || '',
      phone: prev.phone || user?.phone || '',
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(
        `${API_URL}/api/orders`,
        {
          items,
          shippingAddress: formData,
        },
        { withCredentials: true }
      );

      dispatch(clearCart());
      setSuccess(`Commande confirmee: ${response.data.order._id}`);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Impossible de confirmer la commande');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className={styles.loading}>Redirection vers la connexion...</div>;
  }

  if (success) {
    return (
      <div className={styles.empty}>
        <h2>Commande confirmee</h2>
        <p>{success}</p>
        <button onClick={() => router.push('/profile')} className={styles.shopBtn}>
          Voir mon profil
        </button>
      </div>
    );
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
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Nom complet</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Telephone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse</label>
              <input type="text" name="street" value={formData.street} onChange={handleChange} placeholder="Rue, numero" required />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Ville</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className={styles.formGroup}>
                <label>Code postal</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} required />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>Gouvernorat</label>
              <input type="text" name="governorate" value={formData.governorate} onChange={handleChange} required />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Confirmation...' : 'Confirmer la commande'}
            </button>
          </form>
        </div>
        <div className={styles.summary}>
          <h2>Recapitulatif</h2>
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
