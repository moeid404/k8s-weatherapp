const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = new Map(); // email -> { email, passHash }

async function signup(email, password) {
  if (!email || !password) throw new Error('email/password required');
  if (users.has(email)) throw new Error('exists');
  const passHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passHash });
  return { email };
}

async function signin(email, password) {
  if (!email || !password) throw new Error('bad');
  const u = users.get(email);
  if (!u) throw new Error('bad');
  const ok = await bcrypt.compare(password, u.passHash);
  if (!ok) throw new Error('bad');
  const token = jwt.sign({ sub: email }, process.env.JWT_SECRET || 'dev', { expiresIn: '1h' });
  return { token };
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'no token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev');
    next();
  } catch {
    res.status(401).json({ error: 'invalid token' });
  }
}

module.exports = { signup, signin, authMiddleware, _users: users };
