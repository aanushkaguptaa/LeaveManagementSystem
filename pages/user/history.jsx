import { useState, useEffect } from 'react';
import TopNavBar from '@/components/TopNavBar';
import SideNavBar from '@/components/user/SideNavBar';
import styles from '@/styles/user/history.module.css';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { exportToExcel } from '@/utils/historyExport';

const History = () => {
  const { user } = useAuth();
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fetchHistory = async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({
        sapId: user.sapId,
        ...filters
      });

      const response = await fetch(`/api/user/fetchHistory?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setHistoryData(data.requests);
      } else {
        console.error('Failed to fetch history');
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user.sapId]);

  const handleApplySearch = async (type, value) => {
    setSearchFilters(prev => ({
      ...prev,
      ...value
    }));
    
    if (type === 'calendar') {
      await fetchHistory({
        startDate: value.startDate,
        endDate: value.endDate
      });
    }
    
    setActivePopup(null);
  };

  const handleExport = () => {
    if (historyData.length === 0) {
      alert('No data to export');
      return;
    }
    exportToExcel(historyData);
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
                <button 
                  className={`${styles.searchButton} ${(searchFilters.startDate || searchFilters.endDate) ? styles.active : ''}`}
                  onClick={() => {
                    if (searchFilters.startDate || searchFilters.endDate) {
                      setSearchFilters(prev => ({ ...prev, startDate: '', endDate: '' }));
                      fetchHistory({});
                    } else {
                      handleSearchClick('calendar');
                    }
                  }}
                >
                  Search by Date
                </button>
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
                  <th>Cancelled</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className={styles.loading}>Loading...</td>
                  </tr>
                ) : (
                  historyData.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.leaveType}</td>
                      <td>{record.fromDate}</td>
                      <td>{record.toDate}</td>
                      <td>{record.requestedOn}</td>
                      <td>{record.cancelled}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
      {activePopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <button className={styles.closeButton} onClick={handleClosePopup}>×</button>

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