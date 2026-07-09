import { useDispatch, useSelector } from 'react-redux';
import { Skeleton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { setCategory } from '../../features/products/filtersSlice';

export default function CategoryFilter({ categories }) {
  const dispatch = useDispatch();
  const selectedCategory = useSelector((state) => state.filters.selectedCategory);

  // Categories still loading → show skeleton rows
  if (!categories || categories.length === 0) {
    return (
      <div className="space-y-2 py-1">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="text" height={24} animation="wave" />
        ))}
      </div>
    );
  }

  const allCategories = [{ slug: 'all', name: 'All Products' }, ...categories];

  return (
    <ul role="list" className="-mx-2 max-h-72 overflow-y-auto">
        {allCategories.map((cat) => {
          const slug = cat.slug || cat;
          const name = cat.name || cat;
          const isSelected = selectedCategory === slug;
          return (
            <li key={slug}>
              <button
                onClick={() => dispatch(setCategory(slug))}
                aria-pressed={isSelected}
                className={`w-full flex items-center justify-between text-left text-[15px] py-2.5 px-2 rounded transition-colors ${
                  isSelected
                    ? 'text-[#007185] font-bold'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span className="capitalize">{name}</span>
                <KeyboardArrowRightIcon fontSize="small" className="text-gray-400 shrink-0" />
              </button>
            </li>
          );
        })}
    </ul>
  );
}
