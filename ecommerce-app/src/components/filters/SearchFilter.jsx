import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { setSearchQuery } from '../../features/products/filtersSlice';
import { useDebounce } from '../../hooks/useDebounce';
import { DEBOUNCE_DELAY } from '../../utils/constants';

export default function SearchFilter() {
  const dispatch = useDispatch();
  const reduxQuery = useSelector((state) => state.filters.searchQuery);
  const [query, setQuery] = useState(reduxQuery);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);

  useEffect(() => {
    dispatch(setSearchQuery(debouncedQuery));
  }, [debouncedQuery, dispatch]);

  useEffect(() => {
    setQuery(reduxQuery);
  }, [reduxQuery]);

  return (
    <div className="relative">
      <SearchIcon fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full border border-gray-300 rounded-md pl-9 pr-9 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <CloseIcon fontSize="small" />
        </button>
      )}
    </div>
  );
}
