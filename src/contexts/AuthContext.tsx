
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BiometricData {
  face?: {
    encoding: number[];
    timestamp: string;
  };
  voice?: {
    pattern: string;
    duration: number;
    timestamp: string;
  };
  gesture?: {
    landmarks: number[][];
    gestureType: string;
    timestamp: string;
  };
  bodyPattern?: {
    keypoints: number[][];
    poses: string[];
    timestamp: string;
  };
}

interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  biometricData: BiometricData;
  isAuthenticated: boolean;
  registrationComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  isRegistering: boolean;
  registerUser: (userData: { username: string; email: string; password: string }) => void;
  loginUser: (username: string, password: string) => boolean;
  addBiometricData: (type: keyof BiometricData, data: any) => void;
  verifyBiometric: (type: keyof BiometricData, data: any) => Promise<boolean>;
  logout: () => void;
  hasRequiredBiometrics: () => boolean;
  authenticateUser: () => void;
  getRegisteredBiometrics: () => (keyof BiometricData)[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Simple hash function for demonstration (in production, use proper bcrypt)
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const registerUser = (userData: { username: string; email: string; password: string }) => {
    const hashedPassword = simpleHash(userData.password);
    const newUser: User = {
      id: Date.now().toString(),
      username: userData.username,
      email: userData.email,
      passwordHash: hashedPassword,
      biometricData: {},
      isAuthenticated: false,
      registrationComplete: false
    };
    
    // Store in localStorage for persistence
    localStorage.setItem('registeredUser', JSON.stringify(newUser));
    localStorage.setItem('userPassword', userData.password); // Store original for comparison
    setUser(newUser);
    setIsRegistering(true);
    console.log('User registered:', newUser);
  };

  const loginUser = (username: string, password: string): boolean => {
    const storedUser = localStorage.getItem('registeredUser');
    const storedPassword = localStorage.getItem('userPassword');
    
    console.log('Login attempt:', { username, password });
    console.log('Stored data:', { storedUser: !!storedUser, storedPassword });
    
    if (!storedUser || !storedPassword) {
      console.log('No stored user data found');
      return false;
    }
    
    try {
      const userData = JSON.parse(storedUser);
      console.log('Parsed user data:', userData);
      
      if (userData.username === username && password === storedPassword) {
        console.log('Credentials match - proceeding to biometric verification');
        setUser(userData);
        setIsRegistering(false);
        return true;
      } else {
        console.log('Credentials do not match');
        console.log('Expected:', { username: userData.username, password: storedPassword });
        console.log('Received:', { username, password });
        return false;
      }
    } catch (error) {
      console.error('Error parsing stored user data:', error);
      return false;
    }
  };

  const addBiometricData = (type: keyof BiometricData, data: any) => {
    if (!user) {
      console.log('No user found for biometric data');
      return;
    }
    
    console.log(`Adding ${type} biometric data:`, data);
    
    const updatedUser = {
      ...user,
      biometricData: {
        ...user.biometricData,
        [type]: {
          ...data,
          timestamp: new Date().toISOString()
        }
      }
    };
    
    // Check if registration is complete (3+ biometrics)
    const biometricCount = Object.keys(updatedUser.biometricData).length;
    if (biometricCount >= 3) {
      updatedUser.registrationComplete = true;
    }
    
    setUser(updatedUser);
    localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
    console.log(`${type} biometric data stored. Total biometrics: ${biometricCount}`);
  };

  const verifyBiometric = async (type: keyof BiometricData, data: any): Promise<boolean> => {
    if (!user?.biometricData[type]) {
      console.log(`No stored ${type} data for verification`);
      return false;
    }
    
    console.log(`Verifying ${type} biometric data`);
    const storedData = user.biometricData[type];
    
    // Simulate biometric verification with proper type checking
    switch (type) {
      case 'face':
        if (storedData && 'encoding' in storedData && data.encoding) {
          // In real implementation, compare face encodings using cosine similarity
          const similarity = Math.random(); // Simulate similarity score
          return similarity > 0.7; // 70% threshold
        }
        return false;
      
      case 'voice':
        if (storedData && 'pattern' in storedData && data.pattern) {
          // In real implementation, compare voice patterns
          return data.duration > 2 && Math.random() > 0.3; // Simulate voice verification
        }
        return false;
      
      case 'gesture':
        if (storedData && 'gestureType' in storedData && data.gestureType) {
          return data.gestureType === storedData.gestureType;
        }
        return false;
      
      case 'bodyPattern':
        if (storedData && 'poses' in storedData && data.poses) {
          return data.poses.length > 0 && Math.random() > 0.2; // Simulate body pattern verification
        }
        return false;
      
      default:
        return false;
    }
  };

  const hasRequiredBiometrics = (): boolean => {
    if (!user) return false;
    const biometricCount = Object.keys(user.biometricData).length;
    return biometricCount >= 3;
  };

  const getRegisteredBiometrics = (): (keyof BiometricData)[] => {
    if (!user) return [];
    return Object.keys(user.biometricData) as (keyof BiometricData)[];
  };

  const authenticateUser = () => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      isAuthenticated: true
    };
    
    setUser(updatedUser);
    localStorage.setItem('registeredUser', JSON.stringify(updatedUser));
    console.log('User authenticated successfully');
  };

  const logout = () => {
    setUser(null);
    setIsRegistering(false);
    localStorage.removeItem('registeredUser');
    localStorage.removeItem('userPassword');
    console.log('User logged out');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isRegistering,
      registerUser,
      loginUser,
      addBiometricData,
      verifyBiometric,
      logout,
      hasRequiredBiometrics,
      authenticateUser,
      getRegisteredBiometrics
    }}>
      {children}
    </AuthContext.Provider>
  );
};
