import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [nextPage, setNextPage] = useState(null);
  const [previousPage, setPreviousPage] = useState(null);

  const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = `https://${codespaceName}-8000.app.github.dev/api/users/`;

  const fetchUsers = (url) => {
    setLoading(true);
    console.log('Users Component - Fetching from:', url);
    
    fetch(url)
      .then(response => {
        console.log('Users Component - Response status:', response.status);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Users Component - Fetched data:', data);
        
        if (data.results) {
          setUsers(data.results);
          setTotalCount(data.count || data.results.length);
          setNextPage(data.next);
          setPreviousPage(data.previous);
        } else {
          setUsers(Array.isArray(data) ? data : []);
          setTotalCount(Array.isArray(data) ? data.length : 0);
          setNextPage(null);
          setPreviousPage(null);
        }
        
        setLoading(false);
      })
      .catch(error => {
        console.error('Users Component - Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers(apiUrl);
  }, [apiUrl]);

  const handleNextPage = () => {
    if (nextPage) {
      setCurrentPage(prev => prev + 1);
      fetchUsers(nextPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (previousPage) {
      setCurrentPage(prev => prev - 1);
      fetchUsers(previousPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading) return <div className="container mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">👤 Users</h2>
        <div>
          <span className="badge bg-secondary fs-6 me-2">{totalCount} Members</span>
          {(nextPage || previousPage) && <span className="badge bg-info text-dark fs-6">Page {currentPage}</span>}
        </div>
      </div>
      <div className="row">
        {users.length > 0 ? (
          users.map(user => (
            <div key={user.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border-secondary">
                <div className="card-body">
                  <h5 className="card-title text-dark">
                    <strong>👤 {user.name || user.username || 'N/A'}</strong>
                  </h5>
                  <div className="mb-2">
                    <span className="badge bg-secondary me-2">📧</span>
                    <small>{user.email}</small>
                  </div>
                  {user.team && (
                    <div className="mb-2">
                      <span className="badge bg-primary me-2">👥</span>
                      <small><strong>{user.team}</strong></small>
                    </div>
                  )}
                  <div className="mt-3 pt-3 border-top">
                    <small className="text-muted">
                      📅 Joined: {new Date(user.created_at || user.date_joined).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <div className="alert alert-info">No users found</div>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {(nextPage || previousPage) && (
        <nav aria-label="Users pagination" className="mt-4">
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
            Showing {users.length} of {totalCount} users
          </p>
        </nav>
      )}
    </div>
  );
}

export default Users;
