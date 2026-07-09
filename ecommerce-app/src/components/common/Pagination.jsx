import { Pagination as MuiPagination } from '@mui/material';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center py-8">
      <div className="bg-white border border-gray-100 shadow-sm rounded-full px-3 py-2">
        <MuiPagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          shape="rounded"
          showFirstButton
          showLastButton
          siblingCount={1}
          size="medium"
        />
      </div>
    </div>
  );
}
