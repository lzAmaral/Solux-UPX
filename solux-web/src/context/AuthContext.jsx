import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('soluxUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Autenticação simulada para Fase 3
    // Determina o papel com base no email digitado
    
    let role = null;
    let name = '';

    if (email.includes('admin')) {
      role = 'admin';
      name = 'Administrador Solux';
    } else if (email.includes('cliente')) {
      role = 'cliente';
      name = 'Cliente GD';
    } else {
      role = 'admin';
      name = 'Usuário Solux';
    }

    const userData = { email, role, name };
    
    // Usa as credenciais fixas do Spring Security (admin/admin123)
    // definidas em application.properties para garantir que as
    // chamadas à API sempre funcionem independentemente de restarts.
    const basicAuthToken = btoa('admin:admin123');
    localStorage.setItem('basicAuthToken', basicAuthToken);
    
    setUser(userData);
    localStorage.setItem('soluxUser', JSON.stringify(userData));

    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/cliente/dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soluxUser');
    localStorage.removeItem('basicAuthToken');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
