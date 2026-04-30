// src/app/providers.jsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store'; 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { loginSuccess } from '@/redux/features/auth/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5501';

function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/auth/me`, {
          withCredentials: true,
        });
        
        if (res.data.user) {
          dispatch(loginSuccess({
            user: res.data.user,
          }));
        }
      } catch (error) {
        console.log('Utilisateur non authentifié:', error.message);
        // L'utilisateur n'est pas authentifié, c'est normal
      }
    };

    checkAuth();
  }, [dispatch]);

  return null;
}

export function Providers({ children }) {
  return (
    <Provider store={store}>
      <AuthHydrator />
      {children}
    </Provider>
  );
}
