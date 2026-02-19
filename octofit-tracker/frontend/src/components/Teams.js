import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = `https://${codespaceName}-8000.app.github.dev/api/teams/`;

  const fetchTeams = (url) => {
    setLoading(true);
    console.log('Teams Component - Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Teams Component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Teams Component - Fetched data:', data);
        
        if (data.results) {
          setTeams(data.results);
          setTotalCount(data.count || data.results.length);
          setNextPage(data.next);
          setPreviousPage(data.previous);
        } else {
          setTeams(Array.isArray(data) ? data : []);
          setTotalCount(Array.isArray(data) ? data.length : 0);
          setNextPage(null);
          setPreviousPage(null);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Teams Component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTeams(apiUrl);
  }, [apiUrl]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(prev => prev + 1);
      fetchTeams(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(prev => prev - 1);
      fetchTeams(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">👥 Teams</h2>
        <div>
          <span className="badge bg-info text-dark fs-6 me-2">{totalCount} Teams</span>
          {(nextPage || previousPage) && <span className="badge bg-secondary fs-6">Page {currentPage}</span>}
        </div>
      </div>
      <div className="row">
        {teams.length > 0 ? (
          teams.map(team => (
            <div key={team.id} className="col-md-4 mb-4">
              <div className="card h-100 border-primary">
                <div className="card-body">
                  <h5 className="card-title text-primary">
                    <strong>🏆 {team.name}</strong>
                  </h5>
                  <p className="card-text text-muted">{team.description}</p>
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      <span className="badge bg-light text-dark me-2">📅</span>
                      Created: {new Date(team.created_at).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No teams found</div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {(nextPage || previousPage) && (
        <nav aria-label="Teams pagination" className="mt-4">
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
            Showing {teams.length} of {totalCount} teams
          </p>
        </nav>
      )}
    </div>
  );
}

export default Teams;
