import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';

interface AuthContainerProps {
  initialPage?: 'login' | 'signup';
  onBack?: () => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ initialPage = 'login', onBack }) => {
  const [isLogin, setIsLogin] = useState(initialPage === 'login');

  return (
    <>
      {isLogin ? (
        <Login onSwitchToSignup={() => setIsLogin(false)} onBack={onBack} />
      ) : (
        <Signup onSwitchToLogin={() => setIsLogin(true)} onBack={onBack} />
      )}
    </>
  );
};

export default AuthContainer;