'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import styles from './ResetPassword.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5501';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_URL}/api/auth/reset-password/${token}`, { password });
      setMessage('Mot de passe reinitialise');
      setTimeout(() => router.push('/login'), 1200);
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Lien invalide ou expire');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Nouveau mot de passe</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          <label htmlFor="confirmPassword">Confirmer</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Enregistrement...' : 'Reinitialiser'}
          </button>
        </form>
        <Link href="/login" className={styles.backLink}>
          Retour a la connexion
        </Link>
      </div>
    </div>
  );
}
