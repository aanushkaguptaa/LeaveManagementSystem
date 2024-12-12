import { useEffect, useState, useCallback } from 'react';
import styles from '../../src/styles/admin/overview.module.css'; 
import TopNavBar from '../../src/components/TopNavBar'; 
import SideNavBar from '../../src/components/admin/SideNavBar'; 
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';

const SCREEN1ADP = () => {
  const [user, setUser] = useState({
    name: "Admin",
    email: "admin@domain.com",
    profilePicture: "/profile.png"
  });

  const router = useRouter(); 
  const onDashboardIconClick = useCallback(() => {
    router.push('/admin/adminpage');
  }, [router]);

  const onAttendanceOverviewIconClick = useCallback(() => {
    router.push('/admin/attendanceOverview');
  }, [router]);

  const attendanceData = [
    {
      sapId: "2341421",
      employeeName: "Ali Alhamdan",
      leaveType: "Full Leave",
      leaveRequestDateFrom: "29 July 2023",
      leaveRequestDateTo: "29 July 2023",
      leaveRequestedOn: "02 July 2023"
    },
    {
      sapId: "3411421",
      employeeName: "Ahmed Rashdan",
      leaveType: "Half Leave",
      leaveRequestDateFrom: "29 July 2023",
      leaveRequestDateTo: "29 July 2023",
      leaveRequestedOn: "04 July 2023"
    },
  ];

  const [activePopup, setActivePopup] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    sapId: '',
    employeeName: '',
    startDate: '',
    endDate: '',
    leaveType: ''
  });

  const handleSearchClick = (popupType) => {
    setActivePopup(popupType);
  };

  const handleClosePopup = () => {
    setActivePopup(null);
  };

  const handleApplySearch = (type, value) => {
    setSearchFilters(prev => ({
      ...prev,
      ...value
    }));
    setActivePopup(null);
  };

  return (
    <div className={styles.screen1Adp}>
    <TopNavBar user={user} />
    <SideNavBar 
        onDashboardIconClick={onDashboardIconClick} 
        onAttendanceOverviewIconClick={onAttendanceOverviewIconClick} 
        activePage="attendanceOverview" 
    />
    <main className={styles.mainContent}>
    <div className={styles.tableContainer}>
    <h1 className={styles.title}>Attendance Overview</h1>
    <div className={styles.headerSection}>
    <button className={styles.exportButton}>Export to Excel</button>
    
    <div className={styles.searchSection}>
      <span className={styles.searchLabel}>Search By:</span>

      <div className={styles.searchButtons}>
        <button className={styles.searchButton} onClick={() => handleSearchClick('sapId')}>SAP-ID</button>
        <button className={styles.searchButton} onClick={() => handleSearchClick('employeeName')}>Employee-Name</button>
        <button className={styles.searchButton} onClick={() => handleSearchClick('calendar')}>Calendar</button>
        <button className={styles.searchButton} onClick={() => handleSearchClick('leaveType')}>Leave Type</button>
      </div>

      </div>
     </div>

        <table className={styles.overviewTable}>
            <thead>
              <tr>
                <th>SAP ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Leave Request Date From</th>
                <th>Leave Request Date To</th>
                <th>Leave Requested On</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((item, index) => (
                <tr key={index}>
                  <td>{item.sapId}</td>
                  <td>{item.employeeName}</td>
                  <td>{item.leaveType}</td>
                  <td>{item.leaveRequestDateFrom}</td>
                  <td>{item.leaveRequestDateTo}</td>
                  <td>{item.leaveRequestedOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

  {activePopup && (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClosePopup}>×</button>
        
        {activePopup === 'sapId' && (
          <>
            <h2>Enter SAP ID</h2>
            <input 
              type="text" 
              value={searchFilters.sapId}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, sapId: e.target.value }))}
            />
            <button 
              className={styles.doneButton}
              onClick={() => handleApplySearch('sapId', { sapId: searchFilters.sapId })}
            >
              Done
            </button>
          </>
        )}

        {activePopup === 'employeeName' && (
          <>
            <h2>Enter Employee Name</h2>
            <input 
              type="text"
              value={searchFilters.employeeName}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, employeeName: e.target.value }))}
            />
            <button 
              className={styles.doneButton}
              onClick={() => handleApplySearch('employeeName', { employeeName: searchFilters.employeeName })}
            >
              Done
            </button>
          </>
        )}

        {activePopup === 'calendar' && (
          <>
            <h2>Enter Dates</h2>
            <div className={styles.dateSection}>
              <h3>Start Date</h3>
              <input 
                type="date"
                value={searchFilters.startDate}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, startDate: e.target.value }))}
              />
              <h3>End Date</h3>
              <input 
                type="date"
                value={searchFilters.endDate}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            <button 
              className={styles.doneButton}
              onClick={() => handleApplySearch('calendar', { 
                startDate: searchFilters.startDate,
                endDate: searchFilters.endDate 
              })}
            >
              Done
            </button>
          </>
        )}

        {activePopup === 'leaveType' && (
          <>
            <h2>Select Leave Type</h2>
            <select 
              value={searchFilters.leaveType}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, leaveType: e.target.value }))}
            >
              <option value="">Select...</option>
              <option value="Half Day">Half Day</option>
              <option value="Full Day">Full Day</option>
              <option value="Restricted Holiday">Restricted Holiday</option>
              <option value="Compensatory Off">Compensatory Off</option>
            </select>
            <button 
              className={styles.doneButton}
              onClick={() => handleApplySearch('leaveType', { leaveType: searchFilters.leaveType })}
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  )}
      </main>
    </div>
  );
};

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <SCREEN1ADP />
    </ProtectedRoute>
  );
}