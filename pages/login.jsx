'use client';
import React from 'react';
import styles from '@/styles/Home.module.css';
import { useRouter } from 'next/navigation';

export default function LoginSelection() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className={styles.logoContainer}>
          <div className={styles.logoText}>
            <div className={styles.logo}>
              HCLTech
              <span className={styles.divider}>|</span>
              <div className={styles.taglineContainer}>
                <div className={styles.taglineTop}>Supercharging</div>
                <div className={styles.taglineBottom}>Progress™</div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.selectionBox}>
          <h2 className={styles.selectionTitle}>Select Login Type</h2>
          <div className={styles.buttonGroup}>
            {/* Button to navigate to user login form */}
            <button 
              className={styles.selectionButton}
              onClick={() => router.push('/loginForm?type=user')}
            >
              User Login
            </button>
            {/* Button to navigate to admin login form */}
            <button 
              className={styles.selectionButton}
              onClick={() => router.push('/loginForm?type=admin')}
            >
              Admin Login
            </button>
          </div>
        </div>
      </main>
      <div className={styles.overlay} />
    </div>
  );
}