import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const token = searchParams.get('token');
      const userParam = searchParams.get('user');

      console.log('AuthCallback - token:', !!token, 'userParam:', !!userParam); // Debug log

      if (token && userParam) {
        try {
          const user = JSON.parse(decodeURIComponent(userParam));
          console.log('Parsed user:', user); // Debug log - only once now

          // Store token in localStorage
          localStorage.setItem('token', token);

          // Update user context
          updateUser(user);

          // Set authorization header for future requests
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          // Redirect to dashboard
          navigate('/dashboard');
        } catch (error) {
          console.error('Error processing auth callback:', error);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        console.error('Missing token or user param');
        setError('Authentication failed. Missing credentials.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, []); // Empty dependency array to run only once

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {error ? (
          <>
            <div className="text-red-500 text-lg mb-4">⚠️</div>
            <p className="text-red-600">{error}</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Completing sign in...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;
