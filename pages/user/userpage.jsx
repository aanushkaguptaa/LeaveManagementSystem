import { useState, useEffect } from 'react';
import TopNavBar from '@/components/TopNavBar';
import SideNavBar from '@/components/user/SideNavBar';
import LeaveCardsGrid from '@/components/user/LeaveCardGrid';
import LeaveRequestsTable from '@/components/user/LeaveRequestsTable';
import styles from '@/styles/user/userpage.module.css';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

  const tooltipTexts = {
    halfLeave: "Off-shore employees can have first half off and On-shore employees the second respectively",
    fullLeave: "Regular full day leave",
    rhLeave: "Restricted Holiday - can be taken on specific dates only",
    compOffLeave: "Compensatory Off - leave granted for working on holidays/weekends"
  };

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  
  const [leaveRequest, setLeaveRequest] = useState({
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const isFormValid = () => {
    return (
      leaveRequest.type !== '' &&
      leaveRequest.startDate !== '' &&
      leaveRequest.endDate !== '' &&
      leaveRequest.reason.trim() !== ''
    );
  };

  const [activeRequests, setActiveRequests] = useState([]);
  const [leaveStats, setLeaveStats] = useState({
    fullLeave: {
      usedLeaves: 0,
      totalLeaves: 15
    },
    halfLeave: {
      usedLeaves: 0,
      totalLeaves: 10
    },
    rhLeave: {
      usedLeaves: 0,
      totalLeaves: 5
    },
    compOffLeave: {
      usedLeaves: 0,
      totalLeaves: 2
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const handleDeleteClick = (requestId) => {
    setDeleteRequestId(requestId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = async () => {
    try {
      console.log('Cancelling request:', deleteRequestId);
      const response = await fetch('/api/user/cancelRequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          requestId: parseInt(deleteRequestId, 10) 
        }),
      });

      if (response.ok) {
        await fetchUserData(); // Wait for the data to refresh
        setShowDeletePopup(false);
        setDeleteRequestId(null);
      } else {
        const data = await response.json();
        console.error('Cancel failed:', data);
        alert(data.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request');
    }
  };

  const handleCancelDelete = () => {
    setShowDeletePopup(false);
    setDeleteRequestId(null);
  };

  const handleRequestLeave = () => {
    setShowLeavePopup(true);
  };

  const handleClosePopup = () => {
    setShowLeavePopup(false);
    setLeaveRequest({
      type: '',
      startDate: '',
      endDate: '',
      reason: ''
    });
  };

  const handleSubmitLeave = async () => {
    if (isFormValid()) {
      try {
        const response = await fetch('/api/user/createRequest', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sapId: user.sapId,
            type: leaveRequest.type,
            from: leaveRequest.startDate,
            to: leaveRequest.endDate,
            reason: leaveRequest.reason
          }),
        });

        if (response.ok) {
          fetchUserData(); // Refresh the data
          handleClosePopup();
        } else {
          const data = await response.json();
          alert(data.message || 'Failed to create leave request');
        }
      } catch (error) {
        console.error('Error creating leave request:', error);
        alert('Failed to create leave request');
      }
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/dashboard?sapId=${user.sapId}`);
      const data = await response.json();
      if (response.ok) {
        setLeaveStats(data.leaveStats);
        setActiveRequests(data.activeRequests);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      console.log('Cancelling request:', requestId); // Debug log
      const response = await fetch('/api/user/cancelRequest', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          requestId: parseInt(requestId, 10) 
        }),
      });

      if (response.ok) {
        await fetchUserData(); // Wait for the data to refresh
      } else {
        const data = await response.json();
        console.error('Cancel failed:', data); // Debug log
        alert(data.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Error cancelling request:', error);
      alert('Failed to cancel request');
    }
  };

  useEffect(() => {
    fetchUserData();
    // Refresh data every 5 minutes
    const interval = setInterval(fetchUserData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user.sapId]);

  return (
    <div className={styles.dashboard}>
      <TopNavBar user={user} />
      <div className={styles.mainContainer}>
        <SideNavBar activePage="dashboard" />
        <main className={styles.mainContent}>
          <div className={styles.topSection}>
            <button 
              className={styles.requestLeaveButton}
              onClick={handleRequestLeave}
            >
              Request Leave
            </button>
          </div>
          
          <LeaveCardsGrid 
            leaveStats={leaveStats} 
            tooltipTexts={tooltipTexts}
            isLoading={isLoading}
          />
          
          <LeaveRequestsTable 
            requests={activeRequests}
            onDeleteRequest={handleDeleteClick}
          />

          {showDeletePopup && (
            <div className={styles.overlay}>
              <div className={`${styles.popup} ${styles.deletePopup}`}>
                <h2>Are you sure?</h2>
                <button className={styles.closeButton} onClick={handleCancelDelete}>×</button>
                
                <div className={styles.deleteActions}>
                  <button 
                    className={`${styles.actionButton} ${styles.noButton}`} 
                    onClick={handleCancelDelete}
                  >
                    No
                  </button>
                  <button 
                    className={`${styles.actionButton} ${styles.yesButton}`} 
                    onClick={handleConfirmDelete}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          {showLeavePopup && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <div className={styles.popupHeader}>
                  <h2>Request Leave</h2>
                  <button className={styles.closeButton} onClick={handleClosePopup}>×</button>
                </div>

                <div className={styles.popupContent}>
                  <div className={styles.formGroup}>
                    <label>Leave Type</label>
                    <select
                      value={leaveRequest.type}
                      onChange={(e) => setLeaveRequest({...leaveRequest, type: e.target.value})}
                      required
                    >
                      <option value="">Select leave type</option>
                      <option value="Full Day">Full Day</option>
                      <option value="Half Day">Half Day</option>
                      <option value="RH">RH</option>
                      <option value="Compensatory Off">Compensatory Off</option>
                    </select>
                  </div>

                  <div className={styles.dateContainer}>
                    <div className={styles.formGroup}>
                      <label>Start Date</label>
                      <input 
                        type="date"
                        value={leaveRequest.startDate}
                        onChange={(e) => setLeaveRequest({...leaveRequest, startDate: e.target.value})}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label>End Date</label>
                      <input 
                        type="date"
                        value={leaveRequest.endDate}
                        onChange={(e) => setLeaveRequest({...leaveRequest, endDate: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Reason</label>
                    <input 
                      type="text"
                      value={leaveRequest.reason}
                      onChange={(e) => setLeaveRequest({...leaveRequest, reason: e.target.value})}
                      placeholder="Enter your reason for leave"
                      required
                    />
                  </div>

                  <button 
                    className={`${styles.submitButton} ${!isFormValid() ? styles.disabled : ''}`}
                    onClick={handleSubmitLeave}
                    disabled={!isFormValid()}
                  >
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default function UserPage() {
  return (
    <ProtectedRoute>
      <UserDashboard />
    </ProtectedRoute>
  );
}