import { useEffect, useState, useCallback } from 'react';
import styles from '../../src/styles/admin/overview.module.css'; 
import TopNavBar from '../../src/components/TopNavBar'; 
import SideNavBar from '../../src/components/admin/SideNavBar'; 
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import { exportToExcel } from '@/utils/excelExport';
import Pagination from '../../src/components/admin/Pagination';
import FilterButton from '../../src/components/admin/FilterButton';

const SCREEN1ADP = () => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: "",
      sapId: "",
      role: ""
    };
  });

  const router = useRouter(); 
  const onDashboardIconClick = useCallback(() => {
    router.push('/admin/adminpage');
  }, [router]);

  const onAttendanceOverviewIconClick = useCallback(() => {
    router.push('/admin/attendanceOverview');
  }, [router]);

  const [attendanceData, setAttendanceData] = useState([]);

  const [activePopup, setActivePopup] = useState(null);
  const [searchFilters, setSearchFilters] = useState({
    sapId: '',
    employeeName: '',
    startDate: '',
    endDate: '',
    leaveType: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const queryParams = new URLSearchParams({
          ...searchFilters,
          page: currentPage,
          limit: itemsPerPage
        }).toString();
        
        const response = await fetch(`/api/admin/attendanceOverview?${queryParams}`);
        const data = await response.json();
        
        setAttendanceData(data.requests);
        setTotalPages(data.pagination.totalPages);
      } catch (error) {
        console.error('Error fetching attendance data:', error);
      }
    };

    fetchAttendanceData();
  }, [searchFilters, currentPage]);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };


  const handleExportClick = async () => {
    try {
      const queryParams = new URLSearchParams({
        ...searchFilters,
        limit: '0'
      }).toString();
      
      const response = await fetch(`/api/admin/attendanceOverview?${queryParams}`);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      if (!data.requests || data.requests.length === 0) {
        alert('No data available to export');
        return;
      }
  
      const exportData = data.requests.map(item => ({
        'SAP ID': item.sapId,
        'Employee Name': item.employeeName,
        'Leave Type': item.leaveType,
        'From Date': item.leaveRequestDateFrom,
        'To Date': item.leaveRequestDateTo,
        'Requested On': item.leaveRequestedOn
      }));
    
      await exportToExcel(exportData, 'attendance_overview');
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export data');
    }
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
            <button className={styles.exportButton} onClick={handleExportClick}>Export to Excel</button>
            
            <div className={styles.searchSection}>
              <span className={styles.searchLabel}>Search By:</span>
              <div className={styles.searchButtons}>
                <button 
                  className={`${styles.searchButton} ${searchFilters.sapId ? styles.active : ''}`}
                  onClick={() => searchFilters.sapId ? setSearchFilters(prev => ({ ...prev, sapId: '' })) : handleSearchClick('sapId')}
                >
                  SAP-ID
                </button>
                <button 
                  className={`${styles.searchButton} ${searchFilters.employeeName ? styles.active : ''}`}
                  onClick={() => searchFilters.employeeName ? setSearchFilters(prev => ({ ...prev, employeeName: '' })) : handleSearchClick('employeeName')}
                >
                  Employee-Name
                </button>
                <button 
                  className={`${styles.searchButton} ${(searchFilters.startDate || searchFilters.endDate) ? styles.active : ''}`}
                  onClick={() => (searchFilters.startDate || searchFilters.endDate) ? 
                    setSearchFilters(prev => ({ ...prev, startDate: '', endDate: '' })) : 
                    handleSearchClick('calendar')}
                >
                  Calendar
                </button>
                <button 
                  className={`${styles.searchButton} ${searchFilters.leaveType ? styles.active : ''}`}
                  onClick={() => searchFilters.leaveType ? setSearchFilters(prev => ({ ...prev, leaveType: '' })) : handleSearchClick('leaveType')}
                >
                  Leave Type
                </button>
              </div>
            </div>
          </div>

          <div className={styles.activeFilters}>
            {searchFilters.sapId && (
              <FilterButton 
                label="SAP ID" 
                value={searchFilters.sapId} 
                onRemove={() => setSearchFilters(prev => ({ ...prev, sapId: '' }))} 
              />
            )}
            {searchFilters.employeeName && (
              <FilterButton 
                label="Employee Name" 
                value={searchFilters.employeeName} 
                onRemove={() => setSearchFilters(prev => ({ ...prev, employeeName: '' }))} 
              />
            )}
            {/* Add more filters as needed */}
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
                  <th>Cancelled</th>
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
                    <td>{item.cancelled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
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