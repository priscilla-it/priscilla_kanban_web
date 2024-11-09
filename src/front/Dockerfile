# Node Install
FROM node:alpine as build

COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

# Nginx Install
FROM nginx:stable-alpine

COPY --from=build /dist /usr/share/nginx/html
COPY --from=build nginx.conf /etc/nginx/conf.d/default.conf

# Expose API (Next.js local port: 40190)
EXPOSE 40190

# Startup Nginx
CMD [ "nginx", "-g", "daemon off;" ]
