import { BrowserRouter, Route, Routes, Link } from "react-router-dom";
import { useState, useEffect} from 'react';
import JobList from "./pages/JobList";
import AddJob from "./pages/AddJob";
import EditJob from "./pages/EditJob";
import { getMe, logout, loginWithGoogle} from './api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    fetchUser()
  }, []);

  const fetchUser = async () => {
    const data = await getMe();
    setUser(data);
    setLoading(false)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-grey-500 text-4xl">Loading....</p>
    </div>
  )
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-grey-50">
        <nav className="bg-white shadow-sm border-b border-grey-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <Link to="/" className="text-xl front-bold text-[#003049]">Job Tracker</Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <>
                    <Link to="/add" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-400">Add new record</Link>
                    {' | '}
                    <span className="text-sm text-gray-600"> {user.name} </span>
                    {' '}
                    <button onClick={logout} className="text-sm text-gray-500 hover:text-gray-700">logout</button>
                  </>
                ): (<button onClick={loginWithGoogle} className="bg-[#003049] text-white px-4 py-2 rounded-lg text-sm hover:bg-[#4E8D9C] font-medium">Use google to login</button>)}

              </div>
          </div>

        </nav>
        <main className="max-w-7xl mx-auto px-6 py-8">
          {!user ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <h2 className="text-2xl font-bold text-[#003049]">Welcome to JobTracker!</h2>
              <p className="text-gray-500">Please log in first to start your job application tracking.</p>
              <button onClick={loginWithGoogle} className="bg-[#003049] text-white px-6 py-3 rounded-lg hover:bg-[#4E8D9C] font-medium">Use google to login</button>
            </div>
          ): (
          <Routes>
            <Route path="/" element={<JobList />}></Route>
            <Route path="/add" element={<AddJob />}></Route>
            <Route path="/edit/:id" element={<EditJob />}></Route>
          </Routes>
          )
          }
        </main>
        

      </div>

    </BrowserRouter>
  )
};
export default App
