import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect} from 'react';
import JobList from "./pages/JobList";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import { getMe, logout, loginWithGoogle} from './api/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(()=> {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    const data = await getMe();
    setUser(data)
  }
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Job application record</Link>
        {' | '}
        <Link to="/add">Add new record</Link>
        {' | '}
        {user ? (
          <>
            <span> {user.name} </span>
            {' '}
            <button onClick={logout}>logout</button>
          </>
        ): (<button onClick={loginWithGoogle}>Use google to login</button>)}
      </nav>
      <Routes>
        <Route path="/" element={<JobList />}></Route>
        <Route path="/add" element={<AddJob />}></Route>
        <Route path="/edit/:id" element={<EditJob />}></Route>
      </Routes>
    </BrowserRouter>
  )
};
export default App
