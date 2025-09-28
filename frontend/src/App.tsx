
import './App.css'

import { Route, Routes } from 'react-router'

import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

import { Toaster } from './components/ui/sonner';

function App() {

  return (
    <>
      <Routes>
        <Route path="/signup" element= { <SignUp /> } />
        <Route path="/signin" element= { <SignIn /> } />
      </Routes>

      <Toaster richColors expand={false} position="top-center" />
    </>
  )
}

export default App
