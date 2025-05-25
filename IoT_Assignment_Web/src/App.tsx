import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import DeviceDetail from './DeviceDetail';
import Map from './Map';

function Home() {
  return (
    <div className="main-container">
      {/* Header */}
      <header className="header">
        <h1>Assignment of IoT</h1>
        <p className="subtitle">Tracking weather in HCM City</p>
      </header>

      {/* Entities Section */}
      <section className="entities-section">
        <h2>Entities</h2>
        <p className="entities-desc">
          A device collecting the data in each district of HCMC
        </p>
        <div className="entities-cards">
          <Link to="/device/1" className="entity-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Device 1</h3>
            <p>
              This device collects data from the weather station in District 10 (Ho Chi Minh University of Technology, facility 1).
            </p>
          </Link>
          <Link to="/device/2" className="entity-card" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Device 2</h3>
            <p>
              This device collects data from the weather station in Binh Duong Province (Ho Chi Minh University of Technology, facility 2).
            </p>
          </Link>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <h2>Map</h2>
        <p>Show the position of entities in real worlds</p>
        <Map />
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-icons">
          <span className="icon">🗂️</span>
          <span className="icon">🔗</span>
          <span className="icon">🐦</span>
          <span className="icon">🐙</span>
        </div>
        <div className="footer-info">
          <div className="footer-columns">
            <div>
              <div className="footer-title">Team members</div>
              <div>Design</div>
              <div>Protofyping</div>
              <div>Development features</div>
              <div>Data analysis</div>
              <div>Devices</div>
            </div>
            <div>
              <div>&nbsp;</div>
              <div>Demy</div>
              <div>Collaboration features</div>
              <div>Depley</div>
              <div>Fujion</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/device/:id" element={<DeviceDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
