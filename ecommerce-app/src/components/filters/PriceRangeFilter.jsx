import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMinPrice, setMaxPrice } from '../../features/products/filtersSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { DEBOUNCE_DELAY } from '../../utils/constants';

export default function PriceRangeFilter() {
  const dispatch = useDispatch();
  const { minPrice: reduxMin, maxPrice: reduxMax } = useSelector((state) => state.filters);

  // Local state for controlled inputs — debounced before dispatching
  const [localMin, setLocalMin] = useState(reduxMin);
  const [localMax, setLocalMax] = useState(reduxMax);

  const debouncedMin = useDebounce(localMin, DEBOUNCE_DELAY);
  const debouncedMax = useDebounce(localMax, DEBOUNCE_DELAY);

  useEffect(() => {
    dispatch(setMinPrice(debouncedMin));
  }, [debouncedMin, dispatch]);

  useEffect(() => {
    dispatch(setMaxPrice(debouncedMax));
  }, [debouncedMax, dispatch]);

  // Sync if filters reset externally
  useEffect(() => {
    setLocalMin(reduxMin);
  }, [reduxMin]);

  useEffect(() => {
    setLocalMax(reduxMax);
  }, [reduxMax]);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <label htmlFor="min-price" className="text-xs text-gray-500 block mb-1">Min ($)</label>
        <input
          id="min-price"
          type="number"
          min="0"
          placeholder="0"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2.5 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
      <span className="text-gray-400 mt-4">–</span>
      <div className="flex-1">
        <label htmlFor="max-price" className="text-xs text-gray-500 block mb-1">Max ($)</label>
        <input
          id="max-price"
          type="number"
          min="0"
          placeholder="∞"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-2.5 py-2 text-sm focus:outline-none focus:border-blue-500"
        />
      </div>
    </div>
  );
}
