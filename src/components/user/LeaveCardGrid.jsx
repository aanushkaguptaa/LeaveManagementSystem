import styles from '@/styles/user/LeaveCardGrid.module.css'; 
import LeaveCard from './LeaveCard';

const LeaveCardsGrid = ({ leaveStats, tooltipTexts, isLoading }) => {
  return (
    <div className={styles.cardsGrid}>
      {/* Render leave cards for each leave type */}
      <LeaveCard
        title="Full Leave"
        {...leaveStats.fullLeave}
        tooltipText={tooltipTexts.fullLeave}
        isLoading={isLoading}
      />
      <LeaveCard
        title="Half Leave"
        {...leaveStats.halfLeave}
        tooltipText={tooltipTexts.halfLeave}
        isLoading={isLoading}
      />
      <LeaveCard
        title="RH"
        {...leaveStats.rhLeave}
        tooltipText={tooltipTexts.rhLeave}
        isLoading={isLoading}
      />
      <LeaveCard
        title="Comp Off"
        {...leaveStats.compOffLeave}
        tooltipText={tooltipTexts.compOffLeave}
        isLoading={isLoading}
      />
    </div>
  );
};

export default LeaveCardsGrid;