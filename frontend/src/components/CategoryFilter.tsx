interface Category {
  category: string;
  count: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selected: string;
  onSelect: (category: string) => void;
}

import { translateCategory, useLanguage } from '../context/LanguageContext';

const CategoryFilter = ({ categories, selected, onSelect }: CategoryFilterProps) => {
  const { language, t } = useLanguage();
  return (
    <div className="category-filter mb-4">
      <h2 className="h6 text-uppercase text-secondary mb-3" style={{ letterSpacing: '0.05em' }}>
        {t('categories')}
      </h2>
      <ul className="list-unstyled mb-0">
        <li className="mb-2">
          <button
            className={`btn btn-link p-0 text-decoration-none ${selected === '' ? 'fw-semibold text-body' : 'text-secondary'}`}
            onClick={() => onSelect('')}
          >
            {t('all')}
          </button>
        </li>
        {categories.map((cat) => (
          <li key={cat.category} className="mb-2 d-flex justify-content-between">
            <button
              className={`btn btn-link p-0 text-decoration-none text-capitalize ${
                selected === cat.category ? 'fw-semibold text-body' : 'text-secondary'
              }`}
              onClick={() => onSelect(cat.category)}
            >
              {translateCategory(cat.category, language)}
            </button>
            <span className="small text-secondary">{cat.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryFilter;