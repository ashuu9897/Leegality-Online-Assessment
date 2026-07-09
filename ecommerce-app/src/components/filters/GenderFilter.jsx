import { useId, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleGender } from '../../features/products/filtersSlice';
import { filterProducts, productGender } from '../../utils/filterProducts';

const GENDERS = [
  { key: 'men', label: 'Men' },
  { key: 'women', label: 'Women' },
];

export default function GenderFilter() {
  const dispatch = useDispatch();
  const uid = useId();
  const allProducts = useSelector((state) => state.products.allProducts);
  const { minPrice, maxPrice, searchQuery, selectedBrands, selectedGenders } = useSelector(
    (state) => state.filters
  );

  // Faceted counts: over products matching the other filters, ignoring gender itself.
  const counts = useMemo(() => {
    const base = filterProducts(allProducts, {
      minPrice,
      maxPrice,
      searchQuery,
      selectedBrands,
      selectedGenders: [],
    });
    const c = { men: 0, women: 0 };
    base.forEach((p) => {
      const g = productGender(p.category);
      if (g in c) c[g] += 1;
    });
    return c;
  }, [allProducts, minPrice, maxPrice, searchQuery, selectedBrands]);

  return (
    <ul role="list" className="-mx-2">
      {GENDERS.map(({ key, label }) => {
        const id = `${uid}-${key}`;
        const checked = selectedGenders.includes(key);
        return (
          <li key={key}>
            <label
              htmlFor={id}
              className="flex items-center gap-3 px-2 py-2.5 rounded cursor-pointer hover:bg-gray-100"
            >
              <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={() => dispatch(toggleGender(key))}
                className="w-4.5 h-4.5 accent-[#007185] rounded border-gray-300 cursor-pointer shrink-0"
              />
              <span className="text-[15px] text-gray-800 flex-1 flex justify-between">
                <span>{label}</span>
                <span className="text-sm text-gray-400">({counts[key]})</span>
              </span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
