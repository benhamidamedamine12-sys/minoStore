'use client';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const router = useRouter();
  const [stats, setStats] = useState({ users: 0, products: 0, orders: 0 });
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    gender: '',
    sizes: [{ size: '', stock: 0 }],
    images: [''],
    colors: [''],
    tags: ['']
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchStats();
    fetchUsers();
    fetchProducts();
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const [usersRes, productsRes] = await Promise.all([
        axios.get('http://localhost:5501/api/users', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
        axios.get('http://localhost:5501/api/products', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }),
      ]);
      setStats({
        users: usersRes.data.users?.length || 0,
        products: productsRes.data.total || 0,
        orders: 0,
      });
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5501/api/users', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Erreur users:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5501/api/products', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Erreur produits:', error);
    }
  };

const handleDeleteUser = async (userId, userRole) => {
  if (userRole === 'admin') {
    alert('Impossible de supprimer un administrateur');
    return;
  }
  if (!confirm('Supprimer cet utilisateur ?')) return;
  try {
    await axios.delete(`http://localhost:5501/api/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    fetchUsers();
    fetchStats();
  } catch (error) {
    alert('Erreur lors de la suppression');
  }
};

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Supprimer ce produit ?')) return;
    try {
      await axios.delete(`http://localhost:5501/api/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      fetchProducts();
      fetchStats();
    } catch (error) {
      alert('Erreur lors de la suppression du produit');
    }
  };

  // Gestion du formulaire produit
  const handleProductChange = (e, index, field, subField, sizeIndex) => {
    const { name, value } = e.target;
    if (field === 'sizes') {
      const newSizes = [...productForm.sizes];
      newSizes[sizeIndex][subField] = value;
      setProductForm({ ...productForm, sizes: newSizes });
    } else if (field === 'images') {
      const newImages = [...productForm.images];
      newImages[index] = value;
      setProductForm({ ...productForm, images: newImages });
    } else if (field === 'colors') {
      const newColors = [...productForm.colors];
      newColors[index] = value;
      setProductForm({ ...productForm, colors: newColors });
    } else if (field === 'tags') {
      const newTags = [...productForm.tags];
      newTags[index] = value;
      setProductForm({ ...productForm, tags: newTags });
    } else {
      setProductForm({ ...productForm, [name]: value });
    }
  };

  const addSizeField = () => {
    setProductForm({ ...productForm, sizes: [...productForm.sizes, { size: '', stock: 0 }] });
  };

  const removeSizeField = (index) => {
    const newSizes = productForm.sizes.filter((_, i) => i !== index);
    setProductForm({ ...productForm, sizes: newSizes });
  };

  const addArrayField = (field) => {
    if (field === 'images') setProductForm({ ...productForm, images: [...productForm.images, ''] });
    if (field === 'colors') setProductForm({ ...productForm, colors: [...productForm.colors, ''] });
    if (field === 'tags') setProductForm({ ...productForm, tags: [...productForm.tags, ''] });
  };

  const removeArrayField = (field, index) => {
    if (field === 'images') {
      const newImages = productForm.images.filter((_, i) => i !== index);
      setProductForm({ ...productForm, images: newImages });
    }
    if (field === 'colors') {
      const newColors = productForm.colors.filter((_, i) => i !== index);
      setProductForm({ ...productForm, colors: newColors });
    }
    if (field === 'tags') {
      const newTags = productForm.tags.filter((_, i) => i !== index);
      setProductForm({ ...productForm, tags: newTags });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Nettoyer les tableaux vides
      const cleanForm = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : undefined,
        sizes: productForm.sizes.filter(s => s.size && s.stock !== undefined),
        images: productForm.images.filter(url => url.trim() !== ''),
        colors: productForm.colors.filter(c => c.trim() !== ''),
        tags: productForm.tags.filter(t => t.trim() !== '')
      };
      await axios.post('http://localhost:5501/api/products', cleanForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert('Produit créé avec succès');
      setShowProductModal(false);
      resetProductForm();
      fetchProducts();
      fetchStats();
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la création du produit');
    } finally {
      setLoading(false);
    }
  };

  const resetProductForm = () => {
    setProductForm({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      gender: '',
      sizes: [{ size: '', stock: 0 }],
      images: [''],
      colors: [''],
      tags: ['']
    });
  };

  if (!isAuthenticated || user?.role !== 'admin') return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {user?.name}</p>
      </div>

      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`} onClick={() => setActiveTab('overview')}>Vue d'ensemble</button>
        <button className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`} onClick={() => setActiveTab('users')}>Utilisateurs</button>
        <button className={`${styles.tab} ${activeTab === 'products' ? styles.active : ''}`} onClick={() => setActiveTab('products')}>Produits</button>
      </div>

      {activeTab === 'overview' && (
        <div className={styles.statsGrid}>
          <div className={styles.statCard}><span className={styles.statIcon}>👥</span><div className={styles.statValue}>{stats.users}</div><div className={styles.statLabel}>Utilisateurs</div></div>
          <div className={styles.statCard}><span className={styles.statIcon}>📦</span><div className={styles.statValue}>{stats.products}</div><div className={styles.statLabel}>Produits</div></div>
          <div className={styles.statCard}><span className={styles.statIcon}>🛒</span><div className={styles.statValue}>{stats.orders}</div><div className={styles.statLabel}>Commandes</div></div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead><tr><th>Nom</th><th>Email</th><th>Rôle</th><th>Statut</th><th>Dernière connexion</th><th>Actions</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.name} {u.lastName}</td>
                  <td>{u.email}</td>
                  <td><span className={`${styles.roleBadge} ${u.role === 'admin' ? styles.admin : ''}`}>{u.role}</span></td>
                  <td><span className={`${styles.statusBadge} ${u.isActive ? styles.active : styles.inactive}`}>{u.isActive ? 'Actif' : 'Inactif'}</span></td>
                  <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Jamais'}</td>
                  {u.role !== 'admin' && (
                    <td><button className={styles.actionBtn} onClick={() => handleDeleteUser(u._id, u.role)}>🗑️</button></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <div className={styles.productHeader}>
            <button className={styles.addProductBtn} onClick={() => setShowProductModal(true)}>➕ Ajouter un produit</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead><tr><th>Nom</th><th>Prix</th><th>Catégorie</th><th>Genre</th><th>Actions</th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p._id}>
                    <td>{p.name}</td>
                    <td>{p.discountPrice ? `${p.discountPrice} TND` : `${p.price} TND`}</td>
                    <td>{p.category}</td>
                    <td>{p.gender}</td>
                    <td><button className={styles.actionBtn} onClick={() => handleDeleteProduct(p._id)}>🗑️</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal d'ajout de produit */}
      {showProductModal && (
        <div className={styles.modalOverlay} onClick={() => setShowProductModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2>Créer un produit</h2>
            <form onSubmit={handleCreateProduct} className={styles.productForm}>
              <div className={styles.formGroup}><label>Nom *</label><input type="text" name="name" value={productForm.name} onChange={handleProductChange} required /></div>
              <div className={styles.formGroup}><label>Description *</label><textarea name="description" value={productForm.description} onChange={handleProductChange} required /></div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label>Prix (TND) *</label><input type="number" name="price" value={productForm.price} onChange={handleProductChange} required /></div>
                <div className={styles.formGroup}><label>Prix promo (TND)</label><input type="number" name="discountPrice" value={productForm.discountPrice} onChange={handleProductChange} /></div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label>Catégorie *</label>
                  <select name="category" value={productForm.category} onChange={handleProductChange} required>
                    <option value="">Sélectionner</option>
                    <option value="t-shirt">T-shirt</option><option value="chemise">Chemise</option><option value="pantalon">Pantalon</option>
                    <option value="jean">Jean</option><option value="veste">Veste</option><option value="manteau">Manteau</option>
                    <option value="pull">Pull</option><option value="sweat">Sweat</option><option value="chaussures">Chaussures</option>
                    <option value="accessoires">Accessoires</option>
                  </select>
                </div>
                <div className={styles.formGroup}><label>Genre *</label>
                  <select name="gender" value={productForm.gender} onChange={handleProductChange} required>
                    <option value="">Sélectionner</option><option value="homme">Homme</option><option value="femme">Femme</option><option value="unisexe">Unisexe</option>
                  </select>
                </div>
              </div>

              {/* Tailles */}
              <div className={styles.formGroup}>
                <label>Tailles et stocks</label>
                {productForm.sizes.map((sizeItem, idx) => (
                  <div key={idx} className={styles.sizeRow}>
                    <input type="text" placeholder="Taille (ex: S, M, L, 38)" value={sizeItem.size} onChange={(e) => handleProductChange(e, null, 'sizes', 'size', idx)} />
                    <input type="number" placeholder="Stock" value={sizeItem.stock} onChange={(e) => handleProductChange(e, null, 'sizes', 'stock', idx)} />
                    <button type="button" onClick={() => removeSizeField(idx)}>❌</button>
                  </div>
                ))}
                <button type="button" onClick={addSizeField} className={styles.addBtn}>+ Ajouter une taille</button>
              </div>

              {/* Images */}
              <div className={styles.formGroup}>
                <label>Images (URLs)</label>
                {productForm.images.map((url, idx) => (
                  <div key={idx} className={styles.arrayRow}>
                    <input type="url" value={url} onChange={(e) => handleProductChange(e, idx, 'images')} placeholder="URL de l'image" />
                    <button type="button" onClick={() => removeArrayField('images', idx)}>❌</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('images')} className={styles.addBtn}>+ Ajouter une image</button>
              </div>

              {/* Couleurs */}
              <div className={styles.formGroup}>
                <label>Couleurs</label>
                {productForm.colors.map((color, idx) => (
                  <div key={idx} className={styles.arrayRow}>
                    <input type="text" value={color} onChange={(e) => handleProductChange(e, idx, 'colors')} placeholder="Couleur" />
                    <button type="button" onClick={() => removeArrayField('colors', idx)}>❌</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('colors')} className={styles.addBtn}>+ Ajouter une couleur</button>
              </div>

              {/* Tags */}
              <div className={styles.formGroup}>
                <label>Tags</label>
                {productForm.tags.map((tag, idx) => (
                  <div key={idx} className={styles.arrayRow}>
                    <input type="text" value={tag} onChange={(e) => handleProductChange(e, idx, 'tags')} placeholder="Tag (ex: promotion)" />
                    <button type="button" onClick={() => removeArrayField('tags', idx)}>❌</button>
                  </div>
                ))}
                <button type="button" onClick={() => addArrayField('tags')} className={styles.addBtn}>+ Ajouter un tag</button>
              </div>

              <div className={styles.modalActions}>
                <button type="submit" disabled={loading} className={styles.submitBtn}>{loading ? 'Création...' : 'Créer le produit'}</button>
                <button type="button" onClick={() => setShowProductModal(false)} className={styles.cancelBtn}>Annuler</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}