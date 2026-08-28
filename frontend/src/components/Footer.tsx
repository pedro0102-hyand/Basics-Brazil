import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { language } = useLanguage();
  return (
    <footer className="bg-body-tertiary border-top mt-auto py-4">
      <div className="container text-center">
        <p className="mb-1 fw-semibold">Basics Brazil</p>
        <p className="mb-0 small text-secondary">
          {language === 'pt'
            ? `Roupas básicas para o dia a dia · Projeto de aprendizado © ${new Date().getFullYear()}`
            : `Everyday essentials · Learning project © ${new Date().getFullYear()}`}
        </p>
      </div>
    </footer>
  );
};

export default Footer;