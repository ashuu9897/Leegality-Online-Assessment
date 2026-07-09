import { useDispatch } from 'react-redux';
import FilterSection from './FilterSection';
import SearchFilter from './SearchFilter';
import CategoryFilter from './CategoryFilter';
import PriceRangeFilter from './PriceRangeFilter';
import BrandFilter from './BrandFilter';
import { resetFilters } from '../../features/products/filtersSlice';

/**
 * The filter body (header + accordion sections), shared by the desktop
 * persistent sidebar and the mobile drawer.
 */
export default function FilterPanel({ categories, brands }) {
  const dispatch = useDispatch();

  return (
    <div>
      <div className="px-5 py-3.5 flex items-center justify-between border-b border-gray-200">
        <h2 className="font-bold text-gray-900 text-lg">Filters</h2>
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-sm text-[#007185] hover:text-[#c7511f] hover:underline"
          aria-label="Clear all filters"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Search">
        <SearchFilter />
      </FilterSection>

      <FilterSection title="Shop by Category">
        <CategoryFilter categories={categories} />
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRangeFilter />
      </FilterSection>

      {brands.length > 0 && (
        <FilterSection title="Brand">
          <BrandFilter brands={brands} />
        </FilterSection>
      )}
    </div>
  );
}
