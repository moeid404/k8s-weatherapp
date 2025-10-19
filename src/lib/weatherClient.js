const axios = require('axios');

async function getWeatherByCity(city) {
  if (!city) throw new Error('city required');
  // Placeholder الآن عشان نمشي محليًا ونعمل Mock في التستات
  // لاحقًا: هنستخدم API حقيقية ونمرر WEATHER_API_KEY
  return { city, tempC: 25, source: 'mock-local' };
}

module.exports = { getWeatherByCity };
