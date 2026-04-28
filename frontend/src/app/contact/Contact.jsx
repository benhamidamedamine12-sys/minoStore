'use client';
import { useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Message envoyé:', formData);
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Contactez-nous</h1>
        <p className={styles.subtitle}>Une question ? Nous sommes là pour vous aider.</p>
      </div>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <h2>Nos coordonnées</h2>
          <div className={styles.infoItem}>
            <span>📍</span>
            <p>Tunis, Tunisie</p>
          </div>
          <div className={styles.infoItem}>
            <span>📧</span>
            <p>contact@minostore.com</p>
          </div>
          <div className={styles.infoItem}>
            <span>📱</span>
            <p>+216 12 345 678</p>
          </div>
          <div className={styles.infoItem}>
            <span>🕒</span>
            <p>Lun - Sam : 9h - 18h</p>
          </div>
        </div>

        <div className={styles.formCard}>
          {submitted ? (
            <div className={styles.successMessage}>
              <span>✅</span>
              <h3>Message envoyé !</h3>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.field}>
                <label>Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Message</label>
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                ></textarea>
              </div>
              <button type="submit" className={styles.submitBtn}>Envoyer le message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}