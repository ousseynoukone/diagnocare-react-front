# Frontend Dockerfile for production build and static serving with nginx
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json ./
COPY bun.lock ./
RUN npm install

COPY . .
ARG REACT_APP_API_BASE_URL=http://localhost:8765/api/v1
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
RUN npm run build

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
