import React from "react";

export default function WeatherInfo({
  city,
  temp,
  humidity,
  precip,
  windSpeed,
}) {
  return (
    <div className="weather-info">
      <h1 className="location">{city}</h1>
      <div className="weather-details">
        <div className="detail">
          <span className="label">Temperature:</span>
          <span className="value" id="temperature">{temp} °F</span>
        </div>
        <div className="detail">
          <span className="label">Humidity:</span>
          <span className="value" id="humidity">{humidity} %</span>
        </div>
        <div className="detail">
          <span className="label">Precipitation:</span>
          <span className="value" id="precipitation">{precip} mm</span>
        </div>
        <div className="detail">
          <span className="label">Wind Speed:</span>
          <span className="value" id="wind-speed">{windSpeed} km/h</span>
        </div>
      </div>
    </div>);
}
