-- =========================================================
-- Seed EXTRA — amplia os dados de teste
-- Rodar DEPOIS do schema.sql e do seed.sql original
-- Usa subqueries por email/nome, então não depende dos IDs exatos já existentes
-- =========================================================

-- =========================
-- Novos usuários de teste
-- maria@teste.com  | senha: maria123
-- joao@teste.com   | senha: joao123
-- carla@teste.com  | senha: carla123
-- =========================
INSERT INTO users (name, email, password_hash, role) VALUES
('Maria Fernandes', 'maria@teste.com', '$2b$10$/9JJzOGRiBznTktHudF3hOK0KESvi1YoDm3QvHPcBRXKW7lIKZYbm', 'customer'),
('João Ribeiro', 'joao@teste.com', '$2b$10$H7NUG4ygNpp9Nuqat9NybuvYCqC0lyHzW9WF8aEuGtAgMPVpoVGIy', 'customer'),
('Carla Nunes', 'carla@teste.com', '$2b$10$mW7V.2z4EwQ6sq1LKYB/0.z53GDjBh3LqMP9P0z5SUM/9pWi6sPyq', 'customer')
ON CONFLICT (email) DO NOTHING;

-- =========================
-- Mais produtos (novas categorias: tênis, acessório, vestido, saia, jaqueta)
-- =========================
INSERT INTO products (name, description, price, stock_quantity, category, size, color, weight_kg, created_by)
SELECT * FROM (VALUES
    ('Tênis Branco Minimalista', 'Tênis de couro sintético, solado leve, design clean sem logos aparentes.', 259.90, 22, 'tênis', '42', 'branco', 0.80, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Tênis Preto Slip-On', 'Tênis sem cadarço, cano baixo, ideal para o dia a dia.', 229.90, 18, 'tênis', '40', 'preto', 0.70, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Vestido Midi Bege', 'Vestido midi em viscose, alças finas, caimento fluido.', 199.90, 16, 'vestido', 'M', 'bege', 0.30, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Vestido Preto Básico', 'Vestido curto de malha canelada, corte reto.', 149.90, 20, 'vestido', 'P', 'preto', 0.25, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Saia Midi Cinza', 'Saia midi de alfaiataria, cintura alta, fenda discreta.', 179.90, 14, 'saia', 'M', 'cinza', 0.35, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Jaqueta Corta-Vento Preta', 'Jaqueta leve impermeável, ideal para dias de vento e chuva fina.', 279.90, 12, 'jaqueta', 'G', 'preto', 0.50, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Jaqueta Jeans Clara', 'Jaqueta jeans lavagem clara, corte reto, atemporal.', 249.90, 15, 'jaqueta', 'M', 'azul claro', 0.65, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Boné Aba Curva Preto', 'Boné em sarja, aba curva, fecho ajustável.', 89.90, 30, 'acessório', 'Único', 'preto', 0.15, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Cinto de Couro Marrom', 'Cinto de couro legítimo, fivela minimalista.', 99.90, 25, 'acessório', 'Único', 'marrom', 0.20, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Camiseta Listrada Marinho', 'Camiseta em algodão com listras finas, gola careca.', 84.90, 28, 'camiseta', 'G', 'marinho', 0.20, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Calça Alfaiataria Preta', 'Calça de alfaiataria, cintura alta, caimento reto.', 229.90, 17, 'calça', '38', 'preto', 0.45, (SELECT id FROM users WHERE email = 'admin@loja.com')),
    ('Moletom Careca Bege', 'Moletom sem capuz, gola careca, tecido felpado.', 169.90, 19, 'moletom', 'M', 'bege', 0.55, (SELECT id FROM users WHERE email = 'admin@loja.com'))
) AS novos_produtos(name, description, price, stock_quantity, category, size, color, weight_kg, created_by)
WHERE NOT EXISTS (
    SELECT 1 FROM products WHERE products.name = novos_produtos.name
);

-- Imagens de exemplo para os produtos que ainda não têm imagem
INSERT INTO product_images (product_id, image_url, is_primary)
SELECT p.id, '/images/products/placeholder-' || (p.id % 4 + 1) || '.jpg', TRUE
FROM products p
WHERE NOT EXISTS (
    SELECT 1 FROM product_images pi WHERE pi.product_id = p.id
);

-- =========================
-- Mais avaliações (usando emails e nomes de produtos, sem depender de IDs fixos)
-- =========================
INSERT INTO reviews (product_id, user_id, rating)
SELECT p.id, u.id, r.rating
FROM (VALUES
    ('Camiseta Básica Branca', 'maria@teste.com', 4),
    ('Camiseta Básica Preta', 'joao@teste.com', 5),
    ('Moletom Cinza Mescla', 'carla@teste.com', 4),
    ('Calça Reta Bege', 'maria@teste.com', 3),
    ('Camisa Linho Off-White', 'joao@teste.com', 5),
    ('Tênis Branco Minimalista', 'carla@teste.com', 5),
    ('Tênis Preto Slip-On', 'maria@teste.com', 4),
    ('Vestido Midi Bege', 'carla@teste.com', 5),
    ('Blazer Minimalista Preto', 'joao@teste.com', 4)
) AS r(product_name, user_email, rating)
JOIN products p ON p.name = r.product_name
JOIN users u ON u.email = r.user_email
ON CONFLICT (product_id, user_id) DO NOTHING;

-- =========================
-- Mais comentários
-- =========================
INSERT INTO comments (product_id, user_id, content)
SELECT p.id, u.id, c.content
FROM (VALUES
    ('Camiseta Básica Branca', 'maria@teste.com', 'Amei o caimento, comprei em duas cores.'),
    ('Tênis Branco Minimalista', 'carla@teste.com', 'Muito confortável, mas numera um pouco maior.'),
    ('Vestido Midi Bege', 'carla@teste.com', 'Tecido leve, ótimo para o verão.'),
    ('Moletom Cinza Mescla', 'joao@teste.com', 'Chegou rápido e a qualidade surpreendeu.'),
    ('Jaqueta Jeans Clara', 'maria@teste.com', 'Modelagem boa, veste conforme a tabela de medidas.'),
    ('Calça Alfaiataria Preta', 'joao@teste.com', 'Caimento impecável, uso pro trabalho.')
) AS c(product_name, user_email, content)
JOIN products p ON p.name = c.product_name
JOIN users u ON u.email = c.user_email;