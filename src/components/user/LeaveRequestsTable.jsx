import styles from '@/styles/user/LeaveRequestsTable.module.css'; 

const LeaveRequestsTable = ({ requests, onDeleteRequest }) => {
  return (
    <div className={styles.tableContainer}>
      <h2>Leave Requests</h2>
      <table className={styles.leaveTable}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Type</th>
            <th>From Date</th>
            <th>To Date</th>
            <th>Requested On</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.type}</td>
              <td>{request.fromDate}</td>
              <td>{request.toDate}</td>
              <td>{request.requestedOn}</td>
              <td>
                <button 
                  className={styles.deleteButton}
                  onClick={() => onDeleteRequest(request.id)}
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveRequestsTable;