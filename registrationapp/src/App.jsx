import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./components/registration";
import Login from "./components/login";
import Report from "./components/report";
import Admission from "./components/admission";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/report/:userid" element={<Report />} />
          <Route path="/admission/:userid" element={<Admission />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
