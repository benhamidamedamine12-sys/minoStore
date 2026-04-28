// src/app/providers.jsx
'use client';

import { Provider } from 'react-redux';
import { store } from '@/redux/store'; 
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '@/redux/features/auth/authSlice';

function AuthHydrator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/me');
        
        if (res.data.user) {
          // Récupérer le token depuis localStorage s'il existe
          const token = localStorage.getItem('token');
          dispatch(loginSuccess({
            user: res.data.user,
            token: token || res.data.user._id, // Utiliser un token vide si pas de token
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
