import { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import SideNavBar from '@/components/user/SideNavBar';
import styles from '@/styles/user/history.module.css';
import ProtectedRoute from '@/components/ProtectedRoute';

const History = () => {
  const [user] = useState({
    name: "User",
    email: "user@domain.com",
    profilePicture: "/profile.png"
  });

  const [activePopup, setActivePopup] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    sapId: '',
    startDate: '',
    endDate: ''
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

  const [historyData] = useState([
    {
      id: 'REQ001',
      leaveType: "Full Leave",
      fromDate: "15 March 2024",
      toDate: "16 March 2024",
      requestedOn: "10 March 2024"
    },
    {
      id: 'REQ002',
      leaveType: "Sick Leave",
      fromDate: "17 March 2024",
      toDate: "18 March 2024",
      requestedOn: "12 March 2024"
    },
    {
      id: 'REQ003',
      leaveType: "Casual Leave",
      fromDate: "19 March 2024",
      toDate: "20 March 2024",
      requestedOn: "13 March 2024"
    },
    {
      id: 'REQ004',
      leaveType: "Vacation Leave",
      fromDate: "21 March 2024",
      toDate: "22 March 2024",
      requestedOn: "14 March 2024"
    },
    {
      id: 'REQ005',
      leaveType: "Maternity Leave",
      fromDate: "23 March 2024",
      toDate: "24 March 2024",
      requestedOn: "15 March 2024"
    },
    {
      id: 'REQ006',
      leaveType: "Paternity Leave",
      fromDate: "25 March 2024",
      toDate: "26 March 2024",
      requestedOn: "16 March 2024"
    },
    {
      id: 'REQ007',
      leaveType: "Bereavement Leave",
      fromDate: "27 March 2024",
      toDate: "28 March 2024",
      requestedOn: "17 March 2024"
    },
    {
      id: 'REQ008',
      leaveType: "Study Leave",
      fromDate: "29 March 2024",
      toDate: "30 March 2024",
      requestedOn: "18 March 2024"
    },
    {
      id: 'REQ009',
      leaveType: "Personal Leave",
      fromDate: "31 March 2024",
      toDate: "1 April 2024",
      requestedOn: "19 March 2024"
    },
    {
      id: 'REQ010',
      leaveType: "Compassionate Leave",
      fromDate: "2 April 2024",
      toDate: "3 April 2024",
      requestedOn: "20 March 2024"
    },
    // Add more records as needed
  ]);

  const handleExport = () => {
    // Logic to export data to Excel
    console.log("Exporting to Excel...");
  };

  return (
    <div className={styles.dashboard}>
      <TopNavBar user={user} />
      <div className={styles.mainContainer}>
        <SideNavBar activePage="history" />
        <main className={styles.mainContent}>
          <div className={styles.tableContainer}>
            <h1>Request History</h1>
            <div className={styles.tableActions}>
              {/* Export to Excel Button */}
              <button className={styles.exportButton} onClick={handleExport}>
                Export to Excel
              </button>
              {/* Search Filters */}
              <div className={styles.searchSection}>
                <button className={`${styles.searchButton} ${styles.sapIdButton}`} onClick={() => handleSearchClick('sapId')}>SAP-ID</button>
                <button className={styles.searchButton} onClick={() => handleSearchClick('calendar')}>Calendar</button>
              </div>
            </div>
            <table className={styles.historyTable}>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Leave Type</th>
                  <th>Leave Request Date From</th>
                  <th>Leave Request Date To</th>
                  <th>Leave Requested On</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((record, index) => (
                  <tr key={index}>
                    <td>{record.id}</td>
                    <td>{record.leaveType}</td>
                    <td>{record.fromDate}</td>
                    <td>{record.toDate}</td>
                    <td>{record.requestedOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default function UserPage() {
  return (
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  );
}