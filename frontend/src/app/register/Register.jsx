'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import styles from './Register.module.css';

const UserIcon = () => <span>👤</span>;
const EmailIcon = () => <span>✉️</span>;
const LockIcon = () => <span>🔒</span>;
const PhoneIcon = () => <span>📱</span>;
const CalendarIcon = () => <span>📅</span>;
const HomeIcon = () => <span>🏠</span>;
const CityIcon = () => <span>🏙️</span>;
const PostalIcon = () => <span>📮</span>;
const GlobeIcon = () => <span>🌍</span>;
const EyeIcon = ({ visible, onClick }) => (
  <span className={styles.eyeIcon} onClick={onClick}>
    {visible ? '👁️' : '👁️‍🗨️'}
  </span>
);

const TUNISIAN_GOVERNORATES = [
  "Tunis", "Ariana", "Ben Arous", "Manouba", "Nabeul", "Zaghouan",
  "Bizerte", "Béja", "Jendouba", "Le Kef", "Siliana", "Kairouan",
  "Kasserine", "Sidi Bouzid", "Sousse", "Monastir", "Mahdia",
  "Sfax", "Gabès", "Médenine", "Tataouine", "Gafsa", "Tozeur", "Kébili"
];

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: { street: '', city: '', postalCode: '', governorate: '', country: 'Tunisie' },
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPasswordError('');
    if (formData.password !== confirmPassword) {
      setPasswordError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }
    const { street, city, postalCode, governorate, country } = formData.address;
    if (!street || !city || !postalCode || !governorate || !country) {
      setError('Veuillez remplir tous les champs de l\'adresse');
      setLoading(false);
      return;
    }
    try {
      await axios.post('http://localhost:5501/api/auth/register', formData, { withCredentials: true });
      router.push('/login?registered=true');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>MinoStore</div>
          <h1 className={styles.brandTitle}>Rejoignez l'aventure</h1>
          <p className={styles.brandDescription}>Créez votre compte et profitez d'une expérience shopping unique avec des offres exclusives.</p>
          <ul className={styles.brandFeatures}>
            <li><span className={styles.checkIcon}>✓</span>Paiement 100% sécurisé</li>
            <li><span className={styles.checkIcon}>✓</span>Livraison rapide partout en Tunisie</li>
            <li><span className={styles.checkIcon}>✓</span>Service client dédié 24/7</li>
          </ul>
        </div>
      </div>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Créer un compte</h2>
            <p className={styles.formSubtitle}>Remplissez vos informations</p>
          </div>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><UserIcon /></span>
                <input type="text" name="name" placeholder="Prénom" value={formData.name} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><UserIcon /></span>
                <input type="text" name="lastName" placeholder="Nom" value={formData.lastName} onChange={handleChange} required />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><EmailIcon /></span>
              <input type="email" name="email" placeholder="Adresse email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><LockIcon /></span>
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required minLength={8} />
                <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><LockIcon /></span>
                <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirmer" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={8} />
                <EyeIcon visible={showConfirmPassword} onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
              </div>
            </div>
            {passwordError && <span className={styles.fieldError}>{passwordError}</span>}
            <small className={styles.hint}>Au moins 8 caractères, une lettre et un chiffre</small>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><PhoneIcon /></span>
                <input type="tel" name="phone" placeholder="Téléphone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><CalendarIcon /></span>
                <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}>👥</span>
              <select name="gender" value={formData.gender} onChange={handleChange} className={styles.selectInput}>
                <option value="">Sélectionner un genre (optionnel)</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </select>
            </div>
            <fieldset className={styles.addressSection}>
              <legend>📍 Adresse de livraison</legend>
              <div className={styles.inputGroup}>
                <span className={styles.inputIcon}><HomeIcon /></span>
                <input type="text" name="address.street" placeholder="Rue" value={formData.address.street} onChange={handleChange} required />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}><CityIcon /></span>
                  <input type="text" name="address.city" placeholder="Ville" value={formData.address.city} onChange={handleChange} required />
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}><PostalIcon /></span>
                  <input type="text" name="address.postalCode" placeholder="Code postal" value={formData.address.postalCode} onChange={handleChange} required />
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <select name="address.governorate" value={formData.address.governorate} onChange={handleChange} required>
                    <option value="">Gouvernorat</option>
                    {TUNISIAN_GOVERNORATES.map((gov) => <option key={gov} value={gov}>{gov}</option>)}
                  </select>
                </div>
                <div className={styles.inputGroup}>
                  <span className={styles.inputIcon}><GlobeIcon /></span>
                  <input type="text" name="address.country" placeholder="Pays" value={formData.address.country} onChange={handleChange} required />
                </div>
              </div>
            </fieldset>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (<><span className={styles.loader}></span> Inscription...</>) : 'S\'inscrire'}
            </button>
          </form>
          <div className={styles.separator}><span>ou</span></div>
          <button type="button" className={styles.googleBtn} onClick={() => window.location.href = 'http://localhost:5501/api/auth/google'}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            S'inscrire avec Google
          </button>
          <p className={styles.loginLink}>Déjà un compte ? <Link href="/login">Se connecter</Link></p>
        </div>
      </div>
    </div>
  );
}
