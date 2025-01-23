import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types'; // Importando PropTypes

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState(() => {
    const storedUser = localStorage.getItem('usuarioLogado');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (usuario) => {
    setUsuarioLogado(usuario);
    localStorage.setItem('usuarioLogado', JSON.stringify(usuario));
  };

  const logout = () => {
    setUsuarioLogado(null);
    localStorage.removeItem('usuarioLogado');
  };

  useEffect(() => {
    if (!usuarioLogado) {
      localStorage.removeItem('usuarioLogado');
    }
  }, [usuarioLogado]);

  return (
    <AuthContext.Provider value={{ usuarioLogado, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Adicionando validação de props
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
