'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { addToCart } from '@/redux/features/cart/cartSlice';
import styles from './ProductDetail.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5501';

export default function ProductDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(res.data.product);
        if (res.data.product.sizes?.length) {
          setSelectedSize(res.data.product.sizes[0].size);
        }
      } catch (error) {
        console.error('Erreur chargement produit', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta) => {
    let newVal = quantity + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > 20) newVal = 20;
    setQuantity(newVal);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Veuillez choisir une taille');
      return;
    }
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.discountPrice || product.price,
      image: product.images?.[0],
      size: selectedSize,
      quantity: quantity,
    }));
    alert('Ajouté au panier !');
  };

  if (loading) return <div className={styles.loading}>Chargement...</div>;
  if (!product) return <div className={styles.error}>Produit non trouvé</div>;

  const finalPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  return (
    <div className={styles.container}>
      <div className={styles.productLayout}>
        {/* Galerie */}
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <Image
              src={product.images?.[activeImage] || 'https://via.placeholder.com/600x800?text=MinoStore'}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          {product.images?.length > 1 && (
            <div className={styles.thumbnails}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`${styles.thumbnail} ${idx === activeImage ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImage(idx)}
                >
                  <Image
                    src={img}
                    alt={`${product.name} vue ${idx + 1}`}
                    fill
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Infos */}
        <div className={styles.details}>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.prices}>
            {originalPrice && <span className={styles.oldPrice}>{originalPrice} TND</span>}
            <span className={styles.currentPrice}>{finalPrice} TND</span>
          </div>
          <div className={styles.description}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.sizes?.length > 0 && (
            <div className={styles.sizeSelector}>
              <label>Taille :</label>
              <div className={styles.sizeOptions}>
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    className={`${styles.sizeBtn} ${selectedSize === s.size ? styles.activeSize : ''}`}
                    onClick={() => setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                  >
                    {s.size} {s.stock === 0 && '(Rupture)'}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.quantitySelector}>
            <label>Quantité :</label>
            <div className={styles.quantityControl}>
              <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>-</button>
              <span>{quantity}</span>
              <button onClick={() => handleQuantityChange(1)} disabled={quantity >= 20}>+</button>
            </div>
          </div>

          <button onClick={handleAddToCart} className={styles.addToCartBtn}>
            Ajouter au panier
          </button>

          <div className={styles.meta}>
            <p>Catégorie : {product.category}</p>
            <p>Genre : {product.gender === 'homme' ? 'Homme' : product.gender === 'femme' ? 'Femme' : 'Unisexe'}</p>
            {product.tags?.length > 0 && <p>Tags : {product.tags.join(', ')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
