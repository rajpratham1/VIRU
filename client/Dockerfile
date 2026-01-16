# Build Stage
FROM node:18-alpine as build

WORKDIR /app

# Accept build-time variable
ARG VITE_API_URL=http://localhost:5000
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config if needed, otherwise default handles basic static
# For React Router, we need a catch-all
RUN echo 'server { listen 80; root /usr/share/nginx/html; include /etc/nginx/mime.types; location / { try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
