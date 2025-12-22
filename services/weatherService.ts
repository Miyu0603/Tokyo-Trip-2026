
import { WeatherData } from '../types';

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
    return null;
  }
};

export const getWeatherIcon = (code: number): string => {
  if (code <= 1) return 'sun'; 
  if (code <= 3) return 'cloud-sun'; 
  if (code <= 48) return 'cloud'; 
  if (code <= 67) return 'rain'; 
  if (code <= 77) return 'snow'; 
  return 'rain'; 
};
