import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'asha' | 'supervisor' | 'admin';
  phone?: string;
  village?: string;
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    role: 'asha' | 'supervisor' | 'admin';
    phone?: string;
    village?: string;
  }) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        // Ensure demo accounts are seeded first
        const { seedDemoAccounts } = await import('../services/authData');
        seedDemoAccounts();

        const storedUser = localStorage.getItem('village_health_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Get registered users from localStorage
      const storedUsers = localStorage.getItem('village_health_users');
      console.log('Stored users data:', storedUsers);
      
      const registeredUsers = JSON.parse(storedUsers || '[]');
      console.log('Parsed users:', registeredUsers);
      console.log('Attempting login with:', { email, password });
      
      // Find user by email and password
      const foundUser = registeredUsers.find((u: any) => {
        console.log('Checking user:', { userEmail: u.email, userPassword: u.password });
        return u.email === email && u.password === password;
      });

      console.log('Found user:', foundUser);

      if (foundUser) {
        // Create user session (exclude password)
        const { password: _, ...userSession } = foundUser;
        setUser(userSession);
        localStorage.setItem('village_health_user', JSON.stringify(userSession));
        console.log('Login successful for:', userSession.email);
        return true;
      }

      console.log('Login failed: User not found or incorrect credentials');
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData: {
    name: string;
    email: string;
    password: string;
    role: 'asha' | 'supervisor' | 'admin';
    phone?: string;
    village?: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);

      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('village_health_users') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.some((u: any) => u.email === userData.email);
      if (userExists) {
        return false;
      }

      // Create new user
      const newUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        joinedAt: new Date().toISOString(),
      };

      // Save to users list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('village_health_users', JSON.stringify(updatedUsers));

      // Create user session (exclude password)
      const { password: _, ...userSession } = newUser;
      setUser(userSession);
      localStorage.setItem('village_health_user', JSON.stringify(userSession));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('village_health_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};