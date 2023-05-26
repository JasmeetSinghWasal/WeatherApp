
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DetailedCity from "./components/DetailedView/detailedCity";
import Weather from "./components/weather";
function App() {
  return (
    <div className="App">
      <header>
      <h1 className="app-heading"> Weather Forecast App</h1>
      </header>
      <Router>
        <Routes>
          <Route exact path="/" element={<Weather />} />
          <Route path="/details/:city" element={<DetailedCity/>}/>
        </Routes>
      </Router>
      <footer>
      <div className="my-footer">
    Developed by <a href="https://jasmeetsinghwasal.netlify.app" target="_blank"> Jasmeet Singh Wasal </a>
    
  </div>
      </footer>
    </div>
  );
}

export default App;
