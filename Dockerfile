# مرحلة البناء (نستخدمها لتثبيت deps)
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# مرحلة التشغيل (خفيفة + بدون dev deps)
FROM node:20-alpine AS runner
WORKDIR /app

# أضف مستخدم غير root لتحسين الأمان
RUN addgroup -S app && adduser -S app -G app

# انسخ فقط ما نحتاجه للتشغيل
COPY --from=deps /app/node_modules /app/node_modules
COPY src ./src
COPY .env.sample ./.env.sample
COPY package*.json ./

# variables الافتراضية (مينفعش أسرار حقيقية هنا)
ENV NODE_ENV=production
ENV PORT=3000

# امنح الملكية للمستخدم غير الـroot
RUN chown -R app:app /app
USER app

EXPOSE 3000
CMD ["node", "src/server.js"]
