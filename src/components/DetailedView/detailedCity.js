import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import days from "../../utility/DaysEnum";
import WeatherTable from "../WeatherTable/WeatherTable";
const DetailedCity = () => {
//   const tempUnit = JSON.parse(sessionStorage.getItem("tempUnit"));
  const { city } = useParams();
  const [tempUnit, setTempUnit] = useState(JSON.parse(sessionStorage.getItem("tempUnit")));
  const [moreData, setMoreData] = useState(null);

  const handleUnitChange = (unit) => {
    setTempUnit(unit);
    sessionStorage.setItem('tempUnit', JSON.stringify(unit));
  };


  useEffect(() => {
    const fetchData = async () => {
      if (!city) return;

      try {
        const response = await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          setMoreData(data);
        } else {
          setMoreData(null);
        }
      } catch (error) {
        setMoreData(null);
      }
    };

    fetchData();
  }, [city]);

  const forecast = moreData
    ? moreData.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 6)
        .map((item) => {
          const date = new Date(item.dt * 1000);
          const day = days[date.getDay()];
          const extraDetails = item;
          //OpenWeatherAPI return temperature in Kelvin by default
          const temperature =
            tempUnit === "F"
              ? ((item.main.temp - 273.15) * (9 / 5) + 32).toFixed(2) // Fahrenheit formula
              : (item.main.temp - 273.15).toFixed(2); //Celsius formula

          const description = item.weather[0].description;

          return { date, day, temperature, description, extraDetails };
        })
    : [];

  return (
    
    <div>
         <Link className="goHomeLink" to={`/`}>Go Home </Link>
    <h1>Weather for :  {city}</h1>
     
      {forecast.length > 0 && (
        <div key={forecast[0].date}>
          <WeatherTable  weatherData={forecast[0]} tempUnit={tempUnit} handleUnitChange={handleUnitChange} />
        </div>
      )}
    
    <div className="card-container">
      {console.log(forecast[0])}
      {forecast.map((item, index) =>
        index !== 0 ? (
          <div className="card" key={item.date}>
            <h3>
              <u>{item.day}</u>
            </h3>
            <p>{item.date.toLocaleDateString()}</p>
            <p>
              Temperature: {item.temperature} {tempUnit}
            </p>
            <p>{item.description}</p>
          </div>
        ) : null
      )}
    </div>
   
  </div>
  );
};

export default DetailedCity;
