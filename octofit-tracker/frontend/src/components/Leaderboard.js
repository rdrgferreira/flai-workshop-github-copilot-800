import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = `https://${codespaceName}-8000.app.github.dev/api/leaderboard/`;

  const fetchLeaderboard = (url) => {
    setLoading(true);
    console.log('Leaderboard Component - Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Leaderboard Component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Leaderboard Component - Fetched data:', data);
        
        if (data.results) {
          setLeaderboard(data.results);
          setTotalCount(data.count || data.results.length);
          setNextPage(data.next);
          setPreviousPage(data.previous);
        } else {
          setLeaderboard(Array.isArray(data) ? data : []);
          setTotalCount(Array.isArray(data) ? data.length : 0);
          setNextPage(null);
          setPreviousPage(null);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Leaderboard Component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard(apiUrl);
  }, [apiUrl]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(prev => prev + 1);
      fetchLeaderboard(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(prev => prev - 1);
      fetchLeaderboard(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">🏆 Leaderboard</h2>
        <div>
          <span className="badge bg-success fs-6 me-2">{totalCount} Competitors</span>
          {(nextPage || previousPage) && <span className="badge bg-secondary fs-6">Page {currentPage}</span>}
        </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Score</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry, index) => (
                <tr key={entry.id} className={index < 3 ? 'table-active' : ''}>
                  <td className="text-center">
                    {index === 0 && <span className="badge bg-warning text-dark fs-5">🥇 1st</span>}
                    {index === 1 && <span className="badge bg-secondary fs-5">🥈 2nd</span>}
                    {index === 2 && <span className="badge bg-danger fs-5">🥉 3rd</span>}
                    {index > 2 && <span className="badge bg-light text-dark">{index + 1}</span>}
                  </td>
                  <td><strong>{entry.user_name || entry.user || 'N/A'}</strong></td>
                  <td>
                    <span className="badge bg-success fs-6">{entry.total_calories || entry.score} pts</span>
                  </td>
                  <td>
                    <span className="badge bg-info text-dark">{entry.team}</span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">No leaderboard data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {(nextPage || previousPage) && (
        <nav aria-label="Leaderboard pagination" className="mt-4">
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
            Showing {leaderboard.length} of {totalCount} competitors
          </p>
        </nav>
      )}
    </div>
  );
}

export default Leaderboard;
