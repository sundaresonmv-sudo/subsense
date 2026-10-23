import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('subsenseToken'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const boot = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      if (token === 'subsense-prototype-demo-token') {
        const storedDemo = localStorage.getItem('subsenseDemoUser');
        setUser(
          storedDemo
            ? JSON.parse(storedDemo)
            : {
                id: 'demo-user-123',
                name: 'Alex Johnson',
                email: 'alex.johnson@subsense.io',
              }
        );
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user);
      } catch (error) {
        localStorage.removeItem('subsenseToken');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    boot();
  }, [token]);

  const loginDemo = () => {
    const demoToken = 'subsense-prototype-demo-token';
    const demoUser = {
      id: 'demo-user-123',
      name: 'Alex Johnson',
      email: 'alex.johnson@subsense.io',
    };
    localStorage.setItem('subsenseToken', demoToken);
    localStorage.setItem('subsenseDemoUser', JSON.stringify(demoUser));
    setToken(demoToken);
    setUser(demoUser);
    return { token: demoToken, user: demoUser };
  };

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    const nextToken = response.data.token;
    const nextUser = response.data.user;

    localStorage.setItem('subsenseToken', nextToken);
    setToken(nextToken);
    setUser(nextUser);

    return response.data;
  };

  const register = async (payload) => {
    const response = await api.post('/auth/register', payload);
    const nextToken = response.data.token;
    const nextUser = response.data.user;

    localStorage.setItem('subsenseToken', nextToken);
    setToken(nextToken);
    setUser(nextUser);

    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('subsenseToken');
    localStorage.removeItem('subsenseDemoUser');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      loginDemo,
      register,
      logout,
      isAuthenticated: Boolean(user && token),
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider');
  }

  return context;
};
