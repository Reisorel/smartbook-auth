// src/components/auth/LoginForm.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../IndexComponents';
import './LoginForm.scss';

interface LoginFormProps {
  onSuccess?: () => void;
  switchToRegister?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSuccess,
  switchToRegister
}) => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData.email, formData.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      // L'erreur est déjà gérée dans le contexte Auth
      console.error('Erreur lors de la connexion:', err);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-form__error">{error}</div>}

      <div className="auth-form__field">
        <Input
          type="email"
          name="email"
          label="Email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="auth-form__field">
        <Input
          type="password"
          name="password"
          label="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      <div className="auth-form__actions">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </div>

      {switchToRegister && (
        <div className="auth-form__footer">
          <p>Vous n'avez pas encore de compte ?</p>
          <Button
            variant="text"
            onClick={switchToRegister}
          >
            Créer un compte
          </Button>
        </div>
      )}
    </form>
  );
};
