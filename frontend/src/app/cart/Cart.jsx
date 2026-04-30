'use client';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { removeFromCart, updateQuantity, clearCart } from '@/redux/features/cart/cartSlice';
import styles from './Cart.module.css';

export default function CartPage() {
  const dispatch = useDispatch();
  const { items, totalQuantity, totalPrice } = useSelector((state) => state.cart);

  const handleUpdateQuantity = (id, size, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, size, quantity: newQuantity }));
  };

  const handleRemoveItem = (id, size) => {
    dispatch(removeFromCart({ id, size }));
  };

  const handleClearCart = () => {
    if (confirm('Voulez-vous vraiment vider votre panier ?')) {
      dispatch(clearCart());
    }
  };

  if (items.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <FiShoppingBag size={64} />
        <h2>Votre panier est vide</h2>
        <p>Ajoutez des produits depuis notre boutique</p>
        <Link href="/product" className={styles.shopBtn}>
          Découvrir nos produits →
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartHeader}>
        <h1>Mon panier</h1>
        <button onClick={handleClearCart} className={styles.clearBtn}>
          Vider le panier
        </button>
      </div>

      <div className={styles.cartContent}>
        {/* Liste des produits */}
        <div className={styles.cartItems}>
          {items.map((item) => (
            <div key={`${item.id}-${item.size}`} className={styles.cartItem}>
              <div className={styles.itemImage}>
                <Image
                  src={item.image || 'https://via.placeholder.com/160?text=MinoStore'}
                  alt={item.name}
                  fill
                  sizes="80px"
                />
              </div>
              <div className={styles.itemDetails}>
                <h3>{item.name}</h3>
                <p className={styles.itemSize}>Taille : {item.size}</p>
                <p className={styles.itemPrice}>{item.price} TND</p>
              </div>
              <div className={styles.itemActions}>
                <div className={styles.quantitySelector}>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, item.size, item.quantity + 1)}
                  >
                    <FiPlus />
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id, item.size)}
                  className={styles.removeBtn}
                  aria-label="Supprimer"
                >
                  <FiTrash2 />
                </button>
              </div>
              <div className={styles.itemTotal}>
                {(item.price * item.quantity).toFixed(2)} TND
              </div>
            </div>
          ))}
        </div>

        {/* Résumé de la commande */}
        <div className={styles.cartSummary}>
          <h2>Récapitulatif</h2>
          <div className={styles.summaryRow}>
            <span>Total articles :</span>
            <span>{totalQuantity}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Sous-total :</span>
            <span>{totalPrice.toFixed(2)} TND</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Livraison :</span>
            <span>Gratuite</span>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total :</span>
            <span>{totalPrice.toFixed(2)} TND</span>
          </div>
          <Link href="/checkout" className={styles.checkoutBtn}>
            Procéder au paiement
          </Link>
        </div>
      </div>
    </div>
  );
}
