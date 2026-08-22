const Footer = () => {
  return (
    <footer className="bg-body-tertiary border-top mt-auto py-4">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">Loja Minimalista</p>
        <p className="mb-0 small text-secondary">
          Roupas básicas para o dia a dia · Projeto de aprendizado &copy; {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
};

export default Footer;