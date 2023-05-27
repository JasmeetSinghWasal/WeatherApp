import React, { useState, useEffect } from "react";
import "./weather.css";
import TempUnitSlider from "./TempUnitSlider/TempUnitSlider";
import { Link } from "react-router-dom";
import days from "../utility/DaysEnum";
// import ErrorMessage from "./ErrorMsg/ErrorMessage";
import SearchBar from "./SearchBar/SearchBar";
import { Helmet } from "react-helmet";

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("");
  const [tempUnit, setTempUnit] = useState("C");
  const [userFav, setUserFav] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  //Use effect to fetch API response on city change
  useEffect(() => {
    const fetchData = async () => {
      if (!city) return;
      try {
        const response = await fetch(
          `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        } else {
          setWeatherData(null);
        }
      } catch (error) {
        setWeatherData(null);
      }
    };

    fetchData();
  }, [city]);

  //Update user favourites
  useEffect(() => {
    const storedFavorites = sessionStorage.getItem("UserFavs");
    if (storedFavorites) {
      setUserFav(JSON.parse(storedFavorites));
    }
  }, []);

  //Deletion of favourite from sessionStorage
  const handleDeleteFavorite = (favorite) => {
    const updatedFavorites = userFav.filter((item) => item !== favorite);
    setUserFav(updatedFavorites);
    sessionStorage.setItem("UserFavs", JSON.stringify(updatedFavorites));
  };

  //handle city change submit
  const handleSubmit = (event) => {
    event.preventDefault();
    // Call the API when the form is submitted
  };

  //Add too favourite handler
  const handleAddToFavs = (e) => {
    e.preventDefault();
    let city = weatherData.city.name;

    const sessionFav = sessionStorage.getItem("UserFavs");
    if (sessionFav) {
      if (sessionFav.includes(city)) {
        alert("City already in favoiurtes");
        return;
      } else {
        setUserFav([...userFav, city]);
        sessionStorage.setItem("UserFavs", JSON.stringify([...userFav, city]));
      }
    }
  };

  //
  const handleCityChange = (event) => {
    const city = event.target.value;
    // const regex = /^[a-zA-Z\s]+$/; // Regular expression to allow only letters and spaces
    // if (regex.test(city)) {
    //   setErrorMsg("");
    //   setCity(city);
    // } else {
    //   setErrorMsg("Only letters are allowed in city field.");
    //   return;
    // }
    setCity(city);

    //
  };

  //Get data for favourite city clicked
  const getFavCityWeather = (city) => {
    setCity(city);
  };

  //handle Tempterature unit change
  const handleUnitChange = (unit) => {
    setTempUnit(unit);
    sessionStorage.setItem("tempUnit", JSON.stringify(unit));
  };

  //Get forecast data into required format
  const forecast = weatherData
    ? weatherData.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 5)
        .map((item) => {
          const date = new Date(item.dt * 1000); //OpenWeatherAPI gives time and date in Unix hence, multiple by 1000. This return millisesonds
          const day = days[date.getDay()]; //get Day from above Date object

          //OpenWeatherAPI return temperature in Kelvin by default
          const temperature =
            tempUnit === "F"
              ? ((item.main.temp - 273.15) * (9 / 5) + 32).toFixed(2) // Fahrenheit formula
              : (item.main.temp - 273.15).toFixed(2); //Celsius formula

          const description = item.weather[0].description;

          return { date, day, temperature, description };
        })
    : [];

  return (
    <>
      <Helmet>
        <title>Weather-Home</title>
        <meta name="description" content="Weather app by Jasmeet" />
      </Helmet>
      {/* Using callback to get selected unit from child component */}
      <TempUnitSlider defaultUnit={tempUnit} onUnitChange={handleUnitChange} />
      Temperature Unit : {tempUnit}
      {city !== "" && city !== " " && city != null && city !== undefined ? (
        <h2>{city}</h2>
      ) : (
        ""
      )}
      <div className="mycontainer">
        {/* SearchBar componennt */}
        <SearchBar
          onSubmit={handleSubmit}
          city={city}
          onChange={handleCityChange}
          errorMsg={errorMsg}
        />
        <section>
          {weatherData === null ? (
            <p>No data available</p>
          ) : weatherData.cod === "200" ? (
            <>
              <div>
                <form onSubmit={handleAddToFavs}>
                  <p>Want to add {weatherData.city.name} to your favourites?</p>
                  <button type="submit">Add to Favourite</button>
                </form>
              </div>
              <div className="card-container">
                {forecast.map((item) => (
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
                ))}
              </div>
              <Link className="viewMoreLink" to={`/details/${city}`}>
                View more{" "}
              </Link>
            </>
          ) : (
            <p>No data available</p>
          )}
        </section>
        <section>
          <h3>User favourites</h3>
          <div>
            <ul>
              {userFav.map((favorite, index) => (
                <li
                  className="favItem"
                  key={index}
                  onClick={() => getFavCityWeather(favorite)}
                >
                  <span className="favCityName">{favorite}</span>
                  <button
                    className="deleteButton"
                    onClick={() => handleDeleteFavorite(favorite)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </>
  );
};

export default Weather;
