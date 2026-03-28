import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    navigate('/dashboard');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Failed to login: ' + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login to NewsMind AI</h2>
      {error && <p className="error-text">{error}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit">Login</button>
      </form>
      <p>
        New here? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}