import React from 'react';
import './WeatherCard.css';

function WeatherCard({ weatherData }) {
  return (
    <div className="weather-card">
      <div className="weather-main">
        <div className="weather-icon">
          <img src={`/WeatherIcons-main/PNG/1st Set - Color/${weatherData.icon}.png`} alt="Weather Icon" />
        </div>
        <div className="temperature">{weatherData.temp}°F</div>
        <div className="weather-description">{weatherData.description}</div>
      </div>
      <div className="weather-details">
        <div className="weather-detail-item">
          <span>Feels Like: </span>
          <span>{weatherData.feels_like}°F</span>
        </div>
        <div className="weather-detail-item">
          <span>Humidity: </span>
          <span>{weatherData.humidity}%</span>
        </div>
        <div className="weather-detail-item">
          <span>Precipitation: </span>
          <span>{weatherData.precip}mm</span>
        </div>
        <div className="weather-detail-item">
          <span>Wind: </span>
          <span>{weatherData.wind_speed}km/h</span>
        </div>
        <div className="weather-detail-item">
          <span>Sunrise: </span>
          <span>{weatherData.sunrise}</span>
        </div>
        <div className="weather-detail-item">
          <span>Sunset: </span>
          <span>{weatherData.sunset}</span>
        </div>
        {/* ... other details */}
      </div>
    </div>
  );
}

export default WeatherCard;