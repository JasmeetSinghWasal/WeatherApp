import React from "react";
import "./weatherTable.css";
import WeatherIcon from "../WeatherIcon/weatherIcon";
import TempUnitSlider from "../TempUnitSlider/TempUnitSlider";
const WeatherTable = ({ weatherData,tempUnit,handleUnitChange }) => {
    
  return (
    <>
     <TempUnitSlider defaultUnit={tempUnit} onUnitChange={handleUnitChange} />
     <h2>Temperature Unit :  {'\u00b0'}{tempUnit}</h2>
      
    <div className="flex-container tableBackground">
      <div class="weatherSummary">
        <div className=""><h1>{weatherData.date.toLocaleString()}</h1></div>
        <h2>{weatherData.extraDetails.weather[0].main}</h2>
        <WeatherIcon iconCode={weatherData.extraDetails.weather[0].icon}></WeatherIcon>
      </div>
      <div class="weatherTilesContainer">
        <div class="weatherTiles">
          <div>
            <p>Feels like</p>
            <p>{weatherData.extraDetails.main.feels_like}</p>
          </div>
          <div>
            <p>Min Temp</p>
            <p>{weatherData.extraDetails.main.temp_min}</p>
          </div>
          <div>
            <p>Max Temp</p>
            <p>{weatherData.extraDetails.main.temp_max}</p>
          </div>
        </div>
        <div class="weatherTiles">
          <div>
            <p>Humidity</p>
            <p>{weatherData.extraDetails.main.humidity}</p>
          </div>
          <div>
            <p>Pressure</p>
            <p>{weatherData.extraDetails.main.pressure}</p>
          </div>
          <div>
            <p>Wind</p>
            <p>{weatherData.extraDetails.wind.speed}</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default WeatherTable;
