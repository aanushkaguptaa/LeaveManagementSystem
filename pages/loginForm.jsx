'use client';
import React, { useState } from 'react';
import styles from '@/styles/Home.module.css';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type'); // Determine login type (user/admin)
  const { setUser } = useAuth();
  
  const [formData, setFormData] = useState({
    sapId: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validate SAP ID format
  const validateSapId = (sapId) => {
    return /^\d{8}$/.test(sapId);
  };

  // Check if form is valid
  const isFormValid = () => {
    if (!validateSapId(formData.sapId)) {
      return false;
    }
    if (type === 'admin') {
      return formData.password.trim() !== '';
    }
    return true;
  };

  // Handle input changes and validate SAP ID
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === 'sapId' && !/^\d{0,8}$/.test(value)) {
      return;
    }
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    
    setIsLoading(true);
    setError('');

    try {
      // Send login request to the server
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sapId: formData.sapId,
          password: formData.password,
          type
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store token in cookie
      Cookies.set('token', data.token, { expires: 1 });
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Update auth context
      setUser(data.user);

      // Redirect based on user role
      if (type === 'admin' && data.user.role === 'admin') {
        router.push('/admin/adminpage');
      } else {
        router.push('/user/userpage');
      }

    } catch (error) {
      setError(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

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

        <div className={styles.loginBox}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <div className={styles.error}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label htmlFor="sapId" className={styles.label}>
                SAP ID
              </label>
              <input
                type="text"
                id="sapId"
                className={styles.input}
                placeholder="Enter your 8-digit SAP ID"
                required
                value={formData.sapId}
                onChange={handleInputChange}
                autoComplete="off"
                maxLength="8"
                pattern="\d{8}"
                title="Please enter an 8-digit SAP ID"
              />
            </div>
            
            {type === 'admin' && (
              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={styles.input}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="off"
                />
              </div>
            )}

            <button 
              type="submit" 
              className={styles.button}
              disabled={!isFormValid() || isLoading}
            >
              {isLoading ? 'Loading...' : (type === 'admin' ? 'Sign In' : 'Continue')}
            </button>
          </form>
        </div>
      </main>
      <div className={styles.overlay} />
    </div>
  );
}