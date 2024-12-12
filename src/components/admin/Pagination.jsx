import { useState } from 'react';
import styles from '../../styles/admin/pagination.module.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const [jumpToPage, setJumpToPage] = useState('');

  const handleJumpSubmit = (e) => {
    e.preventDefault();
    const pageNum = parseInt(jumpToPage);
    if (pageNum >= 1 && pageNum <= totalPages) {
      onPageChange(pageNum);
      setJumpToPage('');
    }
  };

  return (
    <div className={styles.pagination}>
      <button 
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={styles.paginationButton}
      >
        Previous
      </button>
      
      <span className={styles.pageInfo}>
        Page {currentPage} of {totalPages}
      </span>

      <button 
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={styles.paginationButton}
      >
        Next
      </button>

      <form onSubmit={handleJumpSubmit} className={styles.jumpForm}>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={jumpToPage}
          onChange={(e) => setJumpToPage(e.target.value)}
          placeholder="Jump to page"
          className={styles.jumpInput}
        />
        <button type="submit" className={styles.jumpButton}>Go</button>
      </form>
    </div>
  );
};

export default Pagination;