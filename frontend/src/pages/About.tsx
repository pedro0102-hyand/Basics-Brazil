const About = () => {
  return (
    <div className="container py-5" style={{ maxWidth: '720px' }}>
      <h1 className="h3 mb-4">Sobre Nós</h1>
      <p className="text-body-secondary">
        Somos uma loja dedicada ao essencial. Acreditamos que menos é mais: peças básicas,
        atemporais e de qualidade, pensadas para compor um guarda-roupa funcional e sem excessos.
      </p>
      <p className="text-body-secondary">
        Cada peça é selecionada com cuidado, priorizando tecidos confortáveis, cortes versáteis
        e uma paleta neutra que combina com qualquer ocasião.
      </p>
      <p className="text-body-secondary mb-0">
        Este projeto foi desenvolvido como um estudo full-stack, unindo React, Node.js,
        TypeScript e PostgreSQL numa aplicação completa de e-commerce.
      </p>
    </div>
  );
};

export default About;