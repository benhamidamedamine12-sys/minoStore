'use client';

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import styles from './ForgotPassword.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5501';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      setMessage(response.data.success?.[0]?.msg || 'Email envoye');
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.msg || 'Impossible d envoyer l email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Mot de passe oublie</h1>
        <p>Entrez votre email pour recevoir un lien de reinitialisation.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {message && <div className={styles.success}>{message}</div>}
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>
        <Link href="/login" className={styles.backLink}>
          Retour a la connexion
        </Link>
      </div>
    </div>
  );
}
