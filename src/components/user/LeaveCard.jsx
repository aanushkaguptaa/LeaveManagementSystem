import styles from '@/styles/user/LeaveCard.module.css';

const LeaveCard = ({ title, usedLeaves = 0, totalLeaves = 0, tooltipText, isLoading }) => {
  const safeUsedLeaves = Number(usedLeaves) || 0;
  const safeTotalLeaves = Number(totalLeaves) || 0;
  const percentage = (safeUsedLeaves / safeTotalLeaves) * 100 || 0;

  return (
    <div className={`${styles.card} ${isLoading ? styles.loading : ''}`} title={tooltipText}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <div className={styles.cardStats}>
        <div className={styles.progressCircle} style={{ '--percentage': percentage }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#E8EDFF"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              className={styles.circleProgress}
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40}`}
              transform="rotate(-90 50 50)"
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.progressText}
            >
              {`${safeUsedLeaves}/${safeTotalLeaves}`}
            </text>
          </svg>
        </div>
        <div className={styles.leaveStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Used</span>
            <span className={`${styles.statValue} ${styles.usedValue}`}>{safeUsedLeaves}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total</span>
            <span className={`${styles.statValue} ${styles.totalValue}`}>{safeTotalLeaves}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveCard;