// import React from 'react';
import { AuthProvider } from './auth/AuthContext.jsx';
import AppRoutes from './routes/index.jsx';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;