import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Auth from './components/auth/Auth'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [user, setUser] = useState(null);

  return (
    <>
      {user ? (
        <Dashboard user={user} setUser={setUser} />
      ) : (
        <Auth setUser={setUser} />
      )}
    </>
  )
}

export default App
