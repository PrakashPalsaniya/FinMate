import React, { useEffect, useContext, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import { API_PATH } from '../utils/apiPath';

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [error, setError] = useState(null);
  const hasProcessed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent multiple executions
      if (hasProcessed.current) return;
      hasProcessed.current = true;

      const code = searchParams.get('code');

      if (code) {
        try {
          const response = await axiosInstance.get(API_PATH.AUTH.EXCHANGE_GOOGLE_CODE(code));
          const { user } = response.data;

          login(user);
          navigate('/dashboard', { replace: true });
        } catch (error) {
          console.error('Error processing auth callback:', error);
          setError('Authentication failed. Please try again.');
          setTimeout(() => navigate('/login'), 3000);
        }
      } else {
        console.error('Missing authentication code');
        setError('Authentication failed. Missing credentials.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleCallback();
  }, [login, navigate, searchParams]);

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
