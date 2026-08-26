import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Camera, PersonCircle } from 'react-bootstrap-icons';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:3001';

const Profile = () => {
  const { user, loading } = useAuth();
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) return <div className="container page-shell">Carregando...</div>;
  if (!user) {
    return (
      <div className="container page-shell empty-state text-center">
        <p>Você precisa estar logado para acessar seu perfil.</p>
        <Link to="/login" className="btn btn-primary">Entrar</Link>
      </div>
    );
  }

  const avatar = preview || (user.avatar_url ? `${API_URL}${user.avatar_url}` : null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setSaving(true);
    setMessage('');
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await api.post('/auth/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMessage('Imagem de perfil atualizada.');
      window.location.reload();
    } catch {
      setPreview(null);
      setMessage('Não foi possível atualizar a imagem.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page-shell profile-page">
      <p className="eyebrow mb-2">Sua conta</p>
      <h1 className="display-6 mb-4">Meu Perfil</h1>
      <div className="profile-surface">
        <div className="profile-avatar">
          {avatar ? <img src={avatar} alt={`Foto de ${user.name}`} /> : <PersonCircle size={96} />}
        </div>
        <div>
          <h2 className="h4 mb-1">{user.name}</h2>
          <p className="text-secondary mb-4">{user.email}</p>
          <label className="btn btn-primary d-inline-flex align-items-center gap-2" htmlFor="avatar-upload">
            <Camera /> {saving ? 'Enviando...' : 'Adicionar imagem'}
          </label>
          <input id="avatar-upload" type="file" accept="image/jpeg,image/png,image/webp" className="visually-hidden" onChange={handleFileChange} disabled={saving} />
          {message && <p className="small text-secondary mt-3 mb-0">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
