import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'pt' | 'en';

const categoryTranslations: Record<string, string> = {
  acessório: 'Accessory',
  acessórios: 'Accessories',
  blazer: 'Blazer',
  calça: 'Pants',
  calças: 'Pants',
  camisa: 'Shirt',
  camiseta: 'T-Shirt',
  cueca: 'Underwear',
  cuecas: 'Underwear',
  jaqueta: 'Jacket',
  moletom: 'Sweatshirt',
  saia: 'Skirt',
  tênis: 'Sneakers',
  vestido: 'Dress',
};

export const translateCategory = (category: string, language: Language) => {
  if (language === 'pt') return category;
  return categoryTranslations[category.trim().toLocaleLowerCase('pt-BR')] || category;
};

type TranslationKey =
  | 'about'
  | 'aboutStory'
  | 'aboutIntro'
  | 'aboutBody'
  | 'admin'
  | 'adminPanel'
  | 'addImage'
  | 'addToCart'
  | 'adding'
  | 'all'
  | 'categories'
  | 'calculateShipping'
  | 'calculating'
  | 'cart'
  | 'cartEmpty'
  | 'cartLogin'
  | 'catalog'
  | 'checkout'
  | 'checkoutLastStep'
  | 'checkoutSubtitle'
  | 'checkoutSimulated'
  | 'cityZip'
  | 'clear'
  | 'comment'
  | 'commentPlaceholder'
  | 'comments'
  | 'confirmOrder'
  | 'confirmation'
  | 'createAccount'
  | 'creatingAccount'
  | 'deliveryAddress'
  | 'deliveryZip'
  | 'description'
  | 'editProduct'
  | 'email'
  | 'emailInvalid'
  | 'enter'
  | 'errorCreateAccount'
  | 'errorOrder'
  | 'errorShipping'
  | 'errorUpload'
  | 'finalizePurchase'
  | 'forgot'
  | 'freight'
  | 'freightAtCheckout'
  | 'hidePassword'
  | 'image'
  | 'items'
  | 'loginRequiredCart'
  | 'loginRequiredProfile'
  | 'loginInvalid'
  | 'loggingIn'
  | 'logout'
  | 'manageProducts'
  | 'myAccount'
  | 'myCart'
  | 'myProfile'
  | 'myRating'
  | 'name'
  | 'newProduct'
  | 'newProducts'
  | 'noComments'
  | 'noProducts'
  | 'noReviews'
  | 'notFoundOrder'
  | 'notFoundProduct'
  | 'orderConfirmed'
  | 'orderStatusPaid'
  | 'orderSummary'
  | 'ourCollection'
  | 'ourStory'
  | 'password'
  | 'passwordMismatch'
  | 'passwordConfirmation'
  | 'payment'
  | 'processing'
  | 'productName'
  | 'profileImageUpdated'
  | 'quantity'
  | 'register'
  | 'registerPrompt'
  | 'reviews'
  | 'save'
  | 'saving'
  | 'searchProducts'
  | 'sendComment'
  | 'sending'
  | 'showPassword'
  | 'size'
  | 'stock'
  | 'stockAvailable'
  | 'subtotal'
  | 'total'
  | 'confirmDelete'
  | 'category'
  | 'weight'
  | 'color'
  | 'shippingBeforeCheckout'
  | 'backToShopping'
  | 'viewProducts'
  | 'loading'
  | 'loadingProducts'
  | 'themeDark'
  | 'themeLight'
  | 'language';

const translations: Record<Language, Record<TranslationKey, string>> = {
  pt: {
    about: 'Sobre Nós', aboutStory: 'Nossa história', aboutIntro: 'Somos uma loja dedicada ao essencial. Acreditamos que menos é mais: peças básicas, atemporais e de qualidade, pensadas para compor um guarda-roupa funcional e sem excessos.', aboutBody: 'Cada peça é selecionada com cuidado, priorizando tecidos confortáveis, cortes versáteis e uma paleta neutra que combina com qualquer ocasião.', admin: 'Admin', adminPanel: 'Painel de controle', addImage: 'Adicionar imagem', addToCart: 'Adicionar ao Carrinho', adding: 'Adicionando...', all: 'Todas', categories: 'Categorias', calculateShipping: 'Calcular Frete', calculating: 'Calculando...', cart: 'Carrinho', cartEmpty: 'Seu carrinho está vazio.', cartLogin: 'Você precisa estar logado para ver o carrinho.', catalog: 'Catálogo', checkout: 'Finalizar Compra', checkoutLastStep: 'Última etapa', checkoutSubtitle: 'Confira a entrega e confirme seu pedido.', checkoutSimulated: 'Este é um checkout simulado — nenhum pagamento real será processado. O pedido será aprovado automaticamente.', cityZip: 'CEP (ex: 20950-000)', clear: 'Limpar', comment: 'Comentar', commentPlaceholder: 'Escreva um comentário...', comments: 'Comentários', confirmOrder: 'Confirmar Pedido', confirmation: 'Confirmação', createAccount: 'Criar Conta', creatingAccount: 'Criando conta...', deliveryAddress: 'Endereço de Entrega', deliveryZip: 'Entrega para o CEP', description: 'Descrição', editProduct: 'Editar Produto', email: 'Email', emailInvalid: 'Email ou senha inválidos.', enter: 'Entrar', errorCreateAccount: 'Erro ao criar conta.', errorOrder: 'Não foi possível concluir o pedido.', errorShipping: 'Não foi possível calcular o frete.', errorUpload: 'Não foi possível atualizar a imagem.', finalizePurchase: 'Finalizar Compra', forgot: 'Esqueceu a senha?', freight: 'Frete', freightAtCheckout: 'Frete calculado no checkout', hidePassword: 'Ocultar senha', image: 'Imagem', items: 'Itens', loginRequiredCart: 'Você precisa estar logado para ver o carrinho.', loginRequiredProfile: 'Você precisa estar logado para acessar seu perfil.', loginInvalid: 'Email ou senha inválidos.', loggingIn: 'Entrando...', logout: 'Sair', manageProducts: 'Gerenciar Produtos', myAccount: 'Sua conta', myCart: 'Meu Carrinho', myProfile: 'Meu perfil', myRating: 'Sua avaliação:', name: 'Nome', newProduct: 'Novo Produto', newProducts: 'Ver produtos', noComments: 'Ainda não há comentários.', noProducts: 'Nenhum produto encontrado.', noReviews: 'Ainda não há avaliações.', notFoundOrder: 'Pedido não encontrado.', notFoundProduct: 'Produto não encontrado.', orderConfirmed: 'Pedido Confirmado!', orderStatusPaid: 'Pago', orderSummary: 'Resumo', ourCollection: 'Nossa Coleção', ourStory: 'Nossa história', password: 'Senha', passwordMismatch: 'As senhas não coincidem.', passwordConfirmation: 'Confirmar senha', payment: 'Pagamento', processing: 'Processando...', productName: 'Nome do produto', profileImageUpdated: 'Imagem de perfil atualizada.', quantity: 'Quantidade', register: 'Cadastre-se', registerPrompt: 'Não tem conta?', reviews: 'Avaliações', save: 'Salvar', saving: 'Salvando...', searchProducts: 'Buscar produtos...', sendComment: 'Comentar', sending: 'Enviando...', showPassword: 'Mostrar senha', size: 'Tamanho', stock: 'Estoque', stockAvailable: 'em estoque', subtotal: 'Subtotal', total: 'Total', confirmDelete: 'Tem certeza que deseja excluir este produto?', category: 'Categoria', weight: 'Peso (kg)', color: 'Cor', shippingBeforeCheckout: 'Calcule o frete antes de finalizar.', backToShopping: 'Voltar às Compras', viewProducts: 'Ver produtos', loading: 'Carregando...', loadingProducts: 'Carregando produtos...', themeDark: 'Modo escuro', themeLight: 'Modo claro', language: 'Idioma',
  },
  en: {
    about: 'About Us', aboutStory: 'Our story', aboutIntro: 'We are a store dedicated to the essentials. We believe less is more: basic, timeless, quality pieces designed for a functional wardrobe without excess.', aboutBody: 'Each piece is carefully selected, prioritizing comfortable fabrics, versatile cuts and a neutral palette that works for any occasion.', admin: 'Admin', adminPanel: 'Control panel', addImage: 'Add image', addToCart: 'Add to Cart', adding: 'Adding...', all: 'All', categories: 'Categories', calculateShipping: 'Calculate Shipping', calculating: 'Calculating...', cart: 'Cart', cartEmpty: 'Your cart is empty.', cartLogin: 'You need to be logged in to view your cart.', catalog: 'Catalog', checkout: 'Checkout', checkoutLastStep: 'Last step', checkoutSubtitle: 'Review delivery details and confirm your order.', checkoutSimulated: 'This is a simulated checkout. No real payment will be processed. The order will be approved automatically.', cityZip: 'ZIP code (e.g. 20950-000)', clear: 'Clear', comment: 'Comment', commentPlaceholder: 'Write a comment...', comments: 'Comments', confirmOrder: 'Confirm Order', confirmation: 'Confirmation', createAccount: 'Create Account', creatingAccount: 'Creating account...', deliveryAddress: 'Delivery Address', deliveryZip: 'Delivery to ZIP code', description: 'Description', editProduct: 'Edit Product', email: 'Email', emailInvalid: 'Invalid email or password.', enter: 'Sign in', errorCreateAccount: 'Error creating account.', errorOrder: 'Unable to complete the order.', errorShipping: 'Unable to calculate shipping.', errorUpload: 'Unable to update the image.', finalizePurchase: 'Place Order', forgot: 'Forgot password?', freight: 'Shipping', freightAtCheckout: 'Shipping calculated at checkout', hidePassword: 'Hide password', image: 'Image', items: 'Items', loginRequiredCart: 'You need to be logged in to view your cart.', loginRequiredProfile: 'You need to be logged in to access your profile.', loginInvalid: 'Invalid email or password.', loggingIn: 'Signing in...', logout: 'Sign out', manageProducts: 'Manage Products', myAccount: 'Your account', myCart: 'My Cart', myProfile: 'My profile', myRating: 'Your rating:', name: 'Name', newProduct: 'New Product', newProducts: 'View products', noComments: 'There are no comments yet.', noProducts: 'No products found.', noReviews: 'There are no reviews yet.', notFoundOrder: 'Order not found.', notFoundProduct: 'Product not found.', orderConfirmed: 'Order Confirmed!', orderStatusPaid: 'Paid', orderSummary: 'Summary', ourCollection: 'Our Collection', ourStory: 'Our story', password: 'Password', passwordMismatch: 'Passwords do not match.', passwordConfirmation: 'Confirm password', payment: 'Payment', processing: 'Processing...', productName: 'Product name', profileImageUpdated: 'Profile image updated.', quantity: 'Quantity', register: 'Create one', registerPrompt: "Don't have an account?", reviews: 'Reviews', save: 'Save', saving: 'Saving...', searchProducts: 'Search products...', sendComment: 'Comment', sending: 'Sending...', showPassword: 'Show password', size: 'Size', stock: 'Stock', stockAvailable: 'in stock', subtotal: 'Subtotal', total: 'Total', confirmDelete: 'Are you sure you want to delete this product?', category: 'Category', weight: 'Weight (kg)', color: 'Color', shippingBeforeCheckout: 'Calculate shipping before placing the order.', backToShopping: 'Back to Shopping', viewProducts: 'View products', loading: 'Loading...', loadingProducts: 'Loading products...', themeDark: 'Dark mode', themeLight: 'Light mode', language: 'Language',
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return saved === 'en' ? 'en' : 'pt';
  });

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  };

  useEffect(() => {
    document.documentElement.lang = language === 'pt' ? 'pt-BR' : 'en';
  }, [language]);

  return <LanguageContext.Provider value={{ language, setLanguage, t: (key) => translations[language][key] }}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
