# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Add custom nginx config for React Router if needed, otherwise default is fine for simple routing
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
