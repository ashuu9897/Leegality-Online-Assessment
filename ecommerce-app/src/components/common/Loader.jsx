import { Skeleton } from '@mui/material';

export default function Loader({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-sm">
          <Skeleton variant="rectangular" height={220} animation="wave" />
          <div className="p-3">
            <Skeleton variant="text" height={20} animation="wave" />
            <Skeleton variant="text" width="60%" height={20} animation="wave" />
            <Skeleton variant="text" width="40%" height={28} animation="wave" style={{ marginTop: 8 }} />
            <Skeleton variant="text" width="50%" height={20} animation="wave" />
          </div>
        </div>
      ))}
    </div>
  );
}
