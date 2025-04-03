import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FoodProvider } from './context/FoodContext';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import FoodDonationForm from './components/donor/FoodDonationForm';
import FoodBrowser from './components/recipient/FoodBrowser';
import FoodClaimForm from './components/recipient/FoodClaimForm';
import VolunteerDashboard from './components/volunteer/VolunteerDashboard';
import './App.css';

// Protected route component
const ProtectedRoute: React.FC<{
  element: React.ReactNode;
  requiredRole?: string | string[];
}> = ({ element, requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!currentUser || !roles.includes(currentUser.role)) {
      return <Navigate to="/" replace />;
    }
  }
  
  return <>{element}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <FoodProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="py-6">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                
                {/* Donor routes */}
                <Route 
                  path="/donor-dashboard" 
                  element={
                    <ProtectedRoute 
                      element={<FoodDonationForm />} 
                      requiredRole="donor"
                    />
                  } 
                />
                <Route 
                  path="/donate-food" 
                  element={
                    <ProtectedRoute 
                      element={<FoodDonationForm />} 
                      requiredRole="donor"
                    />
                  } 
                />
                
                {/* Recipient routes */}
                <Route 
                  path="/recipient-dashboard" 
                  element={
                    <ProtectedRoute 
                      element={<FoodBrowser />} 
                      requiredRole="recipient"
                    />
                  } 
                />
                <Route 
                  path="/food/:id/claim" 
                  element={
                    <ProtectedRoute 
                      element={<FoodClaimForm />} 
                      requiredRole="recipient"
                    />
                  } 
                />
                
                {/* Volunteer routes */}
                <Route 
                  path="/volunteer-dashboard" 
                  element={
                    <ProtectedRoute 
                      element={<VolunteerDashboard />} 
                      requiredRole="volunteer"
                    />
                  } 
                />
                
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </FoodProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
