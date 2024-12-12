import styles from '../../styles/admin/overview.module.css';

const FilterButton = ({ label, value, onRemove }) => {
  if (!value) return null;

  return (
    <div className={styles.filterButton}>
      <span>{label}: {value}</span>
      <button onClick={onRemove} className={styles.removeFilter}>×</button>
    </div>
  );
};

export default FilterButton;