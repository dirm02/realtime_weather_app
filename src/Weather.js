import React, { useState, useEffect } from 'react';
import Line from './componets/LineChart'
import WeatherInfo from './componets/WeatherInfo'
import WeatherCard from './componets/WeatherCard';

import axios from 'axios';


const API_KEY = '3KAJKHWT3UEMRQWF2ABKVVVZE'
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/'

const Weather = () => {
    const [input, handleInputChange] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [weatherData, setWeatherData] = useState(null);

    // Zip code for city: K2A1W1
    // const startDate = '2021-10-19T13:59:00'
    // const endDate = '2021-10-19T13:59:00'
    const formatTodayDate = () => {
        let d = new Date(),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        month = month.length < 2 ? '0' + month : month;
        day = day.length < 2 ? '0' + day : day;

        return [year, month, day].join('-');
    }
    const formatCurrentTime = () => {
        const now = new Date();
        // Extract hours, minutes, and seconds
        const hours = String(now.getHours()).padStart(2, '0');
        // const minutes = String(now.getMinutes()).padStart(2, '0');
        // const seconds = String(now.getSeconds()).padStart(2, '0');
        // Format the time as [hh:mm:ss]

        return `${hours}:00:00`;
    }

    const getYourCity = async () => {
        let city = null;
        try {
            const response = await fetch('https://ipinfo.io/json');
            const data = await response.json();
            city = data.postal
            
            console.log(`City from your IP: ${data.postal}(${data.city})`);
        } catch (error) {
            console.error('Error fetching geolocation data:', error);
            console.log('So set the city as Washington...');
            city = '98001';
        }
        console.log('getYourCity', city)
        setZipcode(city)
        handleInputChange(city)
    }

    const fetchTodayData = async () => {
        let url = ''
        try {
            const todayDate = formatTodayDate();
            url = `${BASE_URL}${zipcode}/${todayDate}?key=${API_KEY}&include=hours`
            const response = await axios.get(url);
            setWeatherData(response.data);
            console.log('The weather data is succesfully fetched')
            console.log(response.data); //You can see all the weather data in console log
        } catch (error) {
            console.log('It seems your location is not supported...')
            console.error(error);
        }
    };

    useEffect(() => {
        getYourCity();
    }, []);

    useEffect(() => {
        if (zipcode) {
            fetchTodayData();
            const interval = setInterval(fetchTodayData, 360000); // Set up an interval to fetch data every 1 hour
            return () => clearInterval(interval); // Cleanup interval
        }
    }, [zipcode]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setZipcode(input);
    };

    let days = [];
    const address = weatherData && weatherData.resolvedAddress ? weatherData.resolvedAddress : null;

    let todayIcon = 'clear-day';
    let todayCondition = null;
    let todayDescription = null;
    let todayTemp = null;
    let todayTempmax = null;
    let todayTempmin = null;
    let todayFeelslike = null;
    let todayHumidity = null;
    let todayPrecip = 0;
    let todayWindSpeed = null;
    let todaySunrise = null;
    let todaySunset = null;

    let hourlyData = [];
    let currTemp = null;
    let currHumidity = null;
    let currPrecip = null;
    let currWindSpeed = null;
    let times = [];
    let temps = [];
    let humidities = [];
    let precips = [];
    let windSpeeds = [];

    if (weatherData && weatherData.days) {
        days = weatherData.days;

        todayIcon = days[0].icon;
        todayCondition = days[0].conditions;
        todayDescription = days[0].description;
        todayTemp = days[0].temp;
        todayTempmax = days[0].tempmax;
        todayTempmin = days[0].tempmin;
        todayFeelslike = days[0].feelslike;
        todayHumidity = days[0].humidity;
        todayPrecip = days[0].precip;
        todayWindSpeed = days[0].windspeed;
        todaySunrise = days[0].sunrise;
        todaySunset = days[0].sunset;

        hourlyData = days[0].hours;
        times = hourlyData.map(item => item.datetime);
        temps = hourlyData.map(item => item.temp);
        humidities = hourlyData.map(item => item.humidity);
        precips = hourlyData.map(item => item.precip);
        windSpeeds = hourlyData.map(item => item.windspeed);

        const currTime = formatCurrentTime();
        currTemp = temps.filter((item, idx) => times[idx] === currTime)[0];
        currHumidity = temps.filter((item, idx) => times[idx] === currTime)[0];
        currPrecip = temps.filter((item, idx) => times[idx] === currTime)[0];
        currWindSpeed = temps.filter((item, idx) => times[idx] === currTime)[0];
    }

    const todayData = {
        temp: todayTemp,
        description: todayDescription,
        feels_like: todayFeelslike,
        wind_speed: todayWindSpeed,
        humidity: todayHumidity,
        sunrise: todaySunrise,
        sunset: todaySunset,
        icon: todayIcon
        // ... any other data you might need
    };

    return (
        <div className="container">
            <div id="form-container">
                <form onSubmit={handleSubmit}>
                    <input type="text" id="location" name="location" placeholder="Enter the ZipCode or City name" onChange={e => handleInputChange(e.target.value)} required />
                    <button type="submit">Update</button>
                </form>
            </div>
            <div className="weather-container">
                <WeatherCard weatherData={todayData} />
            </div>
            <div className='weather-data'>
                <h2>Real-time Hourly Weather Data</h2>
                <WeatherInfo className="highlighted-section highlighted" city={address} temp={currTemp} humidity={currHumidity} precip={currPrecip} windSpeed={currWindSpeed} />
                <div className="charts-container">
                    {weatherData ? (
                        <>
                            <div className="chart">
                                <Line key="temperatureChart" label='Hourly Temperature (°C)' weatherData={{ xs: times, ys: temps }} />
                            </div>
                            <div className="chart">
                                <Line key="humidityChart" label='Hourly Humidities (%)' weatherData={{ xs: times, ys: humidities }} />
                            </div>
                            <div className="chart">
                                <Line key="precipitationChart" label='Hourly Precips (mm)' weatherData={{ xs: times, ys: precips }} />
                            </div>
                            <div className="chart">
                                <Line key="windSpeedChart" label='Hourly Wind Speeds (km/h)' weatherData={{ xs: times, ys: windSpeeds }} />
                            </div>
                        </>) :
                        (<p>No data available...</p>)
                    }
                </div>
            </div>
        </div>
    );
}

export default Weather;