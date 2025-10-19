require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');

const app = express();
app.use(express.json());

// Health: السيرفر صاحي؟
app.get('/healthz', (_, res) => res.status(200).json({ ok: true }));

// Readiness: جاهز يستقبل ترافيك؟ (Checks بسيطة حاليا)
const dns = require('node:dns').promises;
app.get('/readyz', async (_, res) => {
  try {
    // 1) متغيرات البيئة الضرورية
    if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET missing');

    // 2) API الطقس — نحاول نعمل DNS resolve لاسم دومين معروف كمثال (Placeholder)
    // لاحقًا لما نوصل API حقيقية، هنستبدل ده بـ ping حقيقي
    await dns.lookup('example.com');

    res.status(200).json({ ready: true });
  } catch (e) {
    res.status(503).json({ ready: false, error: e.message });
  }
});

app.use('/auth', authRoutes);
app.use('/weather', weatherRoutes);

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Listening on ${port}`));
}
module.exports = app; // للتستات
