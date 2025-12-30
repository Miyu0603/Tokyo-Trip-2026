import { WeatherData } from '../types';

// Tokyo coordinates
const LAT = 35.6895;
const LON = 139.6917;

export const fetchTokyoWeather = async (): Promise<WeatherData | null> => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`
    );
    const data = await response.json();
    if (data.current_weather) {
      return {
        temperature: data.current_weather.temperature,
        code: data.current_weather.weathercode,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch weather", error);
    return null;
  }
};

export const getWeatherIcon = (code: number): string => {
  if (code <= 1) return 'sun'; // Clear sky
  if (code <= 3) return 'cloud-sun'; // Partly cloudy
  if (code <= 48) return 'cloud'; // Fog
  if (code <= 67) return 'rain'; // Rain
  if (code <= 77) return 'snow'; // Snow
  return 'rain'; // Showers/Thunderstorm fallback
};