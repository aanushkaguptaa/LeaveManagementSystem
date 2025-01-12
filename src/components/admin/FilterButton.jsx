import styles from '../../styles/admin/overview.module.css';

// Component to display a filter button with a label and value
const FilterButton = ({ label, value, onRemove }) => {
  // If no value is provided, do not render the component
  if (!value) return null;

  return (
    <div className={styles.filterButton}>
      {/* Display the filter label and value */}
      <span>{label}: {value}</span>
      {/* Button to remove the filter */}
      <button onClick={onRemove} className={styles.removeFilter}>×</button>
    </div>
  );
};

export default FilterButton;