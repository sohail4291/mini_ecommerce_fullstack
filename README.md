# Mini Shop (TypeScript) - /server (Express+Prisma) and /client (React+Vite) are separate apps
## Backend
cd server && cp .env.example .env   # set DATABASE_URL (create DB "shop" first)
npm i && npx prisma migrate dev --name init && npx prisma generate && npx prisma db seed && npm run dev
Seed gives admin@shop.com / admin123 (ADMIN) and 6 products. API: http://localhost:4000
## Frontend
npm create vite@latest client -- --template react-ts   (answer: keep existing files -> overwrite with ours in client/src)
cd client && npm i react-router-dom tailwindcss @tailwindcss/vite
vite.config.ts: import tailwindcss from "@tailwindcss/vite"; plugins: [react(), tailwindcss()]
src/index.css: @import "tailwindcss";   then npm run dev (http://localhost:5173)
