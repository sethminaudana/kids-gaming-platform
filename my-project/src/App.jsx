// src/App.jsx - COMPLETE VERSION WITH BACKEND INTEGRATION
import React, { useState, useEffect } from "react";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUserRole(parsedUser.role);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      const apiUrl = 'http://localhost:5000/api/auth/login';
      console.log('🔐 Login attempt:', email);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        credentials: 'omit'
      });

      console.log('📥 Login response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Login error:', errorData);
        return false;
      }

      const data = await response.json();
      console.log('✅ Login successful');

      if (data.success) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        setIsAuthenticated(true);
        setUserRole(data.data.role);
        setUser(data.data);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const apiUrl = `http://localhost:5000/api/auth/register`;
      console.log('📤 Registering user with URL:', apiUrl);
      console.log('📋 User data:', userData);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(userData),
        credentials: 'omit'
      });

      console.log('📥 Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        return { 
          success: false, 
          message: errorData.message || `Server error: ${response.statusText}`
        };
      }

      const data = await response.json();
      console.log('✅ Registration response:', data);

      if (data.success) {
        // Auto-login after registration
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data));
        setIsAuthenticated(true);
        setUserRole(data.data.role);
        setUser(data.data);
        return { success: true, message: 'Registration successful' };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      return { 
        success: false, 
        message: `Network error: ${error.message}. Make sure the backend is running on http://localhost:5000`
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUserRole(null);
    setUser(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 mx-auto mb-4 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(userRole)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto mb-4 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <p className="text-gray-600">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout, register, user }}>
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
