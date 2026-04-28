'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { addToCart } from '@/redux/features/cart/cartSlice';
import styles from './Product.module.css';

const CATEGORIES = [
  { value: '', label: 'Toutes catégories' },
  { value: 't-shirt', label: 'T-shirts' },
  { value: 'chemise', label: 'Chemises' },
  { value: 'pantalon', label: 'Pantalons' },
  { value: 'jean', label: 'Jeans' },
  { value: 'veste', label: 'Vestes' },
  { value: 'manteau', label: 'Manteaux' },
  { value: 'pull', label: 'Pulls' },
  { value: 'sweat', label: 'Sweats' },
  { value: 'chaussures', label: 'Chaussures' },
  { value: 'accessoires', label: 'Accessoires' },
];

const GENDERS = [
  { value: '', label: 'Tous' },
  { value: 'homme', label: 'Homme' },
  { value: 'femme', label: 'Femme' },
];

export default function ProductList() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || '';
  const initialGender = searchParams.get('gender') || '';

  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: initialCategory, gender: initialGender });
  const [sort, setSort] = useState('newest');
  const [quantities, setQuantities] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.gender) params.append('gender', filters.gender);
      const res = await axios.get(`http://localhost:5501/api/products?${params.toString()}`);
      let data = res.data.products;
      if (sort === 'price-asc') data.sort((a, b) => a.price - b.price);
      if (sort === 'price-desc') data.sort((a, b) => b.price - a.price);
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, sort]);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => {
      const current = prev[productId] || 1;
      let newVal = current + delta;
      if (newVal < 1) newVal = 1;
      if (newVal > 20) newVal = 20;
      return { ...prev, [productId]: newVal };
    });
  };

  const handleSizeChange = (productId, size) => {
    setSelectedSizes(prev => ({ ...prev, [productId]: size }));
  };

  const handleAddToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    const size = selectedSizes[product._id] || (product.sizes?.[0]?.size || 'M');
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0],
      size: size,
      quantity: quantity,
    }));
    alert('Ajouté au panier !');
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notre collection</h1>
        <p className={styles.subtitle}>Des vêtements qui vous ressemblent</p>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
            className={styles.select}
          >
            {GENDERS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
          </select>
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className={styles.select}
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={styles.select}
        >
          <option value="newest">Nouveautés</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Chargement...</div>
      ) : products.length === 0 ? (
        <div className={styles.empty}>Aucun produit trouvé.</div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <div key={product._id} className={styles.card}>
              <Link href={`/product/${product._id}`} className={styles.cardLink}>
                <div className={styles.imageWrapper}>
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300x400?text=MinoStore'}
                    alt={product.name}
                    className={styles.image}
                  />
                  {product.discountPrice && (
                    <span className={styles.discountBadge}>
                      -{Math.round((1 - product.discountPrice / product.price) * 100)}%
                    </span>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.priceContainer}>
                    {product.discountPrice ? (
                      <>
                        <span className={styles.originalPrice}>{product.price} TND</span>
                        <span className={styles.discountPrice}>{product.discountPrice} TND</span>
                      </>
                    ) : (
                      <span className={styles.price}>{product.price} TND</span>
                    )}
                  </div>
                </div>
              </Link>
              <div className={styles.cardActions}>
                <select
                  value={selectedSizes[product._id] || product.sizes?.[0]?.size || 'M'}
                  onChange={(e) => handleSizeChange(product._id, e.target.value)}
                  className={styles.sizeSelect}
                >
                  {product.sizes?.map(s => <option key={s.size} value={s.size}>{s.size}</option>)}
                </select>
                <div className={styles.quantityControl}>
                  <button onClick={() => handleQuantityChange(product._id, -1)} disabled={(quantities[product._id] || 1) <= 1}>-</button>
                  <span>{quantities[product._id] || 1}</span>
                  <button onClick={() => handleQuantityChange(product._id, 1)} disabled={(quantities[product._id] || 1) >= 20}>+</button>
                </div>
                <button onClick={() => handleAddToCart(product)} className={styles.cartBtn}>
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
