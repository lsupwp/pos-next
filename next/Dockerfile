# FROM node:22.15.0

# WORKDIR /app

# # ติดตั้ง dependencies ก่อน
# COPY package*.json ./
# RUN npm install

# # คัดลอกไฟล์ config ที่อยู่ใน context (pos-next/next/)
# COPY next.config.mjs ./
# COPY postcss.config.mjs ./
# # (ถ้ามี tailwind.config.js ใน pos-next/next/ ให้เพิ่มบรรทัดนี้)
# # COPY tailwind.config.js ./

# # คัดลอก source code ทั้งหมดจาก context (pos-next/next/)
# COPY . .

# ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run build

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