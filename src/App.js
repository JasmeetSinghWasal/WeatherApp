import "./App.css";
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet";

import DetailedCity from "./components/DetailedView/detailedCity";
import Weather from "./components/weather";
function App() {
  return (
    <div className="App">
      <header>
        <h1 className="app-heading"> Weather Forecast App</h1>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <Router>
          <Routes>
            <Route exact path="/" element={<Weather />} />
            <Route path="/details/:city" element={<DetailedCity />} />
          </Routes>
        </Router>
      </Suspense>
      <footer>
        <div className="my-footer">
          Developed by{" "}
          <a href="https://jasmeetsinghwasal.netlify.app" target="_blank">
            {" "}
            Jasmeet Singh Wasal{" "}
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
