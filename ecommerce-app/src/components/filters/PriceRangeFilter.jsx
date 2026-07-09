import { useState, useEffect, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMinPrice, setMaxPrice } from "../../features/products/filtersSlice";
import { useDebounce } from "../../hooks/useDebounce";
import { DEBOUNCE_DELAY } from "../../utils/constants";

export default function PriceRangeFilter() {
  const dispatch = useDispatch();
  const uid = useId();
  const minId = `${uid}-min`;
  const maxId = `${uid}-max`;
  const { minPrice: reduxMin, maxPrice: reduxMax } = useSelector(
    (state) => state.filters,
  );

  const [localMin, setLocalMin] = useState(reduxMin);
  const [localMax, setLocalMax] = useState(reduxMax);

  const debouncedMin = useDebounce(localMin, DEBOUNCE_DELAY);
  const debouncedMax = useDebounce(localMax, DEBOUNCE_DELAY);

  const invalid =
    localMin !== "" && localMax !== "" && Number(localMin) > Number(localMax);

  useEffect(() => {
    if (invalid) return; // skip applying an invalid range
    dispatch(setMinPrice(debouncedMin));
  }, [debouncedMin, invalid, dispatch]);

  useEffect(() => {
    if (invalid) return;
    dispatch(setMaxPrice(debouncedMax));
  }, [debouncedMax, invalid, dispatch]);

  // Sync if filters reset externally
  useEffect(() => {
    setLocalMin(reduxMin);
  }, [reduxMin]);

  useEffect(() => {
    setLocalMax(reduxMax);
  }, [reduxMax]);

  const inputClass = (isInvalid) =>
    `w-full border rounded-md px-2.5 py-2 text-sm focus:outline-none ${
      isInvalid
        ? "border-red-400 focus:border-red-500"
        : "border-gray-300 focus:border-blue-500"
    }`;

  return (
    <div>
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <label htmlFor={minId} className="text-xs text-gray-500 block mb-1">
            Min ($)
          </label>
          <input
            id={minId}
            type="number"
            min="0"
            placeholder="0"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            aria-invalid={invalid}
            className={inputClass(invalid)}
          />
        </div>
        <span className="text-gray-400 mt-4">–</span>
        <div className="flex-1">
          <label htmlFor={maxId} className="text-xs text-gray-500 block mb-1">
            Max ($)
          </label>
          <input
            id={maxId}
            type="number"
            min="0"
            placeholder="∞"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            aria-invalid={invalid}
            className={inputClass(invalid)}
          />
        </div>
      </div>
      {invalid && (
        <p role="alert" className="text-xs text-red-500 mt-1.5">
          Min price can’t be greater than max price.
        </p>
      )}
    </div>
  );
}
