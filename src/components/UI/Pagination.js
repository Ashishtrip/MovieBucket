import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination renders numbered page controls.
 * It shows the current page, neighbours, and ellipsis for large page counts.
 *
 * @param {Object} props
 * @param {number} props.currentPage  - Active page (1-indexed).
 * @param {number} props.totalPages   - Total number of pages available.
 * @param {Function} props.onPageChange - Called with the new page number.
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Cap displayed pages to TMDB's 500-page public API limit
  const maxPage = Math.min(totalPages, 500);

  /**
   * Build the array of page numbers / ellipsis markers to display.
   * Always shows first, last, current, and immediate neighbours.
   */
  const buildPageList = () => {
    const pages = [];
    const delta = 2; // pages shown on each side of current

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(maxPage - 1, currentPage + delta);

    pages.push(1);
    if (rangeStart > 2) pages.push('...');
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (rangeEnd < maxPage - 1) pages.push('...');
    if (maxPage > 1) pages.push(maxPage);

    return pages;
  };

  const pageList = buildPageList();

  const btnBase =
    'min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-themeGlow focus-visible:ring-offset-2 focus-visible:ring-offset-themeBase';
  const activeBtn = 'bg-themeAccent text-themeBase shadow-glow';
  const inactiveBtn =
    'bg-themeBase/60 text-themeAccent border border-themeAccent/30 hover:bg-themeAccent/20 hover:border-themeAccent/60';
  const arrowBtn =
    'bg-themeBase/60 text-themeAccent border border-themeAccent/30 hover:bg-themeAccent/20 disabled:opacity-40 disabled:cursor-not-allowed';

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-2 mt-10 flex-wrap"
    >
      {/* Previous */}
      <button
        aria-label="Previous page"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${btnBase} ${arrowBtn} px-2`}
      >
        <ChevronLeft className="w-4 h-4" aria-hidden="true" />
      </button>

      {/* Page numbers */}
      {pageList.map((page, idx) =>
        page === '...' ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden="true"
            className="text-themeAccent/50 px-1"
          >
            …
          </span>
        ) : (
          <button
            key={page}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            onClick={() => onPageChange(page)}
            className={`${btnBase} px-2 ${
              page === currentPage ? activeBtn : inactiveBtn
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next */}
      <button
        aria-label="Next page"
        disabled={currentPage >= maxPage}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${btnBase} ${arrowBtn} px-2`}
      >
        <ChevronRight className="w-4 h-4" aria-hidden="true" />
      </button>
    </nav>
  );
};

export default Pagination;
