import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          About Local Food Donation Network
        </h1>
        <div className="mt-6 text-gray-600 space-y-6">
          <p>
            Local Food Donation Network is a platform dedicated to reducing food waste and addressing food insecurity 
            in our communities. We connect food donors with recipients who need it most, and facilitate the delivery 
            process through our network of volunteers.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8">Our Mission</h2>
          <p>
            Our mission is to create an efficient, real-time system that connects food donors with recipients in need, 
            such as NGOs, food banks, shelters, or individuals. By redistributing surplus food that would otherwise 
            go to waste, we aim to reduce hunger, minimize environmental impact, and build stronger communities.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8">The Problem We're Solving</h2>
          <p>
            Globally, millions of people face food insecurity, yet tons of edible food are wasted daily by restaurants, 
            grocery stores, households, and events. There is no efficient, real-time system to connect food donors with 
            recipients in need. Additionally, managing near-expiry or expired food responsibly remains a challenge.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8">How It Works</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="text-lg font-medium text-gray-900">Food Donors</h3>
              <p className="mt-2 text-sm text-gray-600">
                Restaurants, grocery stores, farms, and individuals can list their surplus food on our platform, 
                including details about quantity, expiration date, and pickup instructions.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="text-lg font-medium text-gray-900">Food Recipients</h3>
              <p className="mt-2 text-sm text-gray-600">
                Food banks, shelters, community organizations, and individuals in need can browse available 
                food listings and claim what they need.
              </p>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="text-lg font-medium text-gray-900">Volunteer Drivers</h3>
              <p className="mt-2 text-sm text-gray-600">
                Our network of volunteer drivers helps transport food from donors to recipients 
                when transportation assistance is needed.
              </p>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8">Join Our Network</h2>
          <p>
            Whether you're a potential food donor, a recipient organization, or someone interested in volunteering, 
            we welcome you to join our network and be part of the solution to food waste and hunger.
          </p>
          
          <div className="mt-6 flex space-x-4">
            <Link 
              to="/register" 
              className="btn-primary"
            >
              Register Now
            </Link>
            <Link 
              to="/login" 
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Log In
            </Link>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mt-8">Contact Us</h2>
          <p>
            Have questions or suggestions? We'd love to hear from you! 
            Contact us at <span className="text-accent">contact@fooddonation.network</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 