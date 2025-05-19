import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import './AuthForms.scss';

interface RegisterFormProps {
  onSuccess?: () => void;
  redirectPath?: string;
}

export const RegisterForm = ({ onSuccess, redirectPath = '/' }: RegisterFormProps) => {
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      setFormError('Le mot de passe doit contenir au moins 8 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // On n'envoie pas confirmPassword à l'API
      const { confirmPassword, ...registerData } = formData;
      await register(registerData.name, registerData.email, registerData.password);

      if (onSuccess) {
        onSuccess();
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      // L'erreur est déjà gérée dans le hook useUser
      console.error("Erreur lors de l'inscription :", err);
    }
  };

  return (
    <div className="auth-form">
      <h2 className="auth-form__title">Inscription</h2>

      {(error || formError) && (
        <div className="auth-form__error">
          {formError || error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="auth-form__field">
          <Input
            type="text"
            name="name"
            label="Nom"
            value={formData.name}
            onChange={handleChange}
            required
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
          />
        </div>

        <div className="auth-form__actions">
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
          </Button>
        </div>
      </form>

      <div className="auth-form__footer">
        <p>Déjà un compte ?</p>
        <Button
          variant="text"
          onClick={() => navigate('/login')}
        >
          Se connecter
        </Button>
      </div>
    </div>
  );
};
