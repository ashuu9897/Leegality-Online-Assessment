import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const range = (start, end) =>
  Array.from({ length: end - start + 1 }, (_, i) => start + i);

function getPageItems(page, count, boundaryCount = 1, siblingCount = 1) {
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(
    Math.max(count - boundaryCount + 1, boundaryCount + 1),
    count,
  );

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0] - 2 : count - 1,
  );

  return [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? ["ellipsis-left"]
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? ["ellipsis-right"]
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ];
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showSingle = false,
  compact = false,
}) {
  if (totalPages < 1) return null;
  if (totalPages === 1 && !showSingle) return null;

  const items = getPageItems(currentPage, totalPages);
  const go = (p) => {
    if (p >= 1 && p <= totalPages && p !== currentPage) onPageChange(p);
  };

  const arrowBtn =
    "inline-flex items-center gap-1 px-2.5 sm:px-3 h-9 rounded-md text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors";

  return (
    <nav
      aria-label="Pagination"
      className={`flex justify-center ${compact ? "py-3" : "py-8"}`}
    >
      <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1.5 shadow-sm">
        {/* Previous */}
        <button
          onClick={() => go(currentPage - 1)}
          disabled={currentPage === 1}
          className={arrowBtn}
          aria-label="Previous page"
        >
          <ChevronLeftIcon sx={{ fontSize: 18 }} />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Page numbers */}
        {items.map((item, i) => {
          if (typeof item === "string") {
            return (
              <span
                key={item + i}
                className="w-9 h-9 flex items-center justify-center text-gray-400 select-none"
                aria-hidden="true"
              >
                …
              </span>
            );
          }
          const isActive = item === currentPage;
          return (
            <button
              key={item}
              onClick={() => go(item)}
              aria-current={isActive ? "page" : undefined}
              aria-label={`Page ${item}`}
              className={`w-9 h-9 rounded-md text-sm transition-colors ${
                isActive
                  ? "border border-gray-900 font-semibold text-gray-900"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item}
            </button>
          );
        })}

        {/* Next */}
        <button
          onClick={() => go(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={arrowBtn}
          aria-label="Next page"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRightIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </nav>
  );
}
