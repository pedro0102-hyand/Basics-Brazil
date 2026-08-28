import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { StarFill, Star } from 'react-bootstrap-icons';
import api from '../services/api';
import type { Product } from '../types/products';
import type { ReviewsResponse, Comment } from '../types/review';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translateCategory } from '../context/LanguageContext';

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { language, t } = useLanguage();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  const [reviewsData, setReviewsData] = useState<ReviewsResponse | null>(null);
  const [myRating, setMyRating] = useState(0);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [sendingComment, setSendingComment] = useState(false);

  const fetchExtras = async () => {
    const [reviewsRes, commentsRes] = await Promise.all([
      api.get(`/products/${id}/reviews`),
      api.get(`/products/${id}/comments`),
    ]);
    setReviewsData(reviewsRes.data);
    setComments(commentsRes.data);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data);
      const primary = res.data.images?.find((img: any) => img.is_primary) || res.data.images?.[0];
      setSelectedImage(primary ? `http://localhost:3001${primary.image_url}` : null);
      setLoading(false);
    };
    fetchProduct();
    fetchExtras();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      alert(t('addToCart'));
    } finally {
      setAdding(false);
    }
  };

  const handleRate = async (rating: number) => {
    if (!user) {
      alert(t('loginRequiredProfile'));
      return;
    }
    setMyRating(rating);
    await api.post(`/products/${id}/reviews`, { rating });
    await fetchExtras();
  };

  const handleSendComment = async () => {
    if (!user) {
      alert(t('loginRequiredProfile'));
      return;
    }
    if (!newComment.trim()) return;
    setSendingComment(true);
    try {
      await api.post(`/products/${id}/comments`, { content: newComment });
      setNewComment('');
      await fetchExtras();
    } finally {
      setSendingComment(false);
    }
  };

  if (loading) return <div className="container page-shell">{t('loading')}</div>;
  if (!product) return <div className="container page-shell">{t('notFoundProduct')}</div>;

  return (
    <div className="container page-shell product-detail">
      <div className="row g-5">
        <div className="col-md-6">
          <div className="product-image-frame">
          <img
            src={selectedImage || `https://placehold.co/500x500?text=${t('language') === 'Idioma' ? 'Sem+imagem' : 'No+image'}`}
            alt={product.name}
            className="img-fluid rounded"
            style={{ aspectRatio: '1 / 1', objectFit: 'cover', width: '100%' }}
          />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="d-flex gap-2 mt-3">
              {product.images.map((img) => (
                <img
                  key={img.id}
                  src={`http://localhost:3001${img.image_url}`}
                  alt=""
                  className="rounded"
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: selectedImage?.includes(img.image_url) ? '2px solid var(--bs-primary)' : '2px solid transparent',
                  }}
                  onClick={() => setSelectedImage(`http://localhost:3001${img.image_url}`)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="col-md-6">
          <p className="text-uppercase small text-secondary mb-1">{translateCategory(product.category, language)}</p>
          <h1 className="display-6 mb-2">{product.name}</h1>

          {reviewsData && reviewsData.total_reviews > 0 && (
            <div className="d-flex align-items-center gap-2 mb-3">
              {[1, 2, 3, 4, 5].map((n) =>
                n <= Math.round(Number(reviewsData.average_rating)) ? (
                  <StarFill key={n} className="text-warning" size={16} />
                ) : (
                  <Star key={n} className="text-warning" size={16} />
                )
              )}
              <span className="small text-secondary">
                {reviewsData.average_rating} ({reviewsData.total_reviews} {t('reviews').toLowerCase()})
              </span>
            </div>
          )}

          <p className="h4 mb-4" style={{ fontFamily: 'var(--font-body)', fontWeight: 600 }}>
  R$ {parseFloat(product.price).toFixed(2).replace('.', ',')}
</p>

          <p className="text-body-secondary mb-4">{product.description}</p>

          {(product.size || product.color) && (
            <div className="mb-4 small">
              {product.size && <span className="me-3"><strong>{t('size')}:</strong> {product.size}</span>}
              {product.color && <span><strong>{t('color')}:</strong> {product.color}</span>}
            </div>
          )}

          <div className="d-flex align-items-center gap-3 mb-3 product-buy-row">
            <input
              type="number"
              className="form-control"
              style={{ width: '80px' }}
              min={1}
              max={product.stock_quantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button
              className="btn btn-primary flex-grow-1"
              onClick={handleAddToCart}
              disabled={adding || product.stock_quantity === 0}
            >
              {product.stock_quantity === 0
                ? (t('stock') === 'Estoque' ? 'Sem estoque' : 'Out of stock')
                : adding
                ? t('adding')
                : t('addToCart')}
            </button>
          </div>

          <p className="small text-secondary mb-0">{product.stock_quantity} {t('stockAvailable')}</p>
        </div>
      </div>

      <hr className="section-rule my-5" />

      <div className="row g-5">
        <div className="col-md-6">
          <h2 className="h5 section-title mb-3">{t('reviews')}</h2>

          <div className="mb-4">
            <p className="small mb-1">{t('myRating')}</p>
            <div>
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} style={{ cursor: 'pointer' }} onClick={() => handleRate(n)}>
                  {n <= myRating ? (
                    <StarFill className="text-warning me-1" size={22} />
                  ) : (
                    <Star className="text-warning me-1" size={22} />
                  )}
                </span>
              ))}
            </div>
          </div>

          {reviewsData?.reviews.length === 0 ? (
            <p className="text-secondary small">{t('noReviews')}</p>
          ) : (
            <ul className="list-unstyled">
              {reviewsData?.reviews.map((r) => (
                <li key={r.id} className="mb-2 small">
                  {[1, 2, 3, 4, 5].map((n) =>
                    n <= r.rating ? (
                      <StarFill key={n} className="text-warning" size={12} />
                    ) : (
                      <Star key={n} className="text-warning" size={12} />
                    )
                  )}{' '}
                  <strong>{r.user_name}</strong>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-md-6">
          <h2 className="h5 section-title mb-3">{t('comments')}</h2>

          <div className="mb-4">
            <textarea
              className="form-control mb-2"
              rows={2}
              placeholder={t('commentPlaceholder')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={handleSendComment}
              disabled={sendingComment}
            >
              {sendingComment ? t('sending') : t('sendComment')}
            </button>
          </div>

          {comments.length === 0 ? (
            <p className="text-secondary small">{t('noComments')}</p>
          ) : (
            <ul className="list-unstyled">
              {comments.map((c) => (
                <li key={c.id} className="mb-3">
                  <p className="mb-0 small fw-semibold">{c.user_name}</p>
                  <p className="mb-0 small text-body-secondary">{c.content}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;