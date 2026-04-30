'use client';
import Link from 'next/link';
import styles from './Error.module.css';

export default function ErrorPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page introuvable</h2>
        <p className={styles.message}>La page que vous recherchez n&apos;existe pas ou a été déplacée.</p>
        <Link href="/" className={styles.homeLink}>Retour à l&apos;accueil</Link>
      </div>
    </div>
  );
}
