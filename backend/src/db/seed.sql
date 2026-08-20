
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin Loja', 'admin@loja.com', '$2b$10$wDbDkgQ4GB6KvOaLUBqmbeajhs1BTxlxstGETZSZbjTTX.whczTDi', 'admin'),
('Cliente Teste', 'cliente@loja.com', '$2b$10$Ascju/dGay9zbOFgd4UjOuHY0LeKzbI6oL6sISh6jFDc8KRP2VlFe', 'customer')
ON CONFLICT (email) DO NOTHING;

-- Produtos (roupas básicas/minimalistas)
INSERT INTO products (name, description, price, stock_quantity, category, size, color, weight_kg, created_by) VALUES
('Camiseta Básica Branca', 'Camiseta 100% algodão, corte reto, essencial para o guarda-roupa minimalista.', 79.90, 40, 'camiseta', 'M', 'branco', 0.20, 1),
('Camiseta Básica Preta', 'Camiseta 100% algodão, corte reto, versátil e atemporal.', 79.90, 35, 'camiseta', 'M', 'preto', 0.20, 1),
('Moletom Cinza Mescla', 'Moletom com capuz, tecido flanelado, forro macio, silhueta oversized.', 189.90, 20, 'moletom', 'G', 'cinza', 0.60, 1),
('Calça Reta Bege', 'Calça de alfaiataria em tecido leve, modelagem reta, cintura alta.', 219.90, 15, 'calça', '40', 'bege', 0.45, 1),
('Camisa Linho Off-White', 'Camisa de linho, caimento solto, ideal para dias quentes.', 159.90, 25, 'camisa', 'G', 'off-white', 0.25, 1),
('Calça Jogger Preta', 'Calça jogger em moletom, punho no tornozelo, conforto para o dia a dia.', 169.90, 18, 'calça', 'M', 'preto', 0.40, 1),
('Camiseta Gola V Cinza', 'Camiseta gola V em algodão pima, toque macio.', 89.90, 30, 'camiseta', 'P', 'cinza', 0.20, 1),
('Blazer Minimalista Preto', 'Blazer estruturado, modelagem reta, ideal para looks despojados.', 349.90, 10, 'blazer', 'M', 'preto', 0.70, 1);

-- Imagens de exemplo (usar placeholders — trocar pelas fotos reais depois)
INSERT INTO product_images (product_id, image_url, is_primary)
SELECT id, '/images/products/placeholder-' || (id % 4 + 1) || '.jpg', TRUE
FROM products;

-- Algumas avaliações de exemplo
INSERT INTO reviews (product_id, user_id, rating) VALUES
(1, 2, 5),
(2, 2, 4),
(3, 2, 5);

-- Alguns comentários de exemplo
INSERT INTO comments (product_id, user_id, content) VALUES
(1, 2, 'Tecido de ótima qualidade, veste bem no tamanho indicado.'),
(3, 2, 'Moletom super quentinho, virou meu favorito no inverno.');