const router = require('express').Router();
const { authMiddleware } = require('../lib/auth');
const { getWeatherByCity } = require('../lib/weatherClient');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const city = req.query.city;
    const data = await getWeatherByCity(city);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

module.exports = router;
