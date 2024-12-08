import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { UrlProvider } from './context/UrlContext';
import Routing from './routes/Routing';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <UrlProvider>
        <Routing />
        <Toaster position="top-center" />
      </UrlProvider>
    </AuthProvider>
  );
}

export default App;

