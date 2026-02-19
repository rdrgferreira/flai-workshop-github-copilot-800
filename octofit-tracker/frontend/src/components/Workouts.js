import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = `https://${codespaceName}-8000.app.github.dev/api/workouts/`;

  const fetchWorkouts = (url) => {
    setLoading(true);
    console.log('Workouts Component - Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Workouts Component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Workouts Component - Fetched data:', data);
        
        if (data.results) {
          setWorkouts(data.results);
          setTotalCount(data.count || data.results.length);
          setNextPage(data.next);
          setPreviousPage(data.previous);
        } else {
          setWorkouts(Array.isArray(data) ? data : []);
          setTotalCount(Array.isArray(data) ? data.length : 0);
          setNextPage(null);
          setPreviousPage(null);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Workouts Component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchWorkouts(apiUrl);
  }, [apiUrl]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(prev => prev + 1);
      fetchWorkouts(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(prev => prev - 1);
      fetchWorkouts(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">💪 Personalized Workouts</h2>
        <div>
          <span className="badge bg-warning text-dark fs-6 me-2">{totalCount} Workouts</span>
          {(nextPage || previousPage) && <span className="badge bg-secondary fs-6">Page {currentPage}</span>}
        </div>
      </div>
      <div className="row">
        {workouts.length > 0 ? (
          workouts.map(workout => (
            <div key={workout.id} className="col-md-6 mb-4">
              <div className="card h-100 border-warning">
                <div className="card-body">
                  <h5 className="card-title text-warning">
                    <strong>💪 {workout.name}</strong>
                  </h5>
                  <p className="card-text text-muted">{workout.description}</p>
                  <div className="mt-3">
                    <div className="mb-2">
                      <span className="badge bg-light text-dark me-2">📊</span>
                      <strong>Difficulty:</strong>{' '}
                      <span className={`badge ${
                        workout.difficulty === 'beginner' ? 'bg-success' :
                        workout.difficulty === 'intermediate' ? 'bg-warning text-dark' :
                        'bg-danger'
                      }`}>
                        {workout.difficulty}
                      </span>
                    </div>
                    {workout.duration && (
                      <div className="mb-2">
                        <span className="badge bg-light text-dark me-2">⏱️</span>
                        <strong>Duration:</strong> {workout.duration} minutes
                      </div>
                    )}
                    {workout.category && (
                      <div className="mb-2">
                        <span className="badge bg-light text-dark me-2">🏷️</span>
                        <strong>Category:</strong> {workout.category}
                      </div>
                    )}
                    {workout.recommended_for && (
                      <div className="mb-2 pt-2 border-top">
                        <span className="badge bg-primary me-2">👤</span>
                        <strong>Recommended For:</strong> {workout.recommended_for}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No workouts found</div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {(nextPage || previousPage) && (
        <nav aria-label="Workouts pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${!previousPage ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handlePreviousPage} disabled={!previousPage}>
                <span aria-hidden="true">&laquo;</span> Previous
              </button>
            </li>
            <li className="page-item active">
              <span className="page-link">Page {currentPage}</span>
            </li>
            <li className={`page-item ${!nextPage ? 'disabled' : ''}`}>
              <button className="page-link" onClick={handleNextPage} disabled={!nextPage}>
                Next <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
          <p className="text-center text-muted small">
            Showing {workouts.length} of {totalCount} workouts
          </p>
        </nav>
      )}
    </div>
  );
}

export default Workouts;
