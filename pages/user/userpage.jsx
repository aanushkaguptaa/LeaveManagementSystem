import { useState } from 'react';
import TopNavBar from '@/components/TopNavBar';
import SideNavBar from '@/components/user/SideNavBar';
import LeaveCardsGrid from '@/components/user/LeaveCardGrid';
import LeaveRequestsTable from '@/components/user/LeaveRequestsTable';
import styles from '@/styles/user/userpage.module.css';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';

const UserDashboard = () => {
  const { user } = useAuth();

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

  const [leaveStats] = useState({
    fullLeave: {
      remainingLeaves: 10,
      usedLeaves: 5,
      totalLeaves: 15
    },
    halfLeave: {
      remainingLeaves: 8,
      usedLeaves: 2,
      totalLeaves: 10
    },
    rhLeave: {
      remainingLeaves: 3,
      usedLeaves: 0,
      totalLeaves: 3
    },
    compOff: {
      remainingLeaves: 5,
      usedLeaves: 1,
      totalLeaves: 6
    }
  });

  const [leaveRequests] = useState([
    {
      id: 'REQ001',
      dateSent: '15 March 2024',
      type: 'Full Leave',
      fromDate: '20 March 2024',
      toDate: '21 March 2024'
    }
  ]);

  const handleDeleteClick = (requestId) => {
    setDeleteRequestId(requestId);
    setShowDeletePopup(true);
  };

  const handleConfirmDelete = () => {
    console.log('Deleting request:', deleteRequestId);
    setShowDeletePopup(false);
    setDeleteRequestId(null);
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

  const handleSubmitLeave = () => {
    if (isFormValid()) {
      console.log('Leave Request:', leaveRequest);
      handleClosePopup();
    }
  };

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
          
          <LeaveCardsGrid leaveStats={leaveStats} />
          
          <LeaveRequestsTable 
            requests={leaveRequests}
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
            <div className={styles.overlay}>
              <div className={styles.popup}>
                <h2>Request for Leave</h2>
                <button className={styles.closeButton} onClick={handleClosePopup}>×</button>
                
                <h3>Type</h3>
                <select 
                  value={leaveRequest.type}
                  onChange={(e) => setLeaveRequest({...leaveRequest, type: e.target.value})}
                  required
                >
                  <option value="">Select Leave Type</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Full Day">Full Day</option>
                  <option value="Compensatory Off">Compensatory Off</option>
                  <option value="Restricted Holiday">Restricted Holiday</option>
                </select>

                <div className={styles.dateSection}>
                  <h3>Start Date</h3>
                  <input 
                    type="date"
                    value={leaveRequest.startDate}
                    onChange={(e) => setLeaveRequest({...leaveRequest, startDate: e.target.value})}
                    required
                  />

                  <h3>End Date</h3>
                  <input 
                    type="date"
                    value={leaveRequest.endDate}
                    onChange={(e) => setLeaveRequest({...leaveRequest, endDate: e.target.value})}
                    required
                  />
                </div>

                <h3>Reason</h3>
                <input 
                  type="text"
                  value={leaveRequest.reason}
                  onChange={(e) => setLeaveRequest({...leaveRequest, reason: e.target.value})}
                  placeholder="Enter your reason for leave"
                  required
                />

                <button 
                  className={`${styles.doneButton} ${!isFormValid() ? styles.disabled : ''}`}
                  onClick={handleSubmitLeave}
                  disabled={!isFormValid()}
                >
                  Done
                </button>
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