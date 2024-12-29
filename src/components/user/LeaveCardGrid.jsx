import styles from '@/styles/user/LeaveCardGrid.module.css'; 
import LeaveCard from './LeaveCard';

const LeaveCardsGrid = ({ leaveStats, tooltipTexts }) => {
  return (
    <div className={styles.cardsGrid}>
      <LeaveCard
        title="Full Leave"
        {...leaveStats.fullLeave}
        tooltipText={tooltipTexts.fullLeave}
      />
      <LeaveCard
        title="Half Leave"
        {...leaveStats.halfLeave}
        tooltipText={tooltipTexts.halfLeave}
      />
      <LeaveCard
        title="RH"
        {...leaveStats.rhLeave}
        tooltipText={tooltipTexts.rhLeave}
      />
      <LeaveCard
        title="Comp Off"
        {...leaveStats.compOffLeave}
        tooltipText={tooltipTexts.compOffLeave}
      />
    </div>
  );
};

export default LeaveCardsGrid;