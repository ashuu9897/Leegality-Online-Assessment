import { Rating } from '@mui/material';

export default function RatingStars({ value, count }) {
  return (
    <div className="flex items-center gap-1">
      <Rating value={value} precision={0.5} readOnly size="small" />
      <span className="text-sm text-gray-500">({value?.toFixed(1)})</span>
      {count !== undefined && (
        <span className="text-xs text-gray-400">· {count} reviews</span>
      )}
    </div>
  );
}
