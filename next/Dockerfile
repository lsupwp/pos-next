# # Stage 1: Build Stage
# FROM node:22.15.0 AS builder

# WORKDIR /app

# # Copy และติดตั้ง dependencies
# COPY package*.json ./
# RUN npm install

# # Copy source code ทั้งหมด
# COPY . .

# # Disable Next.js telemetry
# ENV NEXT_TELEMETRY_DISABLED=1

# # Build Next.js app
# RUN npm run build

# # Stage 2: Production Image (เล็ก สะอาด)
# FROM node:22.15.0

# WORKDIR /app

# # Copy only production dependencies
# COPY package*.json ./
# RUN npm install --omit=dev

# # Copy built app จาก builder stage
# COPY --from=builder /app/.next ./.next
# COPY --from=builder /app/public ./public
# COPY --from=builder /app/next.config.mjs ./
# COPY --from=builder /app/postcss.config.mjs ./
# # COPY --from=builder /app/tailwind.config.js ./ # ถ้ามี
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/package-lock.json ./

# # Disable telemetry
# ENV NEXT_TELEMETRY_DISABLED=1

# EXPOSE 3000

# CMD ["npm", "start"]





# for dev
FROM node:22.15.0

WORKDIR /app

# ติดตั้ง dependencies ก่อน (แยก layer เพื่อ cache)
COPY package*.json ./
RUN npm install

# ไม่ต้อง COPY source code ใน Dockerfile สำหรับ development
# จะใช้วิธี Mount Volume แทน

ENV NEXT_TELEMETRY_DISABLED 1

# Expose port สำหรับ Next.js dev server
EXPOSE 3000

# Command สำหรับรัน development server
CMD ["npm", "run", "dev"]