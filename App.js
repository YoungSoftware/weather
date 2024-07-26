import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Wind, Droplet, Thermometer, Navigation } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your OpenWeatherMap API key

const WeatherApp = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js').then(
          (registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          },
          (err) => {
            console.log('ServiceWorker registration failed: ', err);
          }
        );
      });
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (err) => {
          setError('Unable to retrieve your location');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=imperial`)
        .then(response => response.json())
        .then(data => {
          setWeather(data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to fetch weather data');
          setLoading(false);
        });
    }
  }, [location]);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>;

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case 'clear': return <Sun className="text-yellow-400" size={64} />;
      case 'clouds': return <Cloud className="text-gray-400" size={64} />;
      case 'rain': return <CloudRain className="text-blue-400" size={64} />;
      default: return <Wind className="text-gray-600" size={64} />;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">{weather.name}</h1>
        <div className="flex items-center justify-center mb-6">
          {getWeatherIcon(weather.weather[0].main)}
          <span className="text-6xl ml-4 font-bold">{Math.round(weather.main.temp)}°F</span>
        </div>
        <p className="text-xl text-center mb-6 capitalize">{weather.weather[0].description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 p-3 rounded-lg flex items-center">
            <Thermometer className="text-red-500 mr-2" />
            <div>
              <p className="font-semibold">Feels Like</p>
              <p>{Math.round(weather.main.feels_like)}°F</p>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center">
            <Droplet className="text-blue-500 mr-2" />
            <div>
              <p className="font-semibold">Humidity</p>
              <p>{weather.main.humidity}%</p>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center">
            <Wind className="text-gray-500 mr-2" />
            <div>
              <p className="font-semibold">Wind Speed</p>
              <p>{Math.round(weather.wind.speed)} mph</p>
            </div>
          </div>
          <div className="bg-gray-100 p-3 rounded-lg flex items-center">
            <Navigation className="text-green-500 mr-2" />
            <div>
              <p className="font-semibold">Pressure</p>
              <p>{weather.main.pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
