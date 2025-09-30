
import './App.css'

import { Route, Routes } from 'react-router'

import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import Verification from './pages/verification';
import AccountDetails from './pages/AccountDetails';
import CreateSite from './pages/CreateSite';
import Dashboard from './pages/Dashboard';

import { Toaster } from './components/ui/sonner';

import { AuthProvider } from './hooks/AuthContext';

function App() {

  return (
    <>
        <AuthProvider>
          <Routes>
            <Route path="/signup" element= { <SignUp /> } />
            <Route path="/signin" element= { <SignIn /> } />
            <Route path="/verification" element= { <Verification /> } />
            <Route path="/account-details" element={ <AccountDetails /> } />
            <Route path="/create-site" element={ <CreateSite /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />

          </Routes>

          <Toaster richColors expand={false} position="top-center" />
        </AuthProvider>
    </>
  )
}

export default App
