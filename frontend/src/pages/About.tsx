import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();
  return (
    <div className="container page-shell about-page">
      <p className="eyebrow mb-2">{t('aboutStory')}</p>
      <h1 className="display-6 mb-4">{t('about')}</h1>
      <p className="lead text-body-secondary">{t('aboutIntro')}</p>
      <p className="text-body-secondary">{t('aboutBody')}</p>
    </div>
  );
};

export default About;