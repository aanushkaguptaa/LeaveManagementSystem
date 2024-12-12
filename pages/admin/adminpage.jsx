import { useEffect, useState, useCallback } from 'react';
import styles from '../../src/styles/admin/index.module.css'; 
import TopNavBar from '../../src/components/TopNavBar'; 
import SideNavBar from '../../src/components/admin/SideNavBar'; 
import Card from '../../src/components/admin/Card';
import { useRouter } from 'next/router';
import ProtectedRoute from '@/components/ProtectedRoute';

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

  const [leaveData, setLeaveData] = useState({
    employeesPresent: 45,
    fullLeave: 1,
    halfLeave: 2,
    rhLeave: 0,
    compOffLeave: 0
  });

 // Comment out or remove the useEffect for now since we're not using the API yet
  /* 
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        setUser({
          name: data.name,
          email: data.email,
          profilePicture: data.profilePicture
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Use default values for testing if API call fails
        setUser({
          name: "Admin",
          email: "admin@domain.com",
          profilePicture: "/admin-profile.png"
        });
      }
    };

    fetchUserData();
  }, []);
   */

  const onDashboardIconClick = useCallback(() => {
    router.push('/admin/adminpage');
  }, [router]);


  const onAttendanceOverviewIconClick = useCallback(() => {
    router.push('/admin/attendanceOverview');
  }, [router]);

  const handleViewAttendanceClick = useCallback(() => {
    router.push('/admin/attendanceOverview');
  }, [router]);

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
            altText="Employees Icon"
          />
          <Card
            title="Half Leave"
            count={leaveData.halfLeave}
            iconSrc="/half-leave-icon.svg"
            altText="Half Leave Icon"
          />
          <Card
            title="Full Leave"
            count={leaveData.fullLeave}
            iconSrc="/full-leave-icon.svg"
            altText="Full Leave Icon"
          />
          <Card
            title="RH"
            count={leaveData.rhLeave}
            iconSrc="/rh-icon.svg"
            altText="RH Icon"
          />
          <Card
            title="Comp Off"
            count={leaveData.compOffLeave}
            iconSrc="/comp-off-icon.svg"
            altText="Comp Off Icon"
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
              {/* Example data, replace with dynamic data */}
              <tr>
                <td>12345678</td>
                <td>John Doe</td>
                <td>Full Leave</td>
              </tr>
              <tr>
                <td>67890567</td>
                <td>Jane Smith</td>
                <td>Half Leave</td>
              </tr>
            </tbody>
          </table>
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