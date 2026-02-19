import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Activities from './components/Activities';
import Leaderboard from './components/Leaderboard';
import Teams from './components/Teams';
import Users from './components/Users';
import Workouts from './components/Workouts';

function App() {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            🏋️ OctoFit Tracker
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  👤 Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">
                  👥 Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">
                  🏃 Activities
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">
                  🏆 Leaderboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">
                  💪 Workouts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <div className="container mt-5">
              <div className="jumbotron text-center mb-5">
                <h1 className="display-4">Welcome to OctoFit Tracker! 🎯</h1>
                <p className="lead">
                  Track your fitness journey, compete with teams, and achieve your goals!
                </p>
                <hr className="my-4" />
                <p>
                  Use the navigation menu above to explore all features of our fitness tracking platform.
                </p>
              </div>

              <div className="row g-4 mb-5">
                <div className="col-md-4">
                  <div className="card h-100 border-secondary">
                    <div className="card-body text-center">
                      <h3 className="card-title">👤 User Profiles</h3>
                      <p className="card-text">
                        Manage your profile and connect with other fitness enthusiasts.
                      </p>
                      <Link to="/users" className="btn btn-primary">
                        View Users
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-info">
                    <div className="card-body text-center">
                      <h3 className="card-title">👥 Teams</h3>
                      <p className="card-text">
                        Join or create teams and compete together for fitness goals.
                      </p>
                      <Link to="/teams" className="btn btn-info">
                        View Teams
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="card h-100 border-success">
                    <div className="card-body text-center">
                      <h3 className="card-title">🏃 Activities</h3>
                      <p className="card-text">
                        Log your daily activities and track your progress over time.
                      </p>
                      <Link to="/activities" className="btn btn-success">
                        View Activities
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100 border-warning">
                    <div className="card-body text-center">
                      <h3 className="card-title">🏆 Leaderboard</h3>
                      <p className="card-text">
                        See who's leading the pack and compete for the top spot!
                      </p>
                      <Link to="/leaderboard" className="btn btn-warning text-dark">
                        View Leaderboard
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100 border-danger">
                    <div className="card-body text-center">
                      <h3 className="card-title">💪 Workouts</h3>
                      <p className="card-text">
                        Get personalized workout suggestions tailored to your fitness level.
                      </p>
                      <Link to="/workouts" className="btn btn-danger">
                        View Workouts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
        />
        <Route path="/users" element={<Users />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/workouts" element={<Workouts />} />
      </Routes>

      <footer className="bg-dark text-white text-center py-4 mt-5">
        <div className="container">
          <p className="mb-0">🏋️ OctoFit Tracker &copy; 2026 | Build Your Fitness Journey</p>
          <small className="text-muted">Powered by React, Django & MongoDB</small>
        </div>
      </footer>
    </div>
  );
}

export default App;
