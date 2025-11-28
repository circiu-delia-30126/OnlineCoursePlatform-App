import { useState } from 'react';
import { authService } from './services/api';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Te rog completează toate câmpurile!');
      return;
    }

    if (!email.includes('@')) {
      setError('Email invalid!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.login(email, password);
      
      if (response.data && response.data.success && response.data.user) {
        const userData = response.data.user;
        if (onLoginSuccess) {
          onLoginSuccess(userData);
        }
      } else {
        throw new Error('Răspuns invalid de la server');
      }
    } catch (err) {
      let errorMessage = 'Email sau parolă incorectă!';
      
      if (err.code === 'ERR_NETWORK') {
        errorMessage = 'Nu se poate conecta la server! Verifică dacă backend-ul rulează.';
      } else if (err.response?.status === 401) {
        errorMessage = err.response.data || 'Email sau parolă incorectă!';
      } else if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : err.response.data.message || 'Eroare la autentificare!';
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🎓</div>
          <h1>Online Course Platform</h1>
          <p>Bun venit! Autentifică-te pentru a continua</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message" style={{ whiteSpace: 'pre-line' }}>
              ⚠️ {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              type="email"
              id="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">🔒 Parolă</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Se încarcă...
              </>
            ) : (
              '🚀 Autentificare'
            )}
          </button>
        </form>

      </div>

      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </div>
  );
}

export default Login;