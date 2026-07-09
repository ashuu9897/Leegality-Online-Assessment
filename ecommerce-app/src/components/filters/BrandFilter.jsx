import { useId } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleBrand } from '../../features/products/filtersSlice';

export default function BrandFilter({ brands }) {
  const dispatch = useDispatch();
  const uid = useId();
  const selectedBrands = useSelector((state) => state.filters.selectedBrands);

  if (brands.length === 0) return null;

  return (
    <ul role="list" className="-mx-2 max-h-72 overflow-y-auto">
        {brands.map(({ brand, count }) => {
          const checked = selectedBrands.includes(brand);
          const id = `${uid}-${brand.replace(/\s+/g, '-').toLowerCase()}`;
          return (
            <li key={brand}>
              <label
                htmlFor={id}
                className="flex items-center gap-3 px-2 py-2.5 rounded cursor-pointer hover:bg-gray-100"
              >
                <input
                  type="checkbox"
                  id={id}
                  checked={checked}
                  onChange={() => dispatch(toggleBrand(brand))}
                  className="w-4.5 h-4.5 accent-[#007185] rounded border-gray-300 cursor-pointer shrink-0"
                />
                <span className="text-[15px] text-gray-800 flex-1 flex justify-between">
                  <span>{brand}</span>
                  <span className="text-sm text-gray-400">({count})</span>
                </span>
              </label>
            </li>
          );
        })}
    </ul>
  );
}
