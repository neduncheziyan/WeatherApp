import { useEffect, useState } from "react";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import PropTypes from "prop-types";

import sunIcon from "./assets/sun.png";
import cloudIcon from "./assets/cloud.png";
import humidityIcon from "./assets/humidity.png";
import windIcon from "./assets/wind.jpg";

const WeatherDetails = ({ icon, temp, city, country, lat, lon, humidity, wind, error }) => {
  return (
    <div className="weather-details card text-center">
      <div className="card-body">
        <img className="weather-icon w-50" src={icon} alt="weather icon" />
        <h5 className="temp">{temp}°C</h5>
        <h2 className="city text-warning text-uppercase">{city}</h2>
        <p className="country fs-3 text-success">{country}</p>
        <div className="d-flex justify-content-center">
          <div className="coordinates px-2">
            <div className="fs-4">Latitude</div>
            <div className="fs-5">{lat}</div>
          </div>
          <div className="coordinates">
            <div className="fs-4">Longitude</div>
            <div className="fs-5">{lon}</div>
          </div>
        </div>
        <div className="foot-container">
          <div className="humidity-container">
            <img className="humidity-icon" src={humidityIcon} alt="humidity icon" />
            <div className="data">
              <div className="humidity-percent">{humidity} %</div>
              <div className="text">Humidity</div>
            </div>
          </div>
          <div className="wind-container">
            <img className="wind-icon" src={windIcon} alt="wind icon" />
            <div className="data">
              <div className="wind-km">{wind} km/h</div>
              <div className="text">Wind Speed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

WeatherDetails.propTypes = {
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  lat: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  error: PropTypes.string,
};

function App() {
  const api_key = '8def950b00307c9d63d172c47e6c3974';
  const [icon, setIcon] = useState(cloudIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [lon, setLon] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [searchText, setSearchText] = useState('Chennai');
  const [cityNotFound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": sunIcon,
    "01n": sunIcon,
    "02d": sunIcon,
    "02n": sunIcon,
    "03d": cloudIcon,
    "03n": cloudIcon,
    "04d": cloudIcon,
    "04n": cloudIcon,
    "09d": sunIcon,
    "09n": sunIcon,
    "10d": cloudIcon,
    "10n": cloudIcon,
    "13d": cloudIcon,
    "13n": sunIcon,
    "50d": cloudIcon,
    "50n": sunIcon,
  };

  const search = async () => {
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText}&appid=${api_key}&units=Metric`;
    try {
      let res = await fetch(url);
      let data = await res.json();
      if (data.cod === '404') {
        setCityNotFound(true);
        setLoading(false);
        return;
      }
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setTemp(data.main.temp);
      setCity(data.name);
      setCountry(data.sys.country);
      setLat(data.coord.lat);
      setLon(data.coord.lon);
      const weatherIconCode = data.weather[0].icon;
      setIcon(weatherIconMap[weatherIconCode] || sunIcon);
      setCityNotFound(false);
    } catch (error) {
      setError('An error occurred while fetching weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleCity = (e) => {
    setSearchText(e.target.value);
  };

  const handleOnKeyDown = (e) => {
    if(e.target.value) {
      if (e.key === 'Enter') {
        search();
      }
   }
  };

  useEffect(() => {
    search();
  }, []);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="input-group mb-3">
            <input type="text" className="form-control" onChange={handleCity} onKeyDown={handleOnKeyDown} placeholder="Search..." value={searchText} />
            <div className="input-group-append">
              <button className="btn btn-primary" type="button" onClick={search}>
                Search
              </button>
            </div>
          </div>
          {!loading && !cityNotFound && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} lon={lon} humidity={humidity} wind={wind} error={error} />}
          {loading && <div className="loading-message">Loading....</div>}
          {error && <div className="error-message">{error}</div>}
          {cityNotFound && <div className="city-not-found">City Not Found</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
