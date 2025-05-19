import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './AuthForms.scss';

interface LoginFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

export const LoginForm = ({ onSuccess, redirectPath = '/' }: LoginFormProps) => {
  const navigate = useNavigate();
  const { login, loading, error } = useUserContext();

  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials.email, credentials.password);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useUser
      console.error('Erreur lors de la connexion:', err);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Connexion</h2>

      {error && (
        <div className="auth-form__error">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <Input
            type="email"
            name="email"
            label="Email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-form__field">
          <Input
            type="password"
            name="password"
            label="Mot de passe"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="auth-form__actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </Button>
        </div>
      </form>

      <div className="auth-form__footer">
        <p>Pas encore de compte ?</p>
        <Button
          variant="text"
          onClick={() => navigate('/register')}
        >
          Créer un compte
        </Button>
      </div>
    </div>
  );
};
