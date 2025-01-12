import Image from 'next/image';
import styles from '../../styles/admin/index.module.css';

const Card = ({ title, count, iconSrc, altText, tooltipText }) => {
  return (
    <div className={styles.card} title={tooltipText}>
      <div className={styles.cardContent}>
        {/* Display card title and count */}
        <h3 className={styles.cardTitle}>{title}</h3>
        <p className={styles.cardCount}>{count}</p>
      </div>
      {/* Display card icon */}
      <img src={iconSrc} alt={altText} className={styles.cardIcon} />
    </div>
  );
};

export default Card;