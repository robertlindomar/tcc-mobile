FROM node:22-bookworm-slim AS build

WORKDIR /app

# Coolify: marque EXPO_PUBLIC_API_URL como Build Variable (URL pública da API)
ARG EXPO_PUBLIC_API_URL=http://localhost:3000
ENV EXPO_PUBLIC_API_URL=$EXPO_PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npx expo export --platform web

FROM nginx:1.27-alpine

RUN apk add --no-cache curl

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=3000
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -fsS http://127.0.0.1:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
