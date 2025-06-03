# ========================
# Tahap build (development/test)
# ========================
FROM node:18-alpine AS builder

# Direktori kerja
WORKDIR /app

# Salin semua file proyek ke container
COPY . .

# Instal dependensi
RUN npm install

# Jalankan test (akan gagal build jika test gagal)
RUN npm run test

# Build Next.js app (gunakan .env.local)
RUN npm run build

# ========================
# Tahap produksi (final image)
# ========================
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Salin hanya file yang diperlukan untuk production run
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.env.local .env.local

# Port default Next.js
EXPOSE 3000

# Jalankan server
CMD ["npm", "start"]
