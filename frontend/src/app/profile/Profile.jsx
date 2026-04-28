'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { logout, loginSuccess } from '@/redux/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './Profile.module.css';

const DEFAULT_AVATAR = '/assets/picture.png';

export default function Profile() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user, isAuthenticated, token } = useSelector((state) => state.auth);
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const [formData, setFormData] = useState({
    name: '', lastName: '', email: '', phone: '', birthDate: '', gender: ''
  });
  const [addressForm, setAddressForm] = useState({
    street: '', city: '', postalCode: '', governorate: '', country: 'Tunisie', isDefault: false
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Avatar à afficher
  const userAvatar = avatarPreview || user?.image ||
    (user?.gender === 'female' ? '/assets/FemmeProfileImageDefault.png' :
     user?.gender === 'male' ? '/assets/HommeProfileImageDefault.png' :
     DEFAULT_AVATAR);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        birthDate: user.birthDate ? user.birthDate.split('T')[0] : '',
        gender: user.gender || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [isAuthenticated, activeTab]);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get('http://localhost:5501/api/users/addresses', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error('Erreur chargement adresses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e) => {
    const { name, value } = e.target;
    setAddressForm(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
    setPasswordSuccess('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
const handleProfileUpdate = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    const data = new FormData();
    data.append('name', formData.name);
    data.append('lastName', formData.lastName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('birthDate', formData.birthDate);
    data.append('gender', formData.gender);
    if (avatarFile) {
      data.append('image', avatarFile);
    }

    // Récupère le token depuis le state Redux (ou localStorage)
    const currentToken = token || localStorage.getItem('token');

    const response = await axios.put('http://localhost:5501/api/users/profile', data, {
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        // NE PAS METTRE 'Content-Type' ici
      },
      withCredentials: false, // ← désactive le cookie
    });

    if (response.data.user) {
      dispatch(loginSuccess({
        user: response.data.user,
        token: currentToken,
      }));
    }

    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setSuccessMessage('Profil mis à jour avec succès !');
    setTimeout(() => setSuccessMessage(''), 3000);
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    alert('Erreur: ' + (error.response?.data?.errors?.[0]?.msg || error.message));
  } finally {
    setLoading(false);
  }
};
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Le nouveau mot de passe doit avoir au moins 6 caractères');
      return;
    }

    try {
      await axios.put('http://localhost:5501/api/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setPasswordSuccess('Mot de passe modifié avec succès !');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      setPasswordError(error.response?.data?.errors?.[0]?.msg || 'Erreur lors du changement de mot de passe');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5501/api/users/addresses', addressForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAddressForm({ street: '', city: '', postalCode: '', governorate: '', country: 'Tunisie', isDefault: false });
      setShowAddressForm(false);
      setSuccessMessage('Adresse ajoutée avec succès !');
      fetchAddresses();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.errors?.[0]?.msg || error.message));
    }
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5501/api/users/addresses/${editingAddress._id}`, addressForm, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setAddressForm({ street: '', city: '', postalCode: '', governorate: '', country: 'Tunisie', isDefault: false });
      setEditingAddress(null);
      setSuccessMessage('Adresse modifiée avec succès !');
      fetchAddresses();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Erreur: ' + (error.response?.data?.errors?.[0]?.msg || error.message));
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) return;
    try {
      await axios.delete(`http://localhost:5501/api/users/addresses/${addressId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSuccessMessage('Adresse supprimée avec succès !');
      fetchAddresses();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      const addressToUpdate = addresses.find(a => a._id === addressId);
      await axios.put(`http://localhost:5501/api/users/addresses/${addressId}`, {
        ...addressToUpdate,
        isDefault: true
      }, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setSuccessMessage('Adresse par défaut mise à jour !');
      fetchAddresses();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      alert('Erreur lors de la mise à jour');
    }
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setAddressForm(address);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5501/api/auth/logout', {}, { withCredentials: true });
    } catch (error) {
      console.error('Erreur logout:', error);
    }
    dispatch(logout());
    router.push('/');
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.notLogged}>
          <h2>Accès restreint</h2>
          <p>Veuillez vous connecter pour accéder à votre profil.</p>
          <button onClick={() => router.push('/login')} className={styles.loginBtn}>Se connecter</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        {/* SIDEBAR */}
        <div className={styles.sidebar}>
          <div className={styles.avatarWrapper}>
            <img src={userAvatar} alt="Avatar" className={styles.avatar} />
            {isEditing && (
              <button className={styles.changeAvatarBtn} onClick={() => fileInputRef.current?.click()}>
                📷 Modifier
              </button>
            )}
            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleAvatarChange} style={{ display: 'none' }} />
          </div>
          <h2 className={styles.sidebarName}>{user?.name} {user?.lastName}</h2>
          <p className={styles.sidebarEmail}>{user?.email}</p>
          <span className={styles.roleBadge}>{user?.role === 'admin' ? '👨‍💼 Administrateur' : '👤 Client'}</span>
          <button onClick={handleLogout} className={styles.logoutBtn}>Déconnexion</button>
        </div>

        {/* MAIN CONTENT */}
        <div className={styles.mainContent}>
          <div className={styles.tabs}>
            <button className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`} onClick={() => { setActiveTab('info'); setIsEditing(false); }}>Informations</button>
            <button className={`${styles.tab} ${activeTab === 'addresses' ? styles.active : ''}`} onClick={() => setActiveTab('addresses')}>Adresses</button>
            <button className={`${styles.tab} ${activeTab === 'security' ? styles.active : ''}`} onClick={() => setActiveTab('security')}>Sécurité</button>
            <button className={`${styles.tab} ${activeTab === 'orders' ? styles.active : ''}`} onClick={() => setActiveTab('orders')}>Commandes</button>
          </div>

          <div className={styles.tabContent}>
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}

            {/* TAB: INFORMATIONS */}
            {activeTab === 'info' && (
              <div className={styles.tabPane}>
                <h3>Mes informations personnelles</h3>
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label>Prénom</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Nom</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Téléphone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Date de naissance</label>
                      <input type="date" name="birthDate" value={formData.birthDate} onChange={handleInputChange} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Genre</label>
                      <select name="gender" value={formData.gender} onChange={handleInputChange} className={styles.select}>
                        <option value="">Sélectionner un genre</option>
                        <option value="male">Homme</option>
                        <option value="female">Femme</option>
                      </select>
                    </div>
                    <div className={styles.buttonGroup}>
                      <button type="submit" className={styles.submitBtn} disabled={loading}>
                        {loading ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                      <button type="button" onClick={() => { setIsEditing(false); setAvatarPreview(null); }} className={styles.cancelBtn}>
                        Annuler
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className={styles.infoDisplay}>
                    <div className={styles.infoRow}>
                      <span>Prénom:</span>
                      <strong>{user?.name}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Nom:</span>
                      <strong>{user?.lastName}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Email:</span>
                      <strong>{user?.email}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Téléphone:</span>
                      <strong>{user?.phone || 'Non renseigné'}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Date de naissance:</span>
                      <strong>{user?.birthDate ? new Date(user.birthDate).toLocaleDateString('fr-FR') : 'Non renseignée'}</strong>
                    </div>
                    <div className={styles.infoRow}>
                      <span>Genre:</span>
                      <strong>
                        {user?.gender === 'female' ? 'Femme' : user?.gender === 'male' ? 'Homme' : 'Non renseigné'}
                      </strong>
                    </div>
                    <button onClick={() => setIsEditing(true)} className={styles.editBtn}>✏️ Modifier</button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADRESSES */}
            {activeTab === 'addresses' && (
              <div className={styles.tabPane}>
                <h3>Mes adresses</h3>
                {!showAddressForm && !editingAddress && (
                  <button onClick={() => setShowAddressForm(true)} className={styles.addBtn}>➕ Ajouter une adresse</button>
                )}

                {(showAddressForm || editingAddress) && (
                  <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label>Rue</label>
                      <input type="text" name="street" value={addressForm.street} onChange={handleAddressInputChange} required />
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Ville</label>
                        <input type="text" name="city" value={addressForm.city} onChange={handleAddressInputChange} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Code Postal</label>
                        <input type="text" name="postalCode" value={addressForm.postalCode} onChange={handleAddressInputChange} required />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Gouvernorat</label>
                        <input type="text" name="governorate" value={addressForm.governorate} onChange={handleAddressInputChange} required />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Pays</label>
                        <input type="text" name="country" value={addressForm.country} onChange={handleAddressInputChange} required />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>
                        <input type="checkbox" name="isDefault" checked={addressForm.isDefault} onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))} />
                        Adresse par défaut
                      </label>
                    </div>
                    <div className={styles.buttonGroup}>
                      <button type="submit" className={styles.submitBtn}>
                        {editingAddress ? 'Modifier' : 'Ajouter'}
                      </button>
                      <button type="button" onClick={() => { setShowAddressForm(false); setEditingAddress(null); setAddressForm({ street: '', city: '', postalCode: '', governorate: '', country: 'Tunisie', isDefault: false }); }} className={styles.cancelBtn}>
                        Annuler
                      </button>
                    </div>
                  </form>
                )}

                <div className={styles.addressesList}>
                  {addresses.length === 0 ? (
                    <p className={styles.emptyMessage}>Aucune adresse enregistrée</p>
                  ) : (
                    addresses.map(address => (
                      <div key={address._id} className={`${styles.addressCard} ${address.isDefault ? styles.defaultAddress : ''}`}>
                        <div className={styles.addressContent}>
                          {address.isDefault && <span className={styles.defaultBadge}>Par défaut</span>}
                          <p><strong>{address.street}</strong></p>
                          <p>{address.postalCode} {address.city}, {address.governorate}</p>
                          <p>{address.country}</p>
                        </div>
                        <div className={styles.addressActions}>
                          {!address.isDefault && <button onClick={() => handleSetDefault(address._id)} className={styles.setDefaultBtn}>★ Par défaut</button>}
                          <button onClick={() => handleEditAddress(address)} className={styles.editBtn}>✏️ Modifier</button>
                          <button onClick={() => handleDeleteAddress(address._id)} className={styles.deleteBtn}>🗑️ Supprimer</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: SÉCURITÉ */}
            {activeTab === 'security' && (
              <div className={styles.tabPane}>
                <h3>Changer mon mot de passe</h3>
                <form onSubmit={handlePasswordChange} className={styles.form}>
                  {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
                  {passwordSuccess && <div className={styles.successMessage}>{passwordSuccess}</div>}
                  
                  <div className={styles.formGroup}>
                    <label>Mot de passe actuel</label>
                    <input type="password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordInputChange} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Nouveau mot de passe</label>
                    <input type="password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordInputChange} required />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Confirmer le mot de passe</label>
                    <input type="password" name="confirmPassword" value={passwordForm.confirmPassword} onChange={handlePasswordInputChange} required />
                  </div>
                  <button type="submit" className={styles.submitBtn}>Modifier le mot de passe</button>
                </form>
              </div>
            )}

            {/* TAB: COMMANDES */}
            {activeTab === 'orders' && (
              <div className={styles.tabPane}>
                <h3>Mes commandes</h3>
                <p className={styles.emptyMessage}>Aucune commande pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}