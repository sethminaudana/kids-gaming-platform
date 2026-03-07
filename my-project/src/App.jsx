// src/App.jsx - COMPLETE VERSION WITH ALL ROUTES
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import Patient from "./components/Patient";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import Activity from "./components/Activity";
import Progress from "./components/Progress";
import Schedule from "./components/Schedule";
import Games from "./components/Games";
import ResultsDashboard from "./components/ResultsDashboard";
import AdminDashboard from "./components/AdminDashboard";
import JigsawPuzzle from "./components/games/JigsawPuzzle";
import PuzzleReport from "./components/games/PuzzleReport";

// Create Auth Context
export const AuthContext = React.createContext();

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("parent"); // 'parent', 'therapist', 'child'

  const login = (email, password, role) => {
    if (email && password) {
      setIsAuthenticated(true);
      setUserRole(role);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
  };

  // In App.jsx - Update the AuthContext provider

const [users, setUsers] = useState([]); // Mock user database

const register = async (userData) => {
  // In real app, this would call your backend API
  try {
    // Mock API call
    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      return { success: true, message: 'Registration successful' };
    } else {
      return { success: false, message: data.message };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Registration failed' };
  }
};

// In the provider value
<AuthContext.Provider value={{ 
  isAuthenticated, 
  userRole, 
  login, 
  logout,
  register  // Add this
}}></AuthContext.Provider>

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
          {isAuthenticated && <Navigation />}

          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Login />
                )
              }
            />

            {/* Unauthorized Page */}
            <Route
              path="/unauthorized"
              element={
                <div className="flex items-center justify-center min-h-screen p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <div className="text-6xl mb-4">🚫</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      Access Denied
                    </h1>
                    <p className="text-gray-600 mb-6">
                      You don't have permission to view this page.
                    </p>
                    <Link
                      to="/dashboard"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                  <Patient />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/puzzle/report"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                  <PuzzleReport childName="Jamie" />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/:patientId"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                  <Patient />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/activities"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                  <Activity />
                </ProtectedRoute>
              }
            />

            <Route
              path="/progress"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                  <Progress />
                </ProtectedRoute>
              }
            />

            <Route
              path="/schedule"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                  <Schedule />
                </ProtectedRoute>
              }
            />

            {/* Games Routes */}
            <Route
              path="/games"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                  <Games />
                </ProtectedRoute>
              }
            />

            <Route
              path="/games/puzzle"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist", "child"]}>
                  <JigsawPuzzle />
                </ProtectedRoute>
              }
            />

            {/* Additional Routes */}
            <Route
              path="/results"
              element={
                <ProtectedRoute allowedRoles={["parent", "therapist"]}>
                  <ResultsDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["therapist"]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Default Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="flex items-center justify-center min-h-screen p-4">
                  <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
                    <div className="text-6xl mb-4">404</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <Link
                      to="/dashboard"
                      className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600"
                    >
                      Go to Dashboard
                    </Link>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
