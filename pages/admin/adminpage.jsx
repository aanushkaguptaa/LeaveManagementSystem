import { useEffect, useState, useCallback } from 'react';
import styles from '../../src/styles/admin/index.module.css'; 
import TopNavBar from '../../src/components/TopNavBar'; 
import SideNavBar from '../../src/components/admin/SideNavBar'; 
import Card from '../../src/components/admin/Card';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';
import Pagination from '../../src/components/admin/Pagination';

const SCREEN2ADP = () => {
  const router = useRouter(); 
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : {
      name: "",
      sapId: "",
      role: ""
    };
  });
  const tooltipTexts = {
    employeesPresent: "Total number of employees present",
    halfLeave: "Total employees on half leave. (Off-shore employees can have first half off and On-shore employees the second respectively)",
    fullLeave: "Total employees on full leave",
    rhLeave: "Total employees on RH leave",
    compOffLeave: "Total employees on comp-off leave"
  };

  const [leaveData, setLeaveData] = useState({
    employeesPresent: 0,
    fullLeave: 0,
    halfLeave: 0,
    rhLeave: 0,
    compOffLeave: 0
  });

  const [onLeaveToday, setOnLeaveToday] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/adminpage?page=${currentPage}&limit=${itemsPerPage}`);
        const data = await response.json();
        if (response.ok) {
          setLeaveData(data.leaveData);
          setOnLeaveToday(data.onLeaveToday);
          setTotalPages(data.pagination.totalPages);
        } else {
          console.error('Failed to fetch dashboard data:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentPage]);

  const onDashboardIconClick = useCallback(() => {
    router.push('/admin/adminpage');
  }, [router]);


  const onAttendanceOverviewIconClick = useCallback(() => {
    router.push('/admin/attendanceOverview');
  }, [router]);

  const handleViewAttendanceClick = useCallback(() => {
    router.push('/admin/attendanceOverview');
  }, [router]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  return (
    <div className={styles.screen2Adp}>
      <TopNavBar user={user} />
      <SideNavBar 
        onDashboardIconClick={onDashboardIconClick} 
        onAttendanceOverviewIconClick={onAttendanceOverviewIconClick} 
        activePage="dashboard" 
      />
      <main className={styles.mainContent}>
        <section className={styles.cardsSection}>
        <Card 
        title="Employees Present" 
        count={leaveData.employeesPresent} 
        iconSrc="/employees-icon.svg" 
        altText="Employees Present Icon"
        tooltipText={tooltipTexts.employeesPresent}
      />
      <Card 
        title="Half Leave" 
        count={leaveData.halfLeave} 
        iconSrc="/half-leave-icon.svg" 
        altText="Half Leave Icon"
        tooltipText={tooltipTexts.halfLeave}
      />
      <Card 
        title="Full Leave" 
        count={leaveData.fullLeave} 
        iconSrc="/full-leave-icon.svg" 
        altText="Full Leave Icon"
        tooltipText={tooltipTexts.fullLeave}
      />
      <Card 
        title="RH Leave" 
        count={leaveData.rhLeave} 
        iconSrc="/rh-icon.svg" 
        altText="RH Leave Icon"
        tooltipText={tooltipTexts.rhLeave}
      />
      <Card 
        title="Comp Off Leave" 
        count={leaveData.compOffLeave} 
        iconSrc="/comp-off-icon.svg" 
        altText="Comp Off Leave Icon"
        tooltipText={tooltipTexts.compOffLeave}
      />
        </section>

        <button className={styles.viewAttendanceButton} onClick={handleViewAttendanceClick}>
          View Attendance
        </button>

        <section className={styles.onLeaveTodaySection}>
          <h2 className={styles.onLeaveToday}>On Leave Today:</h2>
          <table className={styles.leaveTable}>
            <thead>
              <tr>
                <th>SAP ID</th>
                <th>Employee Name</th>
                <th>Leave Type</th>
              </tr>
            </thead>
            <tbody>
              {onLeaveToday.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.sapId}</td>
                  <td>{leave.employeeName}</td>
                  <td>{leave.leaveType}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            currentPage={currentPage} 
            totalPages={totalPages} 
            onPageChange={handlePageChange} 
          />
        </section>
      </main>
    </div>
  );
};

export default function AdminPage() {
  return (
    <ProtectedRoute adminOnly>
      <SCREEN2ADP />
    </ProtectedRoute>
  );
}