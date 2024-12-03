import './App.css';
import Dashboard from './Pages/dashboard';
import Database from './Pages/database';
import LiveVideoStream from './Pages/livestream';
import SOSAlertPage from './Pages/sos_alert';

import Layout from './Layout';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {/* Define the layout route with nested routes inside */}
        <Route path="/" element={<Layout />}>
          {/* Nested routes that will render inside the Layout's Outlet */}
          <Route index element={<Dashboard />} /> {/* Default route */}
          <Route path="database" element={<Database />} />
          <Route path="live" element={<LiveVideoStream />}/>
          <Route path="alerts" element={<SOSAlertPage />}/>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
