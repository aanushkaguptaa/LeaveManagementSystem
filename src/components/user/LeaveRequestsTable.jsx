import styles from './LeaveRequestsTable.module.css';

const LeaveRequestsTable = ({ requests, onDeleteRequest }) => {
  return (
    <div className={styles.tableContainer}>
      <h2>Leave Requests</h2>
      <table className={styles.leaveTable}>
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Date Sent</th>
            <th>Type</th>
            <th>From - To</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td>{request.id}</td>
              <td>{request.dateSent}</td>
              <td>{request.type}</td>
              <td>{`${request.fromDate} - ${request.toDate}`}</td>
              <td>
                <button 
                  className={styles.deleteButton}
                  onClick={() => onDeleteRequest(request.id)}
                >
                  <Image
                    src="/delete-icon.svg"
                    alt="Delete"
                    width={20}
                    height={20}
                  />
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