const router = require('express').Router();
const { signup, signin } = require('../lib/auth');

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const out = await signup(email, password);
    res.status(201).json(out);
  } catch (e) {
    const status = e.message === 'exists' ? 409 : 400;
    res.status(status).json({ error: e.message });
  }
});

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    const out = await signin(email, password);
    res.json(out);
  } catch {
    res.status(401).json({ error: 'invalid credentials' });
  }
});

module.exports = router;
