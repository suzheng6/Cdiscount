// This file is deprecated. Please use HomePage.tsx instead.
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the new HomePage
    navigate('/');
  }, [navigate]);
  
  return null;
}