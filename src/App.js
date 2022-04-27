import './App.css';
import React, { createContext, useContext } from 'react';
import AuthProvider from './authentication/AuthProvider';
import Register from './components/Auth/Register';
import Signin from './components/Auth/Signin';
import Home from './components/Home/Home';
import RequireAuth from './authentication/RequireAuth';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path='/register'
            element={<Register />}
          />
          <Route
            path='/signin'
            element={<Signin />}
          />
          <Route
            path='/'
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default App;
