import { useState, useEffect, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [weightKg, setWeightKg] = useState('0.3');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    api.get(`/products/${id}`).then((res) => {
      const p = res.data;
      setName(p.name);
      setDescription(p.description);
      setPrice(p.price);
      setStockQuantity(String(p.stock_quantity));
      setCategory(p.category);
      setSize(p.size || '');
      setColor(p.color || '');
      setWeightKg(p.weight_kg);
    });
  }, [id, isEditing]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name,
      description,
      price: parseFloat(price),
      stock_quantity: parseInt(stockQuantity, 10),
      category,
      size: size || null,
      color: color || null,
      weight_kg: parseFloat(weightKg),
    };

    try {
      let productId = id;

      if (isEditing) {
        await api.put(`/products/${id}`, payload);
      } else {
        const res = await api.post('/products', payload);
        productId = res.data.id;
      }

      if (imageFile && productId) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await api.post(`/products/${productId}/images`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      navigate('/admin/products');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '560px' }}>
      <h1 className="h3 mb-4">{isEditing ? 'Editar Produto' : 'Novo Produto'}</h1>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label className="form-label">Descrição</label>
          <textarea
            className="form-control"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-6">
            <label className="form-label">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label">Estoque</label>
            <input
              type="number"
              className="form-control"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Categoria</label>
          <input className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div className="row g-3 mb-3">
          <div className="col-4">
            <label className="form-label">Tamanho</label>
            <input className="form-control" value={size} onChange={(e) => setSize(e.target.value)} />
          </div>
          <div className="col-4">
            <label className="form-label">Cor</label>
            <input className="form-control" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="col-4">
            <label className="form-label">Peso (kg)</label>
            <input
              type="number"
              step="0.01"
              className="form-control"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Imagem</label>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="form-control"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;