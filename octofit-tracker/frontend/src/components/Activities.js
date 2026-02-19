import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = `https://${codespaceName}-8000.app.github.dev/api/activities/`;

  const fetchActivities = (url) => {
    setLoading(true);
    console.log('Activities Component - Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Activities Component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Activities Component - Fetched data:', data);
        
        // Check if response is paginated (Django REST Framework format)
        if (data.results) {
          console.log('Activities Component - Paginated response detected');
          console.log('Activities Component - Count:', data.count);
          console.log('Activities Component - Next:', data.next);
          console.log('Activities Component - Previous:', data.previous);
          
          setActivities(data.results);
          setTotalCount(data.count || data.results.length);
          setNextPage(data.next);
          setPreviousPage(data.previous);
        } else {
          // Plain array response
          console.log('Activities Component - Plain array response');
          setActivities(Array.isArray(data) ? data : []);
          setTotalCount(Array.isArray(data) ? data.length : 0);
          setNextPage(null);
          setPreviousPage(null);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Activities Component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchActivities(apiUrl);
  }, [apiUrl]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(prev => prev + 1);
      fetchActivities(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(prev => prev - 1);
      fetchActivities(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🏃 Activity Log</h2>
        <div>
          <span className="badge bg-primary fs-6 me-2">
            {totalCount} Total Activities
          </span>
          <span className="badge bg-secondary fs-6">
            Page {currentPage}
          </span>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Activity Type</th>
              <th>Duration (min)</th>
              <th>Calories</th>
              <th>User</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map(activity => (
                <tr key={activity.id}>
                  <td>
                    <span className="badge bg-info text-dark">
                      {activity.activity_type}
                    </span>
                  </td>
                  <td>
                    <strong>{activity.duration}</strong> min
                  </td>
                  <td>
                    <span className="text-danger fw-bold">{activity.calories_burned}</span> kcal
                  </td>
                  <td>{activity.user_name || activity.user || 'N/A'}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-muted">No activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {(nextPage || previousPage) && (
        <nav aria-label="Activities pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${!previousPage ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={handlePreviousPage}
                disabled={!previousPage}
              >
                <span aria-hidden="true">&laquo;</span> Previous
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">
                Page {currentPage}
                <span className="visually-hidden">(current)</span>
              </span>
            </li>
            <li className={`page-item ${!nextPage ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={handleNextPage}
                disabled={!nextPage}
              >
                Next <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
          <p className="text-center text-muted small">
            Showing {activities.length} of {totalCount} activities
          </p>
        </nav>
      )}
    </div>
  );
}

export default Activities;
