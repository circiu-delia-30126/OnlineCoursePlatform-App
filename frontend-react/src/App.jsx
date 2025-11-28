import { useState, useEffect } from 'react';
import Login from './Login.jsx';
import Dashboard from './Dashboard.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (userData) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '24px'
      }}>
        🔄 Se încarcă...
      </div>
    );
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}

export default App;