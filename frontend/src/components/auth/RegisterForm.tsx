// src/components/auth/RegisterForm.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../IndexComponents';
import './RegisterForm.scss';

interface RegisterFormProps {
  onSuccess?: () => void;
  switchToLogin?: () => void;
}

export const RegisterForm = ({ onSuccess, switchToLogin }: RegisterFormProps) => {
  const { register, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Les mots de passe ne correspondent pas');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData.name, formData.email, formData.password);
      if (onSuccess) onSuccess();
    } catch (err) {
      // Erreur déjà gérée dans le contexte Auth
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {error && <div className="auth-form__error">{error}</div>}
      {validationError && <div className="auth-form__error">{validationError}</div>}

      <div className="auth-form__field">
        <Input
          type="text"
          name="name"
          label="Nom"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

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

      <div className="auth-form__field">
        <Input
          type="password"
          name="confirmPassword"
          label="Confirmer le mot de passe"
          value={formData.confirmPassword}
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
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </Button>
      </div>

      {switchToLogin && (
        <div className="auth-form__footer">
          <p>Vous avez déjà un compte ?</p>
          <Button
            variant="text"
            onClick={switchToLogin}
          >
            Se connecter
          </Button>
        </div>
      )}
    </form>
  );
};
