import React, { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, ERROR_MESSAGES } from '../utils/constants';
import { getFromStorage, saveToStorage, removeFromStorage, generateId } from '../utils/helpers';

export const AuthContext = createContext(undefined);

// Mock users for demonstration
const mockUsers = [
  {
    id: 'user1',
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'user',
    phone: '+977-9801234567',
    language: 'en',
    avatar: 'https://placehold.co/100x100/4ecdc4/ffffff?text=JD',
  },
  {
    id: 'doctor1',
    email: 'doctor@example.com',
    password: 'password123',
    name: 'Dr. Jane Smith',
    role: 'doctor',
    phone: '+977-9801234568',
    language: 'en',
    avatar: 'https://placehold.co/100x100/ff7849/ffffff?text=JS',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on app start
    const savedUser = getFromStorage(STORAGE_KEYS.USER, null);
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password, role) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const foundUser = mockUsers.find(
        u => u.email === email && u.password === password && u.role === role
      );
      
      if (!foundUser) {
        throw new Error('Invalid credentials or role mismatch');
      }
      
      // Create user object (excluding password)
      const userObject = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        phone: foundUser.phone,
        language: foundUser.language,
        avatar: foundUser.avatar,
        isOffline: false,
      };
      
      // Save to localStorage and state
      saveToStorage(STORAGE_KEYS.USER, userObject);
      setUser(userObject);
      
    } catch (error) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }
      
      // Create new user
      const newUser = {
        id: generateId(),
        email: data.email,
        name: data.name,
        role: data.role,
        phone: data.phone,
        language: 'en',
        avatar: `https://placehold.co/100x100/4ecdc4/ffffff?text=${data.name.charAt(0).toUpperCase()}`,
        isOffline: false,
      };
      
      // Add to mock users (in real app, this would be sent to API)
      mockUsers.push({
        ...newUser,
        password: data.password,
      });
      
      // Save to localStorage and state
      saveToStorage(STORAGE_KEYS.USER, newUser);
      setUser(newUser);
      
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : ERROR_MESSAGES.GENERIC_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    removeFromStorage(STORAGE_KEYS.USER);
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
