'use client';
import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>À propos de MinoStore</h1>
        <p className={styles.subtitle}>Votre destination mode depuis 2024</p>
      </div>

      <div className={styles.content}>
        <div className={styles.section}>
          <h2>Notre histoire</h2>
          <p>MinoStore est né d&apos;une passion pour la mode et le style. Nous croyons que chaque personne mérite de se sentir bien dans ses vêtements, sans compromis sur la qualité ou le prix.</p>
        </div>

        <div className={styles.section}>
          <h2>Notre mission</h2>
          <p>Offrir une expérience shopping unique, avec des collections soigneusement sélectionnées pour homme et femme, et un service client exceptionnel.</p>
        </div>

        <div className={styles.values}>
          <div className={styles.valueCard}>
            <span className={styles.icon}>✨</span>
            <h3>Qualité</h3>
            <p>Des matériaux premium et des finitions soignées</p>
          </div>
          <div className={styles.valueCard}>
            <span className={styles.icon}>🚚</span>
            <h3>Livraison rapide</h3>
            <p>Partout en Tunisie sous 48h</p>
          </div>
          <div className={styles.valueCard}>
            <span className={styles.icon}>💬</span>
            <h3>Support 24/7</h3>
            <p>Une équipe à votre écoute</p>
          </div>
        </div>
      </div>
    </div>
  );
}
