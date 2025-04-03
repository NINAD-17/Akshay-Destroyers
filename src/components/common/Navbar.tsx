import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

const Navbar: React.FC = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-primary">Local Food Donation</span>
                <span className="text-primary ml-1">🌍🥦</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Home
              </Link>
              
              <Link 
                to="/about" 
                className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </Link>
              
              {isAuthenticated && currentUser?.role === UserRole.Donor && (
                <Link 
                  to="/donor-dashboard" 
                  className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Donor Dashboard
                </Link>
              )}
              
              {isAuthenticated && currentUser?.role === UserRole.Recipient && (
                <Link 
                  to="/recipient-dashboard" 
                  className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Browse Food
                </Link>
              )}
              
              {isAuthenticated && currentUser?.role === UserRole.Volunteer && (
                <Link 
                  to="/volunteer-dashboard" 
                  className="border-transparent text-gray-500 hover:border-primary hover:text-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Volunteer Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hi, {currentUser?.name || 'User'}</span>
                <button 
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none">
              <span className="sr-only">Open main menu</span>
              {/* Icon for menu */}
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, to be toggled */}
      <div className="sm:hidden hidden">
        <div className="pt-2 pb-3 space-y-1">
          <Link 
            to="/" 
            className="bg-primary text-white block pl-3 pr-4 py-2 text-base font-medium"
          >
            Home
          </Link>
          
          <Link 
            to="/about" 
            className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
          >
            About
          </Link>
          
          {isAuthenticated ? (
            <>
              {currentUser?.role === UserRole.Donor && (
                <Link 
                  to="/donor-dashboard" 
                  className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
                >
                  Donor Dashboard
                </Link>
              )}
              
              {currentUser?.role === UserRole.Recipient && (
                <Link 
                  to="/recipient-dashboard" 
                  className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
                >
                  Browse Food
                </Link>
              )}
              
              {currentUser?.role === UserRole.Volunteer && (
                <Link 
                  to="/volunteer-dashboard" 
                  className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
                >
                  Volunteer Dashboard
                </Link>
              )}
              
              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
              >
                Log In
              </Link>
              <Link 
                to="/register" 
                className="text-gray-500 hover:text-primary block pl-3 pr-4 py-2 text-base font-medium"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 