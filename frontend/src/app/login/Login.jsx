'use client';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '@/redux/features/auth/authSlice';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5501';

const EmailIcon = () => <span>✉️</span>;
const LockIcon = () => <span>🔒</span>;
const EyeIcon = ({ visible, onClick }) => (
  <span className={styles.eyeIcon} onClick={onClick}>
    {visible ? '👁️' : '👁️‍🗨️'}
  </span>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get('registered');
  const verified = searchParams.get('verified');
  const redirectTo = searchParams.get('redirect') || '/';
  const safeRedirectTo = redirectTo.startsWith('/') ? redirectTo : '/';


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(loginSuccess({ user: response.data.user }));
      router.push(safeRedirectTo);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formSection}>
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h2 className={styles.formTitle}>Connexion</h2>
            <p className={styles.formSubtitle}>Heureux de vous revoir</p>
          </div>
          {registered && (
            <div className={styles.success}>
              <span>✅</span> Compte créé avec succès ! Connectez-vous.
            </div>
          )}
          {verified === 'true' && (
            <div className={styles.success}>
              <span>OK</span> Email verifie avec succes.
            </div>
          )}
          {verified === 'invalid' && (
            <div className={styles.error}>
              Lien de verification invalide ou expire.
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><EmailIcon /></span>
              <input type="email" placeholder="Adresse email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className={styles.inputGroup}>
              <span className={styles.inputIcon}><LockIcon /></span>
              <input type={showPassword ? 'text' : 'password'} placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <EyeIcon visible={showPassword} onClick={() => setShowPassword(!showPassword)} />
            </div>
            {error && <div className={styles.error}>{error}</div>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? (<><span className={styles.loader}></span> Connexion...</>) : 'Se connecter'}
            </button>
          </form>
          <div className={styles.separator}><span>ou</span></div>
          <button type="button" className={styles.googleBtn} onClick={() => window.location.href = `${API_URL}/api/auth/google`}>
            <svg width="20" height="20" viewBox="0 0 24 24" style={{ marginRight: '10px' }}>
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continuer avec Google
          </button>
          <div className={styles.footerLinks}>
            <Link href="/forgot-password" className={styles.forgotLink}>Mot de passe oublié ?</Link>
            <p className={styles.registerLink}>Pas encore de compte ? <Link href="/register">S&apos;inscrire</Link></p>
          </div>
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>MinoStore</div>
          <h1 className={styles.brandTitle}>Votre style, notre passion</h1>
          <p className={styles.brandDescription}>
            Connectez-vous pour accéder à votre espace personnel et découvrir nos dernières collections.
          </p>
          <ul className={styles.brandFeatures}>
            <li><span className={styles.checkIcon}>✓</span>Suivi de commandes en temps réel</li>
            <li><span className={styles.checkIcon}>✓</span>Offres exclusives membres</li>
            <li><span className={styles.checkIcon}>✓</span>Paiement sécurisé</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
