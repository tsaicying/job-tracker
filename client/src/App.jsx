import { BrowserRouter, Route, Routes, Link } from "react-router-dom"
import JobList from "./pages/JobList"
import AddJob from "./pages/AddJob"
import EditJob from "./pages/EditJob"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Job application record</Link>
        {' | '}
        <Link to="/add">Add new record</Link>
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
