import React, { useState, useEffect } from "react";
import "./weather.css";
import TempUnitSlider from "./TempUnitSlider/TempUnitSlider";
import { Link } from "react-router-dom";
import days from "../utility/DaysEnum";
// import ErrorMessage from "./ErrorMsg/ErrorMessage";
import DatedCrds from "./DatedCards/datedCrds";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "./SearchBar/SearchBar";
import { Helmet } from "react-helmet";
import WeatherIcon from "./WeatherIcon/weatherIcon";
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
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.REACT_APP_API_KEY}`
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
    //Adding defualt locations for user

    const defaultLocations = ["Delhi", "Mumbai", "London"];
    sessionStorage.setItem("UserFavs", JSON.stringify(defaultLocations));
    const storedFavorites = sessionStorage.getItem("UserFavs");
    if (storedFavorites) {
      setUserFav(JSON.parse(storedFavorites));
    }
  }, []);

  //Deletion of favourite from sessionStorage
  const handleDeleteFavorite = (favorite) => {
    const updatedFavorites = userFav.filter((item) => item !== favorite);
    setUserFav(updatedFavorites);
    setCity("");
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
        alert("City already in favourites");
        return;
      } else {
        setUserFav([...userFav, city]);
        sessionStorage.setItem("UserFavs", JSON.stringify([...userFav, city]));
      }
    } else {
      setUserFav([...userFav, city]);
      sessionStorage.setItem("UserFavs", JSON.stringify([...userFav, city]));
    }
  };

  //validate city
  const validateCityName = (city) => {
    // Regular expression to check if the city name contains at least one letter and does not have numbers or multiple spaces
    const regex = /^[A-Za-z\s'-]+$/;

    // Check if the city name matches the regular expression and is not just whitespace
    if (regex.test(city) && city.trim().length > 0) {
      return true; // City name is valid
    } else {
      return false; // City name is invalid
    }
  };

  const handleCityChange = (event) => {
    const city = event.target.value;
    if (city.trim() === "") {
      // Empty city name, clear the error message and set the city state
      setErrorMsg("");
      setCity(city);
    } else if (validateCityName(city)) {
      // City name is valid
      setErrorMsg("");
      setCity(city);
    } else {
      setErrorMsg("Only letters are allowed in city field.");
    }
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
          const extraDetails = item;
          return { date, day, temperature, description, extraDetails };
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
      <h2>
        Temperature Unit : {"\u00b0"}
        {tempUnit}
      </h2>
      {/* {city !== "" && city !== " " && city != null && city !== undefined ? (
        <h2>{city}</h2>
      ) : (
        ""
      )} */}
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
              <form onSubmit={handleAddToFavs}>
                <button className="deleteButton" type="submit">
                  {" "}
                  <FontAwesomeIcon icon={faStar} color="gold" /> Save{" "}
                  {weatherData.city.name}{" "}
                </button>
              </form>
              {/* <DatedCrds forecast={forecast} tempUnit={tempUnit}/> */}
              <div className="card-container">
                {forecast.map((item) => (
                  <div className="card" key={item.date}>
                    <p>{item.date.toLocaleDateString()}</p>
                    <h3>
                      <u>{item.day}</u>
                    </h3>
                    <p>
                      Temperature: {item.temperature} {"\u00b0"}
                      {tempUnit}
                    </p>
                    <WeatherIcon
                      iconCode={item.extraDetails.weather[0].icon}
                    ></WeatherIcon>
                    <p>{item.description.toUpperCase()}</p>
                  </div>
                ))}
              </div>
              <Link className="viewMoreLink" to={`/details/${city}`}>
                View More Details...{" "}
              </Link>
            </>
          ) : (
            <p>No data available</p>
          )}
        </section>
        <section>
          <h3>{userFav.length > 0 ? <h1> Your Saved Locations</h1> : ""}</h3>
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
                    Delete <FontAwesomeIcon icon={faTrash} />
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
