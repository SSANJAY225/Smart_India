import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Counters from './Counter';
import Ticketbooked from './Ticketbooked';
import Dashboard from './Dashboard';
import Home from './Home';
import Verify from './verify';
// import { Verify } from 'crypto';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Counters component */}
        <Route path="/counter" element={<Counters />} />
        
        {/* Route for Ticketbooked component */}
        <Route path="/ticketbooked" element={<Ticketbooked />} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/verify" element={<Verify/>}/>
        <Route path="/" element={<Home/>}/>
      </Routes>
    </Router>
  );
}

export default App;
