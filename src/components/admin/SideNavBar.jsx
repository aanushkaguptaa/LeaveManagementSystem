import React from 'react';
import Image from 'next/image';
import styles from '../../styles/admin/SideNavBar.module.css';

const SideNavBar = ({ onDashboardIconClick, onAttendanceOverviewIconClick, activePage }) => {
  return (
    <aside className={styles.sidenav} id="sideNav">
      {/* Dashboard icon with click handler */}
      <Image
        className={styles.dashboardIcon}
        width={24}
        height={24}
        alt="Dashboard Icon"
        src={activePage === 'dashboard' ? "/dashboard-icon-active.svg" : "/dashboard-icon.svg"}
        onClick={onDashboardIconClick}
        style={{ cursor: 'pointer' }}
        title="Go to Dashboard"
      />
      {/* Attendance overview icon with click handler */}
      <Image
        className={styles.attendanceOverviewIcon}
        width={24}
        height={24}
        alt="Attendance Overview Icon"
        src={activePage === 'attendanceOverview' ? "/attendance-overview-icon-active.svg" : "/attendance-overview-icon.svg"}
        onClick={onAttendanceOverviewIconClick}
        style={{ cursor: 'pointer' }}
        title="Go to Attendance Overview"
      />
    </aside>
  );
};

export default SideNavBar;